import api from "../api/api";

export const createTranche = (data) => api.post("/tranches", data);
export const deleteTranche = (id) => api.delete(`/tranches/${id}`);
