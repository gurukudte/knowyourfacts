import * as React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "../../../../../store/hooks";
import { setCurrentSession, TOTAL_SESSIONS } from "../../slices/sessionSlice";
import { useDispatch } from "react-redux";

export function Header() {
  const { currentSession, isSessionInProgress } = useAppSelector(
    (state) => state.session
  );
  const dispatch = useDispatch();
  return (
    <header className="w-full fixed top-0 p-4 bg-background text-center">
      {!isSessionInProgress ? (
        <Label htmlFor="label" className="text-2xl font-bold">
          It's a new day
        </Label>
      ) : (
        <div className="flex flex-col gap-4 bg-background z-10">
          <div className="relative flex justify-center items-center">
            <h1 className="w-full text-xl font-bold text-center">
              Session {currentSession + 1}/{TOTAL_SESSIONS}
            </h1>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Button
              size="sm"
              onClick={() => dispatch(setCurrentSession("prev"))}
              disabled={currentSession === 0}
            >
              Previous
            </Button>
            <Button
              size="sm"
              onClick={() => dispatch(setCurrentSession("next"))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
