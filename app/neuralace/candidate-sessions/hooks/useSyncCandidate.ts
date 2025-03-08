"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // Adjust based on your Redux
import {
  setCandidateDate,
  setCandidateFromSearchParams,
  setCandidateName,
} from "../slices/DashboardCandidateSessionsSlice";
import { useAppSelector } from "@/store/hooks";

export function useSyncCandidate() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { candidateName, candidateDate, candidatesSessions } = useAppSelector(
    (state) => state.DashboardCandidateSessions
  );

  useEffect(() => {
    // Get candidateName from URL and update Redux state
    if (candidatesSessions.length > 0) {
      const candidateFromUrl = searchParams.get("candidate");
      const candidateDateFromUrl = searchParams.get("date");
      if (
        candidateFromUrl &&
        candidateDateFromUrl &&
        candidateFromUrl !== candidateName &&
        candidateDateFromUrl &&
        candidateDateFromUrl !== candidateDate
      ) {
        dispatch(
          setCandidateFromSearchParams({
            candidate: candidateFromUrl,
            date: candidateDateFromUrl,
          })
        );
      }
    }
  }, [candidatesSessions]);

  useEffect(() => {
    // Update URL when candidateName in Redux changes
    if (candidateName !== "" && candidateDate === "") {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("candidate", candidateName);
      router.replace(`?${newParams.toString()}`, { scroll: false });
    } else if (candidateDate !== "") {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("candidate", candidateName);
      newParams.set("date", candidateDate);
      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [candidateName, router, searchParams, candidateDate, candidatesSessions]);
}
