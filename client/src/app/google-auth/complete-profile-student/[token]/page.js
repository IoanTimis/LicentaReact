"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/features/user/userSlice";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function CompleteProfileStudent() {
  const [errorMessage, setErrorMessage] = useState(null); // Stare pentru mesajele de eroare
  const [successMessage, setSuccessMessage] = useState(null); // Stare pentru mesajele de succes
  const [formVisible, setFormVisible] = useState(true); // Controlează afișarea formularului
  const [faculties, setFaculties] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const router = useRouter();
  const dispatch = useDispatch();

  const { token } = useParams();

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const facultyId = formData.get("faculty");
    const specializationId = formData.get("specialization");
    const educationType = formData.get("educationType");

    try {
      const response = await axios.put(
        `http://localhost:8080/complete-profile/as-student/${token}`,
        { facultyId, specializationId, educationType },
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
          router.push("/student");
        }
        , 3000); // Redirecționează utilizatorul către pagina de student după 3 secunde
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("Tokenul este invalid sau expirat, va rugam sa va logati cu contul Google din nou");
        setFormVisible(false); // Ascunde formularul dacă tokenul este invalid
        console.log("Tokenul este invalid sau expirat");
      } else {
        setErrorMessage("A apărut o eroare la completarea profilului");
        console.error("Eroare la completarea profilului:", error);
      }
    }
  };

  // Funcție pentru a obține facultățile de la server
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/fetch/faculties-specializations"
        );
        setFaculties(response.data);
      } catch (error) {
        console.error("Eroare la obținerea facultăților:", error);
        setErrorMessage("Eroare la obținerea datelor despre facultăți");
      }
    };

    fetchFaculties();
  }, []);

  const handleFacultyChange = (e) => {
    const facultyId = e.target.value;
    setSpecializations(
      faculties.find((f) => f.id === parseInt(facultyId))?.specializations || []
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {errorMessage && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          {successMessage}
        </div>
      )}

      {formVisible && (
        <form
          className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4"
          onSubmit={handleCompleteProfile}
        >
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Alege facultatea
            </label>
            <select
              className="w-full border-gray-300 text-gray-700 rounded-md p-2 focus:ring focus:ring-blue-500"
              name="faculty"
              onChange={handleFacultyChange}
            >
              <option value="">Selectează facultatea</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Alege specializarea
            </label>
            <select
              className="w-full border-gray-300 text-gray-700 rounded-md p-2 focus:ring focus:ring-blue-500"
              name="specialization"
            >
              <option value="">Selectează specializarea</option>
              {specializations.map((specialization) => (
                <option key={specialization.id} value={specialization.id}>
                  {specialization.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tipul de învățământ
            </label>
            <select
              className="w-full border-gray-300 text-gray-700 rounded-md p-2 focus:ring focus:ring-blue-500"
              name="educationType"
            >
              <option value="bsc">BSC</option>
              <option value="msc">MSC</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Tip</label>
            <input
              type="text"
              value="student"
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
