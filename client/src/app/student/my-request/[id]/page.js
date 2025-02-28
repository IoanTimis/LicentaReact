"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import CommentList from "@/app/components/general/comment-list";
import CommentInput from "@/app/components/general/comment-input";
import ProfessorDetails from "@/app/components/general/topic-req-profesor-details";
import RequestDetails from "@/app/components/general/request-details";
import TopicDescription from "@/app/components/general/topic-description";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import { BuildEmailData } from "@/utils/buildEmailData";
import { sendEmail } from "@/app/api/sendEmail/page";
import { jwtDecode } from "jwt-decode";

export default function RequestTopicDetails() {
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState("");
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

  const toggleConfirmActionModal = (action) => {
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
        setStatus(response.data.request.status);
        setComments(response.data.request.comments);

      } catch (error) {
        console.error("Error fetching request details:", error);
        setGlobalErrorMessage(translate("An error occurred while fetching request details."));
      }
    };

    fetchRequestDetails();
  }, [id]);

  const confirmRequest = async (requestId) => {
    try {
      await axiosInstance.put(`/student/request/confirm/${requestId}`, { withCredentials: true });
      setStatus("confirmed");

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
      setGlobalErrorMessage(translate("An error occurred while confirming the request."));
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
      setGlobalErrorMessage(translate("An error occurred while adding the comment."));
    }
  };

  if (isRequestDeleted) {
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
            <ProfessorDetails teacher={request.teacher} />
  
            {/* Request Details */}
            <RequestDetails 
              topic={request.topic} 
              status={status} 
              toggleConfirmActionModal={toggleConfirmActionModal} 
              translate={translate} 
              role={localUser.role} 
            />
          </div>
  
          {/* Description */}
          <TopicDescription description={request.topic.description} translate={translate} />
  
          <hr className="border-t-1 border-gray-400" />
  
          {/* Comments */}
          <CommentList comments={comments} language={language} translate={translate}  />

          {/* Add Comment */}
          <CommentInput
            commentMessage={commentMessage}
            setCommentMessage={setCommentMessage}
            handleAddComment={handleAddComment}
          />
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
