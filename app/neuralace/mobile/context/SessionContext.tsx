"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
} from "react";
import {
  ISessionData,
  SessionData,
  useSession,
  VideoData,
} from "../hooks/useSessionHook";
import useActions from "../hooks/useActionsHook";
import useCandidate, { CandidateData } from "../hooks/useCandidateHook";

interface ISessionContext {
  data: {
    sessionsData: {
      sessions: SessionData[];
      currentSession: number;
      sessionDate: string;
      isNewDay: boolean;
      isSessionInProcess: boolean;
    };
    selectedCandidate: string;
    loading: boolean;
    allCandidateData: CandidateData[];
  };
  handlers: {
    navigateSession: (direction: "next" | "prev") => void;
    clearSessionTimings: () => void;
    handleSessionDataChange: (
      sessionIndex: number,
      field: keyof SessionData,
      value: SessionData[keyof SessionData]
    ) => void;
    recordCurrentTime: (
      videoIndex: number,
      timeType: "startTime" | "endTime"
    ) => void;
    handleVideoTimeChange: (
      sessionIndex: number,
      videoIndex: number,
      field: keyof VideoData,
      value: string
    ) => void;
    updateGoogleSheet: (candidate: string) => void;
    shareToWhatsApp: () => void;
    handleSessionData: (
      field: keyof ISessionData,
      value: boolean | string | number
    ) => void;
  };
}

const SessionContext = createContext<ISessionContext | null>(null);

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error(
      "useSessionContext must be used within a SessionContextProvider"
    );
  }
  return context;
};

interface ISessionProvider {
  children: ReactNode;
}

export const SessionContextProvider: React.FC<ISessionProvider> = ({
  children,
}: ISessionProvider) => {
  const { loading, updateGoogleSheet, shareToWhatsApp } = useActions();
  const {
    sessionsData: {
      sessions,
      currentSession,
      selectedCandidate,
      sessionDate,
      isNewDay,
      isSessionInProcess,
    },
    handlers: {
      navigateSession,
      clearSessionTimings,
      handleSessionDataChange,
      recordCurrentTime,
      handleVideoTimeChange,
      handleSessionData,
    },
  } = useSession();
  const {
    states: { allCandidateData },
  } = useCandidate();
  return (
    <SessionContext.Provider
      value={{
        data: {
          sessionsData: {
            sessions,
            currentSession,
            sessionDate,
            isNewDay,
            isSessionInProcess,
          },
          selectedCandidate,
          loading,
          allCandidateData,
        },
        handlers: {
          navigateSession,
          clearSessionTimings,
          handleSessionDataChange,
          recordCurrentTime,
          handleVideoTimeChange,
          updateGoogleSheet,
          shareToWhatsApp,
          handleSessionData,
        },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
