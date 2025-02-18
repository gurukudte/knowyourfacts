"use client";

import { Provider } from "react-redux";
import store from "../store";
import { SessionProvider } from "next-auth/react";

export interface IProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProvidersProps) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
