import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useVolunteers } from "../hooks/useVolunteers";
import { StatsOverview } from "./StatsOverview";
import { SessionReport } from "./SessionReport";
import { Volunteer, SummaryStat } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Search, Users, Mic, Clock, Activity, HardDrive, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnalyticsDashboard() {
    const {
        volunteers,
        dateFilter,
        searchQuery,
        sortConfig,
        loading,
        refresh,
        handleDateChange,
        handleSearchChange,
        handleSort,
    } = useVolunteers();
    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
    const [statusFilter, setStatusFilter] = useState<"all" | "Live" | "Offline">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(100);

    // Compute Summary Stats based on Date Filter
    const computedStats: SummaryStat[] = useMemo(() => {
        let totalSessions = 0;
        let totalHours = 0;
        let totalUploaded = 0;

        // Use filtered volunteers (active on date) but calculate stats SPECIFIC to that date
        volunteers.forEach(v => {
            const dailySessions = v.sessionDetails.filter(s => s.date === dateFilter);

            dailySessions.forEach(s => {
                totalSessions++;
                totalHours += s.micDuration / 60;
                // Mock upload logic
                if (s.micWav === "Y") totalUploaded++;
            });
        });

        return [
            { title: "Active Volunteers", value: volunteers.length.toString(), icon: Users, description: `Active on ${dateFilter}` },
            { title: "Daily Sessions", value: totalSessions.toLocaleString(), icon: Mic, description: "Recorded today" },
            { title: "Avg Recording Time", value: totalSessions > 0 ? `${(totalHours / totalSessions * 60).toFixed(0)}m` : "0m", icon: Clock, description: "Per session" },
            { title: "Uploaded Data", value: "0%", icon: HardDrive, description: "Upload tracking not available" },
            { title: "Daily Recording Hours", value: `${totalHours.toFixed(2)}h`, icon: Activity, description: "Total time today" }
        ];
    }, [volunteers, dateFilter]);

    if (selectedVolunteer) {
        return (
            <SessionReport
                volunteer={selectedVolunteer}
                onBack={() => setSelectedVolunteer(null)}
            />
        );
    }

    const SortIcon = ({ field }: { field: string }) => {
        if (sortConfig?.field !== field)
            return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
        return (
            <ArrowUpDown
                className={`ml-2 h-4 w-4 ${sortConfig.order === "asc" ? "text-black" : "text-black rotate-180"
                    }`}
            />
        );
    };

    // Filter by status
    const filteredVolunteers = useMemo(() => {
        if (statusFilter === "all") return volunteers;
        return volunteers.filter(v => v.status === statusFilter);
    }, [volunteers, statusFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredVolunteers.length / rowsPerPage);
    const paginatedVolunteers = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredVolunteers.slice(startIndex, endIndex);
    }, [filteredVolunteers, currentPage, rowsPerPage]);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, dateFilter, statusFilter]);

    // Format lastActive to show only time in IST
    const formatTimeIST = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-4 flex-none">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search volunteers..."
                            className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg shadow-sm"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                            className="h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                        >
                            <option value="all">All Status</option>
                            <option value="Live">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                        <Input
                            type="date"
                            className="w-auto h-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg shadow-sm"
                            value={dateFilter}
                            onChange={(e) => handleDateChange(e.target.value)}
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={refresh}
                            disabled={loading}
                            title="Refresh Data"
                            className="h-10 w-10 rounded-lg border-gray-300 hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : "text-gray-600"}`} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Summary Cards Section */}
            <div className="flex-none">
                <StatsOverview stats={computedStats} />
            </div>

            {/* Data Analysis / Live Monitoring Section */}
            <div className="grid gap-4 md:grid-cols-1 flex-1 min-h-0">
                <Card className="shadow-xl flex flex-col h-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                    <CardHeader className="flex-none bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-b-0 py-4 px-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                            <Activity className="h-6 w-6" />
                            Data Analysis
                        </CardTitle>
                        <div className="flex items-center gap-2 text-white text-sm">
                            <span>{filteredVolunteers.length} Volunteers</span>
                            <span className="opacity-50">|</span>
                            <span>Page {currentPage} of {totalPages || 1}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0 relative flex flex-col">
                        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
                            <Table className="min-w-full">
                                <TableHeader className="sticky top-0 bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 z-10 shadow-lg border-b-2 border-blue-200 dark:border-blue-900">
                                    <TableRow className="hover:bg-transparent h-10">
                                        <TableHead className="font-bold text-gray-800 dark:text-gray-200 py-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("name")}
                                                className="p-0 hover:bg-transparent font-bold text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-colors h-auto"
                                            >
                                                Name <SortIcon field="name" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="font-bold text-gray-800 dark:text-gray-200 py-2">Phone</TableHead>
                                        <TableHead className="font-bold text-gray-800 dark:text-gray-200 py-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("sessions")}
                                                className="p-0 hover:bg-transparent font-bold text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-colors h-auto"
                                            >
                                                Sessions <SortIcon field="sessions" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="font-bold text-gray-800 dark:text-gray-200 py-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("hours")}
                                                className="p-0 hover:bg-transparent font-bold text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-colors h-auto"
                                            >
                                                Total Hours <SortIcon field="hours" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="font-bold text-gray-800 dark:text-gray-200 py-2">Last Active</TableHead>
                                        <TableHead className="font-bold text-gray-800 dark:text-gray-200 py-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("status")}
                                                className="p-0 hover:bg-transparent font-bold text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-colors h-auto"
                                            >
                                                Status <SortIcon field="status" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-right font-bold text-gray-800 dark:text-gray-200 py-2">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedVolunteers.length > 0 ? (
                                        paginatedVolunteers.map((volunteer, index) => (
                                            <TableRow
                                                key={volunteer.empId}
                                                className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:via-indigo-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 border-b border-gray-200 dark:border-gray-700 hover:shadow-md h-10"
                                                onClick={() => setSelectedVolunteer(volunteer)}
                                            >
                                                <TableCell className="font-medium text-gray-900 dark:text-gray-100 py-2 text-sm">
                                                    {volunteer.name}
                                                </TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-300 py-2 text-sm">
                                                    {volunteer.phone || <span className="text-gray-400 italic">N/A</span>}
                                                </TableCell>
                                                <TableCell className="font-semibold text-gray-800 dark:text-gray-200 py-2 text-sm">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {volunteer.sessions}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-semibold text-gray-800 dark:text-gray-200 py-2 text-sm">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                        {volunteer.hours.toFixed(2)}h
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-300 font-mono text-xs py-2">
                                                    {formatTimeIST(volunteer.lastActive)}
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold shadow-sm ${volunteer.status === "Live"
                                                            ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border border-green-300 animate-pulse"
                                                            : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 border border-gray-300"
                                                            }`}
                                                    >
                                                        {volunteer.status === "Live" && (
                                                            <span className="w-1.5 h-1.5 mr-1.5 bg-white rounded-full animate-ping"></span>
                                                        )}
                                                        {volunteer.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right py-2">
                                                    <span className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-bold hover:underline transition-colors text-xs inline-flex items-center gap-1">
                                                        View
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="text-center h-40 text-gray-500 dark:text-gray-400"
                                            >
                                                <div className="flex flex-col items-center justify-center gap-3 py-8">
                                                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                        <Search className="h-10 w-10 text-gray-400" />
                                                    </div>
                                                    <p className="font-bold text-lg text-gray-700 dark:text-gray-300">No data found matching your filters</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or date filter to see results</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span>Rows per page:</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                    <option value={200}>200</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Page {currentPage} of {totalPages || 1}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
