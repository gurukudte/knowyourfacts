"use client";
import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { useAppContext } from "../../context/AppContext";


export const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export interface Shift {
  id: number;
  name: string;
  startTime?: string;
  endTime?: string;
}

export interface Volunteer {
  id: number;
  name: string;
  preferredShift?: string;
  weekOffDays: string[];
}

interface VolunteerFormProps {
  /** Currently available shifts to choose from */
  availableShifts: Shift[];
  /** Optional existing volunteer ID if editing */
  editingId?: number | null;
  /** Existing volunteer data to prefill */
  volunteer?: Volunteer | undefined;
}

export const VolunteerForm: React.FC<VolunteerFormProps> = ({
  availableShifts,
  editingId = null,
  volunteer,
}) => {
  const [newVolunteer, setNewVolunteer] = useState<Omit<Volunteer, "id">>({
    name: "",
    preferredShift: "",
    weekOffDays: [],
  });
  const {addVolunteer,updateVolunteer} = useAppContext()

  // Prefill if editing
  useEffect(() => {
    if (volunteer) {
      setNewVolunteer(volunteer);
    }
  }, [volunteer]);

  const toggleWeekOffDay = (day: string) => {
    setNewVolunteer((prev) => ({
      ...prev,
      weekOffDays: prev.weekOffDays.includes(day)
        ? prev.weekOffDays.filter((d) => d !== day)
        : [...prev.weekOffDays, day],
    }));
  };

  const handleAddVolunteer = () => {
    if (!newVolunteer.name.trim()) return;
        editingId
      ? updateVolunteer(editingId, newVolunteer)
      : addVolunteer(newVolunteer);
    
    // Clear form if adding new
    if (!editingId) {
      setNewVolunteer({ name: "", preferredShift: "", weekOffDays: [] });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Form */}
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="Enter volunteer name"
            value={newVolunteer.name}
            onChange={(e) =>
              setNewVolunteer({ ...newVolunteer, name: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Shift Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Shift
          </label>
          <select
            value={newVolunteer.preferredShift}
            onChange={(e) =>
              setNewVolunteer({
                ...newVolunteer,
                preferredShift: e.target.value,
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select a shift</option>
            {availableShifts.map((shift) => (
              <option key={shift.id} value={shift.name}>
                {shift.name} ({shift.startTime} - {shift.endTime})
              </option>
            ))}
          </select>
          {availableShifts.length === 0 && (
            <p className="text-sm text-amber-600 mt-2">
              No shifts available. Please create shifts in Shift Manager first.
            </p>
          )}
        </div>

        {/* Week Off Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Week Off Days
          </label>
          <div className="grid grid-cols-2 gap-2">
            {weekDays.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleWeekOffDay(day)}
                className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                  newVolunteer.weekOffDays.includes(day)
                    ? "bg-red-50 text-red-700 border-red-200 shadow-sm"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleAddVolunteer}
          disabled={!newVolunteer.name.trim()}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          {editingId ? "Update Volunteer" : "Add Volunteer"}
        </button>
      </div>
    </div>
  );
};
