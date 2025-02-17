import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "../app/neuralace/mobile/slices/sessionSlice";
import DashboardCandidateSessionsReducer from "@/app/neuralace/candidate-sessions/slices/DashboardCandidateSessionsSlice";
import { loadState, saveState } from "./localStorage";

const PERSISTED_STATE_KEY = "candidateSessions";

// Load initial state from localStorage
const preloadedState: any = loadState(PERSISTED_STATE_KEY);

const store = configureStore({
  reducer: {
    session: sessionReducer,
    DashboardCandidateSessions: DashboardCandidateSessionsReducer,
  },
  preloadedState: {
    session: preloadedState, // Use preloaded state if available
  },
});
// Subscribe to store changes and save the state to localStorage
store.subscribe(() => {
  saveState(PERSISTED_STATE_KEY, store.getState().session);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
