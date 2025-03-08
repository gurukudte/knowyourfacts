"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SessionList } from "@/app/neuralace/candidate-sessions/components/SessionsCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import {
  fetchCandidateSessions,
  setCandidateFromSearchParams,
} from "@/app/neuralace/candidate-sessions/slices/DashboardCandidateSessionsSlice";
import { PacmanLoader } from "react-spinners";
import { useSyncCandidate } from "@/app/neuralace/candidate-sessions/hooks/useSyncCandidate";
import { CandidateSessions } from "../AllCandidates";
import { CandidateDates } from "../CandidateDates";

const SessionsDisplay = () => {
  const { candidateNames, candidateName, candidateDate, filteredSessions } =
    useAppSelector((state) => state.DashboardCandidateSessions);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCandidateSessions());
  }, []);

  useSyncCandidate();
  console.log({ name: candidateName, date: candidateDate });
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
                size={"sm"}
                className={`w-full font-semibold justify-start ${
                  candidate === candidateName
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
                onClick={() =>
                  dispatch(
                    setCandidateFromSearchParams({
                      candidate: candidate,
                      date: "",
                    })
                  )
                }
              >
                {candidate}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-secondary-foreground overflow-hidden">
        {/* Top Navigation Bar */}
        <nav className="h-14 border-b px-4 flex items-center bg-secondary-foreground">
          <h1 className="text-xl font-semibold ">{`${
            candidateName === "" ? "Candidate" : candidateName
          }'s Sessions Data`}</h1>
        </nav>

        <div className="p-4 overflow-y-scroll">
          {candidateName !== "" && candidateDate === "" && <CandidateDates />}
          {candidateName !== "" && candidateDate !== "" && <SessionList />}
        </div>
      </div>
    </div>
  );
};

export default SessionsDisplay;
