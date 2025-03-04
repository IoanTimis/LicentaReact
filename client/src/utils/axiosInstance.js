import axios from "axios";
import {store, persistor} from "@/store/page";
import { setUser, clearUser } from "@/store/features/user/userSlice";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(request => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return request;
}, error => {
  return Promise.reject(error);
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          "http://localhost:8080/refresh",
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;

        if (!accessToken) {
          throw new Error("Refresh token response missing access token");
        }

        const user = jwtDecode(accessToken);
        store.dispatch(setUser({ user }));

        localStorage.setItem("accessToken", accessToken);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        store.dispatch(clearUser());
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;