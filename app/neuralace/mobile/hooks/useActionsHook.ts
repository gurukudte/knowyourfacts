import { formatTime } from "./useTimeHook";
import { useState } from "react";
import useCandidate from "./useCandidateHook";
import { SessionData, VideoData } from "../types/sessionTypes";

/**
 * Custom hook for handling WhatsApp sharing and Google Sheets integration.
 */
const useActions = () => {
  const {
    states: { allCandidateData },
  } = useCandidate();
  const [loading, setLoading] = useState(false);

  const formatSessionData = (session: SessionData, sessionIndex: number) =>
    session.videos.map((video: VideoData, index: number) => [
      index === 0 ? session.sessionId : "", // Session ID in the first row
      index === 0 ? sessionIndex + 1 : "", // Session number in the first row
      index + 1, // Video number
      video.startTime !== "00:00:00" ? formatTime(video.startTime) : "", // Start time
      video.endTime !== "00:00:00" ? formatTime(video.endTime) : "", // End time
      `${formatTime(video.startTime)} - ${formatTime(video.endTime)}`, // Time range
      index === 0
        ? `H-${session.highImpedance}K/L-${session.lowImpedance}K`
        : "", // Impedance in the first row
      video.notes || "NO NOTES", // Video notes
    ]);

  const shareToWhatsApp = (
    currentSessionData: SessionData,
    currentSession: number
  ) => {
    const message =
      `Session : ${currentSession + 1}\n` +
      `Session ID : ${currentSessionData.sessionId}\n` +
      `Impedence : H-${currentSessionData.highImpedance}K/L-${currentSessionData.lowImpedance}K\n` +
      `TIMINGS:\n\n` +
      `${currentSessionData.videos
        .map(
          (video: VideoData) =>
            `${
              video.startTime !== "00:00:00" ? formatTime(video.startTime) : ""
            }\t${video.endTime !== "00:00:00" ? formatTime(video.endTime) : ""}`
        )
        .join("\n")}\n\n` +
      `NOTES:\n` +
      `${currentSessionData.videos
        .map((video: VideoData) => `${video.notes || "NO NOTES"}`)
        .join("\n")}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };
  const shareAllToWhatsApp = (sessionsData: SessionData[]) => {
    const message = sessionsData
      .map((currentSessionData, currentSession) => {
        return (
          `Session : ${currentSession + 1}\n` +
          `Session ID : ${currentSessionData.sessionId}\n` +
          `impedence : H-${currentSessionData.highImpedance}K/L-${currentSessionData.lowImpedance}K\n` +
          `TIMINGS:\n\n` +
          `${currentSessionData.videos
            .map(
              (video: VideoData) =>
                `${
                  video.startTime !== "00:00:00"
                    ? formatTime(video.startTime)
                    : ""
                }\t${
                  video.endTime !== "00:00:00" ? formatTime(video.endTime) : ""
                }`
            )
            .join("\n")}\n\n` +
          `NOTES:\n` +
          `${currentSessionData.videos
            .map((video: VideoData) => `${video.notes || "NO NOTES"}`)
            .join("\n")}`
        );
      })
      .join("\n\n\n");

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const updateGoogleSheet = async (
    isSheetUpdated: boolean,
    todayStartRange: number,
    candidate: string,
    currentSession: number,
    sessions: SessionData[],
    sheetId: string,
    update: (lastRow: number) => void
  ) => {
    if (sessions) {
      const sessionsData = sessions as SessionData[];
      const sheetData = sessionsData.map(formatSessionData).flat();

      // Prepend date and shift
      sheetData.unshift(
        [
          new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        ],
        ["SHIFT A"]
      );

      const { sheetRange } = allCandidateData.find(
        (data) => data.sheetName === candidate
      )!;
      const ranges = [
        { startRange: 0, endRange: 8 },
        { startRange: 9, endRange: 15 },
        { startRange: 16, endRange: 22 },
        { startRange: 23, endRange: 29 },
        { startRange: 30, endRange: 36 },
        { startRange: 37, endRange: 43 },
        { startRange: 44, endRange: 50 },
        { startRange: 51, endRange: 57 },
        { startRange: 58, endRange: 64 },
        { startRange: 65, endRange: 71 },
        { startRange: 72, endRange: 78 },
        { startRange: 79, endRange: 85 },
        { startRange: 86, endRange: 92 },
        { startRange: 93, endRange: 99 },
      ];

      const modifiedData = sheetData.slice(
        ranges[currentSession].startRange,
        ranges[currentSession].endRange + 1
      );

      try {
        setLoading(true);
        const response = await fetch("/api/googlesheet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "updateTimings",
            isSheetUpdated: isSheetUpdated,
            todayStartRange: todayStartRange,
            startRange: ranges[currentSession].startRange,
            endRange: ranges[currentSession].endRange,
            candidateName: candidate,
            values: modifiedData,
            spreadsheetId: sheetId,
          }),
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to update sheet");
        console.log("Success:", data.response.lastRow);
        const lastRow: number = data.response.lastRow || 0;
        update(lastRow);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateFeedBackToGoogleSheet = async (
    values: string[][],
    sheetId: string
  ) => {
    try {
      setLoading(true);
      const response = await fetch("/api/googlesheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateFeedback",
          range: "HI",
          values,
          spreadsheetId: sheetId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update sheet");
      console.log("Success:", data.message);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    shareToWhatsApp,
    updateGoogleSheet,
    shareAllToWhatsApp,
    updateFeedBackToGoogleSheet,
  };
};

export default useActions;
