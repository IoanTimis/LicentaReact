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
            <div className={"bg-gray-100 p-6 flex flex-col items-center justify-center"}>
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
                <img
                  src="/logo_uvt_profile.png"
                  alt={`userphoto`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {request.teacher.title}. {request.teacher.first_name} {request.teacher.name}
              </h2>
              <p className="text-gray-600 mb-4">{request.teacher.email}</p>
            </div>

            {/* Request Details */}
            <div className={"bg-gray-100 p-6 flex flex-col items-center justify-center"}>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold ">{ translate("Description") }:</span> {request.topic.description}
              </p>
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
                <span className="font-semibold ">{ translate("Education Level") }:</span> {request.topic.education_level}
              </p>
              {request.status === "pending" ? (
                <p className="text-black">{ translate("Pending") }...</p>
              ) : request.status === "confirmed" ? (
                <p className="text-black">{ translate("Confirmed") }!</p>
              ) : request.status === "accepted" ? (
                <p className="text-black">{ translate("Accepted") }!</p>
              ) : (
                <p className="text-black">{ translate("Rejected") }!</p>
              )}
            </div>
          </div>
          {/* Request button */}
          {request.status === "accepted" ? (
            <div className="relative flex justify-center mt-4">
              <button 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 w-[50%] rounded"
                onClick={() => handleModal("confirm")}
              >
                {translate("Confirm Request")}
              </button>
            </div>
          ) : request.status === "confirmed" ? (
            <div className="relative flex justify-center mt-4">
              <button 
                className="bg-gray-500 text-white font-semibold py-2 px-4 w-[50%] rounded cursor-not-allowed"
                disabled
              >
                {translate("Confirmed")}
              </button>
            </div>
          ) : (
            <div className="relative flex justify-center mt-4">
              <button 
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 w-[50%] rounded"
                onClick={() => handleModal("delete")}
              >
                {translate("Delete Request")}
              </button>
            </div>
          )}
          {/* Description */}
          <div className="bg-gray-100 p-6 max-w-7xl mx-auto min-h-screen rounded-bl-lg rounded-br-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{ translate("Description") }</h2>
            <p className="text-gray-700 text-center">{request.topic.description}</p>
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
