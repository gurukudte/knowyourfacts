import { ISheet } from "@/models/Sheet";
import axios from "axios";
import { CandidateData } from "../hooks/useCandidateHook";

export const getAllSheetData = async () => {
  try {
    const res = await axios({
      method: "get",
      url: "/api/sheet",
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getSheetData = async (id: string) => {
  try {
    const res = await axios({
      method: "get",
      url: `/api/sheet?${id}`,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const createSheetData = async (
  data: Pick<CandidateData, "sheetName" | "sheetRange">
) => {
  try {
    const res = await axios({
      method: "post",
      url: "/api/sheet",
      data: data,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const updateSheetData = async (data: CandidateData) => {
  try {
    const { _id, sheetName, sheetRange } = data;
    const res = await axios({
      method: "put",
      url: `/api/sheet?id=${_id}`,
      data: {
        sheetName,
        sheetRange,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const deleteSheetData = async (id: string) => {
  try {
    const res = await axios({
      method: "delete",
      url: `/api/sheet?id=${id}`,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
