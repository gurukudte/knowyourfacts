"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import { useAppSelector } from "../../store/hooks";
import useActionsHook from "./mobile/hooks/useActionsHook";
import { useDispatch } from "react-redux";
import {
  setCurrentSession,
  setVideoTimeChange,
  startNew,
  toggleSessionInProgress,
  updateSession,
} from "./mobile/slices/sessionSlice";
import { VideoData } from "./mobile/types/sessionTypes";

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
  const { sessions, currentSession } = useAppSelector((state) => state.session);
  const { shareAllToWhatsApp } = useActionsHook();
  const dispatch = useDispatch();

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
  const clearSessions = () => {
    dispatch(toggleSessionInProgress(true));
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

  return (
    <>
      <header className="w-full fixed top-0 p-4 bg-background text-center">
        <div className="flex flex-col gap-4 bg-background z-10">
          <div className="relative flex justify-center items-center">
            <h1 className="w-full text-xl font-bold text-center">
              Session {currentSession + 1}/{sessions.length}
            </h1>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Button
              size="sm"
              onClick={() => dispatch(setCurrentSession("prev"))}
              disabled={currentSession === 0}
            >
              Previous
            </Button>
            {currentSession === sessions.length - 1 && (
              <Button size="sm" variant="destructive" onClick={clearSessions}>
                Clear Sessions
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => dispatch(setCurrentSession("next"))}
              disabled={currentSession === sessions.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </header>
      <main className="w-full px-4">
        <div className="my-28">
          <Card className="border-none shadow-none">
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
                  <h3 className="text-base font-semibold mb-4">
                    Block Timings
                  </h3>
                  <div className="space-y-4">
                    {sessions[currentSession].videos.map(
                      (video, videoIndex) => (
                        <Card
                          key={videoIndex}
                          className={`${
                            hasVideoTimes(video) ? "bg-muted" : ""
                          }`}
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
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {currentSession === sessions.length - 1 && (
        <footer className="w-full fixed bottom-0 p-4 bg-secondary">
          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              size="lg"
              onClick={() => shareAllToWhatsApp(sessions)}
            >
              Share to WhatsApp
              <TbBrandWhatsappFilled />
            </Button>
          </div>
        </footer>
      )}
    </>
  );
}
