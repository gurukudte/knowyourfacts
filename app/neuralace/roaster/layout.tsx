import React from "react";
import {AppProvider} from "./context/AppContext"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppProvider>{children}</AppProvider>
    </>
  );
}
