"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import RequestCard from "@/app/components/general/request-card";
import AcceptRejectModal from "@/app/components/teacher/accept-reject-modal";
import { useLanguage } from "@/context/Languagecontext";

export default function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState();
  const { translate } = useLanguage();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get("/teacher/fetch/student-requests", { withCredentials: true });
        setRequests(response.data.requests);
      } catch (error) {
        console.error("Eroare la obținerea cererilor:", error);
      }
    };

    fetchRequests();
  }, []);

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
        throw new Error("Id-ul cererii nu este definit.");
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
      console.log("Răspunsul a fost trimis.");
      toggleModal();
    } catch (error) {
      console.error("Eroare la trimiterea răspunsului:", error);
    }
  };

  const handleDelete = async (requestId) => {
    try {
      await axiosInstance.delete(`/teacher/student-request/delete/${requestId}`, { withCredentials: true });
      setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
      console.log("Cererea a fost ștearsă.");
    } catch (error) {
      console.error("Eroare la ștergerea cererii:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {requests.map((request) => (
        <div key={request.id}> 
          <RequestCard request={request} handleDelete={handleDelete}  onResponse={onResponse}/>
        </div>
      ))}
    </div>

      <AcceptRejectModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSubmit={handleSubmit}
        translate={translate}
      />
   </div>
  );
}
