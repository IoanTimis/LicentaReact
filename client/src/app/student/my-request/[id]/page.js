"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";

export default function TopicDetails() {
  const [request, setRequest] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRequestDeleted, setIsRequestDeleted] = useState(false);
  const { translate } = useLanguage();
  const { id } = useParams();

  // Fetch topic details
  useEffect(() => {
    if (!id) return;

    const fetchRequestDetails = async () => {
      try {
        const response = await axiosInstance.get(`/student/fetch/requested-topic/${id}`, { withCredentials: true });
        setRequest(response.data.request);
      } catch (error) {
        console.error("Eroare la obținerea detaliilor temei:", error);
        setErrorMessage("A apărut o eroare la încărcarea detaliilor temei.");
      }
    };

    fetchRequestDetails();
  }, [id]);

  const handleDelete = async (requestId) => {
    try {
      await axiosInstance.delete(`/student/request/delete/${requestId}`, { withCredentials: true });
      console.log("Cererea a fost ștearsă.");

      setIsRequestDeleted(true);
    } catch (error) {
      console.error("Eroare la ștergerea cererii:", error);
      setErrorMessage("A apărut o eroare la ștergerea cererii.");
    }
  };

  if (isRequestDeleted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-green-500">{ translate("The request has been successfully deleted.") }</h1>
      </div>
    );
  }

  if (!request && !errorMessage) {
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
      {request && (
        <>
          <div className="max-w-7xl shadow-xl mx-auto grid grid-cols-1 lg:grid-cols-2">
            {/* Professor Details */}
            <div
              className={"bg-gray-300 p-6 flex flex-col items-center"}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
                <img
                  src="/logo_uvt_profile.png"
                  alt={`userphoto`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {request.teacher.title}. {request.teacher.first_name} {request.teacher.name}
              </h2>
              <p className="text-gray-600 mb-4">{request.teacher.email}</p>
            </div>

            {/* Request Details */}
            <div
              className={
                isSmallScreen
                  ? "bg-gray-300 p-6 flex flex-col items-left rounded-br-lg rounded-bl-lg"
                  : "bg-gray-300 p-6 flex flex-col items-left lg:rounded-tr-lg lg:rounded-br-lg"
              }
            >
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{request.topic.title}</h2>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold ">{ translate("Description") }:</span> {request.topic.description}
              </p>
              <p className="text-gray-700 mb-4">
              {request.topic.slots === 0 ? (
                <span className="text-red-500">{translate("No slots available")}</span>
                ) : (
                <span>
                  <span className="font-semibold">{translate("Slots")}:</span> {request.topic.slots}
                </span>
                )}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold ">{ translate("Education Level") }:</span> {request.topic.education_level}
              </p>
            </div>
          </div>

          {/* Request topic */}
          <div className="bg-gray-300 p-6 max-w-7xl mx-auto min-h-screen rounded-bl-lg rounded-br-lg">
            <div className="flex items-center justify-center mt-8">
              <h2 className="text-black font-semibold">Daca doresti poti sterge cererea.</h2>
              <div className="">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" 
                onClick={() => handleDelete(request.id)}>
                  Sterge cerere
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
