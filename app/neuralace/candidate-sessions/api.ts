import axios from "axios";

export const getAllCandidateSessionsData = async () => {
  try {
    const res = await axios({
      method: "get",
      url: `${process.env.NEXT_BASE_URI}/api/candidate-sessions`,
    });
    return res.data.data;
  } catch (error) {
    return error;
  }
};
