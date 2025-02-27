import { use, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  createTechSheetData,
  deleteTechSheetData,
  getAllTechSheetData,
  updateTechSheetData,
} from "./api";

export type TechSheet = {
  id: string;
  technicianName: string;
  sheetID: string;
};

const useTechnician = () => {
  const [allTechnicianData, setAllTechnicianData] = useState<TechSheet[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [newTechSheetData, setNewTechSheetData] = useState<TechSheet>({
    id: "",
    technicianName: "",
    sheetID: "",
  });

  const loadAllData = async () => {
    try {
      const response = await getAllTechSheetData();
      setAllTechnicianData(response);
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
      const { id, ...TechnicianSheetData } = newTechSheetData;
      await createTechSheetData(TechnicianSheetData);
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
      await deleteTechSheetData(id);
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

  const handleEdit = (TechnicianName: string) => {
    setEditMode(TechnicianName);
    const candidateData: any = allTechnicianData.filter(
      (data) => data.technicianName === TechnicianName
    );
    setNewTechSheetData(candidateData[0]);
  };

  const handleUpdate = async () => {
    if (!editMode) return;

    try {
      await updateTechSheetData(newTechSheetData);
      loadAllData();
      setEditMode(null);
      setNewTechSheetData({ id: "", technicianName: "", sheetID: "" });
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
    setNewTechSheetData({ id: "", technicianName: "", sheetID: "" });
    handleSave();
  };

  useEffect(() => {
    loadAllData();
  }, []);
  return {
    states: { allTechnicianData, editMode, newTechSheetData },
    handlers: {
      handleAdd,
      handleEdit,
      setNewTechSheetData,
    },
    apiCalls: { handleUpdate, handleDelete, handleSave },
  };
};

export default useTechnician;
