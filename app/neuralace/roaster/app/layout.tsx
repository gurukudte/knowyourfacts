
import React from "react";
import AppProvider from "./components/AppProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppProvider>
        {children}
      </AppProvider>
    </>
  );
}
