import axiosClient from "./axiosClient";

const assetService = {
  getAllAssets: () => {
    return axiosClient.get(`/api/asset/getAll`);
  },
  searchAsset: ( content) => {
    return axiosClient.get(`/api/asset/search/${content}`);
  },
  disableAsset: (id) => {
    return axiosClient.delete(`/api/asset/delete/${id}`);
  },
  createAsset: (params) => {
    return axiosClient.post(`/api/asset`, params);
  },
  editAsset: (id, params) => {
    return axiosClient.put(`/api/asset/${id}`, params);
  },
  deleteAsset: (id) => {
    return axiosClient.delete(`/api/asset/${id}`);
  },
  getAssetById: (id) => {
    return axiosClient.get(`/api/asset/${id}`);
  },
  checkAssetHistory: (id) => {
    return axiosClient.get(`/api/asset/check/${id}`);
  },
  getAssetHistory: (id) => {
    return axiosClient.get(`/api/asset/history/${id}`);
  }
};

export default assetService;
