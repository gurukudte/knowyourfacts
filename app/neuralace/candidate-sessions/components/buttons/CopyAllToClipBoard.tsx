"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { SessionData } from "../../../mobile/types/sessionTypes";
import { formatTime } from "../../../mobile/hooks/useTimeHook";

export interface IExcelButtonProps {
  session: SessionData;
  sessionNumber: number;
}

export function CopyAllToClipBoard({
  session,
  sessionNumber,
}: IExcelButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  const generateSessionData = (session: SessionData) => {
    let sessionData = "";
    sessionData += `${session.sessionId}\t`;
    sessionData += `${sessionNumber + 1}\t`;
    session.videos?.forEach((video, videoIndex) => {
      sessionData += `${videoIndex === 0 ? "" : "\t\t"}`;
      sessionData += `${videoIndex + 1}\t${formatTime(
        video.startTime || "00:00:00"
      )}\t${formatTime(video.endTime || "00:00:00")}\t${formatTime(
        video.startTime || "00:00:00"
      )} - ${formatTime(video.endTime || "00:00:00")}\tH-${
        session.highImpedance
      }K/L-${session.lowImpedance}K\t${video.notes || "NO NOTES"}\n`;
    });
    sessionData += "\n";
    return sessionData;
  };
  const copyToClipboard = (text: string) => {
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
        const sessionData = generateSessionData(session);
        copyToClipboard(sessionData);
      }}
      className="bg-blue-600 text-white"
    >
      {isCopied ? "Copied" : "Copy to Clipboard"}
    </Button>
  );
}
