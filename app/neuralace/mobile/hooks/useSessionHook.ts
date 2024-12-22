import { useLocalStorage } from "@/hooks/localStorage";
import { useEffect, useMemo, useState } from "react";
import { calculateDaysUntil } from "../utils/googlesheets";
import { convertDate } from "../utils/dateFormatter";

// Configuration constants
const DEFAULT_TIME = "00:00:00";
const TOTAL_SESSIONS = 13;
const VIDEOS_PER_SESSION = 6;

// Interfaces for session and video data
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

export interface ISessionData {
  currentSession: number;
  sessionDate: string;
  sessionCandidate: string;
  isSessionInProcess: boolean;
}

// Utility functions
const createEmptyVideo = (): VideoData => ({
  startTime: DEFAULT_TIME,
  endTime: DEFAULT_TIME,
  lastUpdated: null,
  notes: "",
});

const createEmptySession = (): SessionData => ({
  sessionId: "",
  highImpedance: "",
  lowImpedance: "",
  sheetUpdate: {
    lastUpdated: null,
    isUpdated: false,
  },
  videos: Array.from({ length: VIDEOS_PER_SESSION }, createEmptyVideo),
});

export const useSession = () => {
  const { getFromLocalStorage, setToLocalStorage } = useLocalStorage();

  const isSSR = typeof window === "undefined";

  // Initialize sessions and sessionData state
  const [sessions, setSessions] = useState<SessionData[]>(() => {
    if (isSSR)
      return Array.from({ length: TOTAL_SESSIONS }, createEmptySession);
    const saved = getFromLocalStorage("sessions");
    return saved
      ? saved
      : Array.from({ length: TOTAL_SESSIONS }, createEmptySession);
  });

  const [sessionData, setSessionData] = useState<ISessionData>(() => {
    const defaultSessionData: ISessionData = {
      currentSession: 0,
      sessionDate: convertDate(new Date().toString()),
      sessionCandidate: "",
      isSessionInProcess: false,
    };
    if (isSSR) return defaultSessionData;
    const saved = getFromLocalStorage("sessionData");
    return saved ? saved : defaultSessionData;
  });

  // Handlers
  const handleSessionData = (
    field: keyof ISessionData,
    value: boolean | string | number
  ) => {
    console.log(field, value);
    setSessionData((prev) => {
      const updatedData = { ...prev, [field]: value };
      if (field === "isSessionInProcess") {
        if (value) {
          const newSessions = Array.from(
            { length: TOTAL_SESSIONS },
            createEmptySession
          );
          setSessions(newSessions);
          setToLocalStorage("sessions", newSessions);
          updatedData.isSessionInProcess = true;
        } else {
          updatedData.isSessionInProcess = false;
          updatedData.currentSession = 0;
        }
      }
      return updatedData;
    });
  };

  const handleSessionDataChange = (
    sessionIndex: number,
    field: keyof SessionData,
    value: SessionData[keyof SessionData]
  ) => {
    console.log("sessionIndex:", sessionIndex);
    setSessions((prev) => {
      const updatedSessions = [...prev];
      updatedSessions[sessionIndex] = {
        ...prev[sessionIndex],
        [field]: value,
      };
      return updatedSessions;
    });
  };

  const handleVideoTimeChange = (
    sessionIndex: number,
    videoIndex: number,
    field: keyof VideoData,
    value: string
  ) => {
    setSessions((prev) => {
      const updatedSessions = [...prev];
      const updatedVideos = [...updatedSessions[sessionIndex].videos];
      updatedVideos[videoIndex] = {
        ...updatedVideos[videoIndex],
        [field]: value,
        lastUpdated: new Date().toLocaleString(),
      };
      updatedSessions[sessionIndex].videos = updatedVideos;
      return updatedSessions;
    });
  };

  const recordCurrentTime = (
    videoIndex: number,
    timeType: "startTime" | "endTime"
  ) => {
    const timeString = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });
    handleVideoTimeChange(
      sessionData.currentSession,
      videoIndex,
      timeType,
      timeString
    );
  };

  const clearSessionTimings = () => {
    setSessions((prev) => {
      const updatedSessions = [...prev];
      updatedSessions[sessionData.currentSession] = createEmptySession();
      return updatedSessions;
    });
  };

  const navigateSession = (direction: "next" | "prev") => {
    setSessionData((prev) => {
      const newIndex =
        direction === "next"
          ? Math.min(prev.currentSession + 1, sessions.length - 1)
          : Math.max(prev.currentSession - 1, 0);
      return { ...prev, currentSession: newIndex };
    });
  };

  // Persist state to localStorage
  useEffect(() => {
    setToLocalStorage("sessions", sessions);
  }, [sessions]);

  useEffect(() => {
    setToLocalStorage("sessionData", sessionData);
  }, [sessionData]);

  const isNewDay = useMemo(
    () => !sessionData.isSessionInProcess,
    [sessionData.isSessionInProcess]
  );

  return {
    sessionsData: {
      sessions,
      currentSession: sessionData.currentSession,
      selectedCandidate: sessionData.sessionCandidate,
      sessionDate: sessionData.sessionDate,
      isSessionInProcess: sessionData.isSessionInProcess,
      isNewDay,
    },
    handlers: {
      handleSessionDataChange,
      handleVideoTimeChange,
      recordCurrentTime,
      clearSessionTimings,
      navigateSession,
      handleSessionData,
    },
  };
};
