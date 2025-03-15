"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/features/user/userSlice";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import { useLanguage } from "@/context/Languagecontext";

export default function CompleteProfileStudent() {
  const [successMessage, setSuccessMessage] = useState(null); 
  const [formVisible, setFormVisible] = useState(true);
  const [faculties, setFaculties] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const { translate } = useLanguage();

  const router = useRouter();
  const dispatch = useDispatch();

  const { token } = useParams();

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const faculty_id = formData.get("faculty");
    const specialization_id = formData.get("specialization");
    const education_level = formData.get("educationType");

    try {
      const response = await axios.put(
        `http://localhost:8080/complete-profile/as-student/${token}`,
        { faculty_id, specialization_id, education_level },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        const user = jwtDecode(accessToken);
        dispatch(setUser({ user }));
        setSuccessMessage(translate("Profile completed successfully"));
        setFormVisible(false); 
        console.log("Profile completed successfully");

        setTimeout(() => {
          router.push("/student");
        }
        , 3000);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setGlobalErrorMessage(translate("The token is invalid or expired"));
        setFormVisible(false);
        console.log("The token is invalid or expired");
      } else {
        console.error("Error completing the profile:", error);
        setGlobalErrorMessage(translate("An error occurred while completing the profile. Please try again."));
      }
    }
  };

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/fetch/faculties-specializations"
        );
        setFaculties(response.data);
      } catch (error) {
        console.error("Error fetching faculties and specializations:", error);
        setGlobalErrorMessage(translate("An error occurred while fetching faculties and specializations. Please try again."));
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
              {translate("Choose faculty")}
            </label>
            <select
              className="w-full border-gray-300 text-gray-700 rounded-md p-2 focus:ring focus:ring-blue-500"
              name="faculty"
              onChange={handleFacultyChange}
            >
              <option value="">{translate("Choose faculty")}</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {translate("Choose specialization")}
            </label>
            <select
              className="w-full border-gray-300 text-gray-700 rounded-md p-2 focus:ring focus:ring-blue-500"
              name="specialization"
            >
              <option value="">{translate("Choose specialization")}</option>
              {specializations.map((specialization) => (
                <option key={specialization.id} value={specialization.id}>
                  {specialization.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {translate("Education level")}
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
            <label className="block text-gray-700 font-medium mb-2">{translate("Type")}</label>
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
