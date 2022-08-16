import axiosClient from "./axiosClient";

const authService = {
  signup: (params) => axiosClient.post("auth/signup", params),
  login: (params) => axiosClient.post("/api/auth/login", params),
  logout: () => axiosClient.post("api/auth/logout"),
  verifyToken: () => axiosClient.post("auth/verify-token"),
  changePassword: (params) => axiosClient.post(`/api/auth/user/changePassword`, params),
};

export default authService;

