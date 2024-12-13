import { useLocalStorage } from "@/hooks/localStorage";
import { useEffect, useState } from "react";

/**
 * Default time value used for new video entries
 */
const DEFAULT_TIME = "00:00:00";

/**
 * Configuration constants
 */
const TOTAL_SESSIONS = 12;
const VIDEOS_PER_SESSION = 6;

/**
 * Represents timing and note data for a single video recording
 */
export interface VideoData {
  startTime: string;
  endTime: string;
  lastUpdated: string | null;
  notes: string;
}

/**
 * Represents all data associated with a recording session
 */
export interface SessionData {
  sessionId: string;
  highImpedance: string;
  lowImpedance: string;
  videos: VideoData[];
}

/**
 * Creates a new empty video entry with default values
 */
const createEmptyVideo = (): VideoData => ({
  startTime: DEFAULT_TIME,
  endTime: DEFAULT_TIME,
  lastUpdated: null,
  notes: "",
});

/**
 * Creates a new empty session with default values
 */
const createEmptySession = (): SessionData => ({
  sessionId: "",
  highImpedance: "",
  lowImpedance: "",
  videos: Array(VIDEOS_PER_SESSION).fill(null).map(createEmptyVideo),
});

/**
 * Custom hook for managing recording session state
 * Handles session navigation, data persistence, and timing operations
 */
export const useSession = () => {
  const { getFromLocalStorage } = useLocalStorage();
  // Initialize current session from localStorage or default to 0
  const [currentSession, setCurrentSession] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("currentSession") || "0");
  });

  // Initialize sessions data from localStorage or create new empty sessions
  const [sessions, setSessions] = useState<SessionData[]>(() => {
    if (typeof window === "undefined") {
      return Array(TOTAL_SESSIONS).fill(null).map(createEmptySession);
    }
    const saved = getFromLocalStorage("sessions");
    return saved
      ? JSON.parse(saved)
      : Array(TOTAL_SESSIONS).fill(null).map(createEmptySession);
  });

  /**
   * Updates session metadata (sessionId, impedance values)
   */
  const handleSessionDataChange = (
    sessionIndex: number,
    field: keyof SessionData,
    value: string
  ) => {
    setSessions((prev) =>
      prev.map((session, idx) =>
        idx === sessionIndex ? { ...session, [field]: value } : session
      )
    );
  };

  /**
   * Updates video timing data and notes, includes timestamp of last update
   */
  const handleVideoTimeChange = (
    sessionIndex: number,
    videoIndex: number,
    field: keyof VideoData,
    value: string
  ) => {
    setSessions((prev) =>
      prev.map((session, sIdx) =>
        sIdx === sessionIndex
          ? {
              ...session,
              videos: session.videos.map((video, vIdx) =>
                vIdx === videoIndex
                  ? {
                      ...video,
                      [field]: value,
                      lastUpdated: new Date().toLocaleString(),
                    }
                  : video
              ),
            }
          : session
      )
    );
  };

  /**
   * Records current system time for a video's start/end time
   */
  const recordCurrentTime = (
    videoIndex: number,
    timeType: "startTime" | "endTime"
  ) => {
    const now = new Date();
    const timeString = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");

    handleVideoTimeChange(currentSession, videoIndex, timeType, timeString);
  };

  /**
   * Resets all video timings for current session to defaults
   */
  const clearSessionTimings = () => {
    setSessions((prev) =>
      prev.map((session, idx) =>
        idx === currentSession
          ? {
              ...session,
              videos: Array(VIDEOS_PER_SESSION)
                .fill(null)
                .map(createEmptyVideo),
            }
          : session
      )
    );
  };

  /**
   * Navigation handlers for moving between sessions
   */
  const nextSession = () =>
    currentSession < sessions.length - 1 &&
    setCurrentSession((curr) => curr + 1);

  const prevSession = () =>
    currentSession > 0 && setCurrentSession((curr) => curr - 1);

  // Persist sessions data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  /**
   * Persists current session index to localStorage whenever it changes
   */
  useEffect(() => {
    localStorage.setItem("currentSession", currentSession.toString());
  }, [currentSession]);

  return {
    sessionsData: {
      sessions,
      currentSession,
    },
    handlers: {
      handleSessionDataChange,
      handleVideoTimeChange,
      recordCurrentTime,
      clearSessionTimings,
      nextSession,
      prevSession,
    },
  };
};
