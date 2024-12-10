"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setUser, clearUser, setLoading } from "@/store/features/user/userSlice";

const useSession = () => {
  const dispatch = useDispatch();

  // Accesează datele din Redux
  const loggedInUser = useSelector((state) => state.user);
  const isLoading = useSelector((state) => state.user.isLoading);
  const isSessionChecked = useSelector((state) => state.user.isSessionChecked);

  useEffect(() => {
    if (!isSessionChecked) {
      // Dacă sesiunea nu a fost verificată, efectuează cererea
      const fetchSession = async () => {
        dispatch(setLoading(true));

        try {
          // Face cererea către backend pentru a verifica sesiunea
          const response = await axios.get("http://localhost:8080/check-session", {
            withCredentials: true, // Include cookie-urile pentru autentificare
          });

          if (response.data.user) {
            dispatch(setUser(response.data.user)); // Salvează utilizatorul în Redux
          } else {
            dispatch(clearUser()); // Dacă nu există utilizator, resetează starea
          }
        } catch (err) {
          console.error("Eroare la obținerea sesiunii:", err);
          dispatch(clearUser()); // Șterge utilizatorul în caz de eroare
        } finally {
          dispatch(setLoading(false)); // Marchează sfârșitul încărcării
        }
      };

      fetchSession();
    }
  }, [dispatch, isSessionChecked]);

  return { loggedInUser, isLoading };
};

export default useSession;
