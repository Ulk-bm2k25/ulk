import api from "../api/api";

export const payTranche = (data) => api.post("/pay-tranche", data);
