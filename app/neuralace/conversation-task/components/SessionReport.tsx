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
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Calendar, Clock, FileText, BarChart3 } from "lucide-react";

interface SessionReportProps {
    volunteer: Volunteer;
    onBack: () => void;
}

export function SessionReport({ volunteer, onBack }: SessionReportProps) {
    const totalSessions = volunteer.sessionDetails.length;
    // Calculate total duration if needed, or use pre-calculated values
    const totalMicDuration = volunteer.sessionDetails.reduce(
        (acc, curr) => acc + curr.micDuration,
        0
    );

    const handleExport = () => {
        const headers = [
            "Session #",
            "Start Time",
            "End Time",
            "Break (min)",
            "Mic (min)",
            "Sys (min)",
            "Max (min)",
            "Mic .wav",
            "Sys .wav",
        ];
        const rows = volunteer.sessionDetails.map((s) => [
            s.sessionNumber,
            s.startTime,
            s.endTime,
            s.breakDuration,
            s.micDuration,
            s.sysDuration,
            s.maxDuration,
            s.micWav,
            s.sysWav,
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
            "download",
            `session_report_${volunteer.name.replace(" ", "_")}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-6 shadow-xl gap-4">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onBack}
                        className="bg-white hover:bg-gray-100 border-2 border-white flex-shrink-0"
                    >
                        <ArrowLeft className="h-5 w-5 text-blue-600" />
                    </Button>
                    <div className="flex-1 sm:flex-initial">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
                            SESSION-WISE REPORT
                        </h2>
                        <p className="text-blue-100 mt-1 text-sm sm:text-base">Detailed session breakdown for {volunteer.name}</p>
                    </div>
                </div>
                <Button
                    onClick={handleExport}
                    className="gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-lg w-full sm:w-auto"
                >
                    <Download className="h-4 w-4" />
                    Export Report
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Overall Summary Card */}
                <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                        <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            OVERALL SUMMARY
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Folder</p>
                                <p className="text-base font-semibold text-gray-900">
                                    recording_{volunteer.name.toLowerCase().replace(" ", "_")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Date</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {new Date().toISOString().split("T")[0]}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Start Time</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {volunteer.sessionDetails[0]?.startTime || "-"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Card */}
                <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                        <CardTitle className="text-xl font-bold text-purple-900 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            SESSION STATISTICS
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                        <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-600 font-medium">End Time</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {volunteer.sessionDetails[totalSessions - 1]?.endTime || "-"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total Sessions</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {totalSessions}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <BarChart3 className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total Recording Time</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {totalMicDuration.toFixed(2)} mins
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Session Details Table */}
            <Card className="border-2 border-gray-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 border-b-2 border-blue-200">
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="h-6 w-6 text-blue-600" />
                        SESSION DETAILS
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-white font-bold text-center border-r border-blue-400 py-4">
                                        Session #
                                    </TableHead>
                                    <TableHead className="text-white font-bold text-center border-r border-blue-400 py-4">
                                        Start (Time)
                                    </TableHead>
                                    <TableHead className="text-white font-bold text-center border-r border-blue-400 py-4">
                                        End (Time)
                                    </TableHead>
                                    <TableHead className="text-white font-bold text-center border-r border-blue-400 py-4">
                                        Break (min)
                                    </TableHead>
                                    <TableHead className="text-white font-bold text-center border-r border-blue-400 py-4">
                                        Mic (min)
                                    </TableHead>
                                    <TableHead className="text-white font-bold text-center border-r border-blue-400 py-4">
                                        Sys (min)
                                    </TableHead>
                                    <TableHead className="text-white font-bold text-center border-r border-blue-400 py-4">
                                        Max (min)
                                    </TableHead>
                                    <TableHead className="text-white font-bold text-center border-r border-blue-400 py-4">
                                        Mic .wav
                                    </TableHead>
                                    <TableHead className="text-white font-bold text-center py-4">
                                        Sys .wav
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {volunteer.sessionDetails.length > 0 ? (
                                    volunteer.sessionDetails.map((session, index) => (
                                        <TableRow
                                            key={session.sessionNumber}
                                            className={`border-b border-gray-200 transition-colors ${index % 2 === 0
                                                    ? "bg-white hover:bg-blue-50"
                                                    : "bg-gray-50 hover:bg-blue-50"
                                                }`}
                                        >
                                            <TableCell className="text-center border-r border-gray-200 font-semibold text-gray-900 py-3">
                                                {session.sessionNumber}
                                            </TableCell>
                                            <TableCell className="text-center border-r border-gray-200 font-medium text-gray-700 py-3">
                                                {session.startTime}
                                            </TableCell>
                                            <TableCell className="text-center border-r border-gray-200 font-medium text-gray-700 py-3">
                                                {session.endTime}
                                            </TableCell>
                                            <TableCell className="text-center border-r border-gray-200 font-medium text-gray-700 py-3">
                                                {session.breakDuration}
                                            </TableCell>
                                            <TableCell className="text-center border-r border-gray-200 font-medium text-gray-700 py-3">
                                                {session.micDuration.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-center border-r border-gray-200 font-medium text-gray-700 py-3">
                                                {session.sysDuration.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-center border-r border-gray-200 font-medium text-gray-700 py-3">
                                                {session.maxDuration.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-center border-r border-gray-200 py-3">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${session.micWav === "Y"
                                                        ? "bg-green-100 text-green-700 border-2 border-green-300"
                                                        : "bg-red-100 text-red-700 border-2 border-red-300"
                                                    }`}>
                                                    {session.micWav}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center py-3">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${session.sysWav === "Y"
                                                        ? "bg-green-100 text-green-700 border-2 border-green-300"
                                                        : "bg-red-100 text-red-700 border-2 border-red-300"
                                                    }`}>
                                                    {session.sysWav}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center h-32 bg-gray-50">
                                            <div className="flex flex-col items-center gap-3">
                                                <FileText className="h-12 w-12 text-gray-400" />
                                                <p className="font-semibold text-gray-600">No session details available.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
