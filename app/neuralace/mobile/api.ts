import axios from "axios";

export const createCandidateSessionsData = async (data: any) => {
  try {
    const res = await axios({
      method: "post",
      url: "/api/candidate-sessions",
      data: data,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const updateCandidateSessionsData = async (id: string, data: any) => {
  try {
    const res = await axios({
      method: "put",
      url: `/api/candidate-sessions?id=${id}`,
      data: data,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getCandidateSessionsData = async (
  candidateName: string,
  date: string
) => {
  try {
    const res = await axios({
      method: "get",
      url: `/api/candidate-sessions?candidateName=${candidateName}&date=${date}`,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

// export const getCandidateSessionsData = async (
//   candidateName: string,
//   date: string
// ) => {
//   try {
//     const res = await axios({
//       method: "get",
//       url: `/api/candidate-sessions?candidateName=${candidateName}&date=${date}`,
//     });
//     return res.data;
//   } catch (error) {
//     return error;
//   }
// };
