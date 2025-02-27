"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CopyAllToClipBoard } from "./buttons/CopyAllToClipBoard";
import { SessionTableData } from "./SessionTableData";
import { SummeryButton } from "./buttons/SummeryButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCandidateFromSearchParams } from "../slices/DashboardCandidateSessionsSlice";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

export function SessionList() {
  const {
    candidateNames,
    candidateName,
    candidateDate,
    filteredSession,
    candidatesSessions,
  } = useAppSelector((state) => state.DashboardCandidateSessions);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(candidateNames);
  }, [filteredSession]);

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold text-white">{`Candidate Sessions${
            filteredSession ? " - " + filteredSession.length : ""
          }`}</h1>
          <div className="flex gap-4">
            <Select
              value={candidateName}
              onValueChange={(value) =>
                dispatch(setCandidateFromSearchParams({ candidate: value }))
              }
            >
              <SelectTrigger id="select-candidate" className="w-full">
                <SelectValue placeholder="CANDIDATE" />
              </SelectTrigger>
              <SelectContent>
                {candidateNames?.map((candidate) => (
                  <SelectItem key={candidate} value={candidate}>
                    {candidate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="select-date"
              type="date"
              className="w-full text-white"
              value={candidateDate}
              onChange={(e) => {
                dispatch(
                  setCandidateFromSearchParams({
                    candidate: candidateName,
                    date: e.target.value,
                  })
                );
              }}
            />
          </div>
        </div>
        <div>
          <SummeryButton />
        </div>
      </div>
      <div className="max-h-[80vh] overflow-auto custom-scrollbar mt-8 flex gap-4 flex-col ">
        {filteredSession?.length > 0 ? (
          filteredSession?.map((session, index) => (
            <Card
              key={session.sessionId + index}
              className="min-w-full bg-gray-900 border-gray-800 "
            >
              <CardHeader>
                <CardTitle className="text-white flex justify-between">
                  Session #{index + 1} - {session.sessionId}
                  <CopyAllToClipBoard session={session} sessionNumber={index} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-400">
                    <strong>High Impedance:</strong> {session.highImpedance}K
                  </p>
                  <p className="text-gray-400">
                    <strong>Low Impedance:</strong> {session.lowImpedance}K
                  </p>
                </div>

                <Table className="mt-2">
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
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
