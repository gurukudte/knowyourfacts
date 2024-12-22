"use client";
import { SessionContextProvider } from "./neuralace/mobile/context/SessionContext";

export interface IProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProvidersProps) {
  return <SessionContextProvider>{children}</SessionContextProvider>;
}
