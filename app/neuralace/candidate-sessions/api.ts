import axios from "axios";

export const getAllCandidateSessionsData = async () => {
  try {
    const res = await axios({
      method: "get",
      url: `http://localhost:3000/api/candidate-sessions`,
    });
    return res.data.data;
  } catch (error) {
    return error;
  }
};
