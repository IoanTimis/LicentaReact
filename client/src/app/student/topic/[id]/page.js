"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import RequestModal from "@/app/components/student/request-modal";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import ProfessorDetails from "@/app/components/general/topic-req-profesor-details";
import TopicDescription from "@/app/components/general/topic-description";
import TopicDetails from "@/app/components/general/topic-details";
import { jwtDecode } from "jwt-decode";
import { BuildEmailData } from "@/utils/buildEmailData";
import { sendEmail } from "@/app/api/sendEmail/page";

export default function TopicDetailsPage() {
  const [topic, setTopic] = useState(null);
  const [hasConfirmedRequest, setHasConfirmedRequest] = useState(false);
  const [topicRequested, setTopicRequested] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { translate, language } = useLanguage();
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const { id } = useParams();
  const [localUser, setLocalUser] = useState(null);

  const toggleRequestModal = () => setIsModalOpen((prev) => !prev);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const decodedToken = jwtDecode(accessToken);
    setLocalUser(decodedToken);
  }, []);

  // Fetch topic details
  useEffect(() => {
    if (!id) return;

    const fetchTopicDetails = async () => {
      try {
        const response = await axiosInstance.get(`/student/fetch/topic/${id}`, { withCredentials: true });
        setTopic(response.data.topic);
        setHasConfirmedRequest(response.data.hasConfirmedRequest);

        const topicRequestedResponse = await axiosInstance.get(`/student/is-topic-requested/${id}`, { withCredentials: true });
        setTopicRequested(topicRequestedResponse.data.requested);

      } catch (error) {
        console.error("Error fetching topic details:", error);
        setGlobalErrorMessage("An error occurred while fetching the topic details.");
      }
    };

    fetchTopicDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);

      const newRequest = {
        topic_id: formData.get("topic_id"),
        teacher_id: formData.get("teacher_id"),
        education_level: formData.get("education_level"),
      };

      const response = await axiosInstance.post("/student/request/add", newRequest, { withCredentials: true });

      const commentMessage = formData.get("message");
      const requestId = response.data.request.id;

      const addComment = await axiosInstance.post(`/student/request/comment/add/${requestId}`, 
        { commentMessage }, { withCredentials: true });

      console.log("Process: ",process.env.NEXT_PUBLIC_NODE_ENV);

      if(process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        const to = response.data.topic.user.email;
        const title = response.data.topic.title;
        const actionMakerEmail = localUser.email;
        const action = "newRequest";
        const role = "student";

        const data = {
          to,
          title,
          actionMakerEmail,
          action,
          language,
          role,
          id: requestId,
        };

        const emailData = BuildEmailData(data);

        sendEmail(emailData)
          .then(() => console.log("Email sent."))
          .catch((error) => console.error("Error sending email:", error));
      }

      console.log("Request response:", response.data);
      setTopicRequested(true);
      toggleRequestModal();
    } catch (error) {
      console.error("Error sending request:", error);
      setGlobalErrorMessage("An error occurred while sending the request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Layout */}
      {topic && (
        <>
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-6">{topic.title}</h2>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">

            {/* Professor Details */}
            <ProfessorDetails teacher={topic.user} />

            {/* Topic Details */}
            <TopicDetails
              topic={topic}
              role="student"
              isRequested={topicRequested}
              toggleRequestModal={toggleRequestModal}
              hasConfirmedRequest={hasConfirmedRequest}
              translate={translate}
            />
          </div>

          {/* Description */}
          <TopicDescription description={topic.description} translate={translate} />
        </>
      )}

      {/* Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={toggleRequestModal}
        onSubmit={handleSubmit}
        requestedTopicId={id}
        requestedTopicTeacherId={topic?.user.id}
        requestedTopicEducationLevel={topic?.education_level}
      />
    </div>
  );
}
