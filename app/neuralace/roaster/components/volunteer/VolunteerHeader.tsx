import { useState, useCallback, useMemo } from "react";
import { Search, Download, Upload, Filter, X } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import VolunteerFilters from "./VolunteerFilters";
import VolunteerImportDialog from "./VolunteerImportDialog";
import { Button } from "@/components/ui/button";

interface Volunteer {
  id: number;
  name: string;
  preferredShift?: string;
  weekOffDays: string[];
}

interface VolunteerHeaderProps {
  onFilterChange: (vols: Volunteer[]) => void;
}

interface FilterState {
  searchTerm: string;
  shiftFilter: string;
  weekOffFilter: string;
}

export default function VolunteerHeader({
  onFilterChange,
}: VolunteerHeaderProps) {
  const { volunteers, bulkAddVolunteers } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [weekOffFilter, setWeekOffFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Memoized filter state to prevent unnecessary recalculations
  const currentFilters = useMemo(
    () => ({ searchTerm, shiftFilter, weekOffFilter }),
    [searchTerm, shiftFilter, weekOffFilter]
  );

  const hasActiveFilters = useMemo(
    () => searchTerm !== "" || shiftFilter !== "all" || weekOffFilter !== "all",
    [searchTerm, shiftFilter, weekOffFilter]
  );

  // Optimized filter handlers with useCallback
  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      // Merge current filters with updates
      const newFilters = { ...currentFilters, ...updates };

      const filteredVolunteers = volunteers.filter((volunteer) => {
        const matchesSearch =
          volunteer.name
            .toLowerCase()
            .includes(newFilters.searchTerm.toLowerCase()) ||
          (volunteer.preferredShift
            ?.toLowerCase()
            .includes(newFilters.searchTerm.toLowerCase()) ??
            false);

        const matchesShift =
          newFilters.shiftFilter === "all" ||
          volunteer.preferredShift === newFilters.shiftFilter;

        const matchesWeekOff =
          newFilters.weekOffFilter === "all" ||
          volunteer.weekOffDays?.includes(newFilters.weekOffFilter);
        console.log(matchesSearch, matchesShift, matchesWeekOff);
        return matchesSearch && matchesShift && matchesWeekOff;
      });

      // Trigger the prop function with filtered results
      onFilterChange(filteredVolunteers);
    },
    [currentFilters, volunteers, onFilterChange]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      updateFilters({ searchTerm: value });
    },
    [updateFilters]
  );

  const handleShiftFilterChange = useCallback(
    (value: string) => {
      setShiftFilter(value);
      updateFilters({ shiftFilter: value });
    },
    [updateFilters]
  );

  const handleWeekOffFilterChange = useCallback(
    (value: string) => {
      setWeekOffFilter(value);
      updateFilters({ weekOffFilter: value });
    },
    [updateFilters]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setShiftFilter("all");
    setWeekOffFilter("all");
    updateFilters({
      searchTerm: "",
      shiftFilter: "all",
      weekOffFilter: "all",
    });
  }, [updateFilters]);

  const clearSingleFilter = useCallback(
    (type: keyof FilterState) => {
      switch (type) {
        case "searchTerm":
          handleSearchChange("");
          break;
        case "shiftFilter":
          handleShiftFilterChange("all");
          break;
        case "weekOffFilter":
          handleWeekOffFilterChange("all");
          break;
      }
    },
    [handleSearchChange, handleShiftFilterChange, handleWeekOffFilterChange]
  );

  const handleImportCSV = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const validTypes = [".csv", ".xlsx"];
      const fileExtension = file.name
        .slice(file.name.lastIndexOf("."))
        .toLowerCase();

      if (!validTypes.includes(fileExtension)) {
        alert("Please select a valid CSV or Excel file");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split("\n").filter((line) => line.trim());

          if (lines.length === 0) {
            throw new Error("File is empty");
          }

          const hasHeader = lines[0].toLowerCase().includes("name");
          const dataLines = hasHeader ? lines.slice(1) : lines;

          const importedVolunteers: Volunteer[] = dataLines
            .map((line, index) => {
              const [name, preferredShift, weekOffDays] = line
                .split(",")
                .map((item) => item.trim());

              if (!name) {
                console.warn(`Skipping row ${index + 1}: Missing name`);
                return null;
              }

              return {
                id: Date.now() + Math.random() + index,
                name,
                preferredShift: preferredShift || "",
                weekOffDays: weekOffDays
                  ? weekOffDays.split("/").filter((d) => d.trim())
                  : [],
              };
            })
            .filter(
              (volunteer): volunteer is NonNullable<typeof volunteer> =>
                volunteer !== null
            ) as Volunteer[];

          if (importedVolunteers.length === 0) {
            throw new Error("No valid volunteer data found in file");
          }

          bulkAddVolunteers(importedVolunteers);
        } catch (error) {
          console.error("Error processing file:", error);
          alert(
            `Error importing file: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      };

      reader.onerror = () => {
        alert("Error reading file");
      };

      reader.readAsText(file);
      e.target.value = "";
    },
    [bulkAddVolunteers]
  );

  const handleExportCSV = useCallback(() => {
    if (volunteers.length === 0) {
      alert("No volunteers to export");
      return;
    }

    try {
      const header = "Name,Preferred Shift,Week Off Days\n";
      const data = volunteers
        .map(
          (v) =>
            `"${v.name.replace(/"/g, '""')}",${
              v.preferredShift || ""
            },"${v.weekOffDays.join("/")}"`
        )
        .join("\n");

      const blob = new Blob([header + data], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `volunteers_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error exporting data");
    }
  }, [volunteers]);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="p-6 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search volunteers by name..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <VolunteerFilters
              searchTerm={searchTerm}
              shiftFilter={shiftFilter}
              weekOffFilter={weekOffFilter}
              onShiftFilterChange={handleShiftFilterChange}
              onWeekOffFilterChange={handleWeekOffFilterChange}
              onClearFilter={clearSingleFilter}
              onClearAll={clearFilters}
            />
            {/* <label className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium cursor-pointer hover:bg-green-100 transition-all">
              <Upload className="w-4 h-4" />
              Import CSV
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleImportCSV}
                className="hidden"
              />
            </label> */}
            <VolunteerImportDialog />
            <Button
              onClick={handleExportCSV}
              disabled={volunteers.length === 0}
              size={"lg"}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-medium hover:bg-purple-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
    </div>
  );
}
