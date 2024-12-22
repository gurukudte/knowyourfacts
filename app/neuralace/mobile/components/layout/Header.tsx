import * as React from "react";
import { useSessionContext } from "../../context/SessionContext";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TiThMenu } from "react-icons/ti";

export interface IHeaderProps {}

export function Header(props: IHeaderProps) {
  const {
    data: {
      sessionsData: { sessions, currentSession, isNewDay },
    },
    handlers: { navigateSession, clearSessionTimings, handleSessionData },
  } = useSessionContext();
  return (
    <header className="w-full fixed top-0 p-4 bg-background text-center">
      {isNewDay ? (
        <Label htmlFor="label" className="text-2xl font-bold">
          It's a new day
        </Label>
      ) : (
        <div className="flex flex-col gap-4 bg-background z-10">
          <div className="relative flex justify-center items-center">
            <h1 className="w-full text-xl font-bold text-center">
              Session {currentSession + 1}/{sessions.length}
            </h1>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Button
              size="sm"
              onClick={() => navigateSession("prev")}
              disabled={currentSession === 0}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={clearSessionTimings}
            >
              Clear Session
            </Button>
            <Button
              size="sm"
              disabled={currentSession === sessions.length - 1}
              onClick={() => navigateSession("next")}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
