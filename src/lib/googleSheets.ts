import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";
import { Submission } from "../types";

// Initialize Firebase client app if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Add required Google Workspace scopes
provider.addScope("https://www.googleapis.com/auth/spreadsheets");
provider.addScope("https://www.googleapis.com/auth/drive.file");

let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // We have the user but no token in current session memory (e.g. page refresh)
        // Set state to show auth required to refresh token
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Không thể lấy Google Access Token từ Firebase Auth");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Sign in with Google error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Log out Google integration
export const googleSignOut = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Create a new beautifully formatted Spreadsheet
export const createGoogleSpreadsheet = async (accessToken: string, title: string): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title: title,
      },
      sheets: [
        {
          properties: {
            title: "Kết quả thi trắc nghiệm & tự luận",
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error?.message || "Không thể tạo Google Spreadsheet");
  }

  const data = await response.json();
  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl: data.spreadsheetUrl,
  };
};

// Synchronize all submissions to Google Spreadsheet
export const syncSubmissionsToGoogleSheet = async (
  accessToken: string,
  spreadsheetId: string,
  submissions: Submission[]
): Promise<void> => {
  // Define standard spreadsheet headers
  const headers = [
    "STT",
    "Mã bài nộp",
    "Họ và Tên",
    "Năm sinh",
    "Giới tính",
    "Số điện thoại",
    "Địa chỉ / Đơn vị",
    "Bộ đề thi",
    "Điểm trắc nghiệm (Tối đa 20)",
    "Thời gian nộp",
    "Điểm Tiêu chí 1",
    "Nhận xét Tiêu chí 1",
    "Điểm Tiêu chí 2",
    "Nhận xét Tiêu chí 2",
    "Điểm Tiêu chí 3",
    "Nhận xét Tiêu chí 3",
    "Nhận xét chung",
    "Bài luận tự luận"
  ];

  // Add columns for individual questions answered
  for (let i = 1; i <= 20; i++) {
    headers.push(`Câu ${i}`);
  }

  // Clear existing content completely first to guarantee a clean sync state
  const clearResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Kết quả thi trắc nghiệm & tự luận'!A1:ZZ10000:clear`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!clearResponse.ok) {
    console.warn("Lưu ý: Không thể dọn dẹp trang tính cũ hoặc trang tính chưa được tạo.");
  }

  // Prepare submission rows
  const rows = [headers];

  submissions.forEach((item, index) => {
    const name = item.candidate?.name || "";
    const dob = item.candidate?.dob || "";
    const gender = item.candidate?.gender || "";
    const phone = item.candidate?.phone || "";
    const address = item.candidate?.address || "";
    const examSet = `Đề ${item.examSet}`;
    const score = `${item.score}/20`;
    const timestamp = item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "-";

    const eval1 = item.essayEvaluation?.criteria1 ?? "-";
    const fb1 = item.essayEvaluation?.feedback1 || "-";
    const eval2 = item.essayEvaluation?.criteria2 ?? "-";
    const fb2 = item.essayEvaluation?.feedback2 || "-";
    const eval3 = item.essayEvaluation?.criteria3 ?? "-";
    const fb3 = item.essayEvaluation?.feedback3 || "-";
    const comment = item.essayEvaluation?.overallComment || "-";
    const essay = item.essay || "Không tham gia tự luận";

    const row: any[] = [
      (index + 1).toString(),
      item.id || "",
      name,
      dob,
      gender,
      phone,
      address,
      examSet,
      score,
      timestamp,
      eval1.toString(),
      fb1,
      eval2.toString(),
      fb2,
      eval3.toString(),
      fb3,
      comment,
      essay
    ];

    // Build values for Câu 1 -> Câu 20
    for (let qIdx = 1; qIdx <= 20; qIdx++) {
      const answerObj = item.answersDetail?.find((a) => a.questionNo === qIdx);
      if (answerObj) {
        const ansText = answerObj.candidateAnswer || "Không trả lời";
        const isCorrectStr = answerObj.isCorrect ? "Đúng" : `Sai (Đáp án đúng: ${answerObj.correctAnswer})`;
        row.push(`${ansText} (${isCorrectStr})`);
      } else {
        row.push("-");
      }
    }

    rows.push(row);
  });

  // Write new values
  const writeResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Kết quả thi trắc nghiệm & tự luận'!A1?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        range: "'Kết quả thi trắc nghiệm & tự luận'!A1",
        majorDimension: "ROWS",
        values: rows,
      }),
    }
  );

  if (!writeResponse.ok) {
    const errorData = await writeResponse.json();
    throw new Error(errorData?.error?.message || "Không thể đồng bộ dữ liệu lên Google Sheets");
  }

  // Auto format headers: Bold and background color (Soft Blue theme matching visual guidelines)
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          // Bold headers and add soft blue background
          {
            repeatCell: {
              range: {
                sheetId: 0, // Default first sheet usually has ID 0
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: headers.length,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.1,
                    green: 0.45,
                    blue: 0.85,
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0,
                    },
                    bold: true,
                    fontSize: 11,
                  },
                  horizontalAlignment: "CENTER",
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
            },
          },
          // Set thin borders
          {
            updateBorders: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: rows.length,
                startColumnIndex: 0,
                endColumnIndex: headers.length,
              },
              top: { style: "SOLID", width: 1, color: { red: 0.8, green: 0.8, blue: 0.8 } },
              bottom: { style: "SOLID", width: 1, color: { red: 0.8, green: 0.8, blue: 0.8 } },
              left: { style: "SOLID", width: 1, color: { red: 0.8, green: 0.8, blue: 0.8 } },
              right: { style: "SOLID", width: 1, color: { red: 0.8, green: 0.8, blue: 0.8 } },
            },
          },
          // Set automatic column width resize
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: "COLUMNS",
                startIndex: 0,
                endIndex: headers.length,
              },
            },
          },
        ],
      }),
    });
  } catch (formatErr) {
    console.warn("Formatting of sheets skipped or failed:", formatErr);
  }
};
