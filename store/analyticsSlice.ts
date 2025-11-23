import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Session {
  id: string;
  sessionNumber: number;
  startTime: string;
  endTime: string;
  breakDuration: number;
  micDurationMin: number;
  sysDurationMin: number;
  maxDurationMin: number;
  micWav: string;
  sysWav: string;
  timestamp: string;
  dailySummaryId: string;
}

interface DailySummary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  date: string;
  totalSessions: number;
  startTime: string;
  endTime: string;
  totalRecordingTime: string;
  totalBreakDuration: string;
  sessions: Session[];
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsState {
  data: DailySummary[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchAnalyticsData = createAsyncThunk(
  "analytics/fetchData",
  async () => {
    const response = await axios.get<DailySummary[]>("/api/analytics");
    return response.data;
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action: PayloadAction<DailySummary[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export default analyticsSlice.reducer;
