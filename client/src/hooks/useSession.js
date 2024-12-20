"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser, clearUser, setLoading } from "@/store/features/user/userSlice";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import axios from "axios";

const useSession = () => {
  const dispatch = useDispatch();
  const Router = useRouter();

  useEffect(() => {
    const validateAccessToken = async () => {
      dispatch(setLoading(true));

      const accessToken = localStorage.getItem("accessToken");
      if (accessToken ) {
        const decoded = jwtDecode(accessToken);
        if (decoded.exp * 1000 > Date.now()) {
          dispatch(setUser({ user: decoded }));
          dispatch(setLoading(false));
          return;
        }
      }

      try {
        const response = await axios.post(
          "http://localhost:8080/refresh",
          {},
          { withCredentials: true }
        );

          const { newAccessToken } = response.data.accessToken;
          const newDecoded = jwtDecode(newAccessToken);

          localStorage.setItem("accessToken", newAccessToken);
          dispatch(setUser({ user: newDecoded }));
      } catch (err) {
        console.log("err", err);
        if(err.response && (err.response.status === 403 || err.response.status === 401)) {
          console.warn("Refresh Token expirat sau invalid. Utilizator deconectat.");
          dispatch(clearUser());
          localStorage.removeItem("accessToken");
          Router.push("/auth/login");
        }
        console.error("Eroare la validarea token-ului:", err);
      } finally {
        dispatch(setLoading(false));
      }

    };

    validateAccessToken();
  }, [dispatch]);

  const loggedInUser = useSelector((state) => state.user);
  const isLoading = useSelector((state) => state.user.isLoading);

  return { loggedInUser, isLoading };
};

export default useSession;
