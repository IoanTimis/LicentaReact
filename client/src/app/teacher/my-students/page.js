"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";


export default function MyStudents() {
  const [students, setStudents] = useState([]);
  const { translate } = useLanguage();
  const { setGlobalErrorMessage } = useContext(ErrorContext);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get("/teacher/fetch/my-students", {
          withCredentials: true,
        });
        setStudents(response.data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
        setGlobalErrorMessage(translate("An error occurred while fetching students."));
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center text-black mb-6">
        {translate("My Students")}
      </h2>

      {/* Students List */}
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-200">
              <th className="border text-black border-gray-500 px-4 py-2">{translate("First Name")}</th>
              <th className="border text-black border-gray-500 px-4 py-2">{translate("Last Name")}</th>
              <th className="border text-black border-gray-500 px-4 py-2">{translate("Email")}</th>
              <th className="border text-black border-gray-500 px-4 py-2">{translate("Theme")}</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.student.id} className="text-center">
                  <td className="border text-black border-gray-500 px-4 py-2">{student.student.first_name}</td>
                  <td className="border text-black border-gray-500 px-4 py-2">{student.student.name}</td>
                  <td className="border text-black border-gray-500 px-4 py-2">{student.student.email}</td>
                  <td className="border text-black border-gray-500 px-4 py-2">{student.topic ? student.topic.title : "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-black text-center py-4">
                  {translate("No students confimed your themes yet.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
