"use client";
import {
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import * as React from "react";
import { SessionData } from "../../mobile/types/sessionTypes";
import { formatTime } from "../../mobile/hooks/useTimeHook";
import { CopyVideoTime } from "./buttons/CopyVideoTime";

export interface ISessionTableDataProps {
  session: SessionData;
}

export function SessionTableData({ session }: ISessionTableDataProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  return (
    <TableBody>
      {session?.videos?.map((video, index) => (
        <TableRow key={index}>
          <TableCell className="text-gray-300">{index + 1}</TableCell>
          <TableCell
            className="text-gray-300 hover:cursor-pointer"
            onClick={() => copyToClipboard(video.startTime)}
          >
            {formatTime(video.startTime) || "N/A"}
          </TableCell>
          <TableCell
            className="text-gray-300 hover:cursor-pointer"
            onClick={() => copyToClipboard(video.startTime)}
          >
            {formatTime(video.endTime) || "N/A"}
          </TableCell>
          <TableCell className="text-gray-300 hover:cursor-pointer">
            {video.notes || "No comments"}
          </TableCell>
          <TableCell className="text-white flex justify-start items-center">
            <CopyVideoTime
              startTime={video.startTime}
              endTime={video.endTime}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
