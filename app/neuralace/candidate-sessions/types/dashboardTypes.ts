import {
  CandidateSessionsData,
  SessionData,
} from "../../mobile/types/sessionTypes";

interface DashBoardSession {
  id: string;
  candidateName: string;
  date: string;
  [key: string]: any;
}

export interface DashBoardSessionsState {
  candidatesSessions: CandidateSessionsData[];
  candidateNames: string[];
  filteredSessions: CandidateSessionsData[];
  filteredSession: SessionData[];
  candidateName: string;
  candidateDate: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
