import { Button } from "@/components/ui/button";
import { getAllCandidateSessionsData } from "./api";
import { CandidateSessions } from "./components/AllCandidates";
import { CandidateSessionsData } from "../mobile/types/sessionTypes";
import Link from "next/link";
import { CandidateDates } from "./components/CandidateDates";
import { initialState } from "../mobile/store/slices/sessionSlice";
import { Suspense } from "react";
import { SessionList } from "./components/SessionsCard";

interface PageProps {
  searchParams: Promise<{ candidate: string; date: string }>;
}

// Server Component
const SessionsDisplay = async (PageProps: PageProps) => {
  let candidatesSessions: CandidateSessionsData[] = [];
  let candidateNames: string[] = [];
  let filteredSessions: CandidateSessionsData[] = [];
  let filteredSession: CandidateSessionsData = initialState;
  let candidateName = "";
  let candidateDate = "";

  try {
    candidatesSessions = await getAllCandidateSessionsData();
    candidateNames = [
      ...new Set(candidatesSessions.map((cs) => cs.candidateName)),
    ];

    const searchParams = await PageProps.searchParams;
    // Filter sessions if candidate is selected
    if (searchParams?.candidate) {
      const { candidate, date } = searchParams;
      filteredSessions = candidatesSessions.filter(
        (session) => session.candidateName === candidate
      );
      filteredSession = candidatesSessions.filter(
        (session) =>
          session.candidateName === candidate && session.date === date
      )[0];
      candidateName = candidate;
      candidateDate = date;
    } else {
      filteredSessions = candidatesSessions;
    }
  } catch (error) {
    console.error("Error fetching candidate sessions:", error);
  }

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
              <Link
                key={candidate}
                href={`?candidate=${candidate}`}
                className="w-full"
              >
                <Button
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
              </Link>
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
        <div className="px-4 py-8">
          <div className="overflow-auto max-h-[86vh] custom-scrollbar">
            {typeof candidateDate === "undefined" ? (
              <>
                {candidateName === "" ? (
                  <CandidateSessions candidateSessions={filteredSessions} />
                ) : (
                  <CandidateDates candidatesSessions={filteredSessions} />
                )}
              </>
            ) : (
              // <Suspense fallback={<div>Loading...</div>}>
              // </Suspense>
              <SessionList candidate={filteredSession} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionsDisplay;
