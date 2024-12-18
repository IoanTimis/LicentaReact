import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Backend URL
  withCredentials: true, // Permite trimiterea cookie-urilor (pentru refresh token)
});

// Adaugă automat token-ul din localStorage în header-ul Authorization
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
