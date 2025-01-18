import * as React from "react";
import { Button } from "@/components/ui/button";
import { calculateDaysUntil } from "../../utils/googlesheets";
import { CustomDialog } from "../Dialog";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { toggleSessionInProgress } from "../../slices/sessionSlice";

export function Footer() {
  const { date, candidateName, isSessionInProgress } = useAppSelector(
    (state) => state.session
  );
  const dispatch = useAppDispatch();

  const startSessions = () => {
    dispatch(toggleSessionInProgress(true));
  };

  return (
    <footer className="w-full fixed bottom-0 p-4 bg-secondary">
      {!isSessionInProgress ? (
        <Button
          size="lg"
          variant="destructive"
          className="w-full hover:bg-red-700"
          disabled={!(candidateName !== "" && calculateDaysUntil(date) === 0)}
          onClick={startSessions}
        >
          Clear all sessions & Start New
        </Button>
      ) : (
        <CustomDialog />
      )}
    </footer>
  );
}
