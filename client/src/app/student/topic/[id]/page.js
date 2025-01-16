"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";

export default function TopicDetails() {
  const [topic, setTopic] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { id } = useParams();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  const { translate } = useLanguage();

  // Fetch topic details
  useEffect(() => {
    if (!id) return;

    const fetchTopicDetails = async () => {
      try {
        const response = await axiosInstance.get(`/student/fetch/topic/${id}`, { withCredentials: true });
        setTopic(response.data.topic);
      } catch (error) {
        console.error("Eroare la obținerea detaliilor temei:", error);
        setErrorMessage("A apărut o eroare la încărcarea detaliilor temei.");
      }
    };

    fetchTopicDetails();
  }, [id]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!topic && !errorMessage) {
    return <div className="text-center text-black mt-8">Se încarcă...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {/* Layout */}
      {topic && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
          {/* Professor Details */}
          <div
            className={
              isSmallScreen
                ? "bg-gray-900 shadow-md p-6 flex flex-col items-center rounded-tr-lg rounded-tl-lg"
                : "bg-gray-900 shadow-md p-6 flex flex-col items-center lg:rounded-tl-lg lg:rounded-bl-lg"
            }
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
              <img
                src="/logo_uvt_profile.png"
                alt={`${topic.user.first_name} ${topic.user.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {topic.user.first_name} {topic.user.name}
            </h2>
            <p className="text-gray-600 mb-4">{topic.user.title}</p>
            <a
              href={`mailto:${topic.user.email}`}
              className="text-blue-600 hover:underline text-lg"
            >
              {topic.user.email}
            </a>
          </div>

          {/* Topic Details */}
          <div
            className={
              isSmallScreen
                ? "bg-gray-900 shadow-md p-6 flex flex-col items-left rounded-br-lg rounded-bl-lg"
                : "bg-gray-900 shadow-md p-6 flex flex-col items-left lg:rounded-tr-lg lg:rounded-br-lg"
            }
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{topic.title}</h2>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold block">{ translate() }</span> {topic.description}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold block">Cuvinte cheie:</span> {topic.keywords}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold block">Locuri disponibile:</span> {topic.slots}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold block">Nivel educație:</span> {topic.education_level}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
