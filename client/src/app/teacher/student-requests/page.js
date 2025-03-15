"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import RequestCard from "@/app/components/general/request-card";
import AcceptRejectModal from "@/app/components/teacher/accept-reject-modal";
import FilterBar from "@/app/components/general/filter-bar";
import { useLanguage } from "@/context/Languagecontext";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import { sendEmail } from "@/app/api/sendEmail/page"; 
import { jwtDecode } from "jwt-decode";
import { BuildEmailData } from "@/utils/buildEmailData";
import { setRequests, addRequest, updateRequest, deleteRequest, setFilteredRequests } from "@/store/features/requests/requestSlice";
import { useDispatch, useSelector } from "react-redux";

export default function StudentRequests() {
  const requests = useSelector((state) => state.requests.list);
  const filteredRequests = useSelector((state) => state.requests.filteredList);
  const localUser = useSelector((state) => state.user.data.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const { translate, language } = useLanguage();
  const { setGlobalErrorMessage } = useContext(ErrorContext);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/teacher/fetch/student-requests", { withCredentials: true });
      
        dispatch(setRequests(response.data.requests));
      } catch (error) {
        console.error("Error fetching requests:", error);
        setGlobalErrorMessage(translate("An error occurred while fetching requests. Please try again."));
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleOpenConfirmModal = (requestId, action) => {
    setSelectedRequestId(requestId);
    setModalAction(action);
    setIsOpen(true);
  };

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

    try {
      if(!selectedRequestId) {
        throw new Error("ID not found");
      }

      const response = await axiosInstance.put(
        `/teacher/student-request/response/${selectedRequestId}`, 
        { status }, 
        { withCredentials: true }
      );

      const commentMessage = formData.get("message");
      const requestId = response.data.request.id;

      const addComment = await axiosInstance.post(`/teacher/student-request/comment/add/${requestId}`, 
        { commentMessage }, { withCredentials: true });

      const updatedRequest = response.data.request;

      dispatch(updateRequest(updatedRequest));

      if(process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        const to = updatedRequest.student.email;
        const title = updatedRequest.topic.title;
        const actionMakerEmail = localUser.email;
        const action = status === "accepted" ? "acceptRequest" : "rejectRequest";
        const role = "teacher";

        const data = {
          to,
          title,
          actionMakerEmail,
          action,
          language,
          role,
          id: selectedRequestId,
        };

        const emailData = BuildEmailData(data);
        console.log("emailData", emailData);
        
        sendEmail(emailData)
          .then((response) => console.log("Response:", response))
          .catch((error) => console.error("Error sending:", error));
      }
      
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
      const deletedRequest = requests.find((request) => request.id === requestId);

      dispatch(deleteRequest(requestId));

      if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        const to = deletedRequest.student.email;
        const title = deletedRequest.topic.title;
        const actionMakerEmail = localUser.email;
        const action = "deleteRequest";
        const role = "teacher";

        const data = {
          to,
          title,
          actionMakerEmail,
          action,
          language,
          role
        };

        const emailData = BuildEmailData(data);
        console.log("emailData", emailData);

        sendEmail(emailData)
          .then((response) => console.log("Response:", response))
          .catch((error) => console.error("Error sending:", error));
      }

      console.log("Request deleted successfully.");
    } catch (error) {
      console.error("Error deleting request:", error);
      setGlobalErrorMessage(translate("An error occurred while deleting request. Please try again."));
    }
  };

  //Search and Filter
  const handleSearchAndFilter = async (searchQuery, filter) => {
    try {
      const selectedStatus = filter.status;
      console.log("selectedStatus", selectedStatus);
      const response = await axiosInstance.get("/teacher/search-filter/requests", {
        params: {
          query: searchQuery,
          status: selectedStatus
        },
        withCredentials: true
      });
  
      if (response.status === 204) {
        setNoMatch(true);
        console.log("No requests found.");
        return;
      }
  
      setNoMatch(false);
      dispatch(setFilteredRequests(response.data.requests));
    } catch (error) {
      console.error("Error searching requests:", error);
      setGlobalErrorMessage(translate("Error searching for requests. Please try again."));
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
    <div className="mx-auto flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4">

      <FilterBar className="lg:w-1/4 w-full" 
        filterOnDatabase={true} 
        filterSearchDatabase={handleSearchAndFilter} 
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
                onResponse={onResponse}
                userRole={"teacher"}
                translate={translate}
              />
            </div>
          ))}
        </div>
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
