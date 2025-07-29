import api from "./api";

export const scrneer = async (formData) => {
  return await api.post("/api/screener", formData);
};