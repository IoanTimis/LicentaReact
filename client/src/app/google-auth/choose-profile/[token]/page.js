"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function CompleteProfile() {
  const params = useParams();
  const { token } = params;
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");

  const validateAndRedirect = async (type) => {
    try {
      const response = await axios.get(`http://localhost:8080/find-user-by-token/${token}`);
      if (response.status === 200) {
        console.log("Token valid");
        // Redirecționează utilizatorul către pagina de completare a profilului
        router.push(`/complete-profile/as-${type}`);
      }
    } catch (error) {
      console.error("Eroare la validarea token-ului:", error);
      setErrorMessage("Token invalid. Încearcă din nou peste 5 minute.");
      // Redirecționează utilizatorul către pagina de login
      setTimeout(() => {
        router.push("/auth/login");
      }, 5000); // Așteaptă 5 secunde înainte de redirecționare
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Pentru a avea acces complet, te rog finalizează-ți profilul
      </h1>

      {/* Mesaj de eroare */}
      {errorMessage && (
        <div className="mb-4 p-4 text-red-600 bg-red-100 border border-red-600 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => validateAndRedirect("teacher")}
          className="px-6 py-3 bg-red-600 text-white font-medium text-lg rounded-md hover:bg-red-700 transition"
        >
          Completează-ți contul ca profesor
        </button>
        <button
          onClick={() => validateAndRedirect("student")}
          className="px-6 py-3 bg-blue-600 text-white font-medium text-lg rounded-md hover:bg-blue-700 transition"
        >
          Completează-ți contul ca student
        </button>
      </div>
    </main>
  );
}
