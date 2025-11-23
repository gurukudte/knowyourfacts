import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volunteer } from "../types";
import { Activity, Cpu, HardDrive, Wifi } from "lucide-react";

interface LiveVolunteerCardProps {
    volunteer: Volunteer;
}

export function LiveVolunteerCard({ volunteer }: LiveVolunteerCardProps) {
    const { systemStats } = volunteer;

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 dark:bg-gray-800">
                <CardTitle className="text-sm font-medium">
                    {volunteer.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                        ({volunteer.empId})
                    </span>
                </CardTitle>
                <div className="flex items-center gap-2">
                    {volunteer.status === "Live" && (
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    )}
                    <span
                        className={`text-xs font-bold ${volunteer.status === "Live"
                                ? "text-green-600"
                                : volunteer.status === "On Break"
                                    ? "text-yellow-600"
                                    : "text-gray-500"
                            }`}
                    >
                        {volunteer.status.toUpperCase()}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {/* Session Info */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Sessions</span>
                        <span className="font-bold">{volunteer.sessions}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Total Hours</span>
                        <span className="font-bold">{volunteer.hours}h</span>
                    </div>
                </div>

                {/* System Stats */}
                {systemStats ? (
                    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                        {/* CPU */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Cpu className="h-3 w-3" /> CPU
                                </span>
                                <span className={systemStats.cpuUsage > 80 ? "text-red-500 font-bold" : ""}>
                                    {systemStats.cpuUsage}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${systemStats.cpuUsage > 80 ? "bg-red-500" : "bg-blue-500"
                                        }`}
                                    style={{ width: `${systemStats.cpuUsage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* RAM */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Activity className="h-3 w-3" /> RAM
                                </span>
                                <span className={systemStats.ramUsage > 80 ? "text-red-500 font-bold" : ""}>
                                    {systemStats.ramUsage}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${systemStats.ramUsage > 80 ? "bg-red-500" : "bg-purple-500"
                                        }`}
                                    style={{ width: `${systemStats.ramUsage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Network & Storage */}
                        <div className="flex items-center justify-between text-xs pt-1">
                            <div className="flex items-center gap-1" title="Internet Speed">
                                <Wifi className="h-3 w-3 text-gray-400" />
                                <span>{systemStats.internetSpeed}</span>
                            </div>
                            <div className="flex items-center gap-1" title="Storage Remaining">
                                <HardDrive className="h-3 w-3 text-gray-400" />
                                <span>{systemStats.storageRemaining}</span>
                            </div>
                        </div>
                        <div className="text-[10px] text-gray-400 text-right">
                            IP: {systemStats.ipAddress}
                        </div>
                    </div>
                ) : (
                    <div className="pt-4 text-center text-xs text-gray-400 italic">
                        System stats unavailable (Offline)
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
