"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Filter, X } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Button } from "@/components/ui/button";

interface Volunteer {
  id: number;
  name: string;
  preferredShift?: string;
  weekOffDays?: string[];
}

interface FilterState {
  searchTerm: string;
  shiftFilter: string;
  weekOffFilter: string;
}

interface VolunteerFiltersProps {
  searchTerm: string;
  shiftFilter: string;
  weekOffFilter: string;
  onShiftFilterChange: (value: string) => void;
  onWeekOffFilterChange: (value: string) => void;
  onClearFilter: (type: keyof FilterState) => void;
  onClearAll: () => void;
}

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export default function VolunteerFilters({
  searchTerm,
  shiftFilter,
  weekOffFilter,
  onShiftFilterChange,
  onWeekOffFilterChange,
  onClearFilter,
  onClearAll,
}: VolunteerFiltersProps) {
    const { shifts } = useAppContext();

  const activeFilterCount = useMemo(() => {
    return [
      searchTerm !== "",
      shiftFilter !== "all",
      weekOffFilter !== "all",
    ].filter(Boolean).length;
  }, [searchTerm, shiftFilter, weekOffFilter]);

  return (
    <DropdownMenu>
      {/* Trigger Button */}
      <DropdownMenuTrigger asChild>
        <Button
          size={"lg"}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeFilterCount > 0
              ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
              : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent className="w-72 p-4">
        {/* Search Input */}

        {/* Shift Filter */}
        <div className="mb-3">
          <DropdownMenuLabel className="text-gray-700 text-sm mb-1">
            Filter by Shift
          </DropdownMenuLabel>
          <select
            value={shiftFilter}
            onChange={(e) => onShiftFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Shifts</option>
            {shifts.map((shift) => (
              <option key={shift.name} value={shift.name}>
                {shift.name} ({shift.startTime} - {shift.endTime})
              </option>
            ))}
          </select>
        </div>

        {/* Week Off Filter */}
        <div className="mb-3">
          <DropdownMenuLabel className="text-gray-700 text-sm mb-1">
            Filter by Week Off
          </DropdownMenuLabel>
          <select
            value={weekOffFilter}
            onChange={(e) => onWeekOffFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Days</option>
            {WEEK_DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <DropdownMenuSeparator />

        {/* Active Filters */}
        {(searchTerm || shiftFilter !== "all" || weekOffFilter !== "all") && (
          <div className="flex flex-wrap gap-2 mt-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm">
                Search: <strong>{searchTerm}</strong>
                <button
                  onClick={() => onClearFilter("searchTerm")}
                  className="ml-1 hover:text-gray-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {shiftFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm">
                Shift: <strong>{shiftFilter}</strong>
                <button
                  onClick={() => onClearFilter("shiftFilter")}
                  className="ml-1 hover:text-gray-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {weekOffFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm">
                Week Off: <strong>{weekOffFilter}</strong>
                <button
                  onClick={() => onClearFilter("weekOffFilter")}
                  className="ml-1 hover:text-gray-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm hover:bg-red-100 transition-colors"
            >
              <X className="w-3 h-3" /> Clear All
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
