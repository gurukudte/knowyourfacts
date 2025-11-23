import { useState, useMemo, useEffect, useCallback } from "react";
import { Volunteer, SessionDetail } from "../types";
import { fetchAnalyticsData } from "@/store/analyticsSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hooks";

export function useVolunteers() {
    const dispatch = useAppDispatch();
    const { data: analyticsData, loading } = useSelector((state: RootState) => state.analytics);

    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [liveVolunteers, setLiveVolunteers] = useState<Volunteer[]>([]);
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        field: keyof Volunteer;
        order: "asc" | "desc";
    }>({ field: "name", order: "asc" });

    const refresh = useCallback(() => {
        dispatch(fetchAnalyticsData());
    }, [dispatch]);

    useEffect(() => {
        refresh();
        const intervalId = setInterval(refresh, 5 * 60 * 1000); // 5 minutes
        return () => clearInterval(intervalId);
    }, [refresh]);

    useEffect(() => {
        if (analyticsData && analyticsData.length > 0) {
            const mappedVolunteers: Volunteer[] = analyticsData.map((summary) => {
                // Use createdAt or updatedAt for reliable date parsing (ISO format)
                // summary.createdAt is a DateTime string (e.g., "2025-11-22T10:00:00.000Z")
                const dateObj = new Date(summary.createdAt);
                const dateStr = dateObj.toISOString().split('T')[0]; // "2025-11-22"
                
                const sessionDetails: SessionDetail[] = summary.sessions.map((session) => ({
                    sessionNumber: session.sessionNumber,
                    startTime: session.startTime,
                    endTime: session.endTime,
                    breakDuration: session.breakDuration,
                    micDuration: session.micDurationMin,
                    sysDuration: session.sysDurationMin,
                    maxDuration: session.maxDurationMin,
                    micWav: session.micWav as "Y" | "N",
                    sysWav: session.sysWav as "Y" | "N",
                    date: dateStr, 
                }));

                // Calculate total hours from sessions if not provided directly or if needed
                // summary.totalRecordingTime is string "HH:MM:SS", we might need to parse it if we want number
                // But Volunteer type expects number for hours. 
                
                const parseDuration = (timeStr: string): number => {
                    if (!timeStr) return 0;
                    
                    try {
                        // Check if format is "X.XXhrs (Xmins)" or "X.XXhrs"
                        if (timeStr.includes('hrs')) {
                            const hoursMatch = timeStr.match(/([\d.]+)hrs/);
                            if (hoursMatch && hoursMatch[1]) {
                                return parseFloat(hoursMatch[1]);
                            }
                        }
                        
                        // Otherwise try time format parsing
                        const parts = timeStr.split(':').map(Number);
                        if (parts.some(isNaN)) return 0;

                        if (parts.length === 3) {
                            // HH:MM:SS format
                            return parts[0] + parts[1] / 60 + parts[2] / 3600;
                        } else if (parts.length === 2) {
                            // MM:SS format (minutes:seconds) - convert to hours
                            return parts[0] / 60 + parts[1] / 3600;
                        }
                        return 0;
                    } catch (e) {
                        return 0;
                    }
                };

                const totalHours = parseDuration(summary.totalRecordingTime);

                return {
                    empId: summary.name, // Using Name as empId as per plan
                    name: summary.name,
                    phone: summary.phone,
                    email: summary.email,
                    sessions: summary.totalSessions,
                    hours: parseFloat(totalHours.toFixed(2)),
                    status: "Offline", // Default status, maybe update based on last active?
                    lastActive: summary.updatedAt,
                    sessionDetails: sessionDetails,
                };
            });
            setVolunteers(mappedVolunteers);
        }
    }, [analyticsData]);

    const handleDateChange = (date: string) => {
        setDateFilter(date);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleSort = (field: keyof Volunteer) => {
        setSortConfig((prev) => ({
            field,
            order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
        }));
        
        // Sort both lists
        const sortList = (list: Volunteer[]) => {
            return [...list].sort((a, b) => {
                // Determine the current sort order based on the previous state for consistent toggling
                const currentOrder = sortConfig.field === field && sortConfig.order === "asc" ? "desc" : "asc";

                const aValue = a[field];
                const bValue = b[field];

                if (aValue === undefined || bValue === undefined) return 0;
                if (typeof aValue === 'object' || typeof bValue === 'object') return 0; // Skip sorting for complex types like arrays/objects

                if (aValue < bValue) return currentOrder === "asc" ? -1 : 1;
                if (aValue > bValue) return currentOrder === "asc" ? 1 : -1;
                return 0;
            });
        };
        
        setVolunteers(sortList(volunteers));
        setLiveVolunteers(sortList(liveVolunteers));
    };

    // Filter logic for main volunteers list (Analytics)
    const filteredVolunteers = useMemo(() => {
        return volunteers.filter((volunteer) => {
            // 1. Search Filter
            const matchesSearch =
                volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                volunteer.empId.toLowerCase().includes(searchQuery.toLowerCase());
            
            // 2. Date Filter (Check if they have sessions on the selected date)
            // If no date selected, show all. If date selected, show only if they have activity.
            // Note: summary.date format in DB might be different from date input. 
            // Assuming YYYY-MM-DD for now as per JSON payload example "231125" -> 2023-11-25? 
            // Wait, "231125" is YYMMDD. We might need to handle date formatting.
            // For now, let's assume exact match or simple string match.
            // Actually, the example payload has "Date": "231125". 
            // The dateFilter from input is YYYY-MM-DD.
            // We might need to normalize.
            
            const matchesDate = dateFilter 
                ? volunteer.sessionDetails.some(s => s.date === dateFilter)
                : true;

            return matchesSearch && matchesDate;
        });
    }, [volunteers, searchQuery, dateFilter]);

    return {
        volunteers: filteredVolunteers,
        liveVolunteers, // Return the live dataset (unfiltered by date/search as it has its own table logic)
        dateFilter,
        searchQuery,
        sortConfig,
        loading,
        refresh,
        handleDateChange,
        handleSearchChange,
        handleSort,
    };
}
