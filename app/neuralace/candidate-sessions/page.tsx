import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Typescript Interfaces
interface VideoData {
  startTime: string;
  endTime: string;
  lastUpdated: string | null;
  notes: string;
}

interface SessionData {
  sessionId: string;
  highImpedance: string;
  lowImpedance: string;
  videos: VideoData[];
  sheetUpdate: {
    lastUpdated: null | string;
    isUpdated: boolean;
  };
}

interface CandidateSessionsProps {
  candidateName: string;
  date: string;
  sessions: SessionData[];
}

// Mock data (replace with API response or props)
const mockData: CandidateSessionsProps[] = [
  {
    candidateName: "John Doe",
    date: "30-12-2024",
    sessions: [
      {
        sessionId: "S1",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: false },
      },
      {
        sessionId: "S2",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: true },
      },
      {
        sessionId: "S1",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: false },
      },
      {
        sessionId: "S2",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: true },
      },
      {
        sessionId: "S1",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: false },
      },
      {
        sessionId: "S2",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: true },
      },
      {
        sessionId: "S1",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: false },
      },
      {
        sessionId: "S2",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: true },
      },
      {
        sessionId: "S1",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: false },
      },
      {
        sessionId: "S2",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: true },
      },
      {
        sessionId: "S1",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: false },
      },
      {
        sessionId: "S2",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: true },
      },
      {
        sessionId: "S1",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: false },
      },
      {
        sessionId: "S2",
        highImpedance: "High",
        lowImpedance: "Low",
        videos: [],
        sheetUpdate: { lastUpdated: null, isUpdated: true },
      },
    ],
  },
];

// React Component
const SessionsDisplay: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      {mockData.map((candidate) => (
        <div key={candidate.candidateName} className="space-y-6">
          {/* Candidate Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {candidate.date}
            </h2>
          </div>

          {/* Session Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidate.sessions.map((session) => (
              <Card
                key={session.sessionId}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700">
                    Session ID: {session.sessionId}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    High Impedance: {session.highImpedance}
                  </p>
                  <p className="text-sm text-gray-600">
                    Low Impedance: {session.lowImpedance}
                  </p>
                  <p className="text-sm text-gray-600">
                    Last Updated: {session.sheetUpdate.lastUpdated || "N/A"}
                  </p>
                </CardContent>
                <CardFooter className="text-right">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
                    View Details
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionsDisplay;
