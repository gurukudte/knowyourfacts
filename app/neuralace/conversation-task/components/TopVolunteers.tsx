import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useVolunteers } from "../hooks/useVolunteers";

export function TopVolunteers() {
    const { volunteers } = useVolunteers();

    // Get top 5 volunteers by hours
    const topVolunteers = [...volunteers]
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 5)
        .map((v, index) => ({
            name: v.name,
            hours: v.hours,
            sessions: v.sessions,
            initials: v.name
                .split(" ")
                .map((n) => n[0])
                .join(""),
            rank: index + 1,
        }));

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle>Top Volunteers</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Highest recording hours this month.
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {topVolunteers.map((volunteer, index) => (
                        <div key={index} className="flex items-center">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-500 mr-3">
                                {volunteer.rank}
                            </div>
                            <Avatar className="h-9 w-9">
                                <AvatarImage
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${volunteer.name}`}
                                    alt="Avatar"
                                />
                                <AvatarFallback>{volunteer.initials}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{volunteer.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {volunteer.sessions} Sessions
                                </p>
                            </div>
                            <div className="ml-auto font-bold text-sm">
                                {volunteer.hours.toFixed(2)}h
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
