"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import RequestCard from "@/app/components/general/request-card";
import AcceptRejectModal from "@/app/components/teacher/accept-reject-modal";
import { useLanguage } from "@/context/Languagecontext";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";

export default function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const { translate } = useLanguage();
  const { setGlobalErrorMessage } = useContext(ErrorContext);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get("/teacher/fetch/student-requests", { withCredentials: true });
        setRequests(response.data.requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setGlobalErrorMessage(translate("An error occurred while fetching requests. Please try again."));
      }
    };

    fetchRequests();
  }, []);

  const handleOpenConfirmModal = (requestId, action) => {
    setSelectedRequestId(requestId);
    setModalAction(action);
    setIsOpen(true);
  };

  //TODO: Refactor all ToggleModal functions to reset the "selectedRequestId"
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    if (!isModalOpen) {
      setSelectedRequestId(null);
    }
  };

  const onResponse = (requestId) => {
    setSelectedRequestId(requestId);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const status = formData.get("status");
    const message = formData.get("message");
    console.log("status", status);
    console.log("message", message);

    try {
      if(!selectedRequestId) {
        throw new Error("ID not found");
      }

      await axiosInstance.put(`/teacher/student-request/response/${selectedRequestId}`, { status, message }, { withCredentials: true });

      setRequests((prevRequests) =>
        prevRequests.map((request) => {
          if (request.id === selectedRequestId) {
            if(status === "accepted") {
              return { ...request, status: "accepted" };
            } else {
              return { ...request, status: "rejected" };
            }
          }
          return request;
        })
      );      
      console.log("Response sent successfully.");
      toggleModal();
    } catch (error) {
      console.error("Error sending response:", error);
      setGlobalErrorMessage(translate("An error occurred while sending response. Please try again."));
    }
  };

  const handleDelete = async (requestId) => {
    try {
      await axiosInstance.delete(`/teacher/student-request/delete/${requestId}`, { withCredentials: true });
      setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
      console.log("Request deleted successfully.");
    } catch (error) {
      console.error("Error deleting request:", error);
      setGlobalErrorMessage(translate("An error occurred while deleting request. Please try again."));
    }
  };

  if(requests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-700">{translate("No requests found.")}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {requests.map((request) => (
        <div key={request.id}> 
          <RequestCard request={request} handleOpenConfirmModal={handleOpenConfirmModal}  onResponse={onResponse}/>
        </div>
      ))}
    </div>

      <AcceptRejectModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSubmit={handleSubmit}
        translate={translate}
      />

      <ConfirmActionModal
        actionFunction={() => modalAction === "delete" ? handleDelete(selectedRequestId) : null}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        action={modalAction}
      />
   </div>
  );
}
