"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import RequestModal from "@/app/components/student/request-modal";

export default function TopicDetails() {
  const [topic, setTopic] = useState(null);
  const [topicRequested, setTopicRequested] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { translate } = useLanguage();
  const { id } = useParams();

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  // Fetch topic details
  useEffect(() => {
    if (!id) return;

    const fetchTopicDetails = async () => {
      try {
        const response = await axiosInstance.get(`/student/fetch/topic/${id}`, { withCredentials: true });
        setTopic(response.data.topic);

        const topicRequestedResponse = await axiosInstance.get(`/student/is-topic-requested/${id}`, { withCredentials: true });
        setTopicRequested(topicRequestedResponse.data.requested);

      } catch (error) {
        console.error("Eroare la obținerea detaliilor temei:", error);
        setErrorMessage("A apărut o eroare la încărcarea detaliilor temei.");
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
        message: formData.get("message"),
      };

      const response = await axiosInstance.post("/student/request/add", newRequest, { withCredentials: true });
      console.log("Request response:", response.data);

      setTopicRequested(true);

      toggleModal();
    } catch (error) {
      console.error("Error sending request:", error);
      setErrorMessage("A apărut o eroare la trimiterea cererii.");
    }
  };

  if (!topic && !errorMessage) {
    return <div className="text-center text-black mt-8">Se încarcă...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {/* Layout */}
      {topic && (
        <>
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-6">{topic.title}</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">

            {/* Professor Details */}
            <div
              className={"bg-gray-100 p-6 flex flex-col items-center"}
            >
              <div className="w-28 h-28 rounded-full overflow-hidden mb-6">
                <img
                  src="/logo_uvt_profile.png"
                  alt={`${topic.user.first_name} ${topic.user.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {topic.user.title}. {topic.user.first_name} {topic.user.name}
              </h2>
              <p className="text-gray-600 mb-4">{topic.user.email}</p>
            </div>

            {/* Topic Details */}
            <div
              className={"bg-gray-100 p-6 flex flex-col items-center justify-left"}
            >
              <p className="text-gray-700 mb-4 ">
                <span className="font-semibold">{ translate("Keywords") }:</span> {topic.keywords}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold ">{ translate("Slots") }:</span> {topic.slots}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold ">{ translate("Education Level") }:</span> {topic.education_level}
              </p>
              {/* Request button */}
              
            </div>
          </div>
          {/* Request button */}
          <div className="flex justify-center mt-4">
            {topicRequested ? (
              <button className="bg-gray-400 text-white font-semibold py-2 px-4 w-[50%] rounded cursor-not-allowed" disabled>
                {translate("Request Sent")}
              </button>) : (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 w-[50%] rounded"
                onClick={toggleModal}
              >
                {translate("Request Theme")}
              </button>
              )}
          </div>

          {/* Description */}
          <div className="bg-gray-100 p-6 max-w-7xl mx-auto min-h-screen rounded-bl-lg rounded-br-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{ translate("Description") }</h2>
            <p className="text-gray-700 text-center">{topic.description}</p>
          </div>
        </>
      )}

      {/* Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSubmit={handleSubmit}
        requestedTopicId={id}
        requestedTopicTeacherId={topic?.user.id}
        requestedTopicEducationLevel={topic?.education_level}
      />
    </div>
  );
}
