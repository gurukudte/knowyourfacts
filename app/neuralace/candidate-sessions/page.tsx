import { Button } from "@/components/ui/button";
import { getAllCandidateSessionsData } from "./api";
import { CandidateSessions } from "./components/main";
import { CandidateSessionsData } from "../mobile/types/sessionTypes";
import Link from "next/link";
import { CandidateDates } from "./components/CandidateDates";

interface PageProps {
  searchParams: Promise<{ candidate: string }>;
}

// Server Component
const SessionsDisplay = async (PageProps: PageProps) => {
  let candidatesSessions: CandidateSessionsData[] = [];
  let candidateNames: string[] = [];
  let filteredSessions: CandidateSessionsData[] = [];
  let candidateName = "";

  try {
    candidatesSessions = await getAllCandidateSessionsData();
    candidateNames = [
      ...new Set(candidatesSessions.map((cs) => cs.candidateName)),
    ];

    const searchParams = await PageProps.searchParams;
    // Filter sessions if candidate is selected
    if (searchParams?.candidate) {
      const { candidate } = searchParams;
      filteredSessions = candidatesSessions.filter(
        (session) => session.candidateName === candidate
      );
      candidateName = candidate;
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
          <nav className="space-y-2">
            {candidateNames.map((candidate) => (
              <Link
                key={candidate}
                href={`?candidate=${candidate}`}
                className="w-full"
              >
                <Button
                  variant={"ghost"}
                  size={"lg"}
                  className="w-full font-bold justify-start"
                >
                  {candidate.toLocaleUpperCase()}
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
        {candidateName === "" ? (
          <CandidateSessions candidateSessions={filteredSessions} />
        ) : (
          <CandidateDates candidatesSessions={filteredSessions} />
        )}
      </div>
    </div>
  );
};

export default SessionsDisplay;
