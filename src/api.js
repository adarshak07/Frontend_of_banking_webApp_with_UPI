import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8082";
const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize 401/403 so UI can react gracefully without breaking
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      // just reject with the same error; our global handler will suppress the overlay
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
