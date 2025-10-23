"use client";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import VolunteerManager from "./components/volunteer/VolunteerManager";
import ShiftManager from "./components/ShiftManager";
import WeekSettings from "./components/WeekSettings";
import RosterGenerator from "./components/roaster-generator/RosterGenerator";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;

      case "shifts":
        return <ShiftManager />;
      case "volunteers":
        return <VolunteerManager />;
      case "week-settings":
        return <WeekSettings />;
      case "roster":
        return <RosterGenerator />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 overflow-hidden">{renderContent()}</main>
      </div>
    </div>
  );
}
