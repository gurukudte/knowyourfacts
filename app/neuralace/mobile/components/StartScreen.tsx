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
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setCandidateName, setDate } from "../slices/sessionSlice";
import useActions from "../hooks/useActionsHook";
import useCandidate from "../hooks/useCandidateHook";

const StartScreen = () => {
  const {
    states: { allCandidateData },
  } = useCandidate();

  const { date, candidateName } = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();

  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <Card className="w-full p-6 shadow-lg rounded-lg bg-white">
      <div className="flex flex-col gap-6">
        {/* Select Candidate */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="select-candidate" className="text-lg font-semibold">
            Select Candidate
          </Label>
          <Select
            value={candidateName}
            onValueChange={(value) => dispatch(setCandidateName(value))}
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
            value={date}
            onChange={(e) => {
              dispatch(setDate(e.target.value));
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default StartScreen;
