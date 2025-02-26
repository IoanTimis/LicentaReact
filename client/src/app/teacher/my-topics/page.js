"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { PlusCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useLanguage } from "@/context/Languagecontext";
import TopicCard from "@/app/components/teacher/topic-card";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import FilterBar from "@/app/components/general/filter-bar";
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
        dispatch(setTopics(response.data.teacher.topics));
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

  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen((prev) => !prev);

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
    return <p className="text-center text-gray-700">{ translate("You didn't add any themes yet.")}</p>;
  }

  return (
    <div className="mx-auto flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4">
     <FilterBar className="lg:w-1/4 w-full" filterOnDatabase={true} filterSearchDatabase={handleSearchAndFilter} noMatch={noMatch} />

      {/* Topics */}
    <div className="lg:w-3/4 w-full p-4 flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-6">
        {/* Add Topic Card */}
        <div className="bg-white shadow rounded hover:shadow-lg transition cursor-pointer border border-gray-950" onClick={handleAddData}>
          <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
            <h2 className="text-lg text-white font-semibold ">{translate("Add a new theme")}</h2>
          </div>
          <div className="px-4 py-2">
            <p className="text-gray-700">{translate("Click here to add a new theme")}</p>
          </div>
          <div className="pb-4">
            <PlusCircleIcon className="h-9 w-9 text-gray-400 mx-auto"/>
          </div>
        </div>
        {loading && <div className="text-center text-gray-700">Se încarcă...</div>}
        {/* Topic Cards */}
        {filteredTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} translate={translate} onEdit={handleEditData} handleOpenConfirmModal={handleOpenConfirmModal} />
        ))}
      </div>
    </div>

    {/* Modal */}
    {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              { formMode === "add" ? translate("Add Theme") : translate("Edit Theme") }
            </h2>
            <form onSubmit={formMode === "add" ? handleSubmit : handleEdit}>
              <div className="mb-4">
                <label className="block text-gray-700">{ translate("Title") }</label>
                <input
                  type="text"
                  className="border border-gray-300 text-gray-700 rounded w-full p-2"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{ translate("Description") }</label>
                <textarea
                  className="border border-gray-300 text-gray-700 rounded w-full p-2"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{ translate("Keywords") }</label>
                <input
                  type="text"
                  className="border border-gray-300 text-gray-700 rounded w-full p-2"
                  name="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
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
                  value={slots}
                  onChange={(e) => setSlots(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{ translate("Education Level") }</label>
                <select
                  className="border border-gray-300 text-gray-700 rounded w-full p-2"
                  name="education_level"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
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
                  value={selectedFacultyId || ""}
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
                      className={`border ${dublicateError ? "border-red-500" : "border-gray-300"} text-gray-700 rounded w-full p-2`}
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
                {dublicateError && <p className="text-red-500 text-sm mt-1">{translate(dublicateError)}</p>}
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

     <ConfirmActionModal
      actionFunction={() => modalAction === "delete" ? handleDelete(selectedTopic) : null}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      action={modalAction}
    />
  </div>
  );
}
