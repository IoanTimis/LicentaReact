"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Pentru redirecționare
import axios from "axios";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState(null); // Gestionarea erorilor
  console.log("welcome to the login page");

  const handleLogin = async (e) => {
    e.preventDefault(); // Previne comportamentul implicit al formularului

    const formData = new FormData(e.target); // Extrage datele din formular
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      console.log("Răspuns:", response.data);

      if (response.data.redirectTo) {
        console.log("Redirecționează către:", response.data.redirectTo);
        router.push(response.data.redirectTo); // Redirecționează pe baza răspunsului
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Afișează mesajul de eroare utilizatorului
        console.error("Eroare:", error.response.data.error);
        setError(error.response.data.error);
      } else {
        console.error("Eroare necunoscută:", error);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      {/* Formular de login */}
      <form
        onSubmit={handleLogin} // Transmite evenimentul către handleLogin
        className="bg-white shadow-lg rounded-lg p-6 w-11/12 max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-black">Autentificare</h1>

        {/* Mesaj de eroare */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Introduceți email"
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
            required // Validează dacă este completat
          />
        </div>

        {/* Parola */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
          >
            Parola
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Introduceți parola"
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
            required // Validează dacă este completat
          />
        </div>

        {/* Butoane */}
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Intră în cont
          </button>
          <a
            href="http://localhost:8080/auth/google"
            className="w-full bg-red-600 text-white py-2 text-center rounded-md hover:bg-red-700 transition"
          >
            Continuă cu Google
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
