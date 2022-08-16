import axiosClient from "./axiosClient";

const userService = {
  getAllUsers: () => {
    return axiosClient.get(`/api/user/getAll`);
  },

  getUserByStaffCode: (staffCode) => {
    return axiosClient.get(`/api/user/getInformation/${staffCode}`);
  },
  searchUser: ( content) => {
    return axiosClient.get(`/api/user/search/${content}`);
  },

  createUser: (params) => {
    return axiosClient.post("/api/user/register", params);
  },

  editUser: (staffCode, params) => {
    return axiosClient.put(`/api/user/edit/${staffCode}`, params);
  },

  checkUserCanDelete: (staffCode) => {
    return axiosClient.get(`/api/user/check/${staffCode}`);
  },

  disableUser: (staffCode) => {
    return axiosClient.patch(`/api/user/disable/${staffCode}`);
  },
};

export default userService;
