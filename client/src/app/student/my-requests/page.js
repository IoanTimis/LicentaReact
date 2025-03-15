"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import RequestCard from "@/app/components/general/request-card";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import FilterBar from "@/app/components/general/filter-bar";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import { useLanguage } from "@/context/Languagecontext";
import { setRequests, addRequest, updateRequest, deleteRequest, setFilteredRequests } from "@/store/features/requests/requestSlice";
import { useDispatch, useSelector } from "react-redux";
import { BuildEmailData } from "@/utils/buildEmailData";
import { sendEmail } from "@/app/api/sendEmail/page";
import { jwtDecode } from "jwt-decode";

export default function StudentRequests() {
  const requests = useSelector((state) => state.requests.list);
  const filteredRequests = useSelector((state) => state.requests.filteredList);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const { translate, language } = useLanguage();
  const [noMatch, setNoMatch] = useState(false);
  const localUser = useSelector((state) => state.user.data.user);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleOpenConfirmModal = (requestId, action) => {
    setSelectedRequest(requestId);
    setModalAction(action);
    setIsOpen(true);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/student/fetch/requested-topics", { withCredentials: true });
        
        dispatch(setRequests(response.data.requests));
      } catch (error) {
        console.error("Error fetching requests:", error);
        setGlobalErrorMessage(translate(translate("An error occurred while fetching requests. Please try again.")));
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleConfirm = async (requestId) => {
    try {
      const response = await axiosInstance.put(`/student/request/confirm/${requestId}`, { withCredentials: true });
      dispatch(setRequests([response.data.request]));
      setIsConfirmed(true);

      if(process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        const to = response.data.request.teacher.email;
        const title = response.data.request.topic.title;
        const actionMakerEmail = localUser.email;
        const action = "confirmRequest";
        const role = "student";

        const data = {
          to,
          title,
          actionMakerEmail,
          action,
          language,
          role,
          id: requestId,
        }

        const emailData = BuildEmailData(data);

        sendEmail(emailData)
          .then(() => console.log("Email sent."))
          .catch((error) => console.error("Error sending email:", error));
      }
  
      console.log("Request confirmed. Other requests were removed.");
    } catch (error) {
      console.error("Error confirming request:", error);
      setGlobalErrorMessage(translate("An error occurred while confirming the request. Please try again."));
    }
  };
  

  const handleDelete = async (requestId) => {
    try {
      await axiosInstance.delete(`/student/request/delete/${requestId}`, { withCredentials: true });
      const deletedRequest = requests.find((request) => request.id === requestId);
      dispatch(deleteRequest(requestId));

      //Spam too much the teacher
      // if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
      //   const to = deletedRequest.teacher.email;
      //   const title = deletedRequest.topic.title;
      //   const actionMakerEmail = localUser.email;
      //   const action = "deleteRequest";
      //   const role = "student";
      //   const data = {
      //     to,
      //     title,
      //     actionMakerEmail,
      //     action,
      //     language,
      //     role
      //   };
      //   const emailData = BuildEmailData(data);

      //   sendEmail(emailData)
      //     .then(() => console.log("Email sent."))
      //     .catch((error) => console.error("Error sending email:", error));
      // }

      console.log("Request deleted.");
    } catch (error) {
      console.error("Error deleting request:", error);
      setGlobalErrorMessage(translate("An error occurred while deleting the request. Please try again."));
    }
  };

  const handleSearch = (query) => {
    const filtered = requests.filter((request) =>
      request.topic.title.toLowerCase().includes(query.toLowerCase()) ||
      request.teacher.first_name.toLowerCase().includes(query.toLowerCase()) ||
      request.teacher.name.toLowerCase().includes(query.toLowerCase())    
    );
    
    dispatch(setFilteredRequests(filtered));
    setNoMatch(filtered.length === 0);
  };
  

  const handleFilterChange = (filter) => {
    const filtered = filter.status ? requests.filter((request) => request.status === filter.status) : requests
    
    dispatch(setFilteredRequests(filtered));
    setNoMatch(filtered.length === 0);
  };

  if(requests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-700">{translate("You didn't make any requests yet.")}</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4">
      <FilterBar className="lg:w-1/4 w-full" 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange} 
        filterOnDatabase={false} 
        noMatch={noMatch} 
      />

      <div className="lg:w-3/4 w-full p-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-6">
          {loading && <p className="text-center text-gray-700">{translate("Loading...")}</p>}
          {filteredRequests.map((request) => (
            <div key={request.id}> 
              <RequestCard 
                request={request} 
                handleOpenConfirmModal={handleOpenConfirmModal}
                translate={translate}
                userRole="student"
                newConfirmedRequest={isConfirmed}
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
