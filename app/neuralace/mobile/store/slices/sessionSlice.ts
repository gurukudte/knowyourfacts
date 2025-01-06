import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CandidateSessionsData,
  SessionData,
  VideoData,
} from "../../types/sessionTypes";

// Configuration constants
export const DEFAULT_TIME = "00:00:00";
export const TOTAL_SESSIONS = 14;
export const VIDEOS_PER_SESSION = 7;

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

// Initial State
const initialState: CandidateSessionsData = {
  candidateName: "",
  currentSession: 0,
  sessions: Array.from({ length: TOTAL_SESSIONS }, createEmptySession),
  isCreated: false,
  lastUpdated: null,
  date: "",
  isSessionInProgress: false,
};

// Slice
const sessionSlice = createSlice({
  name: "candidateSessions",
  initialState,
  reducers: {
    setSessions(state, action: PayloadAction<CandidateSessionsData>) {
      state = action.payload;
    },
    setCandidateName(state, action: PayloadAction<string>) {
      state.candidateName = action.payload;
    },
    setCurrentSession(state, action: PayloadAction<"prev" | "next">) {
      switch (action.payload) {
        case "prev":
          state.currentSession -= 1;
          break;
        case "next":
          state.currentSession += 1;
          break;
      }
    },
    addSession(state, action: PayloadAction<SessionData>) {
      state.sessions.push(action.payload);
    },
    updateSession(
      state,
      action: PayloadAction<{
        sessionIndex: number;
        field: keyof SessionData;
        value: SessionData[keyof SessionData];
      }>
    ) {
      const { sessionIndex, field, value } = action.payload;
      state.sessions[sessionIndex][field] = value as any;
    },
    setVideoTimeChange(
      state,
      action: PayloadAction<{
        sessionIndex: number;
        videoIndex: number;
        field: keyof VideoData;
        value: string;
      }>
    ) {
      const { sessionIndex, videoIndex, field, value } = action.payload;
      const updatedSessions = [...state.sessions];
      const updatedVideos = [...updatedSessions[sessionIndex].videos];
      updatedVideos[videoIndex] = {
        ...updatedVideos[videoIndex],
        [field]: value,
        lastUpdated: new Date().toLocaleString(),
      };
      updatedSessions[sessionIndex].videos = updatedVideos;
      state.sessions = updatedSessions;
    },
    updateLastUpdated(state, action: PayloadAction<string | null>) {
      state.lastUpdated = action.payload;
    },
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
    },
    toggleSessionInProgress(state, action: PayloadAction<boolean>) {
      action.payload
        ? ((state.sessions = Array.from(
            { length: TOTAL_SESSIONS },
            createEmptySession
          )),
          (state.currentSession = 0),
          (state.isSessionInProgress = true))
        : (state.isSessionInProgress = action.payload);
    },
    updateSessionUpdateInGoogleSheet(
      state,
      action: PayloadAction<{
        sessionIndex: number;
        lastUpdated: null | string;
      }>
    ) {
      const { sessionIndex, lastUpdated } = action.payload;
      state.sessions[sessionIndex].sheetUpdate = {
        isUpdated: true,
        lastUpdated: lastUpdated,
      };
    },
    clearSessionTimings(state, action: PayloadAction<number>) {
      const updatedSessions = [...state.sessions];
      updatedSessions[action.payload] = createEmptySession();
      state.sessions = updatedSessions;
    },
  },
});

// Actions
export const {
  setSessions,
  setCandidateName,
  setCurrentSession,
  addSession,
  updateSession,
  setVideoTimeChange,
  updateLastUpdated,
  setDate,
  toggleSessionInProgress,
  updateSessionUpdateInGoogleSheet,
  clearSessionTimings,
} = sessionSlice.actions;

// Reducer
export default sessionSlice.reducer;
