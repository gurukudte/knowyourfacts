import axios from "axios";
import { TechSheet } from "./useTechnicianHook";

export const getAllTechSheetData = async () => {
  try {
    const res = await axios({
      method: "get",
      url: "/api/tech-sheet",
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getTechSheetData = async (id: string) => {
  try {
    const res = await axios({
      method: "get",
      url: `/api/tech-sheet?${id}`,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const createTechSheetData = async (data: Omit<TechSheet, "id">) => {
  try {
    const res = await axios({
      method: "post",
      url: "/api/tech-sheet",
      data: data,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const updateTechSheetData = async (data: TechSheet) => {
  try {
    const { id, technicianName, sheetID } = data;
    const res = await axios({
      method: "put",
      url: `/api/tech-sheet?id=${id}`,
      data: {
        technicianName,
        sheetID,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const deleteTechSheetData = async (id: string) => {
  try {
    const res = await axios({
      method: "delete",
      url: `/api/tech-sheet?id=${id}`,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
