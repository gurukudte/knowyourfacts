import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SiGooglesheets } from "react-icons/si";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  toggleSessionInProgress,
  updateSessionUpdateInGoogleSheet,
} from "../store/slices/sessionSlice";
import useActions from "../hooks/useActionsHook";

export function CustomDialog() {
  const { candidateName, currentSession, sessions } = useAppSelector(
    (state) => state.session
  );
  const dispatch = useAppDispatch();
  const { loading, shareToWhatsApp, updateGoogleSheet } = useActions();

  const updateToSheet = () => {
    updateGoogleSheet(candidateName, currentSession, sessions, () =>
      dispatch(
        updateSessionUpdateInGoogleSheet({
          sessionIndex: currentSession,
          lastUpdated: new Date().toLocaleString(),
        })
      )
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update session</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 items-center">
          {currentSession === sessions.length - 1 && (
            <Button
              className="w-full"
              size="lg"
              onClick={() => dispatch(toggleSessionInProgress(false))}
            >
              Mark Complete
            </Button>
          )}
          <Button
            className="w-full"
            size="lg"
            onClick={() =>
              shareToWhatsApp(sessions[currentSession], currentSession)
            }
          >
            Share to WhatsApp
            <TbBrandWhatsappFilled />
          </Button>
          {candidateName !== "" && (
            <Button
              className="w-full"
              size="lg"
              onClick={() => updateToSheet()}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Updating...
                </span>
              ) : (
                <>
                  {sessions[currentSession].sheetUpdate.isUpdated ? (
                    <>Updated</>
                  ) : (
                    <>
                      Update to Google Sheets
                      <SiGooglesheets />
                    </>
                  )}
                </>
              )}
            </Button>
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild className="flex justify-end items-center">
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
