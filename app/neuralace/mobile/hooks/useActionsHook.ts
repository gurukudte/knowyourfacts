import { SessionData, VideoData } from "./useSessionHook";
import { formatTime } from "./useTimeHook";
import useJsonHook from "./useJsonHook";
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/localStorage";
import { useState } from "react";

/**
 * Custom hook for handling WhatsApp sharing and Google Sheets integration
 * Provides functions to:
 * - Format and share session data via WhatsApp
 * - Update session data to Google Sheets
 */
const useActions = () => {
  const { jsonContent } = useJsonHook();
  const { getFromLocalStorage } = useLocalStorage();
  const [loading, setLoading] = useState(false);

  const formatSessionData = (session: SessionData, sessionIndex: number) => {
    const data = session.videos.map((video: VideoData, index: number) => [
      index === 0 ? session.sessionId : "", // First column only has sessionId in first row
      index === 0 ? sessionIndex + 1 : "", // Second column only has session number in first row
      index + 1, // Video number
      video.startTime !== "00:00:00" ? formatTime(video.startTime) : "", // Start time
      video.startTime !== "00:00:00" ? formatTime(video.endTime) : "", // End time
      `${formatTime(video.startTime)} - ${formatTime(video.endTime)}`, // Time range
      index === 0
        ? `H-${session.highImpedance}K/L-${session.lowImpedance}K`
        : "", // Impedance only in first row
      video.notes,
    ]);
    return data;
  };

  /**
   * Updates Google Sheet with current session data
   *
   * @description
   * Sends a POST request to /api/googlesheet endpoint with formatted session data.
   * The data is structured in rows where:
   * - First row contains session ID, session number and impedance values
   * - Each row represents a video with timing information
   * - Range is hardcoded to "TEST!A314:G319"
   *
   * @throws {Error} If the API request fails or returns non-OK status
   */
  async function updateGoogleSheet(candidate: string) {
    setLoading(true);
    const sessions = getFromLocalStorage("sessions");
    if (candidate === "" || !Object.keys(jsonContent).includes(candidate)) {
      toast({
        variant: "destructive",
        title: "Select Candidate",
        description: "Please select candidate or ask admin to add your name",
      });
      setLoading(false);
    } else if (sessions) {
      const sessionsData = JSON.parse(sessions) as SessionData[];
      const sheetData = sessionsData.map((session, sessionIndex) =>
        formatSessionData(session, sessionIndex)
      );

      const sheetApiData = sheetData.flat();
      sheetApiData.unshift(
        [
          `${new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}`,
        ],
        [`SHIFT A`]
      );
      try {
        const response = await fetch("/api/googlesheet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            range: `${candidate}!${jsonContent[candidate].startRange}:${
              jsonContent[candidate].startRange + 73
            }`, // Specify the range to update
            values: sheetApiData,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to update sheet");
        }
        console.log("Success:", data.message);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    }
  }

  return { loading, updateGoogleSheet };
};

export default useActions;
