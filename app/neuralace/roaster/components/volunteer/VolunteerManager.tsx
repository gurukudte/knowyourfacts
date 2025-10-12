"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Upload,
  Download,
  Trash2,
  Edit,
  Search,
  X,
  Calendar,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { VolunteerForm, Volunteer, Shift } from "./VolunteerForm";
import { VolunteerDialog } from "./VolunteerDialog";
import { Button } from "@/components/ui/button";
import { set } from "mongoose";
import VolunteerHeader from "./VolunteerHeader";

export default function VolunteerManager() {
  const {
    volunteers,
    addVolunteer,
    removeVolunteer,
    bulkAddVolunteers,
    shifts,
    updateVolunteer,
  } = useAppContext();

  const [newVolunteer, setNewVolunteer] = useState<Omit<Volunteer, "id">>({
    name: "",
    preferredShift: "",
    weekOffDays: [],
  });

  const [dialog, setDialog] = useState<"add" | "edit" | "delete" | null>(null);

  const [bulkInput, setBulkInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [availableShifts, setAvailableShifts] = useState<Shift[]>([]);

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Update available shifts when shifts context changes
  useEffect(() => {
    setAvailableShifts(shifts || []);
  }, [shifts]);

  // Filter volunteers based on search and filters
  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesSearch =
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (volunteer.preferredShift
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false);

    const matchesShift =
      shiftFilter === "all" || volunteer.preferredShift === shiftFilter;

    return matchesSearch && matchesShift;
  });

  const cancelEdit = () => {
    setEditingId(null);
    setNewVolunteer({ name: "", preferredShift: "", weekOffDays: [] });
  };

  const handleAddVolunteer = (volunteer: Omit<Volunteer, "id">) => {
    if (!volunteer.name.trim()) return;

    if (editingId !== null) {
      updateVolunteer(editingId, volunteer);
      setEditingId(null);
    } else {
      addVolunteer(volunteer);
    }

    setNewVolunteer({ name: "", preferredShift: "", weekOffDays: [] });
  };

  const handleBulkImport = () => {
    const lines = bulkInput.split("\n").filter((line) => line.trim());
    const newVolunteers: Volunteer[] = lines.map((line) => {
      const [name, preferredShift, weekOffDays] = line
        .split(",")
        .map((item) => item.trim());
      return {
        id: Date.now() + Math.random(),
        name: name || "",
        preferredShift: preferredShift || "",
        weekOffDays: weekOffDays ? weekOffDays.split("/") : [],
      };
    });

    bulkAddVolunteers(newVolunteers);
    setBulkInput("");
    setShowBulkImport(false);
  };

  const exportVolunteers = () => {
    const data = volunteers
      .map((v) => `${v.name},${v.preferredShift},${v.weekOffDays.join("/")}`)
      .join("\n");
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "volunteers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getShiftDetails = (shiftName?: string) =>
    availableShifts.find((shift) => shift.name === shiftName);

  const editingVolunteer = useMemo(() => {
    const editingVolunteer = volunteers.find((v) => v.id === editingId);
    return editingVolunteer ? editingVolunteer : undefined;
  }, [volunteers,editingId]);

  const handleAddOrEdit = (
    volunteer: Omit<Volunteer, "id">,
    editingId?: number | null
  ) => {
    if (editingId != null) {
      updateVolunteer(editingId, volunteer);
    } else {
      addVolunteer(volunteer);
    }
  };

  const handleDelete = (id: number) => {
    removeVolunteer(id);
  };
  // console.log(dialog, editingId, volunteers);
  // console.log(editingVolunteer?.name);
  return (
    <>
      <div className="bg-white flex flex-col gap-4  rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Volunteers ({filteredVolunteers.length})
            </h2>
            <Button
              variant="default"
              className="flex items-center gap-2"
              onClick={() => setDialog("add")}
            >
              <Plus className="w-4 h-4" />
              {"Add Volunteer"}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Name
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Preferred Shift
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Timing
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Week Off Days
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVolunteers.map((volunteer) => {
                const shiftDetails = getShiftDetails(volunteer.preferredShift);
                return (
                  <tr
                    key={volunteer.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {volunteer.name}
                    </td>
                    <td className="py-4 px-6">
                      {volunteer.preferredShift ? (
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: "#6B7280" }}
                          />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {volunteer.preferredShift}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {shiftDetails
                        ? `${shiftDetails.startTime} - ${shiftDetails.endTime}`
                        : "-"}
                    </td>
                    <td className="py-4 px-6">
                      {volunteer.weekOffDays.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {volunteer.weekOffDays.map((day) => (
                            <span
                              key={day}
                              className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full"
                            >
                              {day.substring(0, 3)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No week off
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setDialog("edit");
                            setEditingId(volunteer.id);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDialog("delete");
                            setEditingId(volunteer.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredVolunteers.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-lg font-medium">
                No volunteers found
              </p>
              <p className="text-gray-400 mt-1">
                {volunteers.length === 0
                  ? "Get started by adding your first volunteer"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          )}
        </div>
      </div>
      {dialog && (
        <VolunteerDialog
          dialogType={dialog}
          onSubmit={handleAddOrEdit}
          volunteer={dialog !== "add" ? editingVolunteer : undefined}
          onClose={() => setDialog(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
