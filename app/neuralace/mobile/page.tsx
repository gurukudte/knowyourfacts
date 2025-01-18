"use client";

import SessionLayout from "./components/layout/Layout";
import { Provider } from "react-redux";
import store from "../../../store";

/**
 * Tool Recording Component
 * Main page component for recording and managing video timing sessions.
 * Provides interface for:
 * - Selecting candidates
 * - Navigating between sessions
 * - Recording session data
 * - Sharing data via WhatsApp
 * - Updating data to Google Sheets
 */
export default function ToolRecording() {
  return <SessionLayout />;
}
