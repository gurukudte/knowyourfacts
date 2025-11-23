"use client";

import React, { useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Volunteer } from "../types";
import { ArrowUpDown, Search, Wifi, WifiOff } from "lucide-react";

interface LiveVolunteersTableProps {
    volunteers: Volunteer[];
    className?: string;
}

export function LiveVolunteersTable({ volunteers, className }: LiveVolunteersTableProps) {
    const [filter, setFilter] = useState<"all" | "online" | "offline" | "low_hours">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Volunteer;
        direction: "asc" | "desc";
    }>({ key: "name", direction: "asc" }); // Default sort by Name

    const filteredVolunteers = useMemo(() => {
        let result = [...volunteers];

        // 1. Filter by Status/Condition
        if (filter === "online") {
            result = result.filter((v) => v.status === "Live");
        } else if (filter === "offline") {
            result = result.filter((v) => v.status === "Offline");
        } else if (filter === "low_hours") {
            result = result.filter((v) => v.hours < 3);
        }

        // 2. Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(
                (v) =>
                    v.name.toLowerCase().includes(lowerQuery) ||
                    v.empId.toLowerCase().includes(lowerQuery)
            );
        }

        // 3. Sort (Name wise default)
        result.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === undefined || bValue === undefined) return 0;

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [volunteers, filter, searchQuery, sortConfig]);

    const handleSort = (key: keyof Volunteer) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <div className="space-y-4">
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex gap-2">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("all")}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "online" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("online")}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                        Online
                    </Button>
                    <Button
                        variant={filter === "offline" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("offline")}
                        className="text-gray-500"
                    >
                        Offline
                    </Button>
                    <Button
                        variant={filter === "low_hours" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setFilter("low_hours")}
                    >
                        Hours &lt; 3
                    </Button>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search volunteers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Table */}
            <div className={`rounded-md border bg-white dark:bg-gray-900 relative overflow-hidden flex flex-col ${className || "h-[600px]"}`}>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <Table>
                        <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm">
                            <TableRow>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("name")}
                                >
                                    Name <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                </TableHead>
                                <TableHead>Emp ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>System Stats (CPU | RAM | Net)</TableHead>
                                <TableHead
                                    className="text-right cursor-pointer"
                                    onClick={() => handleSort("sessions")}
                                >
                                    Sessions <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                </TableHead>
                                <TableHead
                                    className="text-right cursor-pointer"
                                    onClick={() => handleSort("hours")}
                                >
                                    Hours <ArrowUpDown className="inline h-4 w-4 ml-1" />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredVolunteers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        No volunteers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredVolunteers.map((volunteer) => (
                                    <TableRow key={volunteer.empId}>
                                        <TableCell className="font-medium">{volunteer.name}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {volunteer.empId}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {volunteer.status === "Live" ? (
                                                    <Wifi className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <WifiOff className="h-4 w-4 text-gray-400" />
                                                )}
                                                <span
                                                    className={`text-xs font-bold px-2 py-1 rounded-full ${volunteer.status === "Live"
                                                        ? "bg-green-100 text-green-700"
                                                        : volunteer.status === "On Break"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {volunteer.status}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {volunteer.systemStats ? (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <div className="flex flex-col w-16">
                                                        <span className="text-[10px] text-muted-foreground">CPU</span>
                                                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${volunteer.systemStats.cpuUsage > 80
                                                                    ? "bg-red-500"
                                                                    : "bg-blue-500"
                                                                    }`}
                                                                style={{ width: `${volunteer.systemStats.cpuUsage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col w-16">
                                                        <span className="text-[10px] text-muted-foreground">RAM</span>
                                                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${volunteer.systemStats.ramUsage > 80
                                                                    ? "bg-red-500"
                                                                    : "bg-purple-500"
                                                                    }`}
                                                                style={{ width: `${volunteer.systemStats.ramUsage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 ml-1">{volunteer.systemStats.internetSpeed}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">{volunteer.sessions}</TableCell>
                                        <TableCell className="text-right font-bold">
                                            {volunteer.hours}h
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
