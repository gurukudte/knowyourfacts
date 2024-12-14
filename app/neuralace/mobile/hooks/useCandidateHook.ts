import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ISheet } from "@/models/Sheet";
import {
  createSheetData,
  deleteSheetData,
  getAllSheetData,
  updateSheetData,
} from "../sheet/api";

export interface CandidateData {
  _id: string;
  sheetName: string;
  sheetRange: string;
}

const useCandidate = () => {
  const [allData, setAllData] = useState<CandidateData[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [newCandidate, setNewCandidate] = useState<CandidateData>({
    _id: "",
    sheetName: "",
    sheetRange: "",
  });

  const loadAllData = async () => {
    try {
      const response = await getAllSheetData();
      setAllData(response);
    } catch (err) {
      console.error("Error loading sheet data:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load sheets data",
      });
    }
  };

  const handleSave = async () => {
    try {
      const { _id, ...candidate } = newCandidate;
      await createSheetData(candidate);
      loadAllData();

      toast({
        title: "Success",
        description: "sheets data saved successfully",
      });
    } catch (err) {
      console.error("Error saving sheet data:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "failed to save sheet data",
      });
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await deleteSheetData(id);
      loadAllData();
      toast({
        title: "Success",
        description: "sheets data deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete sheet data",
      });
    }
  };

  const handleEdit = (sheetName: string) => {
    setEditMode(sheetName);
    const candidateData: any = allData.filter(
      (data) => data.sheetName === sheetName
    );
    setNewCandidate(candidateData[0]);
  };

  const handleUpdate = async () => {
    if (!editMode) return;

    try {
      await updateSheetData(newCandidate);
      loadAllData();
      setEditMode(null);
      setNewCandidate({ _id: "", sheetName: "", sheetRange: "" });
      toast({
        title: "Success",
        description: "sheets data updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update sheet data",
      });
    }
  };

  const handleAdd = () => {
    setNewCandidate({ _id: "", sheetName: "", sheetRange: "" });
    handleSave();
  };

  useEffect(() => {
    loadAllData();
  }, []);
  return {
    states: { allData, editMode, newCandidate },
    handlers: { handleAdd, handleEdit, setNewCandidate },
    apiCalls: { handleUpdate, handleDelete, handleSave },
  };
};

export default useCandidate;
