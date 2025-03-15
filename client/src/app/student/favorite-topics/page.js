"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import TopicCard from "@/app/components/student/topic-card";
import RequestModal from "@/app/components/student/request-modal";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import { useLanguage } from "@/context/Languagecontext";

export default function StudentTopics() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestedTopicId, setRequestedTopicId] = useState(null);
  const [hasConfirmedRequest, setHasConfirmedRequest] = useState(false);
  const [requestedTopicTeacherId, setRequestedTopicTeacherId] = useState(null);
  const [requestedTopicEducationLevel, setRequestedTopicEducationLevel] = useState(null);
  const { translate } = useLanguage();
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const [newRequestedTopic, setNewRequestedTopic] = useState(null);

  const [topics, setTopics] = useState([]);

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/student/fetch/favorite-topics", { withCredentials: true });

        setHasConfirmedRequest(response.data.hasConfirmedRequest);
        setTopics(response.data.topics);
      } catch (error) {
        console.error("Error fetching topics:", error);
        setGlobalErrorMessage(translate("An error occurred while fetching topics. Please try again."));
      }
    };

    fetchData();
  }, []);


  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const onRequest = (topic_id) => {
    const selectedTopic = topics.find((topic) => topic.id === topic_id);

    if (!selectedTopic) return;

    setRequestedTopicId(topic_id);
    setRequestedTopicTeacherId(selectedTopic.user_id);
    setRequestedTopicEducationLevel(selectedTopic.education_level);
    toggleModal();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData(e.target);
  
      const newRequest = {
        topic_id: formData.get("topic_id"),
        teacher_id: formData.get("teacher_id"),
        education_level: formData.get("education_level"),
      };
  
      const response = await axiosInstance.post("/student/request/add", newRequest, {
        withCredentials: true,
      });

      const commentMessage = formData.get("message");

      const addComment = await axiosInstance.post(`/student/request/comment/add/${response.data.request.id}`, 
        { commentMessage }, { withCredentials: true });

      if(process.env.NODE_ENV === "production") {
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
          role
        };

        const emailData = BuildEmailData(data);

        sendEmail(emailData)
          .then(() => console.log("Email sent."))
          .catch((error) => console.error("Error sending email:", error));
      }
  
      console.log("Request sent successfully:", response.data);
      setTopics([...topics]); 
      setNewRequestedTopic(response.data.request);
      toggleModal();
    } catch (error) {
      console.error("Error sending request:", error);
      setGlobalErrorMessage(translate("An error occurred while sending the request. Please try again."));
    }
  };
  
  if(topics.length === 0) {
    return <div className="flex items-center justify-center h-screen">{translate("No themes added to favorites.")}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="py-8 bg-gray-100">
        {/* Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onRequest={onRequest}
              translate={translate}
              setGlobalErrorMessage={setGlobalErrorMessage}
              hasConfirmedRequest={hasConfirmedRequest}
              newRequestedTopic={newRequestedTopic}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSubmit={handleSubmit}
        requestedTopicId={requestedTopicId}
        requestedTopicTeacherId={requestedTopicTeacherId}
        requestedTopicEducationLevel={requestedTopicEducationLevel}
      />
    </div>
  );
}
