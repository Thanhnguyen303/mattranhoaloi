import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory or file-based persistent storage paths
const DATA_DIR = path.join(process.cwd(), "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");
const SCHEDULE_FILE = path.join(DATA_DIR, "schedule.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize Firebase Firestore from config file using firebase client SDK
let db: any = null;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const firebaseApp = initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId
    });
    const dbId = config.firestoreDatabaseId || process.env.FIRESTORE_DB_ID || "ai-studio-trangwebhoithi50-b5c2430c-607f-4e49-b55e-0948634c74f5";
    db = getFirestore(firebaseApp, dbId);
    console.log("Firebase Client Firestore initialized successfully with DB ID:", dbId);
  } else {
    console.warn("firebase-applet-config.json not found. Firestore will fall back to local JSON.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Client Firestore, falling back to local storage:", error);
}

// Google Sheets real-time integration configuration
let googleSheetsConfig = {
  spreadsheetId: "",
  accessToken: ""
};

// Async function to load google sheets config from Firestore
async function loadGoogleSheetsConfig() {
  if (db) {
    try {
      const docRef = doc(db, "settings", "google_sheets");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        googleSheetsConfig.spreadsheetId = data.spreadsheetId || "";
        googleSheetsConfig.accessToken = data.accessToken || "";
        console.log("Loaded Google Sheets config from Firestore. Spreadsheet ID:", googleSheetsConfig.spreadsheetId);
      }
    } catch (error) {
      console.error("Error loading Google Sheets config from Firestore:", error);
    }
  }
}

// Automatically load config on startup
loadGoogleSheetsConfig().catch(err => console.error("Startup config load error:", err));

async function syncToGoogleSheetsServer(submissions: any[]) {
  const { spreadsheetId, accessToken } = googleSheetsConfig;
  if (!spreadsheetId || !accessToken) {
    console.log("Google Sheets config not fully set on server. Skipping auto-sync.");
    return;
  }

  try {
    console.log(`Starting auto-sync to Google Sheets (ID: ${spreadsheetId}) for ${submissions.length} submissions...`);
    
    // Define standard spreadsheet headers matching client exactly
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

    for (let i = 1; i <= 20; i++) {
      headers.push(`Câu ${i}`);
    }

    // Clear existing content
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

      for (let qIdx = 1; qIdx <= 20; qIdx++) {
        const answerObj = item.answersDetail?.find((a: any) => a.questionNo === qIdx);
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
      console.error("Auto-sync to Google Sheets failed writeResponse check:", errorData);
    } else {
      console.log("Auto-sync to Google Sheets completed successfully!");
      // Format headers & styles (Bold and background color matching client)
      try {
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: 0,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: headers.length,
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 0.1, green: 0.45, blue: 0.85 },
                      textFormat: {
                        foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                        bold: true,
                        fontSize: 11,
                      },
                      horizontalAlignment: "CENTER",
                    },
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                },
              },
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
              {
                autoResizeDimensions: {
                  dimensions: {
                    sheetId: 0,
                    dimension: "COLUMNS",
                    startIndex: 0,
                    endIndex: headers.length,
                  },
                },
              }
            ],
          }),
        });
      } catch (formatErr) {
        console.warn("Formatting of sheets skipped or failed:", formatErr);
      }
    }
  } catch (error) {
    console.error("Error in auto-sync to Google Sheets on server:", error);
  }
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Failed (Gracefully falling back): ', JSON.stringify(errInfo));
}

// Helper to read submissions
async function readSubmissions(): Promise<any[]> {
  // First try to read from Firestore
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, "submissions"));
      const list: any[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Synchronize back to local file for backup
      writeSubmissionsLocal(list);
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, "submissions");
    }
  }
  return readSubmissionsLocal();
}

function readSubmissionsLocal(): any[] {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const data = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading submissions file locally:", error);
  }
  return [];
}

// Helper to write submissions locally
function writeSubmissionsLocal(data: any[]) {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing submissions file locally:", error);
  }
}

