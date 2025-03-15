"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";
import AcceptRejectModal from "@/app/components/teacher/accept-reject-modal";
import CommentList from "@/app/components/general/comment-list";
import CommentInput from "@/app/components/general/comment-input";
import ProfessorDetails from "@/app/components/general/topic-req-profesor-details";
import RequestDetails from "@/app/components/general/request-details";
import TopicDescription from "@/app/components/general/topic-description";
import { jwtDecode } from "jwt-decode";
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
  const [commentMessage, setCommentMessage] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const decodedToken = jwtDecode(accessToken);
    setLocalUser(decodedToken);
  }, []);

  const toggleResponseModal = () => {
    setResponseModalOpen((prev) => !prev);
    setIsDropdownOpen(false);
  };

  const toggleConfirmActionModal = (action) => {
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
        setComments(response.data.request.comments);

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

      if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        const to = request.student.email;
        const title = request.topic.title;
        const actionMakerEmail = localUser.email;
        const action = "deleteRequest";
        const role = "teacher";

        const data = {
          to,
          title,
          actionMakerEmail,
          action,
          language,
          role,
          id: topicId,
        }

        const emailData = BuildEmailData(data);

        sendEmail(emailData)
          .then((response) => console.log("Response:", response))
          .catch((error) => console.error("Error sending:", error));
      }

      console.log("Theme deleted successfully.");
      setIsRequestDeleted(true);
    } catch (error) {
      console.error("Error deleting topic:", error);
      setGlobalErrorMessage(translate("An error occurred while deleting the topic."));
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const status = formData.get("status");
      const message = formData.get("message");

      const response = await axiosInstance.put(`/teacher/student-request/response/${request.id}`, { status }, { withCredentials: true });
      setRequest({ ...request, status });

      const commentMessage = formData.get("message");
      const requestId = response.data.request.id;

      const addComment = await axiosInstance.post(`/teacher/student-request/comment/add/${requestId}`, 
        { commentMessage }, { withCredentials: true });

      setComments([...comments, addComment.data.comment]);
      
      if(process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        const to = request.student.email;
        const title = request.topic.title;
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
          id: request.id,
        };
        
        const emailData = BuildEmailData(data);

        sendEmail(emailData)
          .then((response) => console.log("Response:", response))
          .catch((error) => console.error("Error sending:", error));
      }

      console.log("Response sent successfully.");
      toggleResponseModal();
    } catch (error) {
      console.error("Error sending response:", error);
      setGlobalErrorMessage(translate("An error occurred while sending the response."));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/teacher/student-request/comment/add/${request.id}`, { commentMessage }, { withCredentials: true });

      setComments([...comments, response.data.comment]);
      setCommentMessage("");

      if(process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        const to = request.student.email;
        const title = request.topic.title;
        const actionMakerEmail = localUser.email;
        const action = "newComment";
        const role = "teacher";

        const data = {
          to,
          title,
          actionMakerEmail,
          action,
          language,
          role,
          id: request.id,
        };
        
        const emailData = BuildEmailData(data);

        sendEmail(emailData)
          .then((response) => console.log("Response:", response))
          .catch((error) => console.error("Error sending:", error));
      }

    } catch (error) {
      console.error("Error adding comment:", error);
      setGlobalErrorMessage(translate("An error occurred while adding the comment."));
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
            <ProfessorDetails teacher={localUser} />

            <RequestDetails 
              topic={request.topic} 
              request={request} 
              toggleConfirmActionModal={toggleConfirmActionModal}
              toggleResponseModal={toggleResponseModal} 
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
      {/* Modals */}
      <AcceptRejectModal
        isOpen={responseModalOpen}
        onClose={toggleResponseModal}
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
