"use client";

import { Provider } from "react-redux";
import store from "../store";

export interface IProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
