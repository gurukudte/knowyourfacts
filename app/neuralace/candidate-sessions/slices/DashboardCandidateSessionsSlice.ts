import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAllCandidateSessionsData } from "../api";
import { CandidateSessionsData } from "../../mobile/types/sessionTypes";
import { DashBoardSessionsState } from "../types/dashboardTypes";

// Define initial state
const initialState: DashBoardSessionsState = {
  candidatesSessions: [],
  candidateNames: [],
  filteredSessions: [],
  filteredSession: [],
  candidateName: "",
  candidateDate: "",
  status: "idle",
  error: null,
};

// Async thunk to fetch candidate sessions data
export const fetchCandidateSessions = createAsyncThunk(
  "DashboardCandidateSessions/fetchSessions",
  async (_, { rejectWithValue }) => {
    try {
      const candidatesSessions = await getAllCandidateSessionsData();
      return candidatesSessions;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const DashboardCandidateSessionsSlice = createSlice({
  name: "DashboardCandidateSessions",
  initialState,
  reducers: {
    setCandidateName(state, action: PayloadAction<string>) {
      state.candidateName = action.payload;
    },
    setCandidateDate(state, action: PayloadAction<string>) {
      state.candidateDate = action.payload;
    },
    setCandidateFromSearchParams: (
      state,
      action: PayloadAction<{ candidate?: string; date?: string }>
    ) => {
      const { candidate, date } = action.payload;

      state.candidateName = candidate || "";
      state.candidateDate = date || "";

      const filtered = state.candidatesSessions.filter(
        (session) => session.candidateName === candidate
      );
      const fil = filtered.filter(
        (session) =>
          session.candidateName === state.candidateName &&
          session.date === state.candidateDate &&
          session.candidateName !== ""
      )[0]?.sessions;
      state.filteredSession = fil;
      state.filteredSessions = filtered;
    },
    changeCandidateName: (state, action: PayloadAction<string>) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateSessions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCandidateSessions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.candidatesSessions = action.payload;
        state.candidateNames = [
          ...new Set(
            action.payload.map((cs: CandidateSessionsData) => cs.candidateName)
          ),
        ] as string[];
      })
      .addCase(fetchCandidateSessions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  setCandidateName,
  setCandidateDate,
  setCandidateFromSearchParams,
  changeCandidateName,
} = DashboardCandidateSessionsSlice.actions;
export default DashboardCandidateSessionsSlice.reducer;
