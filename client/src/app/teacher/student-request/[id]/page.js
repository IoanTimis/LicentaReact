"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import AcceptRejectModal from "@/app/components/teacher/accept-reject-modal";
import { jwtDecode } from "jwt-decode";
import { EnvelopeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import { BuildEmailData } from "@/utils/buildEmailData";
import { sendEmail } from "@/app/api/sendEmail/page";

export default function TopicDetails() {
  const [request, setRequest] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [isRequestDeleted, setIsRequestDeleted] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const { translate, language } = useLanguage();
  const { id } = useParams();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const decodedToken = jwtDecode(accessToken);
    setLocalUser(decodedToken);
  }, []);

  const toggleModal = () => {
    setResponseModalOpen((prev) => !prev);
    setIsDropdownOpen(false);
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
        console.error("Error fetching topic details:", error);
        setGlobalErrorMessage(translate("An error occurred while fetching topic details."));
      }
    };

    fetchRequestDetails();
  }, [id]);

  const handleDelete = async (topicId) => {
    try {
      await axiosInstance.delete(`/teacher/student-request/delete/${topicId}`, { withCredentials: true });
      const to = request.student.email;
      const title = request.topic.title;
      const actionMakerEmail = localUser.email;
      const action = "deleteRequest";

      const data = {
        to,
        title,
        actionMakerEmail,
        action,
        language
      }

      const emailData = BuildEmailData(data);

      sendEmail(emailData)
        .then((response) => console.log("Response:", response))
        .catch((error) => console.error("Error sending:", error));

      console.log("Theme deleted successfully.");
      setIsRequestDeleted(true);
    } catch (error) {
      console.error("Error deleting topic:", error);
      setGlobalErrorMessage(translate("An error occurred while deleting the topic."));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const status = formData.get("status");
    const message = formData.get("message");

    try {
      await axiosInstance.put(`/teacher/student-request/response/${request.id}`, { status, message }, { withCredentials: true });
      setRequest({ ...request, status });
      
      const to = request.student.email;
      const title = request.topic.title;
      const actionMakerEmail = localUser.email;
      const action = status === "accepted" ? "acceptRequest" : "rejectRequest";

      const data = {
        to,
        title,
        actionMakerEmail,
        action,
        language
      };
      
      const emailData = BuildEmailData(data);

      sendEmail(emailData)
        .then((response) => console.log("Response:", response))
        .catch((error) => console.error("Error sending:", error));

      console.log("Response sent successfully.");
      toggleModal();
    } catch (error) {
      console.error("Error sending response:", error);
      setGlobalErrorMessage(translate("An error occurred while sending the response."));
    }
  };

  if (isRequestDeleted){
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-green-500">{ translate("The request has been successfully deleted.") }</h1>
      </div>
    );
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
                  alt={`${localUser.first_name} ${localUser.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {localUser.title}. {localUser.first_name} {localUser.name}
              </h2>
              <p className="text-gray-600 mb-4">{localUser.email}</p>
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
              {request.status === "pending" ? (
                <p className="text-yellow-500">{ translate("Pending") }...</p>
              ) : request.status === "confirmed" ? (
                <p className="text-green-500">{ translate("Confirmed") }!</p>
              ) : request.status === "accepted" ? (
                <p className="text-blue-500">{ translate("Accepted") }!</p>
              ) : (
                <p className="text-red-500">{ translate("Rejected") }!</p>
              )}
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
