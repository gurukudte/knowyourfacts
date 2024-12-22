import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import React from "react";
import { useSessionContext } from "../context/SessionContext";

const StartScreen = () => {
  const {
    data: {
      sessionsData: { sessionDate },
      selectedCandidate,
      allCandidateData,
    },
    handlers: { handleSessionData },
  } = useSessionContext();

  const handleSessionCandidateChange = (value: string) => {
    handleSessionData("sessionCandidate", value);
  };

  return (
    <Card className="w-full p-6 shadow-lg rounded-lg bg-white">
      <div className="flex flex-col gap-6">
        {/* Select Candidate */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="select-candidate" className="text-lg font-semibold">
            Select Candidate
          </Label>
          <Select
            value={selectedCandidate}
            onValueChange={(value) => handleSessionCandidateChange(value)}
          >
            <SelectTrigger id="select-candidate" className="w-full">
              <SelectValue placeholder="CANDIDATE" />
            </SelectTrigger>
            <SelectContent>
              {allCandidateData
                ?.map((data) => data.sheetName)
                .map((candidate) => (
                  <SelectItem key={candidate} value={candidate}>
                    {candidate}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        {/* Select Date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="select-date" className="text-lg font-semibold">
            Select today's date
          </Label>
          <Input
            id="select-date"
            type="date"
            className="w-full"
            value={sessionDate}
            onChange={(e) => {
              handleSessionData("sessionDate", e.target.value);
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default StartScreen;
