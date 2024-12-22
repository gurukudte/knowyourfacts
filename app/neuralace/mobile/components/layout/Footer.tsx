import * as React from "react";
import { useSessionContext } from "../../context/SessionContext";
import { Button } from "@/components/ui/button";
import { SiGooglesheets } from "react-icons/si";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import { calculateDaysUntil } from "../../utils/googlesheets";
import { CustomDialog } from "../Dialog";

export interface IFooterProps {}

export function Footer(props: IFooterProps) {
  const {
    data: {
      sessionsData: { isNewDay, sessionDate },
      selectedCandidate,
      loading,
    },
    handlers: { shareToWhatsApp, updateGoogleSheet, handleSessionData },
  } = useSessionContext();

  const isNewSession = React.useMemo(() => {
    if (selectedCandidate !== "" && calculateDaysUntil(sessionDate) === 0) {
      return false;
    } else {
      return true;
    }
  }, [[sessionDate, selectedCandidate]]);

  return (
    <footer className="w-full fixed bottom-0 p-4 bg-secondary">
      {isNewDay ? (
        <Button
          size="lg"
          variant="destructive"
          className="w-full hover:bg-red-700"
          disabled={isNewSession}
          onClick={() => {
            handleSessionData("isSessionInProcess", true);
          }}
        >
          Clear all sessions & Start New
        </Button>
      ) : (
        // <div className="flex flex-col gap-2">
        //   <Button className="w-full" size="lg" onClick={shareToWhatsApp}>
        //     Share to WhatsApp
        //     <TbBrandWhatsappFilled />
        //   </Button>
        //   {selectedCandidate !== "" && (
        //     <Button
        //       className="w-full"
        //       size="lg"
        //       onClick={() => updateGoogleSheet(selectedCandidate)}
        //     >
        //       {loading ? (
        //         <span className="flex items-center gap-2">
        //           <span className="animate-spin">⏳</span>
        //           Updating...
        //         </span>
        //       ) : (
        //         <>
        //           {`${false ? "Updated" : "Update to Google Sheets"}`}
        //           <SiGooglesheets />
        //         </>
        //       )}
        //     </Button>
        //   )}
        // </div>
        <CustomDialog />
      )}
    </footer>
  );
}
