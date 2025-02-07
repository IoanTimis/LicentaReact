"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";

export default function TopicDetails() {
  const [topic, setTopic] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const { translate } = useLanguage();
  const { id } = useParams();
  const { setGlobalErrorMessage } = useContext(ErrorContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEdit = () => {
    console.log("Edit clicked");
    setIsDropdownOpen(false); // Închide dropdown-ul
  };

  const openConfirmModal = (action) => {
    setIsOpen(true);
    setModalAction(action);
  };


  // Fetch topic details
  useEffect(() => {
    if (!id) return;

    const fetchTopicDetails = async () => {
      try {
        const response = await axiosInstance.get(`/teacher/fetch/topic/${id}`, { withCredentials: true });
        setTopic(response.data.topic);

      } catch (error) {
        console.error("Error fetching topic details:", error);
        setGlobalErrorMessage(translate("An error occurred while fetching topic details."));
      }
    };

    fetchTopicDetails();
  }, [id]);

  const handleDelete = async (topicId) => {
    try {
      await axiosInstance.delete(`/teacher/topic/delete/${topicId}`, { withCredentials: true });
      console.log("Theme deleted successfully");
    } catch (error) {
      console.error("Error deleting theme:", error);
      setGlobalErrorMessage(translate("An error occurred while deleting the theme."));
    }
  };

  //TODO: Edit Logic

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Layout */}
      {topic && (
        <>
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-6">{topic.title}</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">

            {/* Professor Details */}
            <div
              className={"bg-gray-100 p-6 flex flex-col items-center justify-center"}
            >
              <div className="w-28 h-28 rounded-full overflow-hidden mb-6">
                <img
                  src="/logo_uvt_profile.png"
                  alt={`${topic.user.first_name} ${topic.user.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {topic.user.title}. {topic.user.first_name} {topic.user.name}
              </h2>
              <p className="text-gray-600 mb-4">{topic.user.email}</p>
            </div>

            {/* Topic Details */}
            <div
              className={"bg-gray-100 p-6 flex flex-col items-center justify-center"}
            >
              <p className="text-gray-700 mb-4 ">
                <span className="font-semibold">{ translate("Keywords") }:</span> {topic.keywords}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold ">{ translate("Slots") }:</span> {topic.slots}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold ">{ translate("Education Level") }:</span> {topic.education_level}
              </p>
            </div>
          </div>
          {/* Actions button */}
          <div className="relative flex justify-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 w-[50%] rounded flex items-center justify-between"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {translate("Actions")}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute mt-12 w-[50%] bg-white shadow-lg border rounded-md z-50">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleEdit}
              >
                ✏️ {translate("Edit")}
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                onClick={() => openConfirmModal("delete")}
              >
                🗑️ {translate("Delete")}
              </button>
            </div>
          )}
        </div>

          {/* Description */}
          <div className="bg-gray-100 p-6 max-w-7xl mx-auto min-h-screen rounded-bl-lg rounded-br-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{ translate("Description") }</h2>
            <p className="text-gray-700 text-center">{topic.description}</p>
          </div>
        </>
      )}
      
      {/* Modal */}
      <ConfirmActionModal
        actionFunction={() => modalAction === "delete" ? handleDelete(topic.id) : null}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        action={modalAction}
      />
    </div>
  );
}
