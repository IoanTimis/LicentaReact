"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const useSession = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get("http://localhost:8080/check-session", {
          withCredentials: true,
        });
        setLoggedInUser(response.data.user || null);
      } catch (err) {
        console.error("Eroare la obținerea sesiunii:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { loggedInUser, isLoading, setLoggedInUser };
};

export default useSession;
