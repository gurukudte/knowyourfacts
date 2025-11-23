"use client";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar, Download } from "lucide-react";
import { useAppContext } from "@/app/neuralace/roaster/context/AppContext";
import { Input } from "@/components/ui/input";

export default function RosterGenerator() {
  const { volunteers, shifts, generateRoster } = useAppContext();
  const [startDate, setStartDate] = useState(new Date());
  const [daysToGenerate, setDaysToGenerate] = useState(7);
  const [generatedRoster, setGeneratedRoster] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalVolunteersPerShift, setTotalVolunteersPerShift] = useState(4);

  const scrollableRef = useRef(null);

  // Function to split volunteers equally based on preferred shifts
  const splitVolunteersByShift = (volunteers, shifts, targetCount) => {
    const shiftGroups = {};

    // Initialize shift groups
    shifts.forEach((shift) => {
      shiftGroups[shift.name] = {
        volunteers: [],
        capacity: 0,
      };
    });

    // Assign volunteers strictly to their preferred shift
    volunteers.forEach((volunteer) => {
      const preferred = volunteer.preferredShift;
      if (preferred && shiftGroups[preferred]) {
        shiftGroups[preferred].volunteers.push(volunteer);
      }
    });

    // Handle case where no one prefers any shift
    const allEmpty = Object.values(shiftGroups).every(
      (group) => group.volunteers.length === 0
    );

    if (allEmpty) {
      // If no preferences exist, distribute volunteers equally
      const volunteersPerShift = Math.ceil(volunteers.length / shifts.length);
      let index = 0;
      shifts.forEach((shift) => {
        shiftGroups[shift.name].volunteers = volunteers.slice(
          index,
          index + volunteersPerShift
        );
        index += volunteersPerShift;
      });
    }

    // Calculate total preferred volunteers
    const totalPreferred = Object.values(shiftGroups).reduce(
      (sum, group) => sum + group.volunteers.length,
      0
    );

    // Assign shift capacities based on proportion of preferred volunteers
    Object.keys(shiftGroups).forEach((shiftName) => {
      const group = shiftGroups[shiftName];
      if (totalPreferred > 0) {
        group.capacity = Math.max(
          1,
          Math.round((group.volunteers.length / totalPreferred) * targetCount)
        );
      } else {
        // If no preferred volunteers, distribute equally
        group.capacity = Math.max(1, Math.floor(targetCount / shifts.length));
      }
    });

    // Adjust total capacities to match targetCount exactly (without violating ratios too much)
    const totalCapacity = Object.values(shiftGroups).reduce(
      (sum, group) => sum + group.capacity,
      0
    );

    let diff = targetCount - totalCapacity;
    const shiftNames = Object.keys(shiftGroups);
    let i = 0;

    while (diff !== 0) {
      const shiftName = shiftNames[i % shiftNames.length];
      if (diff > 0) {
        shiftGroups[shiftName].capacity++;
        diff--;
      } else if (diff < 0 && shiftGroups[shiftName].capacity > 1) {
        shiftGroups[shiftName].capacity--;
        diff++;
      }
      i++;
    }

    return shiftGroups;
  };

  // Function to check if volunteer is available on a specific day
  const isVolunteerAvailable = (volunteer, date) => {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return !volunteer.weekOffDays?.includes(dayName);
  };

  // Generate roster respecting preferred shifts
  const handleGenerateRoster = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const roster = [];
      const totalVolunteersPerDay = Math.min(
        volunteers.length,
        totalVolunteersPerShift * shifts.length
      );

      // Get shift-based volunteer distribution
      const shiftDistribution = splitVolunteersByShift(
        volunteers,
        shifts,
        totalVolunteersPerDay
      );

      for (let i = 0; i < daysToGenerate; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const dayRoster = {
          date: new Date(currentDate),
          dayName: currentDate.toLocaleDateString("en-US", { weekday: "long" }),
          dateString: currentDate.toLocaleDateString(),
          shifts: {},
        };

        Object.keys(shiftDistribution).forEach((shiftName) => {
          const shiftGroup = shiftDistribution[shiftName];
          const availableVolunteers = shiftGroup.volunteers.filter((v) =>
            isVolunteerAvailable(v, currentDate)
          );
          console.log(
            `Date: ${dayRoster.dateString}, Shift: ${shiftName}, Capacity: ${shiftGroup.capacity}, Available Volunteers: ${availableVolunteers.length}`
          );

          // Select volunteers for this shift based on preference and capacity
          let selectedVolunteers = [];
          const needed = shiftGroup.capacity;

          if (availableVolunteers.length >= needed) {
            selectedVolunteers = [...availableVolunteers]
              .sort(() => Math.random() - 0.5)
              .slice(0, needed);
          } else {
            selectedVolunteers = [...availableVolunteers];
            const remaining = needed - availableVolunteers.length;

            // if (remaining > 0) {
            //     const otherVolunteers = volunteers
            //       .filter(
            //         (v) =>
            //           v.preferredShift === shiftName &&
            //           isVolunteerAvailable(v, currentDate) &&
            //           !selectedVolunteers.includes(v)
            //       )
            //       .sort(() => Math.random() - 0.5)
            //       .slice(0, remaining);
            // }
            // Pull from other volunteers (balanced fallback)
            // if (remaining > 0) {
            //   const otherVolunteers = volunteers
            //     .filter(
            //       (v) =>
            //         v.preferredShift !== shiftName &&
            //         isVolunteerAvailable(v, currentDate) &&
            //         !selectedVolunteers.includes(v)
            //     )
            //     .sort(() => Math.random() - 0.5)
            //     .slice(0, remaining);

            //   selectedVolunteers.push(...otherVolunteers);
            // }
          }

          dayRoster.shifts[shiftName] = {
            volunteers: selectedVolunteers,
            color: shifts.find((s) => s.name === shiftName)?.color || "#6B7280",
          };
        });
        roster.push(dayRoster);
      }
      // console.log(roster);
      setGeneratedRoster(roster);
      setIsGenerating(false);
    }, 400);
  };

  // Scroll functions
  const scrollHorizontal = (direction) => {
    if (scrollableRef.current) {
      const scrollAmount = 300;
      scrollableRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  // Export roster
  const exportRoster = () => {
    const data = generatedRoster
      .map((day) => {
        const shiftsData = Object.entries(day.shifts)
          .map(
            ([shiftName, shift]) =>
              `${shiftName}: ${shift.volunteers.map((v) => v.name).join(", ")}`
          )
          .join(" | ");

        return `${day.date.toDateString()}: ${shiftsData}`;
      })
      .join("\n");

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roster-${startDate.toDateString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get unique shift names
  const uniqueShifts = [...new Set(shifts.map((shift) => shift.name))];

  return (
    <div className="bg-gray-50/30 py-2">
      <div className="w-full">
        {/* Controls Card - Moved to Top */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Volunteers per shift
              </label>
              <Input
                value={totalVolunteersPerShift}
                placeholder="Enter volunteer count"
                onChange={(e) => setTotalVolunteersPerShift(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Days
              </label>
              <select
                value={daysToGenerate}
                onChange={(e) => setDaysToGenerate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value={7}>7 Days</option>
                <option value={14}>14 Days</option>
                <option value={30}>30 Days</option>
              </select>
            </div>

            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  &nbsp;
                </label>
                <button
                  onClick={handleGenerateRoster}
                  disabled={isGenerating || volunteers.length === 0}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate Roster"}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  &nbsp;
                </label>
                <button
                  onClick={exportRoster}
                  disabled={generatedRoster.length === 0}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Roster
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {volunteers.length}
              </div>
              <div className="text-sm text-gray-600">Total Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-md font-bold text-gray-900">
                {shifts.length}
              </div>
              <div className="text-sm text-gray-600">Available Shifts</div>
            </div>
            <div className="text-center">
              <div className="text-md font-bold text-gray-900">
                {daysToGenerate}
              </div>
              <div className="text-sm text-gray-600">Roster Days</div>
            </div>
          </div>
        </div>

        {/* Roster Display */}
        <div className="flex w-full">
          {generatedRoster.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
              {/* Table Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-md font-semibold text-gray-900">
                  Roster Schedule
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {volunteers.length} volunteers across {uniqueShifts.length}{" "}
                    shifts
                  </span>
                </div>
              </div>

              {/* Roster Table Container */}
              <div className="relative w-full">
                {/* Scroll Buttons */}
                <button
                  onClick={() => scrollHorizontal(-1)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollHorizontal(1)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Table */}
                <div
                  ref={scrollableRef}
                  className=" overflow-scroll max-h-[480px]"
                  style={{ scrollBehavior: "smooth" }}
                >
                  <table className="w-full flex flex-col border-collapse">
                    <thead className="sticky top-0 z-30">
                      <tr>
                        {/* Fixed Volunteer Names Column Header */}
                        <th className="sticky left-0 z-30 bg-gray-100 border-r border-b border-gray-300 p-0">
                          <div className="min-w-[220px] p-4 text-left font-semibold text-gray-900">
                            Volunteer / Shift
                          </div>
                        </th>

                        {/* Scrollable Dates Header */}
                        {generatedRoster.map((day, index) => (
                          <th
                            key={index}
                            className="border-b border-gray-300 p-0 bg-gray-100"
                            style={{ minWidth: "180px" }}
                          >
                            <div className="p-4 text-center">
                              <div className="font-semibold text-gray-900 text-sm">
                                {day.dayName}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                {day.dateString}
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Volunteers Rows - Each volunteer gets their own row */}
                      {volunteers.map((volunteer) => (
                        <tr
                          key={volunteer.id}
                          className="group hover:bg-gray-50/50"
                        >
                          {/* Fixed Volunteer Name */}
                          <td className="sticky left-0 z-20 bg-white border-r border-gray-200 p-0 group-hover:bg-gray-50">
                            <div className="min-w-[220px] p-4 font-medium text-gray-900 flex items-center justify-between">
                              <span>{volunteer.name}</span>
                              {volunteer.preferredShift && (
                                <span
                                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                                  title={`Preferred: ${volunteer.preferredShift}`}
                                >
                                  {volunteer.preferredShift}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Scrollable Daily Assignments */}
                          {generatedRoster.map((day, dayIndex) => {
                            const dayName = day.dayName;
                            const isWeekOff =
                              volunteer.weekOffDays.includes(dayName);

                            // Find which shift this volunteer is assigned to on this day
                            let assignedShift = null;
                            Object.entries(day.shifts).forEach(
                              ([shiftName, shiftData]) => {
                                if (
                                  shiftData.volunteers.some(
                                    (v) => v.id === volunteer.id
                                  )
                                ) {
                                  assignedShift = {
                                    name: shiftName,
                                    color: shiftData.color,
                                  };
                                }
                              }
                            );

                            return (
                              <td
                                key={dayIndex}
                                className="border-b border-gray-200 p-0"
                              >
                                <div
                                  className="min-h-[80px] p-3 min-w-[180px] flex flex-col justify-center"
                                  style={{
                                    backgroundColor: isWeekOff
                                      ? "#fef2f2"
                                      : assignedShift
                                      ? `${assignedShift.color}08`
                                      : "transparent",
                                  }}
                                >
                                  {isWeekOff ? (
                                    <div className="text-center">
                                      <div className="text-xs text-red-600 font-medium">
                                        Week Off
                                      </div>
                                      <div className="text-xs text-red-500 mt-1">
                                        Not Available
                                      </div>
                                    </div>
                                  ) : assignedShift ? (
                                    <div className="text-center">
                                      <div
                                        className="text-sm font-medium text-gray-900 mb-1"
                                        style={{ color: assignedShift.color }}
                                      >
                                        {assignedShift.name}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        Assigned
                                        {volunteer.preferredShift ===
                                          assignedShift.name && (
                                          <span
                                            className="text-blue-600 ml-1"
                                            title="Preferred shift"
                                          >
                                            ★
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <div className="text-xs text-gray-400 italic">
                                        Not Assigned
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        Available
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}

                      {/* Shifts Summary Row */}
                      <tr className="bg-gray-50">
                        <td className="sticky left-0 z-20 bg-gray-100 border-r border-t border-gray-300 p-0">
                          <div className="min-w-[200px] p-4 font-semibold text-gray-900">
                            Shift Summary
                          </div>
                        </td>

                        {generatedRoster.map((day, dayIndex) => (
                          <td
                            key={dayIndex}
                            className="border-t border-gray-300 p-0"
                          >
                            <div className="min-h-[60px] p-3 min-w-[180px]">
                              <div className="space-y-1">
                                {Object.entries(day.shifts).map(
                                  ([shiftName, shiftData]) => (
                                    <div
                                      key={shiftName}
                                      className="flex items-center justify-between text-xs"
                                    >
                                      <span
                                        className="font-medium"
                                        style={{ color: shiftData.color }}
                                      >
                                        {shiftName}:
                                      </span>
                                      <span className="text-gray-600">
                                        {shiftData.volunteers.length} vols
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className=" w-full min-h-[530px] bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Roster Generated Yet
              </h3>
              <p className="text-gray -500 mb-6 max-w-md mx-auto">
                Configure your settings above and generate a roster to see the
                volunteer schedule displayed here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
