"use client";

import React, { useState, useMemo } from "react";
import { StatsOverview } from "./components/StatsOverview";
import { TopVolunteers } from "./components/TopVolunteers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Users, Mic, Clock, Activity, HardDrive } from "lucide-react";
import { SummaryStat } from "./types";
import { useVolunteers } from "./hooks/useVolunteers";

// Helper function to get week number
function getWeekNumber(date: Date): number {
    const day = date.getDate();
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    if (day <= 28) return 4;
    return 5;
}

export default function ConversationTaskDashboard() {
    const { volunteers, loading } = useVolunteers();
    const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().slice(0, 7) // Default to current month YYYY-MM
    );

    // --- Computed Metrics from Real API Data ---
    const { summaryStats, graphData } = useMemo(() => {
        const stats: SummaryStat[] = [];

        // Graph Aggregation
        const weeklyMap = new Map<string, number>(); // "Week X" -> hours
        const monthlyMap = new Map<string, number>(); // "Jan" -> hours

        // Initialize Monthly Map
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        monthNames.forEach(m => monthlyMap.set(m, 0));

        let totalHours = 0;
        let totalSessions = 0;
        let totalSessionDurationMins = 0; // For accurate avg calculation

        volunteers.forEach((volunteer) => {
            totalHours += volunteer.hours;
            totalSessions += volunteer.sessions;

            // Calculate total session duration in minutes from actual session data
            volunteer.sessionDetails.forEach(session => {
                totalSessionDurationMins += session.micDuration;
            });

            // Aggregate data for graphs
            const date = new Date(volunteer.lastActive);
            if (!isNaN(date.getTime())) {
                const hours = volunteer.hours;

                if (viewMode === "monthly") {
                    const weekLabel = `Week ${getWeekNumber(date)}`;
                    weeklyMap.set(weekLabel, (weeklyMap.get(weekLabel) || 0) + hours);
                } else {
                    const month = monthNames[date.getMonth()];
                    monthlyMap.set(month, (monthlyMap.get(month) || 0) + hours);
                }
            }
        });



        // Finalize Stats
        const avgRecordingTime = totalSessions > 0
            ? (totalSessionDurationMins / totalSessions).toFixed(1)
            : "0";

        stats.push(
            { title: "Total Volunteers", value: volunteers.length.toString(), icon: Users, description: "Active participants" },
            { title: "Total Sessions", value: totalSessions.toLocaleString(), icon: Mic, description: "Recorded sessions" },
            { title: "Avg Recording Time", value: `${avgRecordingTime}m`, icon: Clock, description: "Per session" },
            { title: "Total Uploaded Data", value: "0%", icon: HardDrive, description: "Upload tracking not available" },
            { title: "Total Recording Hours", value: `${totalHours.toFixed(2)}h`, icon: Activity, description: "Cumulative time" }
        );

        // Finalize Graph Data
        let finalGraphData = [];
        if (viewMode === "monthly") {
            const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
            finalGraphData = weeks.map(w => ({ label: w, value: parseFloat((weeklyMap.get(w) || 0).toFixed(2)) }));
        } else {
            finalGraphData = monthNames.map(m => ({ label: m, value: parseFloat((monthlyMap.get(m) || 0).toFixed(2)) }));
        }

        return { summaryStats: stats, graphData: finalGraphData };
    }, [selectedDate, viewMode, volunteers]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-end space-y-2 md:space-y-0">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-1">
                        <Button
                            variant={viewMode === "monthly" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("monthly")}
                            className="text-xs"
                        >
                            Monthly
                        </Button>
                        <Button
                            variant={viewMode === "yearly" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("yearly")}
                            className="text-xs"
                        >
                            Yearly
                        </Button>
                    </div>
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 px-3 py-1.5">
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                        <input
                            type={viewMode === "monthly" ? "month" : "number"}
                            min="2020"
                            max="2030"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-sm focus:outline-none"
                            placeholder={viewMode === "yearly" ? "YYYY" : "YYYY-MM"}
                        />
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <StatsOverview stats={summaryStats} />

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                {/* Dynamic Bar Chart Visualization */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>
                            {viewMode === "monthly" ? "Weekly Breakdown" : "Monthly Overview"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px] w-full flex items-end justify-between gap-2 px-4">
                            {graphData.map((item, i) => (
                                <div key={i} className="w-full flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors relative group"
                                        style={{
                                            height: `${item.value > 0 ? Math.max((item.value / Math.max(...graphData.map(d => d.value))) * 100, 5) : 0}%`,
                                        }}
                                    >
                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {item.value.toFixed(2)}h
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 text-center truncate w-full">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Volunteers */}
                <TopVolunteers />
            </div>
        </div>
    );
}
