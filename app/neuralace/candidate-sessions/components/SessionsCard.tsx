import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CandidateSessionsData } from "../../mobile/types/sessionTypes";
import { CopyAllToClipBoard } from "./buttons/CopyAllToClipBoard";
import { SessionTableData } from "./SessionTableData";
import { SummeryButton } from "./buttons/SummeryButton";

type pageProps = {
  candidate: CandidateSessionsData;
};
export function SessionList({ candidate }: pageProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-white">Candidate Sessions</h1>
        <SummeryButton candidateSessions={candidate} />
      </div>
      {candidate?.sessions.map((session, index) => (
        <Card key={session.sessionId} className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex justify-between">
              Session #{index + 1} - {session.sessionId}
              <CopyAllToClipBoard session={session} sessionNumber={index} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-400">
                <strong>High Impedance:</strong> {session.highImpedance}K
              </p>
              <p className="text-gray-400">
                <strong>Low Impedance:</strong> {session.lowImpedance}K
              </p>
            </div>

            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">#</TableHead>
                  <TableHead className="text-white">Start Time</TableHead>
                  <TableHead className="text-white">End Time</TableHead>
                  <TableHead className="text-white">Comments</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <SessionTableData session={session} />
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
