import axiosClient from "./axiosClient";

const categoryService = {
    getAllCategory: () => {
        return axiosClient.get(`/api/category`);
    },
    createCategory: (params) => {
        return axiosClient.post(`/api/category`, params);
    }
}

export default categoryService;