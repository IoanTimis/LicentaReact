"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { PlusCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useLanguage } from "@/context/Languagecontext";
import Link from "next/link";
import TopicCard from "@/app/components/teacher/topic-card";
import { checkForDuplicates } from "@/utils/checkForDublicates";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";

export default function TeacherTopics() {
  const { translate } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");

  const [ formMode , setFormMode ] = useState("add");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [slots, setSlots] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  
  const [faculties, setFaculties] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([null]); // Array pentru specializări

  const handleOpenConfirmModal = (topicId, action) => {
    setSelectedTopic(topicId);
    setModalAction(action);
    setIsOpen(true);
  };

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

  const handleAddData = () => {
    setTitle("");
    setDescription("");
    setKeywords("");
    setSlots("");
    setEducationLevel("");
    setSelectedFacultyId(null);
    setSpecializations([]);
    setSelectedSpecializations([null]);
    toggleModal();
  };

  const handleEditData = (id) => {
    const topic = topics.find((topic) => topic.id === id);
    setTitle(topic.title);
    setDescription(topic.description);
    setKeywords(topic.keywords);
    setSlots(topic.slots);
    setEducationLevel(topic.education_level);
    toggleModal();
  };

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

    try {
      checkForDuplicates(selectedSpecializations);
    
      const formData = new FormData(e.target);
      const newTopic = {
        title: formData.get("title"),
        description: formData.get("description"),
        keywords: formData.get("keywords"),
        slots: formData.get("slots"),
        education_level: formData.get("education_level"),
        specialization_ids: selectedSpecializations.filter((id) => id !== null),
      };
      console.log(newTopic);
    
      const response = await axiosInstance.post("/teacher/topic/add", newTopic, {
        withCredentials: true,
      });

      setTopics((prev) => [...prev, response.data.topic]);
      
      toggleModal();
      console.log("Temă adăugată cu succes!");
    } catch (error) {
      console.error("Eroare la adăugarea temei:", error);
      setErrorMessage("A apărut o eroare la adăugarea temei.");
    }
  };

  const handleEdit = async (topicId) => {
    try {
      const response = await axiosInstance.put(`/teacher/topic/edit/${topicId}`, { withCredentials: true });
      console.log("Tema a fost editată cu succes!");
      const updatedTopic = response.data.topic;

      setTopics((prevTopics) =>
      prevTopics.map((topic) =>
        topic.id === topicId ? { ...topic, ...updatedTopic } : topic
      )
    );
    } catch (error) {
      console.error("Eroare la editarea temei:", error);
      setErrorMessage("A apărut o eroare la editarea temei.");
  };
}

  //Edit, Duplicate, Delete topics
  const handleDelete = async (topicId) => {
    try {
      const response = await axiosInstance.delete(`/teacher/topic/delete/${topicId}`, { withCredentials: true });
      setTopics((prev) => prev.filter((topic) => topic.id !== topicId));
      console.log("Tema a fost ștearsă cu succes!");
    } catch (error) {
      console.error("Eroare la ștergerea temei:", error);
      setErrorMessage("A apărut o eroare la ștergerea temei.");
    };
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-8">
    <div className="py-8 bg-gray-100">
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          {errorMessage}
        </div>
      )}
    
      {/* Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {/* Add Topic Card */}
        <div className="bg-white shadow rounded hover:shadow-lg transition cursor-pointer border border-gray-950" onClick={toggleModal}>
          <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
            <h2 className="text-lg text-white font-semibold ">{translate("Add a new theme")}</h2>
          </div>
          <div className="px-4 py-2">
            <p className="text-gray-700">{translate("Click here to add a new theme")}</p>
          </div>
          <div className="px-4 py-2">
            {/* <p className="text-gray-700">{translate("Click on any other card to view its dedicated page.")}</p> */}
          </div>
          <div className="pb-4">
            <PlusCircleIcon className="h-9 w-9 text-gray-400 mx-auto"/>
          </div>
        </div>
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} translate={translate} onEdit={handleEdit} handleOpenConfirmModal={handleOpenConfirmModal} />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              { formMode === "add" ? translate("Add Theme") : translate("Edit Theme") }
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">{ translate("Title") }</label>
                <input
                  type="text"
                  className="border border-gray-300 text-gray-700 rounded w-full p-2"
                  name="title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{ translate("Description") }</label>
                <textarea
                  className="border border-gray-300 text-gray-700 rounded w-full p-2"
                  name="description"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{ translate("Keywords") }</label>
                <input
                  type="text"
                  className="border border-gray-300 text-gray-700 rounded w-full p-2"
                  name="keywords"
                  required
                />
                <small className="text-gray-500">{ translate("Keywords must be separated by commas.") }</small>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{ translate("Slots") }</label>
                <input
                  type="number"
                  className="border border-gray-300 text-gray-700 rounded w-full p-2"
                  name="slots"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{ translate("Education Level") }</label>
                <select
                  className="border border-gray-300 text-gray-700 rounded w-full p-2"
                  name="education_level"
                  required
                >
                  <option value="">{translate("Select education level")}</option>
                  <option value="bsc">{ translate("Bachelor") }</option>
                  <option value="msc">{ translate("Master") }</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{ translate("Faculty") }</label>
                <select
                  className="border border-gray-300 text-gray-700 rounded w-full p-2"
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  required
                >
                  <option value="">{ translate("Select Faculty") }</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{ translate("Specializations") }</label>
                {selectedSpecializations.map((specialization, index) => (
                  <div key={index} className="flex mb-2">
                    <select
                      className="border border-gray-300 text-gray-700 rounded w-full p-2"
                      value={specialization || ""}
                      onChange={(e) => handleSpecializationChange(index, e.target.value)}
                      required
                    >
                      <option value="">{ translate("Select Specialization") }</option>
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
                  {translate("Add Specialization")}
                </button>
              </div>
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={toggleModal}
                >
                  { translate("Cancel") }
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  { formMode === "add" ? translate("Add") : translate("Edit") }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

     <ConfirmActionModal
      actionFunction={() => modalAction === "delete" ? handleDelete(selectedTopic) : null}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      action={modalAction}
    />
  </div>
  );
}
