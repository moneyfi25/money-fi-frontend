import axios from "axios";

const api = axios.create({
  // baseURL: "http://127.0.0.1:5000",
  // baseURL: "https://money-fi-9702ab6d8daf.herokuapp.com",
  baseURL: "https://moneyfi.onrender.com",

  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adding a request interceptor to include the token in the headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;