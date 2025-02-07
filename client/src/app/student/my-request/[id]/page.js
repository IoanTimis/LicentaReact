"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useLanguage } from "@/context/Languagecontext";
import ConfirmActionModal from "@/app/components/general/confirm-action-modal";

export default function TopicDetails() {
  const [request, setRequest] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRequestDeleted, setIsRequestDeleted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const { translate } = useLanguage();
  const { id } = useParams();

  const handleModal = (action) => {
    setModalAction(action);
    setIsOpen(true);
  };

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
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Layout */}
      {request && (
        <>
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-6">{request.topic.title}</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
            {/* Professor Details */}
            <div className={"bg-gray-100 p-6 flex flex-col items-center justify-center"}>
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
            <div className={"bg-gray-100 p-6 flex flex-col items-center justify-center"}>
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
          {/* Request button */}
          <div className="flex justify-center mt-4">
            <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 w-[50%] rounded"
              onClick={() => handleModal("delete")}
            >
              {translate("Delete Request")}
            </button> 
          </div>

          {/* Description */}
          <div className="bg-gray-100 p-6 max-w-7xl mx-auto min-h-screen rounded-bl-lg rounded-br-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{ translate("Description") }</h2>
            <p className="text-gray-700 text-center">{request.topic.description}</p>
          </div>
        </>
      )}

      <ConfirmActionModal
        actionFunction={() => modalAction === "delete" ? handleDelete(request.id) : null}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        action={modalAction}
      />
    </div>
  );
}
