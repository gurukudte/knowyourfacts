"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Represents the data structure for a single session
 * @interface SessionData
 * @property {string} sessionId - Unique identifier for the session
 * @property {string} highImpedance - High impedance value
 * @property {string} lowImpedance - Low impedance value
 * @property {Array<{startTime: string, endTime: string, lastUpdated: string | null}>} videos - Array of video timing data
 */
interface SessionData {
  sessionId: string;
  highImpedance: string;
  lowImpedance: string;
  videos: {
    startTime: string;
    endTime: string;
    lastUpdated: string | null;
  }[];
}

// Constants for default values and configuration
const DEFAULT_TIME = "00:00:00";

/**
 * Formats a 24h time string to 12h format
 * @param {string} timeStr - Time string in 24h format (HH:mm:ss)
 * @returns {string} Time string in 12h format (hh:mm:ss am/pm)
 */
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

/**
 * Tool Recording Component
 * Provides interface for recording session data and video timings
 */
export default function ToolRecording() {
  // State for tracking current session index
  const [currentSession, setCurrentSession] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("currentSession");
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });

  // State for storing all sessions data
  const [sessions, setSessions] = useState<SessionData[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sessions");
      if (saved) return JSON.parse(saved);
    }
    return Array.from({ length: 13 }, (_, i) => ({
      sessionId: "",
      highImpedance: "",
      lowImpedance: "",
      videos: Array(6).fill({
        startTime: DEFAULT_TIME,
        endTime: DEFAULT_TIME,
        lastUpdated: null,
      }),
    }));
  });

  // Save to localStorage whenever sessions or currentSession changes
  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("currentSession", currentSession.toString());
  }, [currentSession]);

  /**
   * Updates session data fields
   * @param {number} sessionIndex - Index of the session to update
   * @param {keyof SessionData} field - Field to update
   * @param {string} value - New value
   */
  const handleSessionDataChange = (
    sessionIndex: number,
    field: keyof SessionData,
    value: string
  ) => {
    setSessions((prev) => {
      const newSessions = [...prev];
      newSessions[sessionIndex] = {
        ...newSessions[sessionIndex],
        [field]: value,
      };
      return newSessions;
    });
  };

  /**
   * Updates video timing data
   * @param {number} sessionIndex - Index of the session
   * @param {number} videoIndex - Index of the video
   * @param {"startTime" | "endTime"} timeType - Type of time to update
   * @param {string} value - New time value
   */
  const handleVideoTimeChange = (
    sessionIndex: number,
    videoIndex: number,
    timeType: "startTime" | "endTime",
    value: string
  ) => {
    setSessions((prev) => {
      const newSessions = [...prev];
      newSessions[sessionIndex].videos[videoIndex] = {
        ...newSessions[sessionIndex].videos[videoIndex],
        [timeType]: value,
        lastUpdated: new Date().toLocaleString(),
      };
      return newSessions;
    });
  };

  /**
   * Records current time for a video
   * @param {number} videoIndex - Index of the video
   * @param {"startTime" | "endTime"} timeType - Type of time to record
   */
  const recordCurrentTime = (
    videoIndex: number,
    timeType: "startTime" | "endTime"
  ) => {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    handleVideoTimeChange(currentSession, videoIndex, timeType, timeString);
  };

  /**
   * Clears all timings for current session
   */
  const clearSessionTimings = () => {
    setSessions((prev) => {
      const newSessions = [...prev];
      newSessions[currentSession].videos = Array(6).fill({
        startTime: DEFAULT_TIME,
        endTime: DEFAULT_TIME,
        lastUpdated: null,
      });
      return newSessions;
    });
  };

  /**
   * Navigates to next session if available
   */
  const nextSession = () => {
    if (currentSession < sessions.length - 1) {
      setCurrentSession((curr) => curr + 1);
    }
  };

  /**
   * Navigates to previous session if available
   */
  const prevSession = () => {
    if (currentSession > 0) {
      setCurrentSession((curr) => curr - 1);
    }
  };

  /**
   * Checks if a video has any timing data
   * @param {{startTime: string, endTime: string}} video - Video timing data
   * @returns {boolean} True if video has any timing data
   */
  const hasVideoTimes = (video: { startTime: string; endTime: string }) => {
    return video.startTime !== "" || video.endTime !== "";
  };

  /**
   * Shares current session data via WhatsApp
   * Formats session data into a readable message and opens WhatsApp share dialog
   */
  const shareToWhatsApp = () => {
    const currentSessionData = sessions[currentSession];
    const message = `session : ${currentSession + 1}
session ID: ${currentSessionData.sessionId}
impedence: H-${currentSessionData.highImpedance}/L-${
      currentSessionData.lowImpedance
    }

TIMINGS:
${currentSessionData.videos
  .map(
    (video) => `${formatTime(video.startTime)}\t${formatTime(video.endTime)}`
  )
  .join("\n")}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <ScrollArea className="h-[100dvh] w-full">
      <div className="container p-4 space-y-4 max-w-lg mx-auto">
        <div className="sticky top-0 bg-background z-10 pb-2">
          <h1 className="text-xl font-bold flex justify-center items-center">
            Session {currentSession + 1}/{sessions.length}
          </h1>

          <div className="flex items-center justify-between mt-4 gap-2">
            <Button
              size="sm"
              onClick={prevSession}
              disabled={currentSession === 0}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={clearSessionTimings}
            >
              Clear Session
            </Button>
            <Button
              size="sm"
              onClick={nextSession}
              disabled={currentSession === sessions.length - 1}
            >
              Next
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-none">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">
              Session {currentSession + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`session-${currentSession}-id`}>
                    Session ID
                  </Label>
                  <Input
                    id={`session-${currentSession}-id`}
                    value={sessions[currentSession].sessionId}
                    onChange={(e) =>
                      handleSessionDataChange(
                        currentSession,
                        "sessionId",
                        e.target.value
                      )
                    }
                    placeholder="Enter Session ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`session-${currentSession}-high`}>
                    High Impedance
                  </Label>
                  <Input
                    id={`session-${currentSession}-high`}
                    value={sessions[currentSession].highImpedance}
                    onChange={(e) =>
                      handleSessionDataChange(
                        currentSession,
                        "highImpedance",
                        e.target.value
                      )
                    }
                    placeholder="Enter High Impedance"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`session-${currentSession}-low`}>
                    Low Impedance
                  </Label>
                  <Input
                    id={`session-${currentSession}-low`}
                    value={sessions[currentSession].lowImpedance}
                    onChange={(e) =>
                      handleSessionDataChange(
                        currentSession,
                        "lowImpedance",
                        e.target.value
                      )
                    }
                    placeholder="Enter Low Impedance"
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-base font-semibold mb-4">Video Timings</h3>
                <div className="space-y-4">
                  {sessions[currentSession].videos.map((video, videoIndex) => (
                    <Card
                      key={videoIndex}
                      className={`${hasVideoTimes(video) ? "bg-muted" : ""}`}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex justify-between items-center">
                          <span>Video {videoIndex + 1}</span>
                          {video.lastUpdated && (
                            <span className="text-xs text-muted-foreground">
                              Last updated: {video.lastUpdated}
                            </span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor={`session-${currentSession}-video-${videoIndex}-start`}
                            className="text-sm"
                          >
                            Start Time
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={`session-${currentSession}-video-${videoIndex}-start`}
                              type="time"
                              value={video.startTime}
                              onChange={(e) =>
                                handleVideoTimeChange(
                                  currentSession,
                                  videoIndex,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() =>
                                recordCurrentTime(videoIndex, "startTime")
                              }
                            >
                              Record
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor={`session-${currentSession}-video-${videoIndex}-end`}
                            className="text-sm"
                          >
                            End Time
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={`session-${currentSession}-video-${videoIndex}-end`}
                              type="time"
                              value={video.endTime}
                              onChange={(e) =>
                                handleVideoTimeChange(
                                  currentSession,
                                  videoIndex,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() =>
                                recordCurrentTime(videoIndex, "endTime")
                              }
                            >
                              Record
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2 sticky bottom-4">
          <Button
            className="w-full"
            size="lg"
            variant="secondary"
            onClick={shareToWhatsApp}
          >
            Share to WhatsApp
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
