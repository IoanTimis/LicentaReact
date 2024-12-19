"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser, clearUser, setLoading } from "@/store/features/user/userSlice";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const useSession = () => {
  const dispatch = useDispatch();

  // Accesează datele din Redux
  const loggedInUser = useSelector((state) => state.user);
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    const validateAccessToken = async () => {
      dispatch(setLoading(true));

      //Todo: mai trb aici un if care sa verifice daca tokenul din localstorage este valid si daca e valid sa nu mai faca request la server

      try {
        // Extrage Access Token-ul din localStorage
        const response = axios.post(
          "http://localhost:8080/refresh",
          {},
          { withCredentials: true }
        );

        // Decodează Access Token-ul pentru a verifica expirația
        const decoded = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000; // Timpul actual în secunde

        if (decoded.exp < currentTime) {
          console.warn("Access Token expirat, încerc să reîmprospătez...");

          // Încercăm să obținem un nou Access Token folosind Refresh Token-ul
          const response = await axios.post(
            "http://localhost:8080/refresh",
            {},
            { withCredentials: true }
          );

          const { accessToken: newAccessToken } = response.data;
          const newDecoded = jwtDecode(newAccessToken);

          // Salvează noul token și utilizatorul în Redux
          localStorage.setItem("accessToken", newAccessToken);
          dispatch(setUser({ user: newDecoded }));
        } else {
          // Token-ul este valid, setează utilizatorul
          dispatch(setUser({ user: decoded }));
        }
      } catch (err) {
        if(err.response && err.response.status === 403) {
          console.warn("Refresh Token expirat sau invalid. Utilizator deconectat.");
          dispatch(clearUser());
          localStorage.removeItem("accessToken");
        }

        console.error("Eroare la validarea token-ului:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    validateToken();
  }, [dispatch]);

  return { loggedInUser, isLoading };
};

export default useSession;
