"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiGooglesheets } from "react-icons/si";
import { useSession, VideoData } from "./hooks/useSessionHook";
import useActions from "./hooks/useActionsHook";
import useJsonHook from "./hooks/useJsonHook";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  const { loading, updateGoogleSheet, shareToWhatsApp } = useActions();
  const {
    sessionsData: { sessions, currentSession },
    handlers: {
      prevSession,
      clearSessionTimings,
      nextSession,
      handleSessionDataChange,
      recordCurrentTime,
      handleVideoTimeChange,
    },
  } = useSession();
  const { jsonContent } = useJsonHook();
  const [candidate, setCandidate] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("candidate") || "";
  });

  const handleDropdownChange = (value: string) => {
    setCandidate(value);
  };

  /**
   * Checks if a video has any timing data entered
   * @param video Object containing start and end times
   * @returns true if either start or end time is set
   */
  const hasVideoTimes = (
    video: Pick<VideoData, "startTime" | "endTime">
  ): boolean => {
    return video.startTime !== "" || video.endTime !== "";
  };

  useEffect(() => {
    localStorage.setItem("candidate", candidate);
  }, [candidate]);

  return (
    <ScrollArea className="h-[100dvh] w-full">
      <div className="container p-4 space-y-4 max-w-lg mx-auto">
        {/* Header section with candidate selection and session navigation */}
        <div className="sticky top-0 bg-background z-10 pb-2">
          <h1 className="text-xl font-bold flex justify-start items-center gap-10">
            <div>
              <Select
                value={candidate}
                onValueChange={(value) => handleDropdownChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="CANDIDATE" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(jsonContent).map((candidate) => (
                    <SelectItem key={candidate} value={candidate}>
                      {candidate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

        {/* Main session data recording interface */}
        <Card className="border-none shadow-none">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">
              Session {currentSession + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="space-y-4">
                {/* Session ID input */}
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
                {/* High impedance input */}
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
                {/* Low impedance input */}
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

              {/* Video timing cards section */}
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
                            className="min-h-[80px] bg-white"
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

        {/* Action buttons for sharing and updating data */}
        <div className="space-y-2 sticky bottom-4 ">
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
          <Button
            className="w-full"
            size="lg"
            variant="secondary"
            onClick={() => updateGoogleSheet(candidate)}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Verifying...
              </span>
            ) : (
              <>
                Update to Google Sheets
                <SiGooglesheets />
              </>
            )}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
