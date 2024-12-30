"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function TeacherTopics() {
  const [faculties, setFaculties] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedSpecializations, setSelectedSpecializations] = useState([null]); // Array pentru specializări

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/teacher/fetch/topics", { withCredentials: true });
        setFaculties(response.data.faculties);
        setTopics(response.data.teacher.topics);
      } catch (error) {
        console.error("Eroare la obținerea datelor:", error);
        setErrorMessage("A apărut o eroare la obținerea datelor.");
      }
    };

    fetchData();
  }, []);

  // Handle faculty change
  const handleFacultyChange = (facultyId) => {
    setSelectedFacultyId(facultyId);
    const faculty = faculties.find((f) => f.id === parseInt(facultyId));
    setSpecializations(faculty ? faculty.specializations : []);
    setSelectedSpecializations([null]); // Resetează specializările selectate
  };

  // Handle adding another specialization field
  const addSpecializationField = () => {
    setSelectedSpecializations([...selectedSpecializations, null]);
  };

  // Handle specialization change
  const handleSpecializationChange = (index, value) => {
    const updatedSpecializations = [...selectedSpecializations];
    updatedSpecializations[index] = value;
    setSelectedSpecializations(updatedSpecializations);
  };

  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTopic = {
      title: formData.get("title"),
      description: formData.get("description"),
      keywords: formData.get("keywords"),
      slots: formData.get("slots"),
      educationLevel: formData.get("education_level"),
      facultyId: selectedFacultyId,
      specializations: selectedSpecializations.filter((id) => id !== null), // Filtrăm valorile null
    };

    try {
      const response = await axiosInstance.post("/teacher/topics", newTopic, {
        withCredentials: true,
      });
      if (response.status === 201) {
        setTopics((prev) => [...prev, response.data]);
        toggleModal();
        console.log("Temă adăugată cu succes!");
      }
    } catch (error) {
      console.error("Eroare la adăugarea temei:", error);
      setErrorMessage("A apărut o eroare la adăugarea temei.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teme de licență</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={toggleModal}
        >
          Adăugare temă de licență
        </button>
      </header>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {/* Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {topics.map((topic) => (
          <div key={topic.id} className="bg-white shadow rounded p-4 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">{topic.title}</h2>
            <p className="text-gray-600">{topic.description}</p>
            <p className="text-sm text-gray-500">Cuvinte cheie: {topic.keywords}</p>
            <p className="text-sm text-gray-500">Locuri: {topic.slots}</p>
            <p className="text-sm text-gray-500">Tip: {topic.education_level}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Adăugare temă de licență</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Titlu</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                  name="title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Descriere</label>
                <textarea
                  className="border border-gray-300 rounded w-full p-2"
                  name="description"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Cuvinte cheie</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                  name="keywords"
                  required
                />
                <small className="text-gray-500">Cuvintele cheie trebuie separate prin spațiu.</small>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Locuri</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded w-full p-2"
                  name="slots"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nivel educație</label>
                <select
                  className="border border-gray-300 text-gray-700 rounded w-full p-2"
                  name="education_level"
                  required
                >
                  <option value="">Selectează nivelul de educație</option>
                  <option value="bsc">Licență</option>
                  <option value="msc">Master</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Facultate</label>
                <select
                  className="border border-gray-300 text-gray-700 rounded w-full p-2"
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  required
                >
                  <option value="">Selectează facultatea</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Specializări</label>
                {selectedSpecializations.map((specialization, index) => (
                  <div key={index} className="flex mb-2">
                    <select
                      className="border border-gray-300 text-gray-700 rounded w-full p-2"
                      value={specialization || ""}
                      onChange={(e) => handleSpecializationChange(index, e.target.value)}
                      required
                    >
                      <option value="">Selectează specializarea</option>
                      {specializations.map((spec) => (
                        <option key={spec.id} value={spec.id}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                  onClick={addSpecializationField}
                >
                  Adaugă specializare
                </button>
              </div>
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={toggleModal}
                >
                  Anulează
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Salvează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
