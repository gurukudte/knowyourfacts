import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volunteer } from "../types";

interface VolunteersTableProps {
    volunteers: Volunteer[];
}

export function VolunteersTable({ volunteers }: VolunteersTableProps) {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Live Monitoring & Data Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Emp ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Sessions Done</TableHead>
                            <TableHead>Total Recording Hours</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {volunteers.length > 0 ? (
                            volunteers.map((volunteer) => (
                                <TableRow key={volunteer.empId}>
                                    <TableCell className="font-medium">{volunteer.empId}</TableCell>
                                    <TableCell>{volunteer.name}</TableCell>
                                    <TableCell>{volunteer.sessions}</TableCell>
                                    <TableCell>{volunteer.hours}</TableCell>
                                    <TableCell>{volunteer.lastActive}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${volunteer.status === "Live"
                                                    ? "bg-green-100 text-green-800 animate-pulse"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {volunteer.status === "Live" && (
                                                <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full animate-ping"></span>
                                            )}
                                            {volunteer.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                    No data found for the selected date.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
