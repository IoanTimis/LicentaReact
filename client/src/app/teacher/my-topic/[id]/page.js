"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import TopicModal from "@/app/components/teacher/topic-form-modal";
import TopicDetails from "@/app/components/general/topic-details";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import ProfessorDetails from "@/app/components/general/topic-req-profesor-details";
import TopicDescription from "@/app/components/general/topic-description";
import { checkForDuplicates } from "@/utils/checkForDublicates";

export default function TopicDetailsPage() {
  const [topic, setTopic] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [confirmModalAction, setConfirmModalAction] = useState("");
  const { translate } = useLanguage();
  const { id } = useParams();
  const { setGlobalErrorMessage } = useContext(ErrorContext);

  const [ formMode , setFormMode ] = useState("add");
  const [formError, setFormError] = useState(null);
  const [dublicateError, setDublicateError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [slots, setSlots] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  
  const [faculties, setFaculties] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([null]);

  const toggleConfirmActionModal = (action) => {
    setConfirmModalAction(action);
    setIsConfirmModalOpen((prev) => !prev);
  };

  // Toggle modal visibility
  const toggleEditModal = () => {
    setIsTopicModalOpen((prev) => !prev);
    setDublicateError(null);
  };

  // Handle faculty change
  const handleFacultyChange = (facultyId) => {
    setSelectedFacultyId(facultyId);
    const faculty = faculties.find((f) => f.id === parseInt(facultyId));
    setSpecializations(faculty ? faculty.specializations : []);
    setSelectedSpecializations([null]); 
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

    setDublicateError(null);
  };

  const removeSpecializationField = (index) => {
    setSelectedSpecializations(prev => prev.filter((_, i) => i !== index));
  };  

  const handleEditData = () => {
    setFormMode("edit");
    setTitle(topic.title);
    setDescription(topic.description);
    setKeywords(topic.keywords);
    setSlots(topic.slots);
    setEducationLevel(topic.education_level);
    
    const facultyId = topic.specializations[0]?.faculty.id;
    setSelectedFacultyId(facultyId);
    
    handleFacultyChange(facultyId);

    setTimeout(() => {
        setSelectedSpecializations(topic.specializations.map(spec => spec.id));
    }, 100);

    toggleEditModal();
  };

  // Fetch topic details
  useEffect(() => {
    if (!id) return;

    const fetchTopicDetails = async () => {
      try {
        const response = await axiosInstance.get(`/teacher/fetch/topic/${id}`, { withCredentials: true });
        setTopic(response.data.topic);
        setFaculties(response.data.faculties);
        setSelectedFacultyId(response.data.topic.specializations[0]?.faculty.id);
        setSpecializations(response.data.topic.specializations);
        setSelectedSpecializations(response.data.topic.specializations.map(spec => spec.id));

      } catch (error) {
        console.error("Error fetching topic details:", error);
        setGlobalErrorMessage(translate("An error occurred while fetching topic details."));
      }
    };

    fetchTopicDetails();
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const dublicate = checkForDuplicates(selectedSpecializations);

      if(dublicate) {
        setDublicateError("You have selected the same specialization multiple times.");
        return;
      }

      const formData = new FormData(e.target);

      const newTopic = {
        title: formData.get("title"),
        description: formData.get("description"),
        keywords: formData.get("keywords"),
        slots: formData.get("slots"),
        education_level: formData.get("education_level"),
        specialization_ids: selectedSpecializations.filter((id) => id !== null),
      };

      const response = await axiosInstance.put(`/teacher/topic/edit/${topic.id}`, newTopic, { withCredentials: true });
      console.log("Theme edited successfully!");

      setTopic(response.data.topic);
      toggleEditModal();
    } catch (error) {
      console.error("Error editing theme:", error);
      setGlobalErrorMessage(translate("An error occurred while editing the theme."));
    };
  }

  const handleDelete = async (topicId) => {
    try {
      await axiosInstance.delete(`/teacher/topic/delete/${topicId}`, { withCredentials: true });
      console.log("Theme deleted successfully");
    } catch (error) {
      console.error("Error deleting theme:", error);
      setGlobalErrorMessage(translate("An error occurred while deleting the theme."));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Layout */}
      {topic && (
        <>
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-6">{topic.title}</h2>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
            {/* Professor Details */}
            <ProfessorDetails teacher={topic.user} />

            {/* Topic Details */}
            <TopicDetails
              topic={topic}
              toggleConfirmActionModal={toggleConfirmActionModal}
              toggleEditModal={handleEditData}
              translate={translate}
              role="teacher"
            />
          </div>

          {/* Description */}
          <TopicDescription description={topic.description} translate={translate} />
        </>
      )}

      {/* Edit Modal */}
      <TopicModal
        isOpen={isTopicModalOpen}
        setIsOpen={setIsTopicModalOpen}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        keywords={keywords}
        setKeywords={setKeywords}
        slots={slots}
        setSlots={setSlots}
        educationLevel={educationLevel}
        setEducationLevel={setEducationLevel}
        faculties={faculties}
        setFaculties={setFaculties}
        selectedFacultyId={selectedFacultyId}
        setSelectedFacultyId={setSelectedFacultyId}
        specializations={specializations}
        setSpecializations={setSpecializations}
        selectedSpecializations={selectedSpecializations}
        setSelectedSpecializations={setSelectedSpecializations}
        handleFacultyChange={handleFacultyChange}
        addSpecializationField={addSpecializationField}
        handleSpecializationChange={handleSpecializationChange}
        removeSpecializationField={removeSpecializationField}
        formError={formError}
        setFormError={setFormError}
        dublicateError={dublicateError}
        setDublicateError={setDublicateError}
        formMode={formMode}
        handleEditData={handleEditData}
        handleEdit={handleEdit}
        translate={translate}
        toggleModal={toggleEditModal}
      />
      
      {/* Modal */}
      <ConfirmActionModal
        actionFunction={() => modalAction === "delete" ? handleDelete(topic.id) : null}
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        action={confirmModalAction}
      />
    </div>
  );
}
