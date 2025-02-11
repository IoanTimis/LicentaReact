"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import RequestCard from "@/app/components/general/request-card";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import FilterBar from "@/app/components/general/filter-bar";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import { useLanguage } from "@/context/Languagecontext";

export default function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const { translate } = useLanguage();
  const [noMatch, setNoMatch] = useState(false);

  const handleOpenConfirmModal = (requestId, action) => {
    setSelectedRequest(requestId);
    setModalAction(action);
    setIsOpen(true);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get("/student/fetch/requested-topics", { withCredentials: true });
        setRequests(response.data.requests);
        setFilteredRequests(response.data.requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setGlobalErrorMessage(translate(translate("An error occurred while fetching requests. Please try again.")));
      }
    };

    fetchRequests();
  }, []);

  const handleConfirm = async (requestId) => {
    try {
      await axiosInstance.put(`/student/request/confirm/${requestId}`, { withCredentials: true });
  
      setRequests((prevRequests) =>
        prevRequests
          .map((request) => {
            if (request.id === requestId) {
              return { ...request, status: "confirmed" };
            }
            return request;
          })
          .filter((request) => request.id === requestId)
      );
  
      console.log("Request confirmed. Other requests were removed.");
    } catch (error) {
      console.error("Error confirming request:", error);
      setGlobalErrorMessage(translate("An error occurred while confirming the request. Please try again."));
    }
  };
  

  const handleDelete = async (requestId) => {
    try {
      await axiosInstance.delete(`/student/request/delete/${requestId}`, { withCredentials: true });
      setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));

      console.log("Request deleted.");
    } catch (error) {
      console.error("Error deleting request:", error);
      setGlobalErrorMessage(translate("An error occurred while deleting the request. Please try again."));
    }
  };

  //TODO: Toate functiile de cautare ce nu interogheaza baza de date trebuie sa le fac si lor sa activeze "noMatch" daca nu gasesc nimic
  const handleSearch = (query) => {
    setFilteredRequests(requests.filter((request) =>
      request.topic.title.toLowerCase().includes(query.toLowerCase()) ||
      request.teacher.first_name.toLowerCase().includes(query.toLowerCase()) ||
      request.teacher.name.toLowerCase().includes(query.toLowerCase())    
    ));
  };

  const handleFilterChange = (filter) => {
    setFilteredRequests(
      filter.status ? requests.filter((request) => request.status === filter.status) : requests
    );
  };

  if(requests.length === 0) {
    return <div className="min-h-screen bg-gray-100 p-8">{ translate("You didn't make any requests yet.") }</div>
  }

  return (
    <div className="mx-auto flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4">

      <FilterBar className="lg:w-1/4 w-full" onSearch={handleSearch} onFilterChange={handleFilterChange} filterOnDatabase={false} noMatch={noMatch} />

      <div className="lg:w-3/4 w-full p-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-6">
          {filteredRequests.map((request) => (
            <div key={request.id}> 
              <RequestCard 
              request={request} 
              handleOpenConfirmModal={handleOpenConfirmModal}
              />
            </div>
          ))}
        </div>
      </div>
      
    <ConfirmActionModal
      actionFunction={() => modalAction === "delete" ? handleDelete(selectedRequest) : handleConfirm(selectedRequest)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      action={modalAction}
    />
   </div>
  );
}
