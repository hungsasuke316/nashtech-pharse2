import axiosClient from "./axiosClient";

const assignmentService = {
  getAllAssignments: () => {
    return axiosClient.get(`/api/assignment/getAll`);
  },
  searchAssignment: (content) => {
    return axiosClient.get(`/api/assignment/search/${content}`);
  },
  createAssignment: (params) => {
    return axiosClient.post(`/api/assignment`, params);
  },
  editAssignment: (id, params) => {
    return axiosClient.put(`/api/assignment/edit/${id}`, params);
  },
  deleteAssignment: (id) => {
    return axiosClient.delete(`/api/assignment/disable/${id}`);
  },
  getAssignmentById: (id) => {
    return axiosClient.get(`/api/assignment/getAssignment/${id}`);
  },
  getAllAssetsByAvailable: () => {
    return axiosClient.get(`/api/assignment/getAsset`);
  },
  searchAssetByAvailable: (content) => {
    return axiosClient.get(`/api/assignment/searchAsset/${content}`);
  },
  getAllUsersByAvailable: () => {
    return axiosClient.get(`/api/assignment/getUser`);
  },
  searchUserByAvailable: (content) => {
    return axiosClient.get(`/api/assignment/searchUser/${content}`);
  }
};

export default assignmentService;
