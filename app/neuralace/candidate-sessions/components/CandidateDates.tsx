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

export interface IAppProps {
  candidatesSessions: CandidateSessionsData[];
}

export function CandidateDates({ candidatesSessions }: IAppProps) {
  const totalSessionTime = calculateTotalTimeDiff(candidatesSessions);
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
                    {`Total Recorded Time : ${totalSessionTime}`}
                  </p>
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
