"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import Link from "next/link";
import TopicCard from "@/app/components/student/topic-card";

export default function TeacherTopics() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [requestedTopic, setRequestedTopic] = useState(null);
  const [requestedTopicTeacher, setRequestedTopicTeacher] = useState(null);
  const { translate } = useLanguage();

  const [topics, setTopics] = useState([]);

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/student/fetch/topics", { withCredentials: true });
        console.log(response.data.topics);
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

  const onRequest = async (topic_id) => {
    setRequestedTopic(topic_id);
    const teacher_id = topics.find((topic) => topic.id === topic_id).user_id;
    setRequestedTopicTeacher(teacher_id);
  }

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

      console.log(newRequest);
    
      const response = await axiosInstance.post("/student/topic/add", newRequest, {
        withCredentials: true,
      });

      setTopics((prev) => [...prev, response.data.topic]);
      
      toggleModal();
      console.log("Temă adăugată cu succes!");
    } catch (error) {
      console.error("Eroare la adăugarea temei:", error);
      setErrorMessage("A apărut o eroare la adăugarea temei.");
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
              onRequest={() => toggleModal()}
              toggleModal={toggleModal}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">{translate("Send Request")}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input hidden name="topic_id" value={requestedTopic} />
                <input hidden name="teacher_id" value={requestedTopicTeacher} />
                <label className="block text-gray-700">{translate("Request Mesage")}:</label>
                <textarea
                  className="border border-gray-300 text-gray-700 rounded w-full p-2" name="message"
                  required
                />
              </div>
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
                  onClick={toggleModal}
                >
                  {translate("Cancel")}
                </button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  {translate("Send Request")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
