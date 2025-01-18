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

export interface IAppProps {
  candidatesSessions: CandidateSessionsData[];
}

export async function CandidateDates({ candidatesSessions }: IAppProps) {
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
              <Card className="bg-gray-900 border-gray-800 shadow-lg">
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
                      <strong>Total Sessions:</strong>{" "}
                      {candidate.sessions.length}
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {candidate.updatedAt
                        ? convertToIST(candidate.updatedAt)
                        : "Not available"}
                    </p>
                    <p>
                      <strong>Total Recording:</strong>{" "}
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
                  <Link
                    href={`?candidate=${candidate.candidateName}&date=${candidate.date}`}
                    className="w-full"
                  >
                    <Button variant={"secondary"}>View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
