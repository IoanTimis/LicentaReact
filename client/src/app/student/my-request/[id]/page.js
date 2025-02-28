"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import { BuildEmailData } from "@/utils/buildEmailData";
import { sendEmail } from "@/app/api/sendEmail/page";
import { jwtDecode } from "jwt-decode";

import { PaperAirplaneIcon, TrashIcon, CheckCircleIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";

export default function TopicDetails() {
  const [request, setRequest] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isRequestDeleted, setIsRequestDeleted] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const { translate, language } = useLanguage();
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const { id } = useParams();
  const [commentMessage, setCommentMessage] = useState("");
  const [comments, setComments] = useState([]);

  console.log("request", request);

  const handleModal = (action) => {
    setModalAction(action);
    setIsOpen(true);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const decodedToken = jwtDecode(accessToken);
    setLocalUser(decodedToken);
  }, []);

  // Fetch topic details
  useEffect(() => {
    if (!id) return;

    const fetchRequestDetails = async () => {
      try {
        const response = await axiosInstance.get(`/student/fetch/requested-topic/${id}`, { withCredentials: true });
        setRequest(response.data.request);

        if (response.data.request.status === "confirmed") {
          setIsConfirmed(true);
        }
      } catch (error) {
        console.error("Error fetching request details:", error);
        setGlobalErrorMessage("An error occurred while fetching request details.");
      }
    };

    fetchRequestDetails();
  }, [id]);

  const confirmRequest = async (requestId) => {
    try {
      await axiosInstance.put(`/student/request/confirm/${requestId}`, { withCredentials: true });
      setIsConfirmed(true);
      const to = request.teacher.email;
      const title = request.topic.title;
      const actionMakerEmail = localUser.email;
      const action = "confirmRequest";
      const role = "student";

      const data = {
        to,
        title,
        actionMakerEmail,
        action,
        language,
        role
      }

      const emailData = BuildEmailData(data);
      sendEmail(emailData)
        .then(() => console.log("Email sent successfully."))
        .catch((error) => console.error("Error sending email:", error));

      console.log("Request confirmed successfully.");
    } catch (error) {
      console.error("Error confirming request:", error);
      setGlobalErrorMessage("An error occurred while confirming the request.");
    }
  };

  const handleDelete = async (requestId) => {
    try {
      await axiosInstance.delete(`/student/request/delete/${requestId}`, { withCredentials: true });
      console.log("Request deleted successfully.");
      setIsRequestDeleted(true);
      const to = request.teacher.email;
      const title = request.topic.title;
      const actionMakerEmail = localUser.email;
      const action = "deleteRequest";
      const role = "student";
      const data = {
        to,
        title,
        actionMakerEmail,
        action,
        language,
        role
      }

      const emailData = BuildEmailData(data);
      sendEmail(emailData)
        .then(() => console.log("Email sent successfully."))
        .catch((error) => console.error("Error sending email:", error));

    } catch (error) {
      console.error("Error deleting request:", error);
      setGlobalErrorMessage(translate("An error occurred while deleting the request."));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/student/request/comment/add/${request.id}`, { commentMessage }, { withCredentials: true });
      setComments([...comments, response.data.comment]);
      setCommentMessage("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setGlobalErrorMessage("An error occurred while adding the comment.");
    }
  };

  if (isRequestDeleted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-green-500">{ translate("The request has been successfully deleted.") }</h1>
      </div>
    );
  }

  // if (!request && !errorMessage) {
  //   return <div className="text-center text-black mt-8">Se încarcă...</div>;
  // }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Layout */}
      {request && (
        <>
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-6">{request.topic.title}</h2>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
            {/* Professor Details */}
            <div className="bg-gray-100 p-6 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
                <img
                  src="/logo_uvt_profile.png"
                  alt={request.teacher.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {request.teacher.title}. {request.teacher.first_name} {request.teacher.name}
              </h2>
              <p className="text-gray-600 mb-4">{request.teacher.email}</p>
            </div>
  
            {/* Request Details */}
            <div className="bg-gray-100 p-6 flex flex-col items-center justify-center">
              <p className="text-gray-700 mb-4">
                {request.topic.slots === 0 ? (
                  <span className="text-black">{translate("No slots available")}</span>
                ) : (
                  <span>
                    <span className="font-semibold">{translate("Slots")}:</span> {request.topic.slots}
                  </span>
                )}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">{translate("Education Level")}:</span> {request.topic.education_level}
              </p>
              <p className="text-black">
                {request.status === "pending"
                  ? translate("Pending") + "..."
                  : request.status === "confirmed"
                  ? translate("Confirmed") + "!"
                  : request.status === "accepted"
                  ? translate("Accepted") + "!"
                  : translate("Rejected") + "!"}
              </p>
  
              {/* Request Status + Actions */}
              <div className="bg-gray-100 p-6 flex flex-col items-center justify-center relative">
                <div className="flex space-x-4 mt-2">
                  {request.status === "confirmed" ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-500 cursor-not-allowed" />
                  ) : request.status === "accepted" ? (
                    <div className="relative group">
                      <EllipsisVerticalIcon className="w-8 h-8 text-gray-600 cursor-pointer hover:text-gray-800" />
                      <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleModal("confirm")}
                          className="flex items-center p-2 w-full text-black hover:bg-gray-200"
                        >
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                          {translate("Confirm")}
                        </button>
                        <button
                          onClick={() => handleModal("delete")}
                          className="flex items-center p-2 w-full hover:bg-red-100 text-red-600"
                        >
                          <TrashIcon className="w-5 h-5 text-red-500 mr-2" />
                          {translate("Delete")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <TrashIcon className="w-6 h-6 cursor-pointer text-red-600 transition" 
                        onClick={() => handleModal("delete")}
                      />
                      <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 text-xs bg-gray-800 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        {translate("Delete Request")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
  
          {/* Description */}
          <div className="bg-gray-100 p-6 max-w-7xl mx-auto rounded-bl-lg rounded-br-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {translate("Description")}
            </h2>
            <p className="text-gray-700 text-center">{request.topic.description}</p>
          </div>
  
          <hr className="border-t-1 border-gray-400 my-6" />
  
          {/* Comments */}
          <div className="bg-gray-100 p-6 max-w-7xl mx-auto rounded-bl-lg rounded-br-lg">
          {request.comments.length > 0 && (
            <div className="bg-gray-100 p-6 max-w-7xl mx-auto rounded-bl-lg rounded-br-lg">
              {request.comments.map((comment) => (
                <div key={comment.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
              ))}
            </div>
          )}
          </div>

          {/* Add Comment */}
          <div className="bg-gray-100 p-6 max-w-7xl mx-auto">
            <form className="flex items-center w-full border border-gray-300 rounded-lg p-2 bg-white"
              onSubmit={handleAddComment}
            >
              <textarea
                className="w-full text-black p-2 resize-none focus:outline-none focus:ring-0 overflow-hidden"
                placeholder={translate("Write your comment here...")}
                value={commentMessage}
                rows="1"
                onChange={(e) => setCommentMessage(e.target.value)}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
  
              {/* Buton Send */}
              <button
                type="submit"
                disabled={!commentMessage || commentMessage.trim() === ""}
                className={`ml-2 flex items-center justify-center p-2 rounded-full transition ${
                  !commentMessage || commentMessage.trim() === ""
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                }`}
              >
                <PaperAirplaneIcon className="w-4 h-4 text-white transform" />
              </button>
            </form>
          </div>
        </>
      )}
  
      <ConfirmActionModal
        actionFunction={() => modalAction === "delete" ? handleDelete(request.id) : confirmRequest(request.id)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        action={modalAction}
      />
    </div>
  );
   
}
