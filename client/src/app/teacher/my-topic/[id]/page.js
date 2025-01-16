"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axiosInstance";
import { useParams } from "next/navigation";

export default function TopicDetails() {
  const [topic, setTopic] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { id } = useParams();
  console.log(id);

  // Fetch topic details
  useEffect(() => {
    if (!id) return;

    const fetchTopicDetails = async () => {
      try {
        const response = await axiosInstance.get(`/teacher/fetch/topic/${id}`, { withCredentials: true });
        console.log(response.data.topic);
        setTopic(response.data.topic);
      } catch (error) {
        console.error("Eroare la obținerea detaliilor temei:", error);
        setErrorMessage("A apărut o eroare la încărcarea detaliilor temei.");
      }
    };

    fetchTopicDetails();
  }, [id]);

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

      {/* Topic Details */}
      {topic && (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">{topic.title}</h1>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Descriere:</span> {topic.description}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Cuvinte cheie:</span> {topic.keywords}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Locuri disponibile:</span> {topic.slots}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Nivel educație:</span> {topic.education_level}
          </p>
        </div>
      )}
    </div>
  );
}
