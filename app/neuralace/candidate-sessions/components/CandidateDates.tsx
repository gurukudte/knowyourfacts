import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import {
  CandidateSessionsData,
  SessionData,
} from "../../mobile/types/sessionTypes";
import { Button } from "@/components/ui/button";

export interface IAppProps {
  candidatesSessions: CandidateSessionsData[];
}

export function CandidateDates({ candidatesSessions }: IAppProps) {
  return (
    <main className="h-[calc(100vh-3.5rem)] overflow-y-scroll">
      <div className="p-6 space-y-8 ">
        {candidatesSessions?.length === 0 ? (
          <p className="text-center text-gray-600">
            No candidate sessions found.
          </p>
        ) : (
          <div className="flex flex-row gap-6">
            {candidatesSessions?.map((candidate, index) => (
              <Card
                key={candidate.date + index}
                className="bg-secondary-foreground shadow-md hover:shadow-lg transition-shadow text-primary-foreground"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {new Date(candidate.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-md ">
                    Last Updated:{" "}
                    {candidate.lastUpdated
                      ? new Date(candidate.lastUpdated).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                            timeZone: "Asia/Kolkata",
                          }
                        )
                      : "N/A"}
                  </p>
                </CardContent>
                <CardFooter className="text-right">
                  <Button variant={"secondary"}>View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// Utility function to calculate the time difference in seconds
const calculateTimeDiffInSeconds = (startTime: string, endTime: string) => {
  const start = startTime.split(":").map(Number);
  const end = endTime.split(":").map(Number);

  // Convert to seconds
  const startInSeconds = start[0] * 3600 + start[1] * 60 + start[2];
  const endInSeconds = end[0] * 3600 + end[1] * 60 + end[2];

  // Return the difference
  return endInSeconds - startInSeconds;
};

// Function to calculate the sum of time differences for all videos in all sessions
const calculateTotalTimeDiff = (sessions: any[]) => {
  let totalTimeInSeconds = 0;

  sessions.forEach((session: SessionData) => {
    session.videos.forEach((video) => {
      // Only calculate time difference if startTime and endTime are not "00:00:00"
      if (video.startTime !== "00:00:00" && video.endTime !== "00:00:00") {
        totalTimeInSeconds += calculateTimeDiffInSeconds(
          video.startTime,
          video.endTime
        );
      }
    });
  });

  // Convert the total time from seconds to HH:mm:ss format
  const hours = Math.floor(totalTimeInSeconds / 3600);
  const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
  const seconds = totalTimeInSeconds % 60;

  return `${hours} hours ${minutes} minutes ${seconds} seconds`;
};
