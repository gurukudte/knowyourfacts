"use client";

import { Suspense } from "react";
import SessionsDisplay from "./components/layout/layout";

const Page = () => {
  return (
    <Suspense>
      <SessionsDisplay />
    </Suspense>
  );
};

export default Page;
