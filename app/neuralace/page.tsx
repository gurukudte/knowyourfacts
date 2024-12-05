"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useCallback } from "react";

/**
 * TimeRecord represents a single video timing entry
 * @interface TimeRecord
 * @property {string} start - Start time in 24h format (HH:mm:ss)
 * @property {string} end - End time in 24h format (HH:mm:ss)
 * @property {string | null} lastSaved - Timestamp of last modification
 */
interface TimeRecord {
  start: string;
  end: string;
  lastSaved: string | null;
}

/** Session is an array of TimeRecords for a single session */
type Session = TimeRecord[];
/** Sessions is an array of all sessions */
type Sessions = Session[];

// Constants for default values and configuration
const DEFAULT_TIME = "00:00:00";
const SESSION_COUNT = 11;
const VIDEOS_PER_SESSION = 6;

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
 * Main Session Timer Application Component
 * Provides functionality to track and record start/end times for multiple videos across sessions
 */
const Page = () => {
  // Initialize sessions state from localStorage or with default values
  const [sessions, setSessions] = useState<Sessions>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sessionTimings');
      if (saved) return JSON.parse(saved);
    }
    
    return Array(SESSION_COUNT).fill(null).map(() =>
      Array(VIDEOS_PER_SESSION).fill(null).map(() => ({ 
        start: DEFAULT_TIME,
        end: DEFAULT_TIME,
        lastSaved: null 
      }))
    );
  });

  // Track current active session
  const [currentSession, setCurrentSession] = useState(0);

  // Persist sessions to localStorage on change
  useEffect(() => {
    localStorage.setItem('sessionTimings', JSON.stringify(sessions));
  }, [sessions]);

  /**
   * Updates either start or end time for a specific video in a session
   * @param {number} sessionIndex - Index of the session to update
   * @param {number} videoIndex - Index of the video within the session
   * @param {'start' | 'end'} timeType - Which time to update (start or end)
   */
  const updateTime = useCallback((sessionIndex: number, videoIndex: number, timeType: 'start' | 'end') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    
    setSessions(prev => prev.map((session, sIdx) =>
      sIdx === sessionIndex
        ? session.map((time, vIdx) =>
            vIdx === videoIndex 
              ? { ...time, [timeType]: timeStr, lastSaved: now.toLocaleString() }
              : time
          )
        : session
    ));
  }, []);

  /**
   * Clears times for either a specific video or entire current session
   * @param {number} [videoIndex] - Optional index of video to clear. If omitted, clears entire session
   */
  const clearTimes = useCallback((videoIndex?: number) => {
    setSessions(prev => prev.map((session, sIdx) =>
      sIdx === currentSession
        ? session.map((time, vIdx) =>
            videoIndex === undefined || vIdx === videoIndex 
              ? { start: DEFAULT_TIME, end: DEFAULT_TIME, lastSaved: null }
              : time
          )
        : session
    ));
  }, [currentSession]);

  /**
   * Copies formatted start and end times to clipboard
   * @param {string} start - Start time in 24h format
   * @param {string} end - End time in 24h format
   */
  const copyTimeToClipboard = useCallback((start: string, end: string) => {
    const formattedTime = `${formatTime(start)}\t${formatTime(end)}`;
    navigator.clipboard.writeText(formattedTime);
  }, []);

  /**
   * Copies all times from current session to clipboard in tab-separated format
   */
  const copyAllSessionTimes = useCallback(() => {
    const allTimes = sessions[currentSession]
      .map(time => `${formatTime(time.start)}\t${formatTime(time.end)}`)
      .join("\n");
    navigator.clipboard.writeText(allTimes);
  }, [sessions, currentSession]);

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setCurrentSession(prev => Math.max(0, prev - 1))}
          disabled={currentSession === 0}
        >
          Previous Session
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentSession(prev => Math.min(sessions.length - 1, prev + 1))}
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
            <div className="flex gap-2">
              <Button variant="secondary" onClick={copyAllSessionTimes}>
                Copy All Session Times
              </Button>
              <Button variant="destructive" onClick={() => clearTimes()}>
                Clear Session
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap justify-between space-y-4">
            {sessions[currentSession].map((time, videoIndex) => (
              <div key={videoIndex} className="p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">
                    Video {videoIndex + 1}
                  </h3>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => clearTimes(videoIndex)}
                  >
                    Clear
                  </Button>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Start Time:
                    </p>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="outline"
                        onClick={() => updateTime(currentSession, videoIndex, 'start')}
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
                        onClick={() => updateTime(currentSession, videoIndex, 'end')}
                      >
                        Record End
                      </Button>
                      <span className="p-2 bg-background border rounded">
                        {time.end}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Button
                    variant="secondary"
                    onClick={() => copyTimeToClipboard(time.start, time.end)}
                  >
                    Copy Times for Excel
                  </Button>
                  {time.lastSaved && (
                    <span className="text-xs text-muted-foreground">
                      Last saved: {time.lastSaved}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
