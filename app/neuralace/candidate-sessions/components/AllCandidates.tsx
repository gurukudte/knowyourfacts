"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCandidateFromSearchParams } from "../slices/DashboardCandidateSessionsSlice";

export interface IAppProps {}

export function CandidateSessions() {
  const { filteredSessions, candidateName } = useAppSelector(
    (state) => state.DashboardCandidateSessions
  );
  const dispatch = useAppDispatch();
  return (
    <main className="h-[calc(100vh-3.5rem)]">
      <div className="p-6 space-y-8 ">
        {filteredSessions?.length === 0 ? (
          <p className="text-center text-gray-600">
            No candidate sessions found.
          </p>
        ) : (
          filteredSessions?.map((candidate, index) => (
            <div key={candidate?.candidateName + index} className="space-y-6">
              {/* Candidate Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold ">
                  {new Date(candidate.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </h2>
              </div>

              {/* Session Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {candidate.sessions.map((session, index) => (
                  <Card
                    key={session.sessionId + index}
                    className="bg-secondary-foreground shadow-md hover:shadow-lg transition-shadow text-primary-foreground"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        Session ID: {session.sessionId}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-md ">
                        Last Updated:{" "}
                        {session.sheetUpdate.lastUpdated
                          ? new Date(
                              session.sheetUpdate.lastUpdated
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                              timeZone: "Asia/Kolkata",
                            })
                          : "N/A"}
                      </p>
                    </CardContent>
                    <CardFooter className="text-right">
                      <Button
                        variant={"secondary"}
                        onClick={() =>
                          dispatch(
                            setCandidateFromSearchParams({
                              candidate: candidateName,
                              date: candidate.date,
                            })
                          )
                        }
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
