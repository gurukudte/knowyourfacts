import { configureStore } from "@reduxjs/toolkit";
import { loadState, saveState } from "./localStorage";

const PERSISTED_STATE_KEY = "candidateSessions";

// Load initial state from localStorage
const preloadedState: any = loadState(PERSISTED_STATE_KEY);

const store = configureStore({
  reducer: {},
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
