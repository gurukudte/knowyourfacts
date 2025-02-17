"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SessionList } from "@/app/neuralace/candidate-sessions/components/SessionsCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { fetchCandidateSessions } from "@/app/neuralace/candidate-sessions/slices/DashboardCandidateSessionsSlice";
import { PacmanLoader } from "react-spinners";
import { useSyncCandidate } from "@/app/neuralace/candidate-sessions/hooks/useSyncCandidate";

const SessionsDisplay = () => {
  const { candidateNames, candidateName } = useAppSelector(
    (state) => state.DashboardCandidateSessions
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCandidateSessions());
  }, []);

  useSyncCandidate();
  return (
    <div className="flex h-screen bg-secondary text-primary-foreground">
      {/* Sidebar */}
      <div className="w-64 bg-secondary-foreground border-r border-primary-foreground">
        <div className="p-4">
          <Link href={`?`} className="w-full">
            <h2 className="text-lg font-semibold mb-4">Candidate's</h2>
          </Link>
          <nav className="flex flex-col gap-2">
            {candidateNames?.map((candidate) => (
              <Button
                key={candidate}
                variant={"ghost"}
                size={"lg"}
                className={`w-full font-bold justify-start ${
                  candidate === candidateName
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
              >
                {candidate}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-secondary-foreground">
        {/* Top Navigation Bar */}
        <nav className="h-14 border-b px-4 flex items-center bg-secondary-foreground">
          <h1 className="text-xl font-semibold ">{`${
            candidateName === "" ? "Candidate" : candidateName
          }'s Sessions Data`}</h1>
        </nav>
        {candidateNames.length > 0 ? (
          <SessionList />
        ) : (
          <div className={`w-full h-[82vh] flex justify-center items-center`}>
            <PacmanLoader size={35} color="white" />
          </div>
        )}
        <div className="p-2">
          {/* <div>

          {typeof candidateDate === "undefined" ? (
            <>
              {candidateName === "" ? (
                <CandidateSessions />
              ) : (
                <CandidateDates />
              )} 
            </>
          ) : (
          )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SessionsDisplay;
