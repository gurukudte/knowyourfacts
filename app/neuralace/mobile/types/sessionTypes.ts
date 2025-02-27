export interface VideoData {
  startTime: string;
  endTime: string;
  lastUpdated: string | null;
  notes: string;
}

export interface SessionData {
  sessionId: string;
  highImpedance: string;
  lowImpedance: string;
  videos: VideoData[];
  sheetUpdate: {
    lastUpdated: null | string;
    isUpdated: boolean;
  };
}

export interface CandidateSessionsData {
  id: string;
  todayStartRange: number;
  isSheetUpdated: boolean;
  raTechnicianName?: string;
  candidateName: string;
  currentSession: number;
  sessions: SessionData[];
  isCreated: boolean;
  updatedAt: string | null;
  date: string;
  isSessionInProgress: boolean;
}
