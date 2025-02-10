"use client";
import { useState, useEffect, useContext } from "react";
import axiosInstance from "@/utils/axiosInstance";
import FilterBar from "@/app/components/general/filterBar";
import { useLanguage } from "@/context/Languagecontext";
import { ErrorContext } from "@/context/errorContext";
import StudentInfoCard from "@/app/components/teacher/student-info-card";

export default function MyStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { translate } = useLanguage();
  const { setGlobalErrorMessage } = useContext(ErrorContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/teacher/fetch/my-students", { withCredentials: true });
        setStudents(response.data.students);
        setFilteredStudents(response.data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
        setGlobalErrorMessage(translate("Error fetching students."));
      }
    };
    fetchData();
  }, []);

  const handleSearch = (query) => {
    setFilteredStudents(students.filter((student) =>
      student.student.first_name.toLowerCase().includes(query.toLowerCase()) ||
      student.student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.student.email.toLowerCase().includes(query.toLowerCase())
    ));
  };

  const handleFilterChange = (filter) => {
    setFilteredStudents(
      filter ? students.filter((student) => student.topic.education_level === filter) : students
    );
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4">
      {/* FilterBar - 25% din container */}
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} />

      {/* Lista de Studenți - 75% din container */}
      <div className="lg:w-3/4 w-full p-4">
        {/* Wrapper responsiv */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <StudentInfoCard key={student.id} studentInfo={student} />
          ))}
        </div>
      </div>
    </div>
  );
}
