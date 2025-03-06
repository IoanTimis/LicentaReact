"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import FilterBar from "@/app/components/general/filter-bar";
import TopicList from "@/app/components/teacher/topic-list";
import TopicModal from "@/app/components/teacher/topic-form-modal";
import { checkForDuplicates } from "@/utils/checkForDublicates";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import { addTopic, setTopics, updateTopic, deleteTopic, setFilteredTopics } from "@/store/features/topics/topicSlice";
import { useDispatch, useSelector } from "react-redux";

export default function TeacherTopics() {
  const { translate } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const dispatch = useDispatch();

  const topics = useSelector((state) => state.topics.list);
  const filteredTopics = useSelector((state) => state.topics.filteredList);

  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");

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

  const [noMatch, setNoMatch] = useState(false);

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get("/teacher/fetch/topics", { withCredentials: true });

        setFaculties(response.data.faculties);
        dispatch(setTopics(response.data.topics));
      } catch (error) {
        console.error("Error fetching topics:", error);
        setGlobalErrorMessage(translate("An error occurred while fetching topics."));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenConfirmModal = (topicId, action) => {
    setSelectedTopic(topicId);
    setModalAction(action);
    setIsOpen(true);
  };

  const handleAddData = () => {
    setTitle("");
    setDescription("");
    setKeywords("");
    setSlots("");
    setEducationLevel("");
    setSelectedFacultyId(null);
    setSpecializations([]);
    setSelectedSpecializations([null]);
    setFormMode("add");
    toggleModal();
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

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev)
    setDublicateError(null);
  };

  const handleEditData = (id) => {
    const topic = topics.find((topic) => topic.id === id);
    setSelectedTopic(id);
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

    toggleModal();
  };

  const handleSubmit = async (e) => {
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
    
      const response = await axiosInstance.post("/teacher/topic/add", newTopic, {
        withCredentials: true,
      });

      console.log("Theme added successfully!", response.data.topic);

      dispatch(addTopic(response.data.topic));
      
      toggleModal();
      console.log("Theme added successfully!");
    } catch (error) {
      console.error("Error adding theme:", error);
      setGlobalErrorMessage(translate("An error occurred while adding the theme."));
    }
  };

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

      const response = await axiosInstance.put(`/teacher/topic/edit/${selectedTopic}`, newTopic, { withCredentials: true });
      console.log("Theme edited successfully!");

      dispatch(updateTopic(response.data.topic));
      toggleModal();
    } catch (error) {
      console.error("Error editing theme:", error);
      setGlobalErrorMessage(translate("An error occurred while editing the theme."));
    };
  }

  const handleDelete = async (topicId) => {
    try {
      const response = await axiosInstance.delete(`/teacher/topic/delete/${topicId}`, { withCredentials: true });
      
      dispatch(deleteTopic(topicId));
      console.log("Theme deleted successfully!");
    } catch (error) {
      console.error("Error deleting theme:", error);
      setGlobalErrorMessage(translate("An error occurred while deleting the theme."));
    };
  }

  const handleSearchAndFilter = async (searchQuery, filter) => {
    try {
      const selectedEducationLevel = filter.educationLevel;
      const selectedSlots = filter.slots;
      
      const response = await axiosInstance.get("/teacher/search-filter/topics", {
        params: {
          query: searchQuery,
          education_level: selectedEducationLevel,
          slots: selectedSlots
        },
        withCredentials: true
      });
  
      if (response.status === 204) {
        setNoMatch(true);
        console.log("No requests found.");
        return;
      }
  
      setNoMatch(false);
      dispatch(setFilteredTopics(response.data.topics));
    } catch (error) {
      console.error("Error searching requests:", error);
      setGlobalErrorMessage(translate("Error searching for themes. Please try again."));
    }
  };

  if(topics.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-700">{translate("You didn't add any themes yet.")}</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4">
     <FilterBar className="lg:w-1/4 w-full" filterOnDatabase={true} filterSearchDatabase={handleSearchAndFilter} noMatch={noMatch} />

     <TopicList 
      topics={filteredTopics.length > 0 ? filteredTopics : topics}
      loading={loading}
      handleOpenConfirmModal={handleOpenConfirmModal}
      setIsModalOpen={setIsModalOpen}
      setFormMode={setFormMode}
      setSelectedTopic={setSelectedTopic}
      translate={translate}
      handleEditData={handleEditData}
      handleAddData={handleAddData}
     />

    {/* Add/edit modal */}
    <TopicModal
      isOpen={isModalOpen}
      toggleModal={toggleModal}
      formMode={formMode}
      translate={translate}
      handleSubmit={handleSubmit}
      handleEdit={handleEdit}
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
      selectedFacultyId={selectedFacultyId}
      handleFacultyChange={handleFacultyChange}
      specializations={specializations}
      selectedSpecializations={selectedSpecializations}
      handleSpecializationChange={handleSpecializationChange}
      removeSpecializationField={removeSpecializationField}
      addSpecializationField={addSpecializationField}
      dublicateError={dublicateError}
    />

    <ConfirmActionModal
      actionFunction={() => modalAction === "delete" ? handleDelete(selectedTopic) : null}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      action={modalAction}
    />
  </div>
  );
}
