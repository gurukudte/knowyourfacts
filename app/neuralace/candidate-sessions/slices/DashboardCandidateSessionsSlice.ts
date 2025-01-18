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
    setCandidateFromSearchParams: (
      state,
      action: PayloadAction<{ candidate?: string; date?: string }>
    ) => {
      const { candidate, date } = action.payload;
      if (candidate) {
        state.candidateName = candidate || "";
      }
      if (date) {
        state.candidateDate = date || "";
      }
      const filtered = state.candidatesSessions.filter(
        (session) => session.candidateName === candidate
      );
      const fil = filtered.filter(
        (session) =>
          session.candidateName === state.candidateName &&
          session.date === state.candidateDate
      )[0]?.sessions;
      state.filteredSession = fil;
      state.filteredSessions = filtered;
      console.log({ ...state });
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

export const { setCandidateFromSearchParams, changeCandidateName } =
  DashboardCandidateSessionsSlice.actions;
export default DashboardCandidateSessionsSlice.reducer;
