"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import AcceptRejectModal from "@/app/components/teacher/accept-reject-modal";
import { jwtDecode } from "jwt-decode";
import { EnvelopeIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function TopicDetails() {
  const [request, setRequest] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRequestDeleted, setIsRequestDeleted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { translate } = useLanguage();
  const { id } = useParams();
  
  const accessToken = localStorage.getItem("accessToken");
  const user = jwtDecode(accessToken);

  const toggleModal = () => {
    setResponseModalOpen((prev) => !prev);
  };

  const openConfirmModal = (action) => {
    setIsOpen(true);
    setModalAction(action);
  };


  // Fetch topic details
  useEffect(() => {
    if (!id) return;

    const fetchRequestDetails = async () => {
      try {
        const response = await axiosInstance.get(`/teacher/fetch/student-request/${id}`, { withCredentials: true });
        setRequest(response.data.request);

      } catch (error) {
        console.error("Eroare la obținerea detaliilor temei:", error);
        setErrorMessage("A apărut o eroare la încărcarea detaliilor temei.");
      }
    };

    fetchRequestDetails();
  }, [id]);

  const handleDelete = async (topicId) => {
    try {
      await axiosInstance.delete(`/teacher/student-request/delete/${topicId}`, { withCredentials: true });
      console.log("Tema a fost ștearsă.");
      setIsRequestDeleted(true);
    } catch (error) {
      console.error("Eroare la ștergerea temei:", error);
      setErrorMessage("A apărut o eroare la ștergerea temei.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const status = formData.get("status");
    const message = formData.get("message");
    console.log("status", status);
    console.log("message", message);

    try {
      await axiosInstance.put(`/teacher/student-request/response/${request.id}`, { status, message }, { withCredentials: true });
  
      console.log("Răspunsul a fost trimis.");
      toggleModal();
    } catch (error) {
      console.error("Eroare la trimiterea răspunsului:", error);
    }
  };

  if (isRequestDeleted){
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-green-500">{ translate("The request has been successfully deleted.") }</h1>
      </div>
    );
  }

  if (!request && !errorMessage) {
    return <div className="text-center text-black mt-8">Se încarcă...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Layout */}
      {request && (
        <>
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-6">{request.topic.title}</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">

            {/* Professor Details */}
            <div
              className={"bg-gray-100 p-6 flex flex-col items-center justify-center"}
            >
              <div className="w-28 h-28 rounded-full overflow-hidden mb-6">
                <img
                  src="/logo_uvt_profile.png"
                  alt={`${user.first_name} ${user.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {user.title}. {user.first_name} {user.name}
              </h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
            </div>

            {/* Topic Details */}
            <div
              className={"bg-gray-100 p-6 flex flex-col items-center justify-center"}
            >
              <p className="text-gray-700 mb-4 ">
                <span className="font-semibold">{ translate("Keywords") }:</span> {request.topic.keywords}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold ">{ translate("Slots") }:</span> {request.topic.slots}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold ">{ translate("Education Level") }:</span> {request.topic.education_level}
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
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={toggleModal}
            >
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              {translate("Respond to Request")}
            </button>
            <button
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
              onClick={() => openConfirmModal("delete")}
            >
              <TrashIcon className="w-5 h-5 mr-2" />
              {translate("Delete")}
            </button>
          </div>
        )}
        </div>

          {/* Description */}
          <div className="bg-gray-100 p-6 max-w-7xl mx-auto min-h-screen rounded-bl-lg rounded-br-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{ translate("Description") }</h2>
            <p className="text-gray-700 text-center">{request.description}</p>
          </div>
        </>
      )}
      {/* Modals */}
      <AcceptRejectModal
        isOpen={responseModalOpen}
        onClose={toggleModal}
        onSubmit={handleSubmit}
        translate={translate}
      />
      
      <ConfirmActionModal
        actionFunction={() => modalAction === "delete" ? handleDelete(request.id) : null}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        action={modalAction}
      />
    </div>
  );
}
