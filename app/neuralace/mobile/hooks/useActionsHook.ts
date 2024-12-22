import {
  ISessionData,
  SessionData,
  useSession,
  VideoData,
} from "./useSessionHook";
import { formatTime } from "./useTimeHook";
import { useLocalStorage } from "@/hooks/localStorage";
import { useState } from "react";
import useCandidate from "./useCandidateHook";

/**
 * Custom hook for handling WhatsApp sharing and Google Sheets integration.
 */
const useActions = () => {
  const {
    handlers: { handleSessionDataChange },
  } = useSession();
  const {
    states: { allCandidateData },
  } = useCandidate();
  const { getFromLocalStorage } = useLocalStorage();
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

  const shareToWhatsApp = () => {
    const sessions = getFromLocalStorage("sessions") as SessionData[];
    const { currentSession } = getFromLocalStorage(
      "sessionData"
    ) as ISessionData;
    const currentSessionData = sessions[currentSession];
    const message =
      `Session : ${currentSession + 1}\n` +
      `Session ID : ${currentSessionData.sessionId}\n` +
      `impedence : H-${currentSessionData.highImpedance}K/L-${currentSessionData.lowImpedance}K\n` +
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

  const updateGoogleSheet = async (candidate: string) => {
    const currentSession = getFromLocalStorage("sessionData").currentSession;
    const sessions = getFromLocalStorage("sessions");

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
        { startRange: 0, endRange: 7 },
        { startRange: 8, endRange: 13 },
        { startRange: 14, endRange: 19 },
        { startRange: 20, endRange: 25 },
        { startRange: 26, endRange: 31 },
        { startRange: 32, endRange: 37 },
        { startRange: 38, endRange: 43 },
        { startRange: 44, endRange: 49 },
        { startRange: 50, endRange: 55 },
        { startRange: 56, endRange: 61 },
        { startRange: 62, endRange: 67 },
        { startRange: 68, endRange: 73 },
        { startRange: 74, endRange: 79 },
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
            range: `${candidate}!${
              Number(sheetRange) + ranges[currentSession].startRange
            }:${Number(sheetRange) + ranges[currentSession].endRange}`,
            values: modifiedData,
          }),
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to update sheet");
        console.log("Success:", data.message);
        handleSessionDataChange(currentSession, "sheetUpdate", {
          isUpdated: true,
          lastUpdated: new Date().toString(),
        });
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return { loading, shareToWhatsApp, updateGoogleSheet };
};

export default useActions;
