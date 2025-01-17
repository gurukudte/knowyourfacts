"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setVideoTimeChange,
  updateDatabase,
  updateSession,
} from "../store/slices/sessionSlice";
import { VideoData } from "../types/sessionTypes";
import { useEffect } from "react";
import { io } from "socket.io-client";

// Connect to WebSocket server
const socket = io(process.env.LIVE_PUBLIC_URI);
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
export default function MainRecording() {
  const { currentSession, sessions, ...other } = useAppSelector(
    (state) => state.session
  );
  const store = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();

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

  const handleVideoTimeChange = (
    value: string,
    videoIndex: number,
    field: "startTime" | "endTime" | "notes"
  ) => {
    dispatch(
      setVideoTimeChange({
        sessionIndex: currentSession,
        videoIndex: videoIndex,
        field: field,
        value: value,
      })
    );
  };

  const recordCurrentTime = (
    videoIndex: number,
    field: "startTime" | "endTime"
  ) => {
    const value = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });
    handleVideoTimeChange(value, videoIndex, field);
  };

  useEffect(() => {
    if (sessions[0].sessionId !== "") {
      dispatch(updateDatabase({ currentSession, sessions, ...other }));
    }
  }, [sessions]);

  useEffect(() => {
    // Function to send updates
    const sendLiveUpdate = async () => {
      try {
        socket.emit("candidateUpdate", {
          candidateId: store.candidateName, // Use unique candidate ID
          sessionData: sessions,
        });
      } catch (error) {}
    };

    // Send updates every 5 seconds
    const interval = setInterval(sendLiveUpdate, 5000);
    return () => clearInterval(interval);
  }, [currentSession, sessions]);
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-4">
            {/* Session ID input */}
            <div className="space-y-2">
              <Label htmlFor={`session-${currentSession}-id`}>Session ID</Label>
              <Input
                id={`session-${currentSession}-id`}
                value={sessions[currentSession]?.sessionId}
                onChange={(e) =>
                  dispatch(
                    updateSession({
                      sessionIndex: currentSession,
                      field: "sessionId",
                      value: e.target.value,
                    })
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
                placeholder="Enter High Impedance"
                type="number"
                onChange={(e) =>
                  dispatch(
                    updateSession({
                      sessionIndex: currentSession,
                      field: "highImpedance",
                      value: e.target.value,
                    })
                  )
                }
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
                placeholder="Enter Low Impedance"
                type="number"
                onChange={(e) =>
                  dispatch(
                    updateSession({
                      sessionIndex: currentSession,
                      field: "lowImpedance",
                      value: e.target.value,
                    })
                  )
                }
              />
            </div>
          </div>
          {/* Video timing cards section */}
          <div className="mt-6">
            <h3 className="text-base font-semibold mb-4">Block Timings</h3>
            <div className="space-y-4">
              {sessions[currentSession].videos.map((video, videoIndex) => (
                <Card
                  key={videoIndex}
                  className={`${hasVideoTimes(video) ? "bg-muted" : ""}`}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-base flex justify-between items-center">
                      <span>{`block_${videoIndex}`}</span>
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
                          step="1"
                          value={video.startTime}
                          onChange={(e) =>
                            handleVideoTimeChange(
                              e.target.value,
                              videoIndex,
                              "startTime"
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
                          step="1"
                          value={video.endTime}
                          onChange={(e) =>
                            handleVideoTimeChange(
                              e.target.value,
                              videoIndex,
                              "endTime"
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
                            e.target.value,
                            videoIndex,
                            "notes"
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
  );
}
