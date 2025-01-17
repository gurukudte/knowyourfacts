"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { SessionData } from "../../../mobile/types/sessionTypes";
import { formatTime } from "../../../mobile/hooks/useTimeHook";

export interface IExcelButtonProps {
  startTime: string;
  endTime: string;
}

export function CopyVideoTime({ startTime, endTime }: IExcelButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = () => {
    const text = `${formatTime(startTime || "00:00:00")}\t${formatTime(
      endTime || "00:00:00"
    )}\t${formatTime(startTime || "00:00:00")} - ${formatTime(
      endTime || "00:00:00"
    )}`;
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
      size={"sm"}
      onClick={copyToClipboard}
      className="bg-blue-600 text-white flex justify-center items-center"
    >
      {isCopied ? "Copied" : "Copy"}
    </Button>
  );
}
