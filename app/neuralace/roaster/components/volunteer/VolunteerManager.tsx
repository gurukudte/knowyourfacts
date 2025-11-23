"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Edit, Search } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Volunteer, Shift } from "./VolunteerForm";
import { VolunteerDialog } from "./VolunteerDialog";
import { Button } from "@/components/ui/button";
import VolunteerHeader from "./VolunteerHeader";

export default function VolunteerManager() {
  const {
    volunteers,
    addVolunteer,
    removeVolunteer,
    bulkRemoveVolunteer,
    shifts,
    updateVolunteer,
  } = useAppContext();
  const [dialog, setDialog] = useState<
    "add" | "edit" | "delete" | "multi-delete" | null
  >(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [availableShifts, setAvailableShifts] = useState<Shift[]>([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleFilteredResults = (vols: Volunteer[]) => {
    setFilteredVolunteers(vols);
    setSelectedIds([]); // clear selection when filter changes
  };

  const getShiftDetails = (shiftName?: string) =>
    availableShifts.find((shift) => shift.name === shiftName);

  const editingVolunteer = useMemo(() => {
    return volunteers.find((v) => v.id === editingId);
  }, [volunteers, editingId]);

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

  const handleMultiDelete = () => {
    bulkRemoveVolunteer(selectedIds);
    setSelectedIds([]);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredVolunteers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVolunteers.map((v) => v.id));
    }
  };

  useEffect(() => {
    setAvailableShifts(shifts || []);
    setFilteredVolunteers(volunteers);
  }, [shifts, volunteers]);

  return (
    <>
      <div className="bg-white flex flex-col gap-4 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">
                Volunteers ({filteredVolunteers.length})
              </h2>
              {selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={() => setDialog("multi-delete")}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedIds.length})
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <VolunteerHeader onFilterChange={handleFilteredResults} />
              <Button
                variant="default"
                className="flex items-center gap-2"
                onClick={() => setDialog("add")}
              >
                <Plus className="w-4 h-4" />
                Add Volunteer
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-scroll max-h-[40rem] overflow-x-hidden">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === filteredVolunteers.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
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
                  const shiftDetails = getShiftDetails(
                    volunteer.preferredShift
                  );
                  const isSelected = selectedIds.includes(volunteer.id);

                  return (
                    <tr
                      key={volunteer.id}
                      className={`transition-colors ${
                        isSelected ? "bg-blue-50" : "hover:bg-gray-50/50"
                      }`}
                    >
                      <td className="py-4 px-6 flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(volunteer.id)}
                        />
                      </td>
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
                        {volunteer?.weekOffDays?.length > 0 ? (
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
          </div>

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

      {/* Dialogs */}
      {dialog && dialog !== "multi-delete" && (
        <VolunteerDialog
          dialogType={dialog}
          onSubmit={handleAddOrEdit}
          volunteer={dialog !== "add" ? editingVolunteer : undefined}
          onClose={() => setDialog(null)}
          onDelete={()=>handleDelete(editingVolunteer?.id as number)}
        />
      )}

      {dialog === "multi-delete" && (
        <VolunteerDialog
          dialogType="delete"
          onSubmit={() => {}}
          onClose={() => setDialog(null)}
          onDelete={() => {
            handleMultiDelete();
            setDialog(null);
          }}
          volunteer={undefined}
        />
      )}
    </>
  );
}
