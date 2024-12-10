"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

/**
 * Represents the data structure for a single video within a session
 */
interface VideoData {
  startTime: string;
  endTime: string;
  lastUpdated: string | null;
  notes: string;
}

/**
 * Represents the data structure for a complete session
 */
interface SessionData {
  sessionId: string;
  highImpedance: string;
  lowImpedance: string;
  videos: VideoData[];
}

// Default time value used for new/reset video timings
const DEFAULT_TIME = "00:00:00";

// Number of sessions and videos per session
const TOTAL_SESSIONS = 13;
const VIDEOS_PER_SESSION = 6;

/**
 * Formats a 24h time string to 12h format with AM/PM
 * @param timeStr - Time string in 24h format (HH:mm:ss)
 * @returns Formatted time string in 12h format (hh:mm:ss am/pm)
 */
const formatTime = (timeStr: string): string => {
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
 * Creates a new empty video data object
 */
const createEmptyVideo = (): VideoData => ({
  startTime: DEFAULT_TIME,
  endTime: DEFAULT_TIME,
  lastUpdated: null,
  notes: "",
});

/**
 * Creates a new empty session data object
 */
const createEmptySession = (): SessionData => ({
  sessionId: "",
  highImpedance: "",
  lowImpedance: "",
  videos: Array(VIDEOS_PER_SESSION).fill(null).map(createEmptyVideo),
});

/**
 * Tool Recording Component
 * Provides interface for recording and managing multiple sessions of video timing data
 */
export default function ToolRecording() {
  // Initialize current session from localStorage or default to 0
  const [currentSession, setCurrentSession] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("currentSession") || "0");
  });

  // Initialize sessions data from localStorage or create new empty sessions
  const [sessions, setSessions] = useState<SessionData[]>(() => {
    if (typeof window === "undefined") {
      return Array(TOTAL_SESSIONS).fill(null).map(createEmptySession);
    }
    const saved = localStorage.getItem("sessions");
    return saved
      ? JSON.parse(saved)
      : Array(TOTAL_SESSIONS).fill(null).map(createEmptySession);
  });

  // Persist sessions data to localStorage
  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Persist current session index to localStorage
  useEffect(() => {
    localStorage.setItem("currentSession", currentSession.toString());
  }, [currentSession]);

  /**
   * Updates session metadata fields
   */
  const handleSessionDataChange = (
    sessionIndex: number,
    field: keyof SessionData,
    value: string
  ) => {
    setSessions((prev) =>
      prev.map((session, idx) =>
        idx === sessionIndex ? { ...session, [field]: value } : session
      )
    );
  };

  /**
   * Updates video timing and notes data
   */
  const handleVideoTimeChange = (
    sessionIndex: number,
    videoIndex: number,
    field: keyof VideoData,
    value: string
  ) => {
    setSessions((prev) =>
      prev.map((session, sIdx) =>
        sIdx === sessionIndex
          ? {
              ...session,
              videos: session.videos.map((video, vIdx) =>
                vIdx === videoIndex
                  ? {
                      ...video,
                      [field]: value,
                      lastUpdated:
                        field !== "notes"
                          ? new Date().toLocaleString()
                          : video.lastUpdated,
                    }
                  : video
              ),
            }
          : session
      )
    );
  };

  /**
   * Records current system time for a video's start/end time
   */
  const recordCurrentTime = (
    videoIndex: number,
    timeType: "startTime" | "endTime"
  ) => {
    const now = new Date();
    const timeString = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");

    handleVideoTimeChange(currentSession, videoIndex, timeType, timeString);
  };

  /**
   * Resets all video timings for current session to defaults
   */
  const clearSessionTimings = () => {
    setSessions((prev) =>
      prev.map((session, idx) =>
        idx === currentSession
          ? {
              ...session,
              videos: Array(VIDEOS_PER_SESSION)
                .fill(null)
                .map(createEmptyVideo),
            }
          : session
      )
    );
  };

  /**
   * Navigation handlers for moving between sessions
   */
  const nextSession = () =>
    currentSession < sessions.length - 1 &&
    setCurrentSession((curr) => curr + 1);
  const prevSession = () =>
    currentSession > 0 && setCurrentSession((curr) => curr - 1);

  /**
   * Checks if a video has any timing data entered
   */
  const hasVideoTimes = (
    video: Pick<VideoData, "startTime" | "endTime">
  ): boolean => {
    return video.startTime !== "" || video.endTime !== "";
  };

  /**
   * Formats and shares current session data via WhatsApp
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
    (video, index) =>
      `Video ${index + 1}:
${formatTime(video.startTime)}\t${formatTime(video.endTime)}
Notes: ${video.notes || "No notes"}`
  )
  .join("\n\n")}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
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
                        <div className="space-y-2">
                          <Label
                            htmlFor={`session-${currentSession}-video-${videoIndex}-notes`}
                            className="text-sm"
                          >
                            Notes
                          </Label>
                          <Textarea
                            id={`session-${currentSession}-video-${videoIndex}-notes`}
                            value={video.notes}
                            onChange={(e) =>
                              handleVideoTimeChange(
                                currentSession,
                                videoIndex,
                                "notes",
                                e.target.value
                              )
                            }
                            placeholder="Add notes for this video..."
                            className="min-h-[80px]"
                          />
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
