"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { toggleSessionInProgress } from "../slices/sessionSlice";
import useActions from "../hooks/useActionsHook";
import useTechnician from "../../tech-sheet/useTechnicianHook";
import { useAppSelector } from "@/store/hooks";
import { useToast } from "@/hooks/use-toast";

type RatingQuestions =
  | "raConductRating"
  | "experimentalConditionsRating"
  | "managementExperienceRating"
  | "healthGuidelinesFollowingRating"
  | "healthGuidelinesEffectivenessRating"
  | "healthFeelingRating";

const EndScreen = () => {
  const { toast } = useToast();
  const { updateFeedBackToGoogleSheet, updateGoogleSheet } = useActions();
  const {
    states: { allTechnicianData },
  } = useTechnician();
  const {
    candidateName,
    currentSession,
    sessions,
    raTechnicianName,
    isSheetUpdated,
    todayStartRange,
  } = useAppSelector((state) => state.session);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    timestamp: new Date().toISOString(),
    volunteerName: candidateName,
    fatigueLastShift: "",
    sleepHours: "",
    hoursBeforeEating: "",
    dailyWorkout: "",
    shampooBeforeShift: "",
    currentFatigue: "",
    sleepyOrHungryDuringSession: "",
    setupCorrect: "",
    setupIssues: "",
    raConductFeedback: "",
    raConductRating: "",
    experimentalConditionsRating: "",
    managementExperienceRating: "",
    healthGuidelinesFollowingRating: "",
    healthGuidelinesEffectivenessRating: "",
    healthFeelingRating: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateToSheet = (sheetId: string) => {
    updateGoogleSheet(
      isSheetUpdated,
      todayStartRange,
      candidateName,
      currentSession - 1,
      sessions,
      sheetId,
      (lastRow) => {}
    );
  };

  const handleSubmit = async () => {
    const hasEmptyValue = Object.values(formData).some((value) => value === "");
    console.log("formData", formData);
    if (hasEmptyValue) {
      toast({
        variant: "destructive",
        title: "Fill all the fields",
        description: "There are empty fields in the form",
      });
    } else {
      try {
        const sheetId =
          allTechnicianData.find(
            (tech) => tech.technicianName === raTechnicianName
          )?.sheetID || "";
        const values = Object.values(formData).map((value) => [value]);
        await updateToSheet(sheetId);
        await updateFeedBackToGoogleSheet(
          values,
          sheetId,
          candidateName,
          () => {
            dispatch(toggleSessionInProgress(false));
          }
        );
      } catch (error) {
        console.error("Error in submitting feedback", error);
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Numeric Inputs */}
          {["sleepHours", "hoursBeforeEating"].map((name, index) => (
            <div key={index}>
              <Label>
                {name === "sleepHours"
                  ? "How many hours did you sleep last night?"
                  : "How many hours before the shift you ate?"}
              </Label>
              <Input
                type="number"
                name={name}
                value={formData[name as "sleepHours" | "hoursBeforeEating"]}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* Yes/No Questions */}
          {[
            "raConductFeedback",
            "fatigueLastShift",
            "dailyWorkout",
            "shampooBeforeShift",
            "currentFatigue",
            "sleepyOrHungryDuringSession",
            "setupCorrect",
            "setupIssues",
          ].map((name, index) => (
            <div key={index}>
              <Label>
                {name === "raConductFeedback"
                  ? "Did they feel the research assistant was rough, untrained, unresponsive or unavailable through the shift?"
                  : name === "fatigueLastShift"
                  ? "The candidate felt any fatigue or pain due to the setup last shift?"
                  : name === "dailyWorkout"
                  ? "Are you working out for at least 10-15 min daily?"
                  : name === "shampooBeforeShift"
                  ? "Have you shampooed your head one hour before the shift?"
                  : name === "currentFatigue"
                  ? "Do you feel any fatigue?"
                  : name === "sleepyOrHungryDuringSession"
                  ? "During the session, do you feel sleepy or hungry?"
                  : name === "setupCorrect"
                  ? "Was the setup correct as per your understanding?"
                  : "Did you face any issue during the setup?"}
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange(name, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}

          {/* Rating Questions */}
          {[
            "raConductRating",
            "experimentalConditionsRating",
            "managementExperienceRating",
            "healthGuidelinesFollowingRating",
            "healthGuidelinesEffectivenessRating",
            "healthFeelingRating",
          ].map((name, index) => (
            <div key={index}>
              <Label>
                {name === "raConductRating"
                  ? "On a scale of 1 to 10, how would you rate RA’s conduct?"
                  : name === "experimentalConditionsRating"
                  ? "On a scale of 1 to 10, how would you rate the experimental conditions (space, environment, lighting, etc.)?"
                  : name === "managementExperienceRating"
                  ? "On a scale of 1 to 10, how would you rate the experience with the management team?"
                  : name === "healthGuidelinesFollowingRating"
                  ? "On a scale of 1 to 10, how would you rate your following of the health guidelines shared with you?"
                  : name === "healthGuidelinesEffectivenessRating"
                  ? "On a scale of 1 to 10, how would you rate the effectiveness of the health guidelines shared with you?"
                  : "On a scale of 1 to 10, how healthy do you feel?"}
              </Label>
              <Input
                type="number"
                name={name}
                value={formData[name as RatingQuestions]}
                min="1"
                max="10"
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <Button
            onClick={() => {
              handleSubmit();
            }}
            variant="destructive"
            className="w-full md:w-1/2"
          >
            Submit & End Shift
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EndScreen;
