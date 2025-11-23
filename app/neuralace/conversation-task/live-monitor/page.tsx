"use client";

import React, { useMemo } from "react";
import { LiveVolunteersTable } from "../components/LiveVolunteersTable";
import { useVolunteers } from "../hooks/useVolunteers";
import { Users, Wifi, WifiOff, Mic, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LiveMonitorPage() {
    const { liveVolunteers: volunteers } = useVolunteers();

    // Compute Metrics
    const metrics = useMemo(() => {
        let online = 0;
        let offline = 0;
        let totalSessions = 0;
        let totalHours = 0;

        volunteers.forEach(v => {
            if (v.status === "Live") online++;
            else offline++; // Includes "On Break" as not live or separate? Assuming Offline + On Break = Not Live for simple count, or just count strictly.
            // Let's count "Offline" and "On Break" as distinct if needed, but user asked for "online/offline".
            // Let's group "On Break" with "Online" or "Offline"? Usually "On Break" implies they are logged in but away.
            // Let's stick to the status strings.

            totalSessions += v.sessions;
            totalHours += v.hours;
        });

        return {
            total: volunteers.length,
            online,
            offline: volunteers.length - online, // Simple subtraction to ensure totals match
            totalSessions,
            totalHours: totalHours.toFixed(1)
        };
    }, [volunteers]);

    return (
        <div className="space-y-4 h-full flex flex-col">
            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-none">
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Users className="h-5 w-5 text-blue-500 mb-1" />
                        <span className="text-2xl font-bold">{metrics.total}</span>
                        <span className="text-xs text-muted-foreground">Total Volunteers</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Wifi className="h-5 w-5 text-green-500 mb-1" />
                        <span className="text-2xl font-bold">{metrics.online}</span>
                        <span className="text-xs text-muted-foreground">Online</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <WifiOff className="h-5 w-5 text-gray-500 mb-1" />
                        <span className="text-2xl font-bold">{metrics.offline}</span>
                        <span className="text-xs text-muted-foreground">Offline</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Mic className="h-5 w-5 text-purple-500 mb-1" />
                        <span className="text-2xl font-bold">{metrics.totalSessions}</span>
                        <span className="text-xs text-muted-foreground">Total Sessions</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Clock className="h-5 w-5 text-orange-500 mb-1" />
                        <span className="text-2xl font-bold">{metrics.totalHours}h</span>
                        <span className="text-xs text-muted-foreground">Recorded Hours</span>
                    </CardContent>
                </Card>
            </div>

            {/* Table Section - Flex Grow to fill remaining space */}
            <div className="flex-1 min-h-0">
                <LiveVolunteersTable volunteers={volunteers} className="h-full" />
            </div>
        </div>
    );
}
