import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

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

// Helper to read submissions
function readSubmissions(): any[] {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const data = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading submissions file:", error);
  }
  return [];
}

// Helper to write submissions
function writeSubmissions(data: any[]) {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing submissions file:", error);
  }
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

app.get("/api/submissions", (req, res) => {
  res.json(readSubmissions());
});

app.post("/api/submissions", (req, res) => {
  const submission = req.body;
  if (!submission || !submission.candidate || !submission.candidate.phone) {
    return res.status(400).json({ error: "Invalid submission data" });
  }

  const submissions = readSubmissions();
  
  // Enforce max 5 submissions per phone number
  const candidatePhone = submission.candidate.phone;
  const count = submissions.filter(s => s.candidate && s.candidate.phone === candidatePhone).length;
  if (count >= 5) {
    return res.status(400).json({ error: "Số điện thoại này đã hoàn thành tối đa 5 lượt làm bài thi quy định!" });
  }

  // Assign a unique temporary ID if not present
  submission.id = submission.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  submissions.push(submission);
  writeSubmissions(submissions);
  res.status(201).json(submission);
});

app.patch("/api/submissions/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const submissions = readSubmissions();
  const idx = submissions.findIndex(s => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Submission not found" });
  }
  submissions[idx] = { ...submissions[idx], ...updatedData };
  writeSubmissions(submissions);
  res.json(submissions[idx]);
});

app.delete("/api/submissions/:id", (req, res) => {
  const { id } = req.params;
  let submissions = readSubmissions();
  const initialLength = submissions.length;
  submissions = submissions.filter(s => s.id !== id);
  if (submissions.length === initialLength) {
    return res.status(404).json({ error: "Submission not found" });
  }
  writeSubmissions(submissions);
  res.json({ success: true });
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
