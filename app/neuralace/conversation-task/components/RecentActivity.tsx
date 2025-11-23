import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentActivity() {
    const activities = [
        {
            user: "Alice Johnson",
            action: "Completed Session #15",
            time: "2 mins ago",
            amount: "+15m",
            initials: "AJ",
        },
        {
            user: "Bob Smith",
            action: "Started Break",
            time: "10 mins ago",
            amount: "0m",
            initials: "BS",
        },
        {
            user: "Charlie Brown",
            action: "Uploaded Data",
            time: "1 hour ago",
            amount: "+1.2GB",
            initials: "CB",
        },
        {
            user: "Diana Prince",
            action: "System Alert: High CPU",
            time: "2 hours ago",
            amount: "Alert",
            initials: "DP",
        },
        {
            user: "Evan Wright",
            action: "Logged Out",
            time: "3 hours ago",
            amount: "-",
            initials: "EW",
        },
    ];

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground">
                    You have {activities.length} new notifications today.
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                <AvatarFallback>{activity.initials}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{activity.user}</p>
                                <p className="text-sm text-muted-foreground">
                                    {activity.action}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-sm text-gray-500">
                                {activity.amount}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
