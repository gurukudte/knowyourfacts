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
import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  setCandidateName,
  setDate,
  setRaTechnicianName,
} from "../slices/sessionSlice";
import useTechnician from "../../tech-sheet/useTechnicianHook";
import axios from "axios";
import { cn } from "@/lib/utils";

const StartScreen = () => {
  const [allCandidateNames, setAllCandidateNames] = useState<string[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false); // Loading state
  const [candidateSelectKey, setCandidateSelectKey] = useState(0); // Key for re-rendering the candidate select

  const {
    states: { allTechnicianData },
  } = useTechnician();

  const { date, candidateName, raTechnicianName } = useAppSelector(
    (state) => state.session
  );
  const dispatch = useAppDispatch();

  // Memoize the allTechnicianData mapping to prevent unnecessary re-renders
  const technicianItems = useMemo(() => {
    return allTechnicianData
      ?.map((data) => data.technicianName)
      .map((technician) => (
        <SelectItem key={technician} value={technician}>
          {technician}
        </SelectItem>
      ));
  }, [allTechnicianData]);

  useEffect(() => {
    if (raTechnicianName !== "" && allTechnicianData.length > 0) {
      const sheetId =
        allTechnicianData.find(
          (tech) => tech.technicianName === raTechnicianName
        )?.sheetID || "";
      getAllCandidateNames(sheetId);
    }
  }, [raTechnicianName]); // Added allTechnicianData to dependency array

  const getAllCandidateNames = async (sheetId: string) => {
    setIsLoadingCandidates(true);
    try {
      const res = await axios({
        method: "get",
        url: `/api/googlesheet?spreadsheetId=${sheetId}`,
      });
      setAllCandidateNames(res.data.data);
    } catch (error) {
      console.error("Error fetching candidate names:", error);
      // Handle the error (e.g., display an error message to the user)
    } finally {
      setIsLoadingCandidates(false);
    }
  };

  // Effect to clear localStorage on component mount.  No dependencies needed.
  useEffect(() => {
    localStorage.clear();
  }, []);

  // Function to handle changing the RA/Technician
  const handleRaTechnicianChange = (value: string) => {
    dispatch(setRaTechnicianName(value));
    dispatch(setCandidateName("")); // Reset candidate name when RA/Tech changes
    setCandidateSelectKey((prevKey) => prevKey + 1); // Force re-render of the candidate select
  };

  return (
    <Card className="w-full p-6 shadow-lg rounded-lg bg-white">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="select-raTTechnician"
            className="text-lg font-semibold"
          >
            RA/Technician
          </Label>
          <Select
            value={raTechnicianName}
            onValueChange={handleRaTechnicianChange} // Use the handler function
          >
            <SelectTrigger id="select-candidate" className="w-full">
              <SelectValue placeholder="RA/Technician" />
            </SelectTrigger>
            <SelectContent>{technicianItems}</SelectContent>
          </Select>
        </div>
        {/* Select Candidate */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="select-candidate" className="text-lg font-semibold">
            Select Candidate
          </Label>
          <Select
            key={candidateSelectKey} // Force re-render when RA/Tech changes
            value={candidateName}
            onValueChange={(value) => dispatch(setCandidateName(value))}
            disabled={isLoadingCandidates || allCandidateNames.length === 0}
          >
            <SelectTrigger
              id="select-candidate"
              className={cn("w-full", {
                "cursor-not-allowed opacity-50":
                  isLoadingCandidates || allCandidateNames.length === 0,
              })}
            >
              <SelectValue
                placeholder={isLoadingCandidates ? "Loading..." : "CANDIDATE"}
              />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCandidates ? (
                <SelectItem value="Loading" disabled>
                  Loading...
                </SelectItem>
              ) : allCandidateNames.length === 0 ? (
                <SelectItem value="No candidates available " disabled>
                  No candidates available
                </SelectItem>
              ) : (
                allCandidateNames.map((candidate) => (
                  <SelectItem key={candidate} value={candidate}>
                    {candidate}
                  </SelectItem>
                ))
              )}
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
