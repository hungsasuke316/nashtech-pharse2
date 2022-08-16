import axiosClient from "./axiosClient";

const reportService = {
  getReportList: () => {
    return axiosClient.get(`/api/report`);
  },
  getExportReport: () => {
    return axiosClient.get(`/api/report/export`);
  }
};

export default reportService;