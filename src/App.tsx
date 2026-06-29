import React, { useState, useEffect, useRef } from "react";
import { 
  Star, 
  Clock, 
  User, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Send, 
  Phone, 
  MapPin, 
  Calendar, 
  FileSpreadsheet, 
  LogOut, 
  Users, 
  Settings, 
  Sliders, 
  Eye, 
  Trash2, 
  Award, 
  RefreshCw, 
  X, 
  Cpu, 
  ShieldAlert, 
  Search, 
  ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Candidate, Question, AnswerDetail, EssayEvaluation, Submission, ContestSchedule } from "./types";
import { questionsDB, generateFixedExamSet } from "./questions";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const formatVietnameseDateTime = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}h${minutes} ngày ${day}-${month}-${year}`;
  } catch (e) {
    return dateStr;
  }
};

export default function App() {
  // Navigation with local persistence
  const [activeTabState, setActiveTabState] = useState<"portal" | "auth" | "dashboard">(
    () => (localStorage.getItem("contest_active_tab") as "portal" | "auth" | "dashboard") || "portal"
  );
  const [adminPin, setAdminPin] = useState("");
  const [isAdminAuthenticatedState, setIsAdminAuthenticatedState] = useState<boolean>(
    () => localStorage.getItem("contest_admin_auth") === "true"
  );

  const activeTab = activeTabState;
  const isAdminAuthenticated = isAdminAuthenticatedState;

  const setActiveTab = (tab: "portal" | "auth" | "dashboard") => {
    setActiveTabState(tab);
    localStorage.setItem("contest_active_tab", tab);
  };

  const setIsAdminAuthenticated = (auth: boolean) => {
    setIsAdminAuthenticatedState(auth);
    if (auth) {
      localStorage.setItem("contest_admin_auth", "true");
    } else {
      localStorage.removeItem("contest_admin_auth");
    }
  };

  // Core App states
  const [schedule, setSchedule] = useState<ContestSchedule>({
    startTime: "2026-06-28T00:00",
    endTime: "2026-07-02T23:59"
  });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regDob, setRegDob] = useState("");
  const [regGender, setRegGender] = useState<"Nam" | "Nữ">("Nam");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");

  // Exam state
  const [isExamActive, setIsExamActive] = useState(false);
  const [examSetNumber, setExamSetNumber] = useState(1);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [candidateAnswers, setCandidateAnswers] = useState<Record<number, string>>({});
  const [essayResponse, setEssayResponse] = useState("");
  const [examTimeRemaining, setExamTimeRemaining] = useState(1200); // 20 minutes in seconds
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);

  // Results state
  const [submittedResult, setSubmittedResult] = useState<Submission | null>(null);

  // Admin section states
  const [adminSelectedTab, setAdminSelectedTab] = useState<"results" | "examsets" | "schedule">("results");
  const [adminSelectedSet, setAdminSelectedSet] = useState(1);
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState<number | null>(null);
  const [isAiGrading, setIsAiGrading] = useState(false);
  const [scheduleFormStart, setScheduleFormStart] = useState("");
  const [scheduleFormEnd, setScheduleFormEnd] = useState("");

  // Ref for exam timer
  const examTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger toast
  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initial Fetches
  useEffect(() => {
    fetchSchedule();
    fetchSubmissions();
  }, []);

  const fetchSchedule = async () => {
    let localSched: ContestSchedule | null = null;
    const local = localStorage.getItem("contest_schedule");
    if (local) {
      try {
        localSched = JSON.parse(local);
      } catch (e) {}
    }

    try {
      const res = await fetch("/api/schedule");
      if (res.ok) {
        const serverSched = await res.json();
        const isServerDefault = serverSched.startTime === "2026-06-28T00:00" && serverSched.endTime === "2026-07-02T23:59";
        
        let finalSched = serverSched;
        if (isServerDefault && localSched) {
          finalSched = localSched;
          // Sync custom local schedule back to server
          try {
            await fetch("/api/schedule", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(localSched),
            });
          } catch (syncErr) {
            console.warn("Failed to sync local schedule to server", syncErr);
          }
        }
        
        setSchedule(finalSched);
        setScheduleFormStart(finalSched.startTime);
        setScheduleFormEnd(finalSched.endTime);
        localStorage.setItem("contest_schedule", JSON.stringify(finalSched));
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn("Falls back to local schedule due to network issue");
      if (localSched) {
        setSchedule(localSched);
        setScheduleFormStart(localSched.startTime);
        setScheduleFormEnd(localSched.endTime);
      } else {
        const fallback = {
          startTime: "2026-06-28T00:00",
          endTime: "2026-07-02T23:59"
        };
        setSchedule(fallback);
        setScheduleFormStart(fallback.startTime);
        setScheduleFormEnd(fallback.endTime);
      }
    }
  };

  const fetchSubmissions = async () => {
    let localSubmissions: Submission[] = [];
    const local = localStorage.getItem("contest_submissions");
    if (local) {
      try {
        localSubmissions = JSON.parse(local);
      } catch (e) {
        console.error("Error parsing local submissions", e);
      }
    }

    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const serverSubmissions: Submission[] = await res.json();
        
        // Merge server and local submissions
        const mergedMap = new Map<string, Submission>();
        
        localSubmissions.forEach(s => {
          const id = s.id || `${s.candidate.phone}_${new Date(s.createdAt).getTime()}`;
          s.id = id;
          mergedMap.set(id, s);
        });
        
        serverSubmissions.forEach(s => {
          const id = s.id || `${s.candidate.phone}_${new Date(s.createdAt).getTime()}`;
          s.id = id;
          mergedMap.set(id, s);
        });
        
        const mergedList = Array.from(mergedMap.values());
        mergedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setSubmissions(mergedList);
        localStorage.setItem("contest_submissions", JSON.stringify(mergedList));
        
        // Proactively sync local-only submissions to the server
        const serverIds = new Set(serverSubmissions.map(s => s.id));
        for (const sub of localSubmissions) {
          if (sub.id && !serverIds.has(sub.id)) {
            try {
              await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sub)
              });
            } catch (syncErr) {
              console.warn("Failed to sync local submission to server", syncErr);
            }
          }
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn("Falls back to local storage submissions only");
      setSubmissions(localSubmissions);
    }
  };

  // Save schedule
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(scheduleFormStart) >= new Date(scheduleFormEnd)) {
      triggerToast("Thời gian bắt đầu phải trước thời gian kết thúc!", "error");
      return;
    }
    const newSched = { startTime: scheduleFormStart, endTime: scheduleFormEnd };
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSched),
      });
      if (res.ok) {
        const data = await res.json();
        setSchedule(data);
        triggerToast("Đã cập nhật thời gian tổ chức hội thi thành công!");
      } else {
        throw new Error("Không thể lưu cấu hình");
      }
    } catch (error) {
      localStorage.setItem("contest_schedule", JSON.stringify(newSched));
      setSchedule(newSched);
      triggerToast("Đã lưu cài đặt lịch trình vào trình duyệt (Local Mode)!");
    }
  };

  // Check contest status
  const getContestStatus = (): "NOT_STARTED" | "RUNNING" | "ENDED" => {
    const start = new Date(schedule.startTime);
    const end = new Date(schedule.endTime);
    if (currentTime < start) return "NOT_STARTED";
    if (currentTime >= start && currentTime <= end) return "RUNNING";
    return "ENDED";
  };

  const contestStatus = getContestStatus();

  // Get countdown remaining seconds
  const getCountdownValues = () => {
    const start = new Date(schedule.startTime);
    const end = new Date(schedule.endTime);
    let diff = 0;
    if (contestStatus === "NOT_STARTED") {
      diff = start.getTime() - currentTime.getTime();
    } else if (contestStatus === "RUNNING") {
      diff = end.getTime() - currentTime.getTime();
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const countdown = getCountdownValues();

  // Start exam timer loop
  useEffect(() => {
    if (isExamActive) {
      examTimerRef.current = setInterval(() => {
        setExamTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(examTimerRef.current!);
            triggerToast("Hết thời gian làm bài! Đang tự động nộp bài...", "info");
            handleFinalSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (examTimerRef.current) clearInterval(examTimerRef.current);
    }

    return () => {
      if (examTimerRef.current) clearInterval(examTimerRef.current);
    };
  }, [isExamActive]);

  // Form submit -> start exam
  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (contestStatus === "NOT_STARTED") {
      triggerToast("Hội thi chưa chính thức bắt đầu!", "error");
      return;
    }
    if (contestStatus === "ENDED") {
      triggerToast("Hội thi đã chính thức kết thúc!", "error");
      return;
    }

    const cleanPhone = regPhone.trim();
    if (!cleanPhone) {
      triggerToast("Vui lòng nhập số điện thoại liên hệ!", "error");
      return;
    }

    // Check submission limit (Max 5 tries per phone number)
    const currentTries = submissions.filter(
      (s) => s.candidate && s.candidate.phone.trim() === cleanPhone
    ).length;

    if (currentTries >= 5) {
      triggerToast("Số điện thoại này đã hoàn thành tối đa 5 lượt làm bài thi quy định!", "error");
      return;
    }

    // Set up exam
    const chosenSet = Math.floor(Math.random() * 10) + 1;
    setExamSetNumber(chosenSet);
    setExamQuestions(generateFixedExamSet(chosenSet));
    setCandidateAnswers({});
    setEssayResponse("");
    setExamTimeRemaining(1200); // 20 minutes
    setIsExamActive(true);

    triggerToast(`Bắt đầu làm đề thi số ${chosenSet} (Lượt ${currentTries + 1}/5). Chúc bạn thi tốt!`, "success");
  };

  // Option selection
  const handleSelectOption = (questionNo: number, optionChar: string) => {
    setCandidateAnswers((prev) => ({
      ...prev,
      [questionNo]: optionChar
    }));
  };

  // Submit process
  const handleFinalSubmit = async (autoSubmit: boolean = false) => {
    setIsConfirmSubmitOpen(false);
    setIsExamActive(false);

    let correctCount = 0;
    const answersDetail: AnswerDetail[] = [];

    examQuestions.forEach((q, idx) => {
      const qNum = idx + 1;
      const candAns = candidateAnswers[qNum] || "X"; // X means empty/unanswered
      const isCorrect = candAns === q.answer;
      if (isCorrect) correctCount++;

      answersDetail.push({
        questionNo: qNum,
        questionText: q.q,
        options: q.options,
        correctAnswer: q.answer,
        candidateAnswer: candAns,
        explanation: q.explanation,
        isCorrect
      });
    });

    const newCandidate: Candidate = {
      name: regName.trim(),
      dob: regDob.trim(),
      gender: regGender,
      phone: regPhone.trim(),
      address: regAddress.trim(),
      timestamp: new Date().toISOString()
    };

    const finalSubmission: Submission = {
      candidate: newCandidate,
      examSet: examSetNumber,
      score: correctCount,
      essay: essayResponse.trim(),
      answersDetail,
      createdAt: new Date().toISOString()
    };

    // Save to server, fallback to local storage
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalSubmission)
      });
      if (res.ok) {
        const savedData = await res.json();
        setSubmittedResult(savedData);
        // Save to local storage as well!
        const currentLocal = localStorage.getItem("contest_submissions");
        let localList: Submission[] = [];
        if (currentLocal) {
          try { localList = JSON.parse(currentLocal); } catch (err) {}
        }
        const updatedLocal = [savedData, ...localList.filter((s: Submission) => s.id !== savedData.id)];
        localStorage.setItem("contest_submissions", JSON.stringify(updatedLocal));
        // Refresh local submissions cache
        fetchSubmissions();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Không thể lưu kết quả trên server");
      }
    } catch (e: any) {
      console.warn("Lưu trữ trực tuyến thất bại, lưu trữ cục bộ:", e);
      const updatedLocal = [...submissions, finalSubmission];
      localStorage.setItem("contest_submissions", JSON.stringify(updatedLocal));
      setSubmissions(updatedLocal);
      setSubmittedResult(finalSubmission);
    }

    // Trigger festive fireworks confetti
    try {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      // Initial big splash of confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Fireworks bursts from random left and right positions
        confetti({ 
          ...defaults, 
          particleCount, 
          origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() - 0.2 } 
        });
        confetti({ 
          ...defaults, 
          particleCount, 
          origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() - 0.2 } 
        });
      }, 250);
    } catch (confettiErr) {
      console.warn("Lỗi kích hoạt pháo hoa confetti:", confettiErr);
    }

    triggerToast("Đã nộp bài thi thành công lên hệ thống!", "success");
  };

  // Return to portal state
  const handleResetPortal = () => {
    setSubmittedResult(null);
    setRegName("");
    setRegDob("");
    setRegPhone("");
    setRegAddress("");
    setEssayResponse("");
  };

  // Admin Verification
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === "hoaloi2026") {
      setIsAdminAuthenticated(true);
      setActiveTab("dashboard");
      triggerToast("Xác thực Ban Tổ Chức thành công!");
    } else {
      triggerToast("Mã PIN không đúng! Vui lòng kiểm tra lại.", "error");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminPin("");
    setActiveTab("portal");
    triggerToast("Đã đăng xuất tài khoản quản trị.");
  };

  // CSV Export
  const handleExportCSV = () => {
    if (submissions.length === 0) {
      triggerToast("Không có dữ liệu bài làm để xuất báo cáo.", "error");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "STT,Họ và Tên,Năm sinh,Giới tính,Số điện thoại,Địa chỉ / Đơn vị,Bộ đề thi,Điểm trắc nghiệm (Tối đa 20),Bài viết luận tự luận,Thời gian nộp\n";

    submissions.forEach((item, index) => {
      const name = item.candidate.name.replace(/"/g, '""');
      const dob = (item.candidate.dob || "").replace(/"/g, '""');
      const gender = (item.candidate.gender || "").replace(/"/g, '""');
      const phone = (item.candidate.phone || "").replace(/"/g, '""');
      const address = (item.candidate.address || "").replace(/"/g, '""');
      const essay = item.essay ? item.essay.replace(/"/g, '""').replace(/\n/g, ' ') : "Không tham gia tự luận";
      const timestamp = item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "-";

      csvContent += `${index + 1},"${name}","${dob}","${gender}","${phone}","${address}",Đề ${item.examSet},${item.score},"${essay}","${timestamp}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Bao_Cao_Hoi_Thi_50_Nam_Phuong_Hoa_Loi.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Kết xuất tệp báo cáo bảng điểm CSV thành công!");
  };

  // Delete submission
  const handleDeleteSubmission = async (id: string, index: number) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn bài nộp của thí sinh ${submissions[index].candidate.name}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        // Remove from local storage as well
        const local = localStorage.getItem("contest_submissions");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            const filtered = parsed.filter((s: Submission) => s.id !== id);
            localStorage.setItem("contest_submissions", JSON.stringify(filtered));
          } catch (err) {}
        }
        triggerToast("Xóa kết quả thành công.");
      } else {
        throw new Error("Xóa thất bại trên server");
      }
    } catch (e) {
      // Local fall back
      const updated = submissions.filter((_, idx) => idx !== index);
      setSubmissions(updated);
      localStorage.setItem("contest_submissions", JSON.stringify(updated));
      triggerToast("Đã xóa bài làm thành công (Local Mode).");
    }

    if (selectedSubmission?.id === id) {
      setSelectedSubmission(null);
    }
  };

  // AI evaluation
  const handleAiGrade = async () => {
    if (!selectedSubmission) return;
    if (!selectedSubmission.essay || selectedSubmission.essay.trim().length === 0) {
      triggerToast("Thí sinh này không tham gia phần viết luận tự luận!", "error");
      return;
    }

    setIsAiGrading(true);
    triggerToast("AI Gemini đang phân tích chấm điểm bài luận...", "info");

    try {
      const res = await fetch("/api/gemini/grade-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay: selectedSubmission.essay }),
      });

      if (res.ok) {
        const aiEvaluation: EssayEvaluation = await res.json();
        
        // Update local object
        const updatedSubmission: Submission = {
          ...selectedSubmission,
          ratings: {
            1: aiEvaluation.criteria1,
            2: aiEvaluation.criteria2,
            3: aiEvaluation.criteria3
          },
          essayEvaluation: aiEvaluation
        };

        // Update server
        const updateRes = await fetch(`/api/submissions/${selectedSubmission.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSubmission)
        });

        if (updateRes.ok) {
          const savedUpdated = await updateRes.json();
          setSelectedSubmission(savedUpdated);
          // Refresh list
          fetchSubmissions();
          triggerToast("AI Gemini đã hoàn thành chấm điểm bài luận và lưu vào cơ sở dữ liệu!");
        } else {
          // Fallback if patch fails
          setSelectedSubmission(updatedSubmission);
          const updatedList = submissions.map((s) => s.id === selectedSubmission.id ? updatedSubmission : s);
          setSubmissions(updatedList);
          localStorage.setItem("contest_submissions", JSON.stringify(updatedList));
          triggerToast("Đã chấm điểm AI tạm thời thành công!");
        }

      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Lỗi phản hồi từ AI");
      }
    } catch (error: any) {
      console.error(error);
      triggerToast(`AI chấm điểm thất bại: ${error.message || error}`, "error");
    } finally {
      setIsAiGrading(false);
    }
  };

  // Star Rating update manually
  const handleManualRating = async (criterion: 1 | 2 | 3, score: number) => {
    if (!selectedSubmission) return;
    
    const currentRatings = selectedSubmission.ratings || { 1: 0, 2: 0, 3: 0 };
    const updatedSubmission: Submission = {
      ...selectedSubmission,
      ratings: {
        ...currentRatings,
        [criterion]: score
      }
    };

    try {
      const res = await fetch(`/api/submissions/${selectedSubmission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSubmission)
      });
      if (res.ok) {
        const saved = await res.json();
        setSelectedSubmission(saved);
        fetchSubmissions();
        triggerToast(`Đã lưu ${score} sao cho tiêu chí ${criterion}!`);
      }
    } catch (e) {
      setSelectedSubmission(updatedSubmission);
      const updatedList = submissions.map((s) => s.id === selectedSubmission.id ? updatedSubmission : s);
      setSubmissions(updatedList);
      localStorage.setItem("contest_submissions", JSON.stringify(updatedList));
      triggerToast("Lưu điểm thủ công thành công cục bộ.");
    }
  };

  // Calculate statistics
  const getAdminStats = () => {
    const total = submissions.length;
    if (total === 0) {
      return { total: 0, avgScore: "0.0", essayRate: "0%", oldestCandidate: "Chưa rõ" };
    }

    const avg = (submissions.reduce((acc, curr) => acc + curr.score, 0) / total).toFixed(1);
    const withEssay = submissions.filter((s) => s.essay && s.essay.trim().length >= 10).length;
    const rate = Math.round((withEssay / total) * 100) + "%";

    let oldest: Candidate | null = null;
    let minYear = 2026;
    submissions.forEach((s) => {
      const year = parseInt(s.candidate.dob);
      if (year && year < minYear) {
        minYear = year;
        oldest = s.candidate;
      }
    });

    const oldestDesc = oldest ? `${oldest.name} (${oldest.dob})` : "Chưa rõ";

    return { total, avgScore: avg, essayRate: rate, oldestCandidate: oldestDesc };
  };

  const adminStats = getAdminStats();

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    const query = adminSearchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      s.candidate.name.toLowerCase().includes(query) ||
      s.candidate.phone.includes(query) ||
      s.candidate.address.toLowerCase().includes(query)
    );
  });

  // Progress calculations for the active exam
  const answeredCount = Object.keys(candidateAnswers).length;
  const totalQuestions = examQuestions.length || 20;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-red-200">
      
      {/* Toast Notification Bar */}
      <div className="fixed top-5 right-5 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-xl text-xs md:text-sm font-semibold text-white pointer-events-auto border backdrop-blur-md ${
                toast.type === "success" 
                  ? "bg-emerald-900/90 border-emerald-500 text-emerald-200" 
                  : toast.type === "error"
                  ? "bg-red-950/90 border-red-500 text-red-200"
                  : "bg-slate-900/90 border-slate-700 text-slate-200"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : toast.type === "error" ? (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header Panel with Banner */}
      <header className="bg-white border-b border-slate-200 shrink-0 shadow-sm">
        {/* Full-width Banner Image with Fallback and Glassmorphism text overlay */}
        <div className="relative w-full overflow-hidden bg-gradient-to-r from-red-800 via-red-600 to-amber-600 py-10 md:py-14 px-4 flex flex-col items-center justify-center text-center shadow-inner">
          {/* Main Banner Image */}
          <img 
            src="/assets/hcmc_contest_banner.png" 
            alt="Hành Trình 50 Năm Ngày Thành Phố Sài Gòn - Gia Định"
            className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay opacity-80"
            onError={(e) => {
              // If the image fails to load, keep the vibrant patriotic gradient active
              e.currentTarget.style.opacity = '0';
            }}
            referrerPolicy="no-referrer"
          />
          
          {/* Subtle dark overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>

          {/* Glassmorphism Content Card - Extremely Luxurious & Elegant */}
          <div className="relative z-10 max-w-5xl mx-auto backdrop-blur-md bg-slate-950/65 border border-amber-500/30 p-4 md:p-8 rounded-2xl shadow-2xl space-y-3 w-full">
            {/* Elegant Subtitle */}
            <h2 className="font-black tracking-widest text-amber-300 uppercase drop-shadow-sm font-sans text-[10px] xs:text-xs sm:text-sm md:text-base leading-normal sm:leading-relaxed mb-1 text-center">
              ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM VÀ CÁC TỔ CHỨC CHÍNH TRỊ - XÃ HỘI PHƯỜNG HÒA LỢI
            </h2>
            
            {/* Elegant Golden Divider Accent */}
            <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>

            {/* Main Title - Luxurious Gold Text Effect */}
            <h1 className="font-sans font-extrabold uppercase tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl leading-relaxed sm:leading-relaxed md:leading-snug text-center">
              CUỘC THI TRỰC TUYẾN HÀNH TRÌNH 50 NĂM NGÀY THÀNH PHỐ SÀI GÒN - GIA ĐỊNH CHÍNH THỨC, VINH DỰ MANG TÊN CHỦ TỊCH HỒ CHÍ MINH
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex justify-center w-full">
          <div className="grid grid-cols-2 gap-2 w-full max-w-sm sm:flex sm:flex-row sm:w-auto sm:gap-3 sm:justify-center">
            <button 
              id="nav-btn-portal"
              onClick={() => setActiveTab("portal")} 
              className={`px-4 py-2.5 sm:px-5 sm:py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm border w-full sm:w-auto cursor-pointer ${
                activeTab === "portal" 
                  ? "bg-[#ee1212] text-white border-[#ee1212] shadow-sm" 
                  : "bg-white hover:bg-red-50/40 text-slate-600 border-slate-200 hover:text-[#ee1212]"
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === "portal" ? "text-white" : "text-slate-400"}`} /> Cổng Thí Sinh
            </button>
            <button 
              id="nav-btn-admin"
              onClick={() => {
                if (isAdminAuthenticated) {
                  setActiveTab("dashboard");
                } else {
                  setActiveTab("auth");
                }
              }} 
              className={`px-4 py-2.5 sm:px-5 sm:py-2 rounded-lg text-xs font-bold transition-all active:scale-[1.05] flex items-center justify-center gap-1.5 shadow-sm border w-full sm:w-auto cursor-pointer ${
                activeTab === "auth" || activeTab === "dashboard"
                  ? "bg-[#ff0000] text-white border-[#ff0000] shadow-sm"
                  : "bg-white hover:bg-red-50/40 text-slate-600 border-slate-200 hover:text-[#ff0000]"
              }`}
            >
              {isAdminAuthenticated ? (
                <Unlock className={`w-4 h-4 ${activeTab === "auth" || activeTab === "dashboard" ? "text-white" : "text-slate-400"}`} />
              ) : (
                <Lock className={`w-4 h-4 ${activeTab === "auth" || activeTab === "dashboard" ? "text-white" : "text-slate-400"}`} />
              )} 
              Ban Tổ Chức
            </button>
          </div>
        </div>
        <div className="h-[3px] bg-red-750"></div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        
        {/* TAB 1: PORTAL */}
        {activeTab === "portal" && (
          <div className="space-y-6">
            
            {/* Countdown Banner */}
            {!isExamActive && !submittedResult && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"
              >
                <div className={`font-bold uppercase tracking-widest text-xs mb-3 flex items-center justify-center gap-1.5 ${
                  contestStatus === "RUNNING" ? "text-emerald-600" : "text-amber-600"
                }`}>
                  <Clock className={`w-4 h-4 ${contestStatus === "RUNNING" ? "animate-spin" : "animate-pulse"}`} style={{ animationDuration: contestStatus === "RUNNING" ? '12s' : '2s' }} />
                  <span>
                    {contestStatus === "NOT_STARTED" && "Hội thi chưa mở cổng - Đếm ngược thời gian"}
                    {contestStatus === "RUNNING" && "Hội thi đang diễn ra - Thời gian còn lại"}
                    {contestStatus === "ENDED" && "Hội thi đã kết thúc nhận bài"}
                  </span>
                </div>

                {/* Clock display */}
                <div className="flex justify-center gap-4 text-center">
                  <div className="bg-slate-50 text-slate-800 px-4 py-2.5 rounded-xl min-w-[70px] border border-slate-200 shadow-sm">
                    <span className="block text-2xl font-extrabold font-mono text-red-600">
                      {String(countdown.days).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Ngày</span>
                  </div>
                  <div className="bg-slate-50 text-slate-800 px-4 py-2.5 rounded-xl min-w-[70px] border border-slate-200 shadow-sm">
                    <span className="block text-2xl font-extrabold font-mono text-red-600">
                      {String(countdown.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Giờ</span>
                  </div>
                  <div className="bg-slate-50 text-slate-800 px-4 py-2.5 rounded-xl min-w-[70px] border border-slate-200 shadow-sm">
                    <span className="block text-2xl font-extrabold font-mono text-red-600">
                      {String(countdown.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Phút</span>
                  </div>
                  <div className="bg-slate-50 text-slate-800 px-4 py-2.5 rounded-xl min-w-[70px] border border-slate-200 shadow-sm">
                    <span className="block text-2xl font-extrabold font-mono text-red-600">
                      {String(countdown.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Giây</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-3 font-medium">
                  {contestStatus === "NOT_STARTED" && `Cổng thi sẽ mở vào lúc: ${formatVietnameseDateTime(schedule.startTime)}`}
                  {contestStatus === "RUNNING" && `Thời hạn cuối nộp bài: ${formatVietnameseDateTime(schedule.endTime)}`}
                  {contestStatus === "ENDED" && "Cảm ơn toàn thể nhân dân đã hăng hái tham gia hiến kế sáng tạo."}
                </p>
              </motion.div>
            )}

            {/* PORTAL STATE 1: Registration Form */}
            {!isExamActive && !submittedResult && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl mx-auto"
              >
                <div className="gold-gradient-bg p-6 text-white text-center">
                  <h2 className="font-sans font-extrabold text-lg md:text-xl uppercase tracking-tight text-center">ĐĂNG KÝ THÔNG TIN DỰ THI</h2>
                  <p className="text-xs text-amber-300 mt-1 font-medium">Vui lòng cung cấp chính xác để làm cơ sở xét thưởng</p>
                </div>

                <form onSubmit={handleStartExam} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Họ và Tên Thí Sinh <span className="text-red-500">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-650 focus:border-red-650 focus:outline-none text-slate-800 font-medium text-sm md:text-base" 
                      placeholder="Ví dụ: Nguyễn Văn A"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Năm sinh <span className="text-red-500">*</span>
                      </label>
                      <input 
                        required 
                        type="number" 
                        min="1920" 
                        max="2020"
                        value={regDob}
                        onChange={(e) => setRegDob(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-655 focus:border-red-655 focus:outline-none text-slate-800 text-sm md:text-base" 
                        placeholder="Ví dụ: 1995"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Giới tính <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-6 py-2">
                        <label className="inline-flex items-center cursor-pointer">
                          <input 
                            type="radio" 
                            name="regGender" 
                            checked={regGender === "Nam"}
                            onChange={() => setRegGender("Nam")}
                            className="w-4 h-4 text-red-700 focus:ring-red-600 border-slate-300"
                          />
                          <span className="ml-2 text-sm font-medium text-slate-700">Nam</span>
                        </label>
                          <label className="inline-flex items-center cursor-pointer">
                          <input 
                            type="radio" 
                            name="regGender" 
                            checked={regGender === "Nữ"}
                            onChange={() => setRegGender("Nữ")}
                            className="w-4 h-4 text-red-700 focus:ring-red-600 border-slate-300"
                          />
                          <span className="ml-2 text-sm font-medium text-slate-700">Nữ</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Số điện thoại liên hệ <span className="text-red-500">*</span>
                      </label>
                      <input 
                        required 
                        type="tel" 
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-655 focus:border-red-655 focus:outline-none text-slate-800 text-sm md:text-base font-mono" 
                        placeholder="Ví dụ: 0912345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Địa chỉ / Đơn vị công tác cụ thể <span className="text-red-500">*</span>
                      </label>
                      <input 
                        required 
                        type="text" 
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-655 focus:border-red-655 focus:outline-none text-slate-800 text-sm md:text-base" 
                        placeholder="Ví dụ: Khu phố 3, P. Hòa Lợi"
                      />
                    </div>
                  </div>

                  <div className="bg-red-50/40 p-4 rounded-xl border border-red-100 text-xs text-slate-700 leading-relaxed space-y-1">
                    <h4 className="font-bold flex items-center gap-1.5 text-red-800 text-xs uppercase">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" /> THỂ LỆ HỘI THI TRỰC TUYẾN:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
                      <li>Mỗi thí sinh được tham gia tối đa <strong>5 lượt làm bài</strong>.</li>
                      <li>Đề thi gồm <strong>20 câu hỏi trắc nghiệm</strong> bốc ngẫu nhiên từ ngân hàng câu hỏi.</li>
                      <li>Phần tự luận hiến kế xây dựng phường và thành phố <strong>(bắt buộc, viết tối đa 5000 ký tự)</strong>.</li>
                      <li>Thời gian làm bài quy định tối đa là <strong>20 phút</strong>.</li>
                    </ul>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3.5 rounded-xl text-white font-bold bg-red-700 hover:bg-red-800 shadow-md shadow-red-100 hover:shadow-lg transition-all text-sm tracking-wide uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Bắt Đầu Làm Bài <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* PORTAL STATE 2: ACTIVE EXAM WORKBENCH */}
            {isExamActive && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Questions content */}
                <div className="lg:col-span-2 space-y-6 order-last lg:order-first">
                  
                  {/* Exam Card Info Header */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-4 mb-6 gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-red-700 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider border border-red-100">
                          Đề thi số {examSetNumber}
                        </span>
                        <h2 className="text-lg font-bold text-slate-800 mt-2">Phần I: Câu Hỏi Trắc Nghiệm</h2>
                      </div>
                      
                      {/* Active Countdown Timer */}
                      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm font-mono text-lg font-extrabold self-start sm:self-center">
                        <Clock className="w-5 h-5 text-red-400 animate-pulse" />
                        <span>
                          {Math.floor(examTimeRemaining / 60)}:
                          {String(examTimeRemaining % 60).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Component */}
                    <div className="mb-6 bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 shadow-inner">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2.5 gap-2">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                          📋 Tiến trình làm bài: <span className="font-mono text-red-700 font-extrabold text-sm bg-red-50 px-2 py-0.5 rounded">{answeredCount}</span> / <span className="font-mono text-slate-700 font-bold text-sm bg-slate-200/60 px-2 py-0.5 rounded">{totalQuestions}</span> câu đã chọn đáp án
                        </span>
                        <span className="text-xs font-black text-amber-700 font-mono bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 self-start sm:self-center">
                          {progressPercent}% hoàn thành
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden relative shadow-inner">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ type: "spring", stiffness: 80, damping: 15 }}
                        />
                      </div>
                    </div>

                    {/* Quiz Questions List */}
                    <div className="space-y-6">
                      {examQuestions.map((q, idx) => {
                        const qNum = idx + 1;
                        const hasSelected = !!candidateAnswers[qNum];

                        return (
                          <div 
                            key={q.id} 
                            id={`q-card-${qNum}`}
                            className={`p-5 rounded-xl border transition-all space-y-3 ${
                              hasSelected 
                                ? "border-red-100 bg-red-50/10" 
                                : "border-slate-100 bg-slate-50/55 hover:bg-white hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-extrabold flex items-center justify-center text-xs mt-0.5 shrink-0 font-mono">
                                {qNum}
                              </span>
                              <h4 className="font-bold text-slate-800 text-sm md:text-base leading-relaxed">
                                {q.q}
                              </h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-10">
                              {q.options.map((opt) => {
                                const optionChar = opt.charAt(0);
                                const isSelected = candidateAnswers[qNum] === optionChar;

                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => handleSelectOption(qNum, optionChar)}
                                    className={`text-left p-3.5 rounded-xl border transition-all text-xs md:text-sm font-medium cursor-pointer ${
                                      isSelected
                                        ? "border-red-600 bg-red-50 text-red-800 font-extrabold shadow-sm ring-1 ring-red-200"
                                        : "border-slate-200 bg-white text-slate-700 hover:bg-red-50/30 hover:border-red-200"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Part II: Essay Response */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                    <div className="border-b pb-4">
                      <span className="text-[10px] font-extrabold text-red-700 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider border border-red-100">
                        Phần II: Tự Luận Hiến Kế (Bắt buộc)
                      </span>
                      <h2 className="text-base font-bold text-slate-800 mt-2">
                        Đề bài tự luận phát triển địa phương <span className="text-red-500">*</span>:
                      </h2>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                      Bạn hãy đề xuất các giải pháp, sáng kiến hoặc kế hoạch hành động cụ thể để góp phần xây dựng và phát triển <strong className="text-red-700 font-bold">Phường Hòa Lợi</strong> và <strong className="text-red-700 font-bold">Thành phố Hồ Chí Minh</strong> ngày càng văn minh, hiện đại, nghĩa tình nhân kỷ niệm 50 năm ngày mang tên Bác?
                    </div>

                    <div>
                      <textarea
                        rows={8}
                        value={essayResponse}
                        onChange={(e) => {
                          if (e.target.value.length <= 5000) {
                            setEssayResponse(e.target.value);
                          }
                        }}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-650 focus:border-red-650 focus:outline-none text-slate-800 text-sm leading-relaxed"
                        placeholder="Hãy viết bài hiến kế của bạn tại đây (Nhập tự do tối đa 5000 ký tự)..."
                      />
                      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                        <span>💡 Sáng kiến: Đô thị thông minh, ngày chủ nhật xanh, cải tiến hành chính công...</span>
                        <span className={`font-bold ${essayResponse.length >= 5000 ? "text-rose-600" : "text-emerald-600"}`}>
                          {essayResponse.length} / 5000 ký tự
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submission Action */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (!essayResponse.trim()) {
                          triggerToast("Vui lòng viết bài tự luận hiến kế xây dựng phường và thành phố (bắt buộc) trước khi nộp bài!", "error");
                          return;
                        }
                        setIsConfirmSubmitOpen(true);
                      }}
                      className="px-8 py-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition-all uppercase flex items-center gap-2 tracking-wide text-sm cursor-pointer"
                    >
                      <Send className="w-4 h-4" /> Nộp Bài Thi Lên Hệ Thống
                    </button>
                  </div>

                </div>

                {/* Right side navigation and stats */}
                <div className="space-y-6 order-first lg:order-last">
                  {/* Candidate Info */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Thí Sinh Hiện Tại</h3>
                    <div className="space-y-3">
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <User className="w-4 h-4 text-red-700 shrink-0" />
                        <span>{regName}</span>
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 border-t border-b py-2 my-2">
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-red-700" />
                          <span>NS: {regDob}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-red-700" />
                          <span>GT: {regGender}</span>
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-red-700" />
                        <span className="font-mono">{regPhone}</span>
                      </p>

                      <p className="text-xs text-slate-600 flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-red-700 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{regAddress}</span>
                      </p>
                    </div>
                  </div>

                  {/* Fast question navigator */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Danh Sách Câu Hỏi</h3>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {examQuestions.map((_, idx) => {
                        const qNum = idx + 1;
                        const isAnswered = !!candidateAnswers[qNum];

                        return (
                          <button
                            key={qNum}
                            onClick={() => {
                              document.getElementById(`q-card-${qNum}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                            }}
                            className={`w-10 h-10 rounded-xl font-bold transition-all flex items-center justify-center text-xs shadow-sm font-mono cursor-pointer ${
                              isAnswered
                                ? "bg-red-750 text-white shadow-sm shadow-red-100"
                                : "bg-white border border-slate-200 text-slate-700 hover:bg-red-50/50"
                            }`}
                          >
                            {qNum}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-750 inline-block"></span> Đã chọn</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-slate-300 bg-white inline-block"></span> Chưa chọn</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* PORTAL STATE 3: EXAM SUBMISSION RESULTS */}
            {submittedResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden text-center">
                  <div className="gold-gradient-bg p-8 text-white relative">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                      <CheckCircle className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h2 className="font-sans font-extrabold text-2xl tracking-tight">BÀI THI ĐÃ NỘP THÀNH CÔNG!</h2>
                    <p className="text-xs text-slate-300 uppercase tracking-widest mt-1.5 font-semibold">
                      HỆ THỐNG ĐÃ GHI NHẬN KẾT QUẢ CỦA BẠN
                    </p>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Kết quả phần trắc nghiệm</p>
                      <h3 className="text-4xl font-black text-red-700 mt-2 font-mono">
                        {submittedResult.score} / 20
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Câu trả lời chính xác</p>
                    </div>

                    <div className="text-left space-y-3 max-w-lg mx-auto text-xs md:text-sm text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-200 leading-relaxed">
                      <p className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" /> THÔNG BÁO BẢO MẬT BAN TỔ CHỨC:
                      </p>
                      <p>
                        Nhằm đảm bảo tính công bằng và bảo mật tuyệt đối cho hội thi trực tuyến của phường Hòa Lợi, hệ thống <strong>không hiển thị đáp án chi tiết và câu đúng/sai cụ thể</strong> cho thí sinh ngay sau khi nộp bài.
                      </p>
                      <p>
                        Kết quả trắc nghiệm and nội dung viết luận hiến kế phát triển địa phương của bạn đã được mã hóa an toàn và gửi thẳng đến tài khoản giám khảo của Ban Tổ chức để tiến hành đánh giá, xếp hạng chung cuộc.
                      </p>
                    </div>

                    <div className="pt-4 border-t flex justify-center">
                      <button
                        onClick={handleResetPortal}
                        className="px-6 py-3 rounded-xl font-bold bg-red-700 hover:bg-red-800 text-white transition-all text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" /> Tiếp Tục Lượt Thi Tiếp Theo
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        )}

        {/* TAB 2: ADMIN AUTHENTICATION LOGIN */}
        {activeTab === "auth" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="gold-gradient-bg p-6 text-white text-center">
                <Lock className="w-12 h-12 text-amber-300 mx-auto mb-2 animate-pulse" />
                <h2 className="font-sans font-extrabold text-xl mt-2 uppercase tracking-tight">XÁC THỰC BAN TỔ CHỨC</h2>
                <p className="text-xs text-red-100 mt-1 font-medium">Vui lòng cung cấp mã PIN Quản trị viên để truy cập cơ sở dữ liệu</p>
              </div>

              <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Mã PIN Admin
                  </label>
                  <input
                    required
                    type="password"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-650 focus:outline-none text-center font-mono text-lg tracking-widest text-slate-800"
                    placeholder="••••••••"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-red-100"
                >
                  Xác Thực Truy Cập
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* TAB 3: ADMIN DASHBOARD */}
        {activeTab === "dashboard" && isAdminAuthenticated && (
          <div className="space-y-6">
            
            {/* Admin Header Title */}
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-sans font-extrabold text-slate-900 tracking-tight">Bảng Điều Khiển Của Ban Tổ Chức</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Giám sát bài làm, kết quả thi, chấm điểm tự luận hiến kế bằng AI và quản lý cấu hình cuộc thi.
                </p>
              </div>
              
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Xuất Bảng Điểm (CSV)
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-slate-500" /> Thoát Admin
                </button>
              </div>
            </div>

            {/* Inner Tabs navigation */}
            <div className="flex border-b border-slate-200 justify-center">
              <button
                onClick={() => setAdminSelectedTab("results")}
                className={`px-6 py-3 border-b-2 font-bold text-sm focus:outline-none flex items-center gap-2 transition-all cursor-pointer ${
                  adminSelectedTab === "results"
                    ? "border-red-700 text-red-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Users className="w-4 h-4" /> Danh Sách Thí Sinh
              </button>
              <button
                onClick={() => setAdminSelectedTab("examsets")}
                className={`px-6 py-3 border-b-2 font-bold text-sm focus:outline-none flex items-center gap-2 transition-all cursor-pointer ${
                  adminSelectedTab === "examsets"
                    ? "border-red-700 text-red-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Sliders className="w-4 h-4" /> Thư Viện 10 Bộ Đề Thi
              </button>
              <button
                onClick={() => setAdminSelectedTab("schedule")}
                className={`px-6 py-3 border-b-2 font-bold text-sm focus:outline-none flex items-center gap-2 transition-all cursor-pointer ${
                  adminSelectedTab === "schedule"
                    ? "border-red-700 text-red-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Settings className="w-4 h-4" /> Thiết Lập Lịch Thi
              </button>
            </div>

            {/* Admin Section 1: Candidates list & results */}
            {adminSelectedTab === "results" && (
              <div className="space-y-6">
                
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tổng số thí sinh</p>
                      <h3 className="text-2xl font-black text-slate-800 mt-1">{adminStats.total}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-700 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Điểm số trung bình</p>
                      <h3 className="text-2xl font-black text-slate-800 mt-1">{adminStats.avgScore}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tỷ lệ viết tự luận</p>
                      <h3 className="text-2xl font-black text-slate-800 mt-1">{adminStats.essayRate}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Thí sinh cao tuổi nhất</p>
                      <h3 className="text-sm font-bold text-slate-800 mt-1 truncate max-w-[150px]">{adminStats.oldestCandidate}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-700 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Submissions Table list */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <h3 className="font-bold text-slate-800 text-sm">Danh sách Kết Quả Thí Sinh</h3>
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={adminSearchQuery}
                        onChange={(e) => setAdminSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                        placeholder="Tìm tên / số điện thoại / đơn vị..."
                      />
                    </div>
                  </div>

                  {/* Desktop Table view (visible on lg and up) */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-bold">
                          <th className="p-4">Thí Sinh</th>
                          <th className="p-4 text-center">Năm Sinh</th>
                          <th className="p-4 text-center">Giới Tính</th>
                          <th className="p-4">Số Điện Thoại</th>
                          <th className="p-4">Địa Chỉ / Đơn Vị</th>
                          <th className="p-4 text-center">Mã Bộ Đề</th>
                          <th className="p-4 text-center">Điểm Trắc Nghiệm</th>
                          <th className="p-4">Tự Luận Hiến Kế</th>
                          <th className="p-4 text-center">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredSubmissions.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-slate-400 font-medium">
                              Không tìm thấy kết quả nào trùng khớp.
                            </td>
                          </tr>
                        ) : (
                          filteredSubmissions.map((item, index) => {
                            const subId = item.id || `sub_${index}`;
                            return (
                              <tr key={subId} className="hover:bg-slate-50/80 transition-all">
                                <td className="p-4 font-bold text-slate-800">
                                  <div>{item.candidate.name}</div>
                                  <div className="text-[10px] font-normal text-slate-400 mt-0.5">
                                    Nộp: {new Date(item.createdAt).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
                                  </div>
                                </td>
                                <td className="p-4 text-center font-medium text-slate-600">{item.candidate.dob}</td>
                                <td className="p-4 text-center">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    item.candidate.gender === "Nam" ? "bg-red-50 text-red-700" : "bg-pink-50 text-pink-700"
                                  }`}>
                                    {item.candidate.gender}
                                  </span>
                                </td>
                                <td className="p-4 font-mono font-medium text-slate-600">{item.candidate.phone}</td>
                                <td className="p-4 font-medium text-slate-600 max-w-[180px] truncate" title={item.candidate.address}>
                                  {item.candidate.address}
                                </td>
                                <td className="p-4 text-center font-bold text-red-700 font-mono">Đề {item.examSet}</td>
                                <td className="p-4 text-center font-bold">
                                  <span className={`px-2.5 py-1 rounded-full ${
                                    item.score >= 15 ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"
                                  }`}>
                                    {item.score} / 20
                                  </span>
                                </td>
                                <td className="p-4">
                                  {item.essay ? (
                                    <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-100 max-w-[150px] truncate block" title={item.essay}>
                                      {item.essay.substring(0, 30)}...
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic">Không viết tự luận</span>
                                  )}
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex justify-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedSubmission(item);
                                        setSelectedSubmissionIndex(index);
                                      }}
                                      className="px-2.5 py-1 rounded bg-red-700 hover:bg-red-800 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                      <Eye className="w-3 h-3" /> Xem Bài
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSubmission(item.id!, index)}
                                      className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile & Tablet Card View (visible on screens below lg) */}
                  <div className="block lg:hidden divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                    {filteredSubmissions.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 font-medium text-xs">
                        Không tìm thấy kết quả nào trùng khớp.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/30">
                        {filteredSubmissions.map((item, index) => {
                          const subId = item.id || `sub_${index}`;
                          return (
                            <div key={subId} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between gap-3">
                              <div className="space-y-2">
                                <div className="flex justify-between items-start gap-1">
                                  <div>
                                    <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{item.candidate.name}</h4>
                                    <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">
                                      Nộp: {new Date(item.createdAt).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
                                    </span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-full font-bold text-xs shrink-0 ${
                                    item.score >= 15 ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                                  }`}>
                                    {item.score} / 20 điểm
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-xs border-t pt-2 border-slate-100 font-medium text-slate-600">
                                  <div>
                                    <span className="text-slate-400">Năm sinh:</span> {item.candidate.dob}
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Giới tính:</span>{' '}
                                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                                      item.candidate.gender === "Nam" ? "bg-red-50 text-red-700" : "bg-pink-50 text-pink-700"
                                    }`}>
                                      {item.candidate.gender}
                                    </span>
                                  </div>
                                  <div className="col-span-2 font-mono mt-0.5">
                                    <span className="text-slate-400 font-sans">SĐT:</span> {item.candidate.phone}
                                  </div>
                                  <div className="col-span-2 text-[11px] truncate text-slate-500 mt-0.5" title={item.candidate.address}>
                                    <span className="text-slate-400">Đơn vị:</span> {item.candidate.address}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                  <span className="text-[10px] font-extrabold text-red-700 font-mono bg-red-50 px-1.5 py-0.5 rounded border border-red-100 shrink-0">Đề {item.examSet}</span>
                                  {item.essay ? (
                                    <span className="text-[10px] font-mono text-amber-800 truncate flex-grow" title={item.essay}>
                                      📝 Luận: {item.essay.substring(0, 35)}...
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic">Không viết tự luận</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2 border-t pt-2.5 border-slate-100 justify-end shrink-0">
                                <button
                                  onClick={() => {
                                    setSelectedSubmission(item);
                                    setSelectedSubmissionIndex(index);
                                  }}
                                  className="flex-1 py-1.5 rounded-lg bg-[#ee1212] hover:bg-red-800 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                                >
                                  <Eye className="w-3.5 h-3.5" /> Xem Bài
                                </button>
                                <button
                                  onClick={() => handleDeleteSubmission(item.id!, index)}
                                  className="py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* Admin Section 2: Detailed 10 exam sets viewer */}
            {adminSelectedTab === "examsets" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-4">
                    LỰA CHỌN BỘ ĐỀ THI ĐỂ XEM CHI TIẾT
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const setNum = i + 1;
                      const isActive = adminSelectedSet === setNum;

                      return (
                        <button
                          key={setNum}
                          onClick={() => setAdminSelectedSet(setNum)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                            isActive
                              ? "border-red-700 bg-red-50 text-red-700 shadow-sm"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          Đề Số {setNum}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-lg font-sans font-extrabold text-slate-900 tracking-tight">Chi Tiết Bộ Đề Thi Số {adminSelectedSet}</h2>
                    <p className="text-xs text-slate-400 mt-1">Đề thi bao gồm 20 câu trắc nghiệm được phân bố tỷ lệ cân bằng và bốc ngẫu nhiên</p>
                  </div>

                  <div className="space-y-6">
                    {generateFixedExamSet(adminSelectedSet).map((q, idx) => (
                      <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-extrabold flex items-center justify-center text-xs mt-0.5 shrink-0 font-mono">
                            {idx + 1}
                          </span>
                          <h4 className="font-bold text-slate-800 text-sm md:text-base leading-relaxed">{q.q}</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-10 text-xs md:text-sm">
                          {q.options.map((opt) => {
                             const optChar = opt.charAt(0);
                             const isCorrect = optChar === q.answer;

                             return (
                               <div
                                 key={opt}
                                 className={`p-3 rounded-xl border font-medium ${
                                   isCorrect
                                     ? "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold"
                                     : "border-slate-200 bg-white text-slate-600"
                                 }`}
                               >
                                 {opt}
                               </div>
                             );
                           })}
                        </div>

                        <div className="pl-10 text-xs text-slate-500 bg-slate-100/50 p-3 rounded-xl border border-dashed border-slate-200">
                          <strong>📌 Lý giải chi tiết:</strong> {q.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Admin Section 3: Time setting schedule */}
            {adminSelectedTab === "schedule" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
                    <Settings className="w-5 h-5 text-red-700" /> Thiết Lập Thời Gian Tổ Chức Hội Thi
                  </h3>
                  <p className="text-xs text-slate-500 text-center leading-relaxed">
                    Khung thời gian quy định cổng làm bài mở hoặc đóng tự động. Ngoài khoảng này, trang portal thí sinh sẽ khóa nộp bài và chỉ hiển thị đồng hồ đếm ngược.
                  </p>
                </div>

                <form onSubmit={handleSaveSchedule} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Thời gian Bắt Đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="datetime-local"
                      value={scheduleFormStart}
                      onChange={(e) => setScheduleFormStart(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-700 focus:outline-none text-slate-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Thời gian Kết Thúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="datetime-local"
                      value={scheduleFormEnd}
                      onChange={(e) => setScheduleFormEnd(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-700 focus:outline-none text-slate-800 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-white font-bold bg-red-800 hover:bg-red-900 shadow transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Lưu Khung Thời Gian
                  </button>
                </form>
              </motion.div>
            )}

          </div>
        )}

      </main>

      {/* CONFIRMATION SUBMIT POPUP MODAL */}
      {isConfirmSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full border border-slate-100 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-800 flex items-center justify-center mx-auto">
              <Send className="w-8 h-8 text-red-800 animate-bounce" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 font-serif">Nộp bài thi và bài luận hiến kế?</h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              Hệ thống sẽ ngay lập tức so sánh tính đúng đắn của phần thi trắc nghiệm và ghi nhận bản viết luận tự luận của bạn gửi trực tiếp cho Ban Giám Khảo Phường.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => setIsConfirmSubmitOpen(false)}
                className="py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm cursor-pointer"
              >
                Làm tiếp
              </button>
              <button
                onClick={() => handleFinalSubmit(false)}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md cursor-pointer"
              >
                Đồng ý nộp bài
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ADMIN DETAIL SUBMISSION MODAL POPUP */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-100 flex flex-col max-h-[90vh]"
          >
            {/* Header info */}
            <div className="gold-gradient-bg p-5 text-white flex justify-between items-center shrink-0 relative">
              <div className="text-center w-full">
                <h3 className="font-serif font-bold text-lg md:text-xl">
                  {selectedSubmission.candidate.name}
                </h3>
                <p className="text-xs text-yellow-300 font-medium">
                  Năm sinh: {selectedSubmission.candidate.dob || "-"} | Giới tính: {selectedSubmission.candidate.gender || "-"}
                </p>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all absolute right-5 cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-grow text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/80 space-y-2">
                  <h4 className="font-bold text-slate-800 border-b pb-1.5 flex items-center gap-1">
                    <User className="w-4 h-4 text-red-800 shrink-0" /> Chi tiết Thí sinh
                  </h4>
                  <p className="text-xs text-slate-600"><strong>Số điện thoại:</strong> <span className="font-mono text-slate-800">{selectedSubmission.candidate.phone}</span></p>
                  <p className="text-xs text-slate-600"><strong>Địa chỉ / Đơn vị cụ thể:</strong> <span className="text-slate-800 font-medium">{selectedSubmission.candidate.address}</span></p>
                  <p className="text-xs text-slate-600"><strong>Bộ đề thi làm:</strong> <span className="font-bold text-red-700">Đề Số {selectedSubmission.examSet}</span></p>
                  <p className="text-xs text-slate-600"><strong>Thời gian hoàn thành:</strong> <span className="text-slate-800 font-medium">{new Date(selectedSubmission.createdAt).toLocaleString("vi-VN")}</span></p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-2">
                  <h4 className="font-bold text-emerald-800 border-b pb-1.5 flex items-center gap-1">
                    <Award className="w-4 h-4 text-emerald-700 shrink-0" /> Kết quả Trắc nghiệm
                  </h4>
                  <p className="text-xs text-slate-600"><strong>Tổng câu trả lời đúng:</strong> <span className="text-xl font-black text-emerald-700 font-mono">{selectedSubmission.score} / 20</span></p>
                  <p className="text-xs text-slate-600"><strong>Tỷ lệ chính xác:</strong> <span className="font-bold text-slate-800">{Math.round((selectedSubmission.score / 20) * 100)}%</span></p>
                </div>
              </div>

              {/* Essay Content */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 border-b pb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-800 shrink-0" /> Bài luận tự luận hiến kế của thí sinh:
                </h4>
                <div className="bg-amber-50/30 p-4 rounded-xl border border-amber-200/50 whitespace-pre-line italic text-slate-700 leading-relaxed text-xs md:text-sm max-h-48 overflow-y-auto">
                  {selectedSubmission.essay || "Thí sinh không tham gia trả lời tự luận hiến kế."}
                </div>
              </div>

              {/* Star grading & AI grading */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-2">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs uppercase">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" /> Chấm điểm tự luận hiến kế
                  </h4>
                  
                  {selectedSubmission.essay && selectedSubmission.essay.trim().length > 0 && (
                    <button
                      onClick={handleAiGrade}
                      disabled={isAiGrading}
                      className="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-900 text-white text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Cpu className={`w-3.5 h-3.5 ${isAiGrading ? "animate-spin" : "animate-pulse"}`} />
                      {isAiGrading ? "AI Đang chấm bài..." : "AI Chấm Bài Luận (Gemini)"}
                    </button>
                  )}
                </div>

                <div className="space-y-3.5">
                  {/* Criterion 1 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-700">Tiêu chí 1: Tính thực tiễn & khả thi</span>
                      <p className="text-[10px] text-slate-500 leading-tight">Mức độ thiết thực, khả năng hiện thực hóa tại Phường Hòa Lợi.</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starNum = i + 1;
                        const hasStar = starNum <= (selectedSubmission.ratings?.[1] || 0);
                        return (
                          <Star
                            key={starNum}
                            onClick={() => handleManualRating(1, starNum)}
                            className={`w-5 h-5 cursor-pointer transition-all ${
                              hasStar ? "text-yellow-500 fill-yellow-500" : "text-slate-300 hover:text-yellow-400"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Criterion 2 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-700">Tiêu chí 2: Tính sáng tạo & đổi mới</span>
                      <p className="text-[10px] text-slate-500 leading-tight">Tính đột phá, áp dụng khoa học công nghệ, cách tiếp cận hiện đại.</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starNum = i + 1;
                        const hasStar = starNum <= (selectedSubmission.ratings?.[2] || 0);
                        return (
                          <Star
                            key={starNum}
                            onClick={() => handleManualRating(2, starNum)}
                            className={`w-5 h-5 cursor-pointer transition-all ${
                              hasStar ? "text-yellow-500 fill-yellow-500" : "text-slate-300 hover:text-yellow-400"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Criterion 3 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-700">Tiêu chí 3: Văn phong & lập luận</span>
                      <p className="text-[10px] text-slate-500 leading-tight">Lập luận chặt chẽ, trình bày mạch lạc, thuyết phục người nghe.</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starNum = i + 1;
                        const hasStar = starNum <= (selectedSubmission.ratings?.[3] || 0);
                        return (
                          <Star
                            key={starNum}
                            onClick={() => handleManualRating(3, starNum)}
                            className={`w-5 h-5 cursor-pointer transition-all ${
                              hasStar ? "text-yellow-500 fill-yellow-500" : "text-slate-300 hover:text-yellow-400"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Total manual display */}
                <div className="border-t pt-2.5 flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Tổng điểm xếp hạng chấm hiến kế:</span>
                  <span className="text-amber-600 font-extrabold text-sm font-mono">
                    {((selectedSubmission.ratings?.[1] || 0) + (selectedSubmission.ratings?.[2] || 0) + (selectedSubmission.ratings?.[3] || 0))} / 15 Sao
                  </span>
                </div>

                {/* AI Detailed comment display if present */}
                {selectedSubmission.essayEvaluation && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 mt-3"
                  >
                    <h5 className="font-extrabold text-emerald-800 text-xs flex items-center gap-1">
                      <Cpu className="w-4 h-4 text-emerald-600" /> BAN GIÁM KHẢO AI (GEMINI) NHẬN XÉT CHI TIẾT:
                    </h5>
                    <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white/70 p-3 rounded-lg border border-emerald-100">
                      <p className="mb-1"><strong>📊 Nhận xét theo tiêu chí:</strong></p>
                      <ul className="list-disc pl-4 space-y-1 mb-2">
                        <li><strong>Thực tiễn:</strong> {selectedSubmission.essayEvaluation.feedback1}</li>
                        <li><strong>Sáng tạo:</strong> {selectedSubmission.essayEvaluation.feedback2}</li>
                        <li><strong>Lập luận:</strong> {selectedSubmission.essayEvaluation.feedback3}</li>
                      </ul>
                      <p className="border-t pt-1.5 mt-1.5"><strong>💡 Đánh giá tổng quát:</strong> {selectedSubmission.essayEvaluation.overallComment}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Detailed choices list comparison */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 border-b pb-1.5">Đối chiếu đáp án chi tiết trắc nghiệm:</h4>
                <div className="space-y-4">
                  {selectedSubmission.answersDetail.map((item) => (
                    <div 
                      key={item.questionNo}
                      className={`p-4 rounded-xl border ${
                        item.isCorrect ? "border-emerald-200 bg-emerald-50/20" : "border-red-200 bg-red-50/20"
                      } space-y-2`}
                    >
                      <div className="font-bold text-slate-800 flex items-start gap-2 text-xs md:text-sm">
                        <span className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-mono ${
                          item.isCorrect ? "bg-emerald-600" : "bg-red-600"
                        }`}>
                          {item.questionNo}
                        </span>
                        <span>{item.questionText}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-7 text-[11px] md:text-xs">
                        {item.options.map((opt) => {
                          const optionChar = opt.charAt(0);
                          const isCandChoice = item.candidateAnswer === optionChar;
                          const isCorrectChoice = item.correctAnswer === optionChar;

                          let style = "p-2 rounded bg-white border border-slate-100 text-slate-600";
                          if (isCorrectChoice) {
                            style = "p-2 rounded border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                          } else if (isCandChoice && !item.isCorrect) {
                            style = "p-2 rounded border-2 border-red-500 bg-red-50 text-red-950 font-semibold";
                          }

                          return <div key={opt} className={style}>{opt}</div>;
                        })}
                      </div>

                      <div className="pl-7 pt-1 text-xs text-slate-500 italic leading-relaxed">
                        <strong>Lý giải chi tiết:</strong> {item.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer action close modal */}
            <div className="p-4 bg-slate-50 border-t flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Đóng Xem Chi Tiết
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer System Panel */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-xs space-y-1.5 mt-auto px-4 shrink-0">
        <p className="text-slate-300 font-bold uppercase tracking-wider">
          ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM VÀ CÁC TỔ CHỨC CHÍNH TRỊ - XÃ HỘI PHƯỜNG HÒA LỢI
        </p>
        <p>
          Hội thi trực tuyến tìm hiểu lịch sử - Hành trình 50 năm ngày Thành phố Sài Gòn - Gia Định chính thức mang tên Chủ tịch Hồ Chí Minh (02/7/1976 - 02/7/2026)
        </p>
        <p className="text-slate-500">
          © 2026 Bản quyền hệ thống và thiết lập cấu trúc thuộc về Ban Tổ chức Phường Hòa Lợi.
        </p>
      </footer>

    </div>
  );
}
