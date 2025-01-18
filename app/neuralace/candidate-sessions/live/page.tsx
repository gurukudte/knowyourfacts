"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const socket = io(process.env.NEXT_PUBLIC_LIVE_BASE_URI);

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState<any>([]);

  useEffect(() => {
    // Listen for candidate updates
    socket.on("adminViewUpdate", (data) => {
      console.log(candidates);
      const array = candidates;
      array.filter((arr: any) => arr.candidateId === data?.candidateId)
        .length === 0 && array.push(data);
      setCandidates(array);
    });

    return () => {
      socket.off("adminViewUpdate");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Live Candidate Session
      </h1>

      {candidates ? (
        <>
          {candidates.map((candidate: any) => {
            return (
              <Card className="bg-gray-800 text-white shadow-md p-4">
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between">
                    Candidate:{" " + candidate?.candidateId}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="mb-4">
                    <h2 className="text-lg font-medium mb-2">Session Info</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <span className="font-semibold">Current:</span>{" "}
                        {candidate.sessionData.length}
                      </p>
                      {/* <p>
                        <span className="font-semibold">High Impedance:</span>{" "}
                        {candidate.sessionData.highImpedance} Ω
                      </p>
                      <p>
                        <span className="font-semibold">Low Impedance:</span>{" "}
                        {candidate.sessionData.lowImpedance} Ω
                      </p> */}
                    </div>
                  </div>

                  {/* <h2 className="text-lg font-medium mb-2">Block Timings</h2>
                  <Table className="border border-gray-700 rounded-lg">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Block</TableHead>
                        <TableHead className="text-left">Start Time</TableHead>
                        <TableHead className="text-left">End Time</TableHead>
                        <TableHead className="text-left">
                          Last Updated
                        </TableHead>
                        <TableHead className="text-left">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidate.sessionData.videos.map(
                        (video: any, index: number) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-700 transition"
                          >
                            <TableCell>Block {index + 1}</TableCell>
                            <TableCell>{video.startTime}</TableCell>
                            <TableCell>{video.endTime}</TableCell>
                            <TableCell>
                              {video.lastUpdated || "Not updated"}
                            </TableCell>
                            <TableCell>{video.notes || "--"}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table> */}
                </CardContent>
              </Card>
            );
          })}
        </>
      ) : (
        <p className="text-center text-gray-400">
          Waiting for live candidate data...
        </p>
      )}
    </div>
  );
}
