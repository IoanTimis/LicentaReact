"use client";

import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "@/store/features/user/userSlice";
import { useLanguage } from "@/context/Languagecontext";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { translate } = useLanguage();
  const { setGlobalErrorMessage } = useContext(ErrorContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      console.log("email", email);
      const response = await axios.post(
        "http://localhost:8080/login",
        { email, password },
        { withCredentials: true } 
      );

      const { accessToken} = response.data;
      const user = jwtDecode(accessToken);
      dispatch(setUser({ user }));
      localStorage.setItem("accessToken", accessToken);

      if (user.role === "admin") {
        router.push("/admin");
      } else if (user.role === "teacher") {
        router.push("/teacher");
      } else {
        router.push("/student");
      }
    } catch (error) {
      console.error("Error on login:", error);
      setGlobalErrorMessage("An error occurred while logging in. Please try again.");
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    window.location.href = "http://localhost:8080/auth/google";
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-lg p-6 w-11/12 max-w-md">
        <h1 className="text-2xl text-black font-bold text-center mb-6">{translate("Login")}</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
          <input type="email" id="email" name="email" className="w-full border text-black border-gray-300 rounded-md p-3" required />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">{translate("Password")}</label>
          <input type="password" id="password" name="password" className="text-black w-full border border-gray-300 rounded-md p-3" required />
        </div>
        <div className="flex flex-col gap-4">
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">{translate("Login")}</button>
          <button type="button" onClick={handleGoogleLogin} className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700">{translate("Google Login")}</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
