"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import { CandidateSessionsData } from "../../mobile/types/sessionTypes";
import { Button } from "@/components/ui/button";
import { calculateTotalTimeDiff } from "./utils/calculateSessionTime";
import Link from "next/link";
import { convertToIST } from "./utils/formatTime";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCandidateDate } from "../slices/DashboardCandidateSessionsSlice";

export interface IAppProps {
  candidatesSessions: CandidateSessionsData[];
}

export function CandidateDates() {
  const { filteredSessions } = useAppSelector(
    (state) => state.DashboardCandidateSessions
  );

  const dispatch = useAppDispatch();
  return (
    <main className="h-[calc(100vh-2.5rem)] P-4">
      {filteredSessions?.length === 0 ? (
        <p className="text-center text-gray-600">
          No candidate sessions found.
        </p>
      ) : (
        <div className="w-full flex flex-wrap flex-row gap-6">
          {filteredSessions?.map((candidate, index) => (
            <Card
              className="bg-gray-900 border-gray-800 shadow-lg min-w-[25rem]"
              key={candidate.candidateName + index}
            >
              <CardHeader>
                <CardTitle className="text-white">
                  {new Date(candidate.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-400 space-y-2">
                  <p>
                    <strong>Total Sessions:</strong>
                    {candidate.sessions.length}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>
                    {candidate.updatedAt
                      ? convertToIST(candidate.updatedAt)
                      : "Not available"}
                  </p>
                  <p>
                    <strong>Total Recording:</strong>
                    {calculateTotalTimeDiff(candidate.sessions)}
                  </p>
                  <p
                    className={
                      candidate.isSessionInProgress
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {candidate.isSessionInProgress
                      ? "Session in Progress"
                      : "No Active Session"}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="text-right">
                <Button
                  variant={"secondary"}
                  onClick={() => dispatch(setCandidateDate(candidate.date))}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
