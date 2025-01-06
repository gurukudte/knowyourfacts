import { useEffect, useState } from "react";
import { useAppSelector } from "../../mobile/store/hooks";
import { getCandidateSessionsData } from "../../mobile/api";

export default function useCandidateSessions() {
  const [candidateSessions, setCandidateSessions] = useState(null);

  const fetchCandidateSessions = async () => {
    const { candidateName, date, sessions } = useAppSelector(
      (state) => state.session
    );
    if (sessions.length <= 0 && candidateName !== "") {
      try {
        const response = await getCandidateSessionsData({
          candidateName: candidateName,
          date: date,
        });
        console.log(response);
        response && setCandidateSessions(response[0]);
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {}, []);

  return { candidateSessions };
}
