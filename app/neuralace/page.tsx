"use client";
import { Button } from "@/components/ui/button";
import React from "react";

/**
 * Session Timer Application
 * 
 * This React component provides functionality to track and record start/end times
 * for multiple videos across multiple sessions. It's designed for timing and logging
 * purposes, with features to copy formatted times to clipboard for Excel compatibility.
 * 
 * Key Features:
 * - Manages multiple sessions (11) with multiple videos (6) per session
 * - Records start and end times for each video
 * - Navigation between sessions
 * - Clipboard functionality for exporting times
 * - Time formatting from 24h to 12h format
 */

const Page = () => {
  // Initialize state for all sessions with default times
  const [sessions, setSessions] = React.useState(
    [...Array(11)].map(() =>
      [...Array(6)].map(() => ({ start: "00:00:00", end: "00:00:00" }))
    )
  );

  // Track current active session
  const [currentSession, setCurrentSession] = React.useState(0);

  /**
   * Records the start time for a specific video in a specific session
   * @param sessionIndex - The index of the current session
   * @param videoIndex - The index of the video within the session
   */
  const handleStartTime = (sessionIndex: number, videoIndex: number) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setSessions((prev) =>
      prev.map((session, sIdx) =>
        sIdx === sessionIndex
          ? session.map((time, vIdx) =>
              vIdx === videoIndex ? { ...time, start: timeStr } : time
            )
          : session
      )
    );
  };

  /**
   * Records the end time for a specific video in a specific session
   * @param sessionIndex - The index of the current session
   * @param videoIndex - The index of the video within the session
   */
  const handleEndTime = (sessionIndex: number, videoIndex: number) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setSessions((prev) =>
      prev.map((session, sIdx) =>
        sIdx === sessionIndex
          ? session.map((time, vIdx) =>
              vIdx === videoIndex ? { ...time, end: timeStr } : time
            )
          : session
      )
    );
  };

  /**
   * Navigates to the next session if available
   */
  const goToNextSession = () => {
    if (currentSession < sessions.length - 1) {
      setCurrentSession((prev) => prev + 1);
    }
  };

  /**
   * Navigates to the previous session if available
   */
  const goToPrevSession = () => {
    if (currentSession > 0) {
      setCurrentSession((prev) => prev - 1);
    }
  };

  /**
   * Copies a single video's start and end times to clipboard in Excel-friendly format
   * @param start - Start time string in HH:MM:SS format
   * @param end - End time string in HH:MM:SS format
   */
  const copyTimeToClipboard = (start: string, end: string) => {
    const formatTime = (timeStr: string) => {
      const date = new Date();
      const [hours, minutes, seconds] = timeStr.split(":");
      date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
      return date
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
        .toLowerCase();
    };

    const formattedTime = `${formatTime(start)}\t${formatTime(end)}`;
    navigator.clipboard.writeText(formattedTime);
  };

  /**
   * Copies all times from the current session to clipboard in Excel-friendly format
   */
  const copyAllSessionTimes = () => {
    const formatTime = (timeStr: string) => {
      const date = new Date();
      const [hours, minutes, seconds] = timeStr.split(":");
      date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
      return date
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
        .toLowerCase();
    };

    const allTimes = sessions[currentSession]
      .map((time) => `${formatTime(time.start)}\t${formatTime(time.end)}`)
      .join("\n");

    navigator.clipboard.writeText(allTimes);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <Button
          variant="outline"
          onClick={goToPrevSession}
          disabled={currentSession === 0}
        >
          Previous Session
        </Button>
        <Button
          variant="outline"
          onClick={goToNextSession}
          disabled={currentSession === sessions.length - 1}
        >
          Next Session
        </Button>
      </div>
      <div className="w-full">
        <div
          key={currentSession}
          className="w-full p-6 rounded-xl shadow-lg bg-card border"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Session {currentSession + 1}</h2>
            <Button variant="secondary" onClick={copyAllSessionTimes}>
              Copy All Session Times
            </Button>
          </div>
          <div className="flex flex-wrap justify-between space-y-4">
            {sessions[currentSession].map((time, videoIndex) => (
              <div key={videoIndex} className="p-4 rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold mb-2">
                  Video {videoIndex + 1}
                </h3>
                <div className="flex gap-6">
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Start Time:
                    </p>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleStartTime(currentSession, videoIndex)
                        }
                      >
                        Record Start
                      </Button>
                      <span className="p-2 bg-background border rounded">
                        {time.start}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      End Time:
                    </p>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleEndTime(currentSession, videoIndex)
                        }
                      >
                        Record End
                      </Button>
                      <span className="p-2 bg-background border rounded">
                        {time.end}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => copyTimeToClipboard(time.start, time.end)}
                >
                  Copy Times for Excel
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
