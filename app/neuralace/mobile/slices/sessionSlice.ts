import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CandidateSessionsData,
  SessionData,
  VideoData,
} from "../types/sessionTypes";
import {
  createCandidateSessionsData,
  getCandidateSessionsData,
  updateCandidateSessionsData,
} from "../api";

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
export const initialState: CandidateSessionsData = {
  id: "",
  isSheetUpdated: false,
  todayStartRange: 2,
  candidateName: "",
  raTechnicianName: "",
  currentSession: 0,
  sessions: Array.from({ length: TOTAL_SESSIONS }, createEmptySession),
  isCreated: false,
  updatedAt: null,
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
    setRaTechnicianName(state, action: PayloadAction<string>) {
      state.raTechnicianName = action.payload;
    },
    setCurrentSession(state, action: PayloadAction<"prev" | "next" | number>) {
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
      state.updatedAt = action.payload;
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
          (state.isSessionInProgress = true),
          ((state.id = ""), (state.isCreated = false), (state.updatedAt = "")))
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
    startNew(state) {
      state.sessions = Array.from(
        { length: TOTAL_SESSIONS },
        createEmptySession
      );
      state = initialState;
      state.isSessionInProgress = true;
    },
    updateSheet(
      state,
      action: PayloadAction<{
        isSheetUpdated?: boolean;
        todayStartRange?: number;
      }>
    ) {
      state.isSheetUpdated = action.payload.isSheetUpdated || false;
      state.todayStartRange = action.payload.todayStartRange || 0;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(updateDatabase.fulfilled, (state, action) => {
      if (action?.payload?._id) {
        const { _id, updatedAt } = action.payload;
        state.updatedAt = updatedAt;
        state.isCreated = true;
        state.id = _id;
      }
    });
    builder.addCase(retrieveFromDatabase.fulfilled, (state, action) => {
      if (action?.payload?._id) {
        const { _id, updatedAt } = action.payload;
        state.updatedAt = updatedAt;
        state.isCreated = true;
        state.id = _id;
      }
    });
  },
});

export const updateDatabase = createAsyncThunk(
  "candidateSessions/updateDatabase",
  async (state: CandidateSessionsData, { rejectWithValue }) => {
    try {
      const {
        sessions,
        isCreated,
        updatedAt,
        id,
        currentSession,
        isSessionInProgress,
        ...otherData
      } = state;
      const apiSessions = sessions.filter(
        (session) => session.sessionId !== ""
      );
      const apiData = {
        ...otherData,
        sessions: apiSessions.map((session, index) => ({
          ...session,
          session: index + 1,
        })),
      };

      if (!isCreated) {
        const res = await createCandidateSessionsData(apiData);
        return res.data;
      } else {
        const res = await updateCandidateSessionsData(id, apiData);
        return res.data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const retrieveFromDatabase = createAsyncThunk(
  "candidateSessions/retrieveFromDatabase",
  async (state: CandidateSessionsData, { rejectWithValue }) => {
    try {
      const { candidateName, date } = state;
      const res = await getCandidateSessionsData(candidateName, date);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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
  startNew,
  setRaTechnicianName,
  updateSheet,
} = sessionSlice.actions;

// Reducer
export default sessionSlice.reducer;
