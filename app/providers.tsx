"use client";

import { Provider } from "react-redux";
import store from "../store";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

export interface IProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProvidersProps) {
  return (
    <SessionProvider>
      {/* <Provider store={store}></Provider> */}
      {children}
      <Toaster />
    </SessionProvider>
  );
}
