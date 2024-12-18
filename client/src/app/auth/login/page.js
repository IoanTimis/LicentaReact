"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "@/store/features/user/userSlice";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.user) {
        dispatch(setUser(response.data.user));
        router.push(response.data.redirectTo || "/");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Autentificare eșuată");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google";
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-lg p-6 w-11/12 max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Autentificare</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
          <input type="email" id="email" name="email" className="w-full border border-gray-300 rounded-md p-3" required />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Parola</label>
          <input type="password" id="password" name="password" className="w-full border border-gray-300 rounded-md p-3" required />
        </div>
        <div className="flex flex-col gap-4">
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Intră în cont</button>
          <button type="button" onClick={handleGoogleLogin} className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700">Continuă cu Google</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
