"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/features/user/userSlice";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function CompleteProfileTeacher() {
  const [errorMessage, setErrorMessage] = useState(null); // Stare pentru mesajele de eroare
  const [successMessage, setSuccessMessage] = useState(null); // Stare pentru mesajele de succes
  const [formVisible, setFormVisible] = useState(true); // Controlează afișarea formularului

  const router = useRouter();
  const dispatch = useDispatch();

  const { token } = useParams();

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");

    try {
      const response = await axios.put(
        `http://localhost:8080/complete-profile/as-teacher/${token}`,
        { title },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        const user = jwtDecode(accessToken);
        dispatch(setUser({ user }));
        setSuccessMessage("Profilul a fost completat cu succes!");
        setFormVisible(false);

        console.log("Profilul a fost completat cu succes");
        setTimeout(() => {
          router.push("/teacher");
        }, 3000); // Redirecționează după 3 secunde
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(
          "Tokenul este invalid sau expirat, vă rugăm să vă logați cu contul Google din nou"
        );
        setFormVisible(false); // Ascunde formularul dacă tokenul este invalid
        console.log("Tokenul este invalid sau expirat");
      } else {
        setErrorMessage("A apărut o eroare la completarea profilului");
        console.error("Eroare la completarea profilului:", error);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          {successMessage}
        </div>
      )}

      {formVisible && (
        <form
          onSubmit={handleCompleteProfile}
          method="PUT"
          className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Titlu
            </label>
            <input
              id="title"
              name="title"
              placeholder="Introdu titlul"
              className="w-full border-gray-300 text-black rounded-md p-2 focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-gray-700 font-medium mb-2"
            >
              Tip
            </label>
            <input
              id="type"
              value="teacher"
              disabled
              className="w-full border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
          >
            Trimite
          </button>
        </form>
      )}
    </main>
  );
}
