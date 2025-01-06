import * as React from "react";
import { Button } from "@/components/ui/button";
import { calculateDaysUntil } from "../../utils/googlesheets";
import { CustomDialog } from "../Dialog";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { toggleSessionInProgress } from "../../store/slices/sessionSlice";

export function Footer() {
  const { date, candidateName, isSessionInProgress } = useAppSelector(
    (state) => state.session
  );
  const dispatch = useDispatch();

  return (
    <footer className="w-full fixed bottom-0 p-4 bg-secondary">
      {!isSessionInProgress ? (
        <Button
          size="lg"
          variant="destructive"
          className="w-full hover:bg-red-700"
          disabled={!(candidateName !== "" && calculateDaysUntil(date) === 0)}
          onClick={() => {
            dispatch(toggleSessionInProgress(true));
          }}
        >
          Clear all sessions & Start New
        </Button>
      ) : (
        <CustomDialog />
      )}
    </footer>
  );
}
