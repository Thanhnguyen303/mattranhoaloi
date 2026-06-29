export interface Candidate {
  name: string;
  dob: string; // Year of birth
  gender: 'Nam' | 'Nữ';
  phone: string;
  address: string;
  timestamp: string;
}

export interface Question {
  id: number;
  q: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface AnswerDetail {
  questionNo: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  candidateAnswer: string;
  explanation: string;
  isCorrect: boolean;
}

export interface EssayEvaluation {
  criteria1: number; // 1 to 5
  criteria2: number; // 1 to 5
  criteria3: number; // 1 to 5
  feedback1: string;
  feedback2: string;
  feedback3: string;
  overallComment: string;
}

export interface Submission {
  id?: string;
  candidate: Candidate;
  examSet: number;
  score: number;
  essay: string;
  answersDetail: AnswerDetail[];
  createdAt: string;
  ratings?: {
    1: number;
    2: number;
    3: number;
  };
  essayEvaluation?: EssayEvaluation;
}

export interface ContestSchedule {
  startTime: string;
  endTime: string;
}
