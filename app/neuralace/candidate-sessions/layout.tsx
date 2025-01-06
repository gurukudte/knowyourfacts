"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import useCandidate from "../mobile/hooks/useCandidateHook";

export interface ILayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
  const {
    states: { allCandidateData },
  } = useCandidate();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Candidate's Formulas</h2>
          <nav className="space-y-2">
            {allCandidateData.map((candidate) => (
              <Button
                variant="ghost"
                className="w-full justify-start font-bold"
              >
                {candidate.sheetName}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Top navigation bar */}
        <nav className="h-14 border-b px-4 flex items-center bg-card">
          <h1 className="text-xl font-semibold">Venky's sessions Data</h1>
        </nav>

        {/* Page content */}
        <main className="h-[calc(100vh-3.5rem)]">{children}</main>
      </div>
    </div>
  );
}
