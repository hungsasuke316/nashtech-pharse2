import axiosClient from "./axiosClient";

const staffService = {
    getListAssignments: (userId) => {
        return axiosClient.get(`/api/staff/assignments/${userId}`);
    },
    getAssignmentById: (id) => {
        return axiosClient.get(`/api/staff/assignments/${id}`);
    },
    updateStateAssignment: (id, state) => {
        return axiosClient.patch(`/api/staff/assignments/${id}/state?state=${state}`);
    }
}
export default staffService;