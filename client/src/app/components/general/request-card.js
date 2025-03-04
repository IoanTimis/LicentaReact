import Link from "next/link";
import { CheckIcon, PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { truncateText } from "@/utils/truncateText";
import CardDetails from "./card-details";

export default function RequestCard({ request, onResponse, handleOpenConfirmModal, translate, userRole, newConfirmedRequest }) {
  
  const isConfirmed = request.status === "confirmed";
  console.log("request:", request);

  const statusColors = {
    pending: "bg-yellow-400",
    confirmed: "bg-green-500",
    accepted: "bg-blue-500",
    rejected: "bg-red-500",
  };

  const requestStatus = request.status;
  
  const topicLink = userRole === "student"
    ? `/student/my-request/${request.id}`
    : `/teacher/student-request/${request.id}`;

  return (
    <div className="bg-white shadow rounded transform border border-gray-950
      hover:shadow-xl hover:-translate-y-1 transition-transform duration-200"
    >
      <Link href={topicLink}>
        <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
          <h2 className="text-lg font-semibold text-white">
            {truncateText(request.topic.title, 27)}
          </h2>
        </div>

        {/* Details */}
        <CardDetails request={request} translate={translate} requestStatus={requestStatus} userRole={userRole} />
      </Link>

      {/* Student Buttons */}
      <div className="px-4 py-2 flex justify-end space-x-2 bg-gray-50 border-t border-gray-200 rounded-b">
        {userRole === "student" ? (
          <>
            {(!isConfirmed && !newConfirmedRequest ) && requestStatus === "accepted" && (
              <button
                onClick={() => {
                  handleOpenConfirmModal(request.id, "confirm");
                }}
                className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition text-white"
              >
                <CheckIcon className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => handleOpenConfirmModal(request.id, "delete")}
              disabled={(isConfirmed || newConfirmedRequest)}
              className={`p-2 rounded-full transition ${
                (isConfirmed || newConfirmedRequest) ? "bg-gray-400 cursor-not-allowed text-white" : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            {/* Teacher Buttons */}
            {requestStatus === "pending" && (
              <button
                onClick={() => onResponse(request.id)}
                className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition text-white"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => handleOpenConfirmModal(request.id, "delete")}
              className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition text-white"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
