"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  CandidateSessionsData,
  SessionData,
} from "../../../mobile/types/sessionTypes";
import { formatTime } from "../../../mobile/hooks/useTimeHook";
import { useAppSelector } from "@/store/hooks";

export function SummeryButton() {
  const { filteredSession, candidateDate, candidateName } = useAppSelector(
    (state) => state.DashboardCandidateSessions
  );

  const [isCopied, setIsCopied] = React.useState(false);

  const generateSessionData = () => {
    let sessionData = "";
    sessionData += `${candidateDate}\t`;
    sessionData += `Shift A\t`;
    sessionData += `${candidateName}\t`;
    filteredSession?.forEach((session, index) => {
      sessionData += `${index === 0 ? "" : "\t\t\t"}`;
      sessionData += `${index + 1}\t${formatTime(
        session.videos[0].startTime || "00:00:00"
      )}\t${formatTime(
        session.videos[6].endTime || "00:00:00"
      )}\tNO\t${session.videos
        .filter((sessionVideo) => sessionVideo.notes !== "")
        .map((video, videoIndex) =>
          (video.notes + " in block_" + videoIndex).toString()
        )}\n`;
    });
    return sessionData;
  };
  const copyToClipboard = () => {
    const text = generateSessionData();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
      })
      .catch((error) => {
        console.error("Error copying to clipboard: ", error);
      });
  };
  return (
    <Button
      onClick={() => {
        copyToClipboard();
      }}
      className="bg-blue-600 text-white"
    >
      {isCopied ? "Copied" : "Copy to Clipboard"}
    </Button>
  );
}