// Helper to write a single submission to Firestore and local
async function saveSubmission(id: string, submission: any) {
  // Save locally first
  const localList = readSubmissionsLocal();
  const idx = localList.findIndex(s => s.id === id);
  if (idx !== -1) {
    localList[idx] = submission;
  } else {
    localList.push(submission);
  }
  writeSubmissionsLocal(localList);

  // Save to Firestore
  if (db) {
    try {
      const docRef = doc(db, "submissions", id);
      await setDoc(docRef, submission);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `submissions/${id}`);
    }
  }
}

// Helper to delete submission
async function deleteSubmission(id: string): Promise<boolean> {
  // Delete locally
  let localList = readSubmissionsLocal();
  const initialLength = localList.length;
  localList = localList.filter(s => s.id !== id);
  writeSubmissionsLocal(localList);

  // Delete from Firestore
  if (db) {
    try {
      const docRef = doc(db, "submissions", id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `submissions/${id}`);
    }
  }

  return localList.length !== initialLength;
}

// Helper to read schedule
function readSchedule(): { startTime: string; endTime: string } {
  try {
    if (fs.existsSync(SCHEDULE_FILE)) {
      const data = fs.readFileSync(SCHEDULE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading schedule file:", error);
  }
  return {
    startTime: "2026-06-28T00:00",
    endTime: "2026-07-02T23:59"
  };
}

// Helper to write schedule
function writeSchedule(data: { startTime: string; endTime: string }) {
  try {
    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing schedule file:", error);
  }
}

// API Routes
app.get("/api/schedule", (req, res) => {
  res.json(readSchedule());
});

app.post("/api/schedule", (req, res) => {
  const { startTime, endTime } = req.body;
  if (!startTime || !endTime) {
    return res.status(400).json({ error: "Missing startTime or endTime" });
  }
  const newSchedule = { startTime, endTime };
  writeSchedule(newSchedule);
  res.json(newSchedule);
});

app.get("/api/submissions", async (req, res) => {
  try {
    const list = await readSubmissions();
    res.json(list);
  } catch (error) {
    console.error("Error in GET /api/submissions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/submissions", async (req, res) => {
  try {
    const submission = req.body;
    if (!submission || !submission.candidate || !submission.candidate.phone) {
      return res.status(400).json({ error: "Invalid submission data" });
    }

    const submissions = await readSubmissions();
    
    // Enforce max 5 submissions per phone number
    const candidatePhone = submission.candidate.phone;
    const count = submissions.filter(s => s.candidate && s.candidate.phone === candidatePhone).length;
    if (count >= 5) {
      return res.status(400).json({ error: "Số điện thoại này đã hoàn thành tối đa 5 lượt làm bài thi quy định!" });
    }

    // Assign a unique temporary ID if not present
    const id = submission.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    submission.id = id;
    
    await saveSubmission(id, submission);

    // Auto-sync in background after new submission
    try {
      const updatedList = await readSubmissions();
      syncToGoogleSheetsServer(updatedList).catch(err => console.error("Auto-sync error after new submission:", err));
    } catch (syncErr) {
      console.error("Failed to trigger sheets auto-sync after submission:", syncErr);
    }

    res.status(201).json(submission);
  } catch (error) {
    console.error("Error in POST /api/submissions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/api/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const submissions = await readSubmissions();
    const idx = submissions.findIndex(s => s.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Submission not found" });
    }
    const updatedSubmission = { ...submissions[idx], ...updatedData };
    await saveSubmission(id, updatedSubmission);

    // Auto-sync in background after edit
    try {
      const updatedList = await readSubmissions();
      syncToGoogleSheetsServer(updatedList).catch(err => console.error("Auto-sync error after PATCH:", err));
    } catch (syncErr) {
      console.error("Failed to trigger sheets auto-sync after PATCH:", syncErr);
    }

    res.json(updatedSubmission);
  } catch (error) {
    console.error("Error in PATCH /api/submissions/:id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteSubmission(id);
    if (!success) {
      return res.status(404).json({ error: "Submission not found" });
    }

    // Auto-sync in background after delete
    try {
      const updatedList = await readSubmissions();
      syncToGoogleSheetsServer(updatedList).catch(err => console.error("Auto-sync error after DELETE:", err));
    } catch (syncErr) {
      console.error("Failed to trigger sheets auto-sync after DELETE:", syncErr);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/submissions/:id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to save Google Sheets configuration from the client
app.post("/api/sheets/config", async (req, res) => {
  try {
    const { spreadsheetId, accessToken } = req.body;
    googleSheetsConfig.spreadsheetId = spreadsheetId || "";
    googleSheetsConfig.accessToken = accessToken || "";

    if (db) {
      try {
        const docRef = doc(db, "settings", "google_sheets");
        await setDoc(docRef, {
          spreadsheetId: googleSheetsConfig.spreadsheetId,
          accessToken: googleSheetsConfig.accessToken,
          updatedAt: new Date().toISOString()
        });
        console.log("Successfully saved Google Sheets config to Firestore Settings:", googleSheetsConfig.spreadsheetId);
      } catch (err) {
        console.error("Failed to persist Google Sheets config to Firestore Settings:", err);
      }
    }

    res.json({ success: true, config: googleSheetsConfig });
  } catch (error: any) {
    console.error("Error in POST /api/sheets/config:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Gemini AI Essay Grader Route
app.post("/api/gemini/grade-essay", async (req, res) => {
  const { essay } = req.body;
  if (!essay || typeof essay !== "string") {
    return res.status(400).json({ error: "Essay content is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: "Không tìm thấy GEMINI_API_KEY trên máy chủ. Vui lòng cấu hình API Key trong trang cài đặt." 
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    const systemPrompt = `Bạn là Ban Giám Khảo chuyên nghiệp chấm bài luận hiến kế của Hội thi tìm hiểu lịch sử: "Cuộc thi trực tuyến Hành trình 50 năm ngày Thành phố Sài Gòn - Gia Định chính thức mang tên Bác (02/7/1976 - 02/7/2026)".
Hãy chấm điểm bài tự luận của thí sinh dựa trên 3 tiêu chí chính thức (mỗi tiêu chí chấm từ 1 đến 5 điểm/sao):
- Tiêu chí 1: Tính thực tiễn & khả thi (phù hợp với phường Hòa Lợi và TP.HCM).
- Tiêu chí 2: Tính sáng tạo & đổi mới (áp dụng khoa học công nghệ, chuyển đổi số).
- Tiêu chí 3: Văn phong, bố cục & lập luận logic.

Hãy trả về nhận xét tinh tế, mang tính đóng góp, khích lệ quần chúng bằng tiếng Việt dưới dạng đối tượng JSON có cấu trúc chính xác như yêu cầu.`;

    const userQuery = `Hãy chấm điểm bài viết tự luận hiến kế phát triển phường Hòa Lợi và TP.HCM sau đây:
Nội dung bài viết của thí sinh: "${essay}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            criteria1: { type: Type.INTEGER, description: "Điểm tiêu chí 1 từ 1 đến 5" },
            criteria2: { type: Type.INTEGER, description: "Điểm tiêu chí 2 từ 1 đến 5" },
            criteria3: { type: Type.INTEGER, description: "Điểm tiêu chí 3 từ 1 đến 5" },
            feedback1: { type: Type.STRING, description: "Nhận xét ngắn gọn tiêu chí 1 (tiếng Việt)" },
            feedback2: { type: Type.STRING, description: "Nhận xét ngắn gọn tiêu chí 2 (tiếng Việt)" },
            feedback3: { type: Type.STRING, description: "Nhận xét ngắn gọn tiêu chí 3 (tiếng Việt)" },
            overallComment: { type: Type.STRING, description: "Nhận xét tổng quát toàn bài (tiếng Việt)" }
          },
          required: ["criteria1", "criteria2", "criteria3", "feedback1", "feedback2", "feedback3", "overallComment"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Không nhận được phản hồi từ mô hình AI.");
    }

    const evaluation = JSON.parse(responseText.trim());
    res.json(evaluation);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: `Lỗi khi gọi API Gemini: ${error.message || error}` 
    });
  }
});

// Vite middleware for development / Static files serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
