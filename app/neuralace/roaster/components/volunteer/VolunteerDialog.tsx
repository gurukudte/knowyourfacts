"use client";
import React, { useCallback, useState } from "react";
import { VolunteerForm, Volunteer, Shift } from "./VolunteerForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export const shifts: Shift[] = [
  { id: 1, name: "Morning", startTime: "08:00", endTime: "12:00" },
  { id: 2, name: "Afternoon", startTime: "12:00", endTime: "16:00" },
  { id: 3, name: "Evening", startTime: "16:00", endTime: "20:00" },
];

type DialogType = "add" | "edit" | "delete";

interface VolunteerDialogProps {
  dialogType: DialogType;
  onSubmit: (
    volunteer: Omit<Volunteer, "id">,
    editingId?: number | null
  ) => void;
  onDelete?: (volunteerId: number) => void;
  volunteer?: Volunteer | null;
  onClose?: () => void;
}

export const VolunteerDialog: React.FC<VolunteerDialogProps> = ({
  dialogType,
  onSubmit,
  onDelete,
  volunteer = null,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const { shifts } = useAppContext();
  const availableShifts = shifts || [];
  const handleSubmit = (
    volunteer: Omit<Volunteer, "id">,
    editingId?: number | null
  ) => {
    onSubmit(volunteer, editingId);
    onClose && onClose();
  };

  const handleDelete = () => {
    if (volunteer?.id && onDelete) {
      onDelete(volunteer.id);
    }
    onClose && onClose();
  };

  const renderContent = useCallback(() => {
    switch (dialogType) {
      case "add":
      case "edit":
        return (
          <VolunteerForm
            availableShifts={availableShifts}
            editingId={volunteer?.id || null}
            volunteer={volunteer || undefined}
          />
        );

      case "delete":
        return (
          <div className="p-4">
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete <strong>{volunteer?.name}</strong>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [volunteer]);
  console.log(volunteer?.name, volunteer?.id);
  return (
    <Dialog open={dialogType !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {dialogType === "add"
              ? "Add Volunteer"
              : dialogType === "edit"
              ? "Edit Volunteer"
              : "Delete Volunteer"}
          </DialogTitle>
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
