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
import { useSessionContext } from "../context/SessionContext";
import { SiGooglesheets } from "react-icons/si";
import { TbBrandWhatsappFilled } from "react-icons/tb";

export function CustomDialog() {
  const {
    data: { selectedCandidate, loading },
    handlers: { shareToWhatsApp, updateGoogleSheet, handleSessionData },
  } = useSessionContext();

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
          <Button
            className="w-full"
            size="lg"
            onClick={() => handleSessionData("isSessionInProcess", false)}
          >
            Mark Complete
          </Button>
          <Button className="w-full" size="lg" onClick={shareToWhatsApp}>
            Share to WhatsApp
            <TbBrandWhatsappFilled />
          </Button>
          {selectedCandidate !== "" && (
            <Button
              className="w-full"
              size="lg"
              onClick={() => updateGoogleSheet(selectedCandidate)}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Updating...
                </span>
              ) : (
                <>
                  Update to Google Sheets
                  <SiGooglesheets />
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
