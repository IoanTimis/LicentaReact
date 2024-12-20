import axios from "axios";
import { store } from "@/store"; // Importă Redux store
import { setUser, clearAuth } from "@/store/features/authSlice"; // Actions din Redux
import { clearUser } from "@/store/features/user/userSlice";
import { Router, useRouter } from "next/router";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // URL-ul API-ului tău backend
  withCredentials: true, // Include cookies pentru Refresh Token
});

// Variabilă pentru a preveni mai multe cereri de refresh simultan
let isRefreshing = false;
let failedQueue = [];

// Funcție pentru procesarea cererilor din coadă
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });

  failedQueue = [];
};

// Interceptor pentru răspunsuri
axiosInstance.interceptors.response.use(
  (response) => response, // Continuă dacă răspunsul este valid
  async (error) => {
    const originalRequest = error.config;

    // Verifică dacă este o eroare 401 (token expirat)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Dacă deja se reîmprospătează, adaugă cererea în coadă
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Începe procesul de reîmprospătare
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          "http://localhost:8080/refresh",
          {},
          { withCredentials: true }
        );
      
        const { accessToken } = response.data.accessToken;
        const user = jwtDecode(accessToken);
      
        // Actualizează token-ul în Redux și Axios
        store.dispatch(setUser({ user }));
        localStorage.setItem("accessToken", accessToken);
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
      
        processQueue(null, accessToken); // Reprocesăm cererile din coadă
        isRefreshing = false;
      
        // Retrimite cererea originală cu noul token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        isRefreshing = false;
      
        // Dacă serverul returnează 403, deconectează utilizatorul
        if (err.response && err.response.status === 403) {
          console.warn("Refresh Token expirat sau invalid. Utilizator deconectat.");
          processQueue(err, null);
          store.dispatch(clearUser()); // Șterge datele utilizatorului
          localStorage.removeItem("accessToken");
          Router.push("/auth/login"); // Redirecționează utilizatorul la pagina de autentificare
          return Promise.reject(err);
        }
      
        // Pentru alte erori, tratează normal
        processQueue(err, null);
        return Promise.reject(err);
      }      
    }

    return Promise.reject(error); // Alte erori continuă
  }
);

export default axiosInstance;
