"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import Link from "next/link";
import TopicCard from "@/app/components/student/topic-card";
import RequestModal from "@/app/components/student/request-modal";

export default function StudentTopics() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [requestedTopicId, setRequestedTopicId] = useState(null);
  const [requestedTopicTeacherId, setRequestedTopicTeacherId] = useState(null);
  const { translate } = useLanguage();

  const [topics, setTopics] = useState([]);

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/student/fetch/topics", { withCredentials: true });
        setTopics(response.data.topics);
      } catch (error) {
        console.error("Eroare la obținerea datelor:", error);
        setErrorMessage("A apărut o eroare la obținerea datelor.");
      }
    };

    fetchData();
  }, []);

  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const onRequest = (topic_id) => {
    console.log("Requested topic id: page ", topic_id);
    const selectedTopic = topics.find((topic) => topic.id === topic_id);
    if (!selectedTopic) return;

    setRequestedTopicId(topic_id);
    setRequestedTopicTeacherId(selectedTopic.user_id);
    toggleModal();
  };

  console.log("Requested topic id state: ", requestedTopicId);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);

      const newRequest = {
        topic_id: formData.get("topic_id"),
        teacher_id: formData.get("teacher_id"),
        message: formData.get("message"),
      };

      const response = await axiosInstance.post("/student/request/add", newRequest, {
        withCredentials: true,
      });

      console.log("Cererea a fost trimisă cu succes!", response.data);
      toggleModal();
    } catch (error) {
      console.error("Eroare la trimiterea cererii:", error);
      setErrorMessage("A apărut o eroare la trimiterea cererii.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="py-8 bg-gray-100">
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              translate={translate}
              onRequest={onRequest}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSubmit={handleSubmit}
        translate={translate}
        requestedTopicId={requestedTopicId}
        requestedTopicTeacherId={requestedTopicTeacherId}
      />
    </div>
  );
}
