import axios from "axios";

export const getAllCandidateSessionsData = async () => {
  try {
    const res = await axios({
      method: "get",
      url: `/api/candidate-sessions`,
    });
    console.log(res.data.data);
    return res.data.data;
  } catch (error) {
    return error;
  }
};
