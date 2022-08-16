import axiosClient from "./axiosClient";

const returningService = {
  getAllReturning: () => {
    return axiosClient.get(`/api/return`);
  },
  createNewReturning: (assId) => {
    return axiosClient.post(`/api/return/${assId}`);
  },
  searchReturning: ( content) => {
    return axiosClient.get(`/api/return/search/${content}`);
  },
  completeRequest: (returnId) => {
    return axiosClient.patch(`/api/return/${returnId}`);
  },
  deleteReturning: (returnId) => {
    return axiosClient.delete(`/api/return/${returnId}`);
  },
};

export default returningService;
