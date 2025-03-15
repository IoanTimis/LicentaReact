"use client";
import { useState, useEffect, useContext } from "react";
import axiosInstance from "@/utils/axiosInstance";
import FilterBar from "@/app/components/general/filter-bar";
import { useLanguage } from "@/context/Languagecontext";
import { ErrorContext } from "@/context/errorContext";
import StudentInfoCard from "@/app/components/teacher/student-info-card";

export default function MyStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { translate } = useLanguage();
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const [noMatch, setNoMatch] = useState(false);

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
    const filtered = students.filter((student) =>
      student.student.first_name.toLowerCase().includes(query.toLowerCase()) ||
      student.student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.student.email.toLowerCase().includes(query.toLowerCase()) ||
      student.request.topic.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredStudents(filtered);
    setNoMatch(filtered.length === 0);
  };

  const handleFilterChange = (filter) => {
    const filtered = filter.educationLevel ? students.filter((student) => student.request.topic.education_level === filter.educationLevel) : students

    setFilteredStudents(filtered);
    setNoMatch(filtered.length === 0);
  };

  if(students.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-700">{translate("No one confirmed your theme yet.")}</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4">
      <FilterBar className="lg:w-1/4 w-full" 
        filterOnDatabase={false}  
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange} 
        noMatch={noMatch} 
      />
  
      <div className="lg:w-3/4 w-full p-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-6">
          {filteredStudents.map((student) => (
            <StudentInfoCard key={student.id} studentInfo={student} />
          ))}
        </div>
      </div>
    </div>
  );  
}
