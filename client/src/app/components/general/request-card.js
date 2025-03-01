import Link from "next/link";
import { truncateText } from "@/utils/truncateText";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function RequestCard({ request, onResponse, handleOpenConfirmModal, translate, userRole }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);

  const topicLink = userRole === "student"
    ? `/student/my-request/${request.id}`
    : `/teacher/student-request/${request.id}`;

  return (
    <div className="bg-white shadow rounded hover:shadow-lg transition border border-gray-950">
      <Link href={topicLink}>
        <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
          <h2 className="text-lg font-semibold text-white">
            {truncateText(request.topic.title, 27)}
          </h2>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">{translate("Description")}: </span>
            {truncateText(request.topic.description, 40)}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">{translate("Slots")}: </span>{request.topic.slots}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            {userRole === "student" ? (
              <>
                <span className="font-semibold">{translate("Teacher")}: </span>
                {request.teacher.name} {request.teacher.first_name}
              </>
            ) : (
              <>
                <span className="font-semibold">{translate("Student")}: </span>
                {request.student.name} {request.student.first_name}
              </>
            )}
          </p>
          <p className="text-black">
            {request.status === "pending"
              ? translate("Pending") + "..."
              : request.status === "confirmed"
              ? translate("Confirmed") + "!"
              : request.status === "accepted"
              ? translate("Accepted") + "!"
              : translate("Rejected") + "!"}
          </p>
        </div>
      </Link>

      {/* Modal Footer */}
      <div className="px-4 py-2 flex justify-between items-center bg-gray-50 border-t border-gray-200 rounded-b">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <span>{translate("Actions")}</span>
            <ChevronDownIcon className="h-5 w-5 ml-1" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
              {userRole === "student" ? (
                <>
                  {request.status === "accepted" && (
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-green-600 transition"
                      onClick={() => {
                        handleOpenConfirmModal(request.id, "confirm");
                        setIsDropdownOpen(false);
                      }}
                    >
                      {translate("Confirm Theme")}
                    </button>
                  )}
                  <Link
                    href={`/student/my-request/${request.id}`}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    {translate("View Request")}
                  </Link>
                  {request.status !== "confirmed" && (
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-red-600 transition"
                      onClick={() => {
                        handleOpenConfirmModal(request.id, "delete");
                        setIsDropdownOpen(false);
                      }}
                    >
                      {translate("Delete Request")}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href={`/teacher/student-request/${request.id}`}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    {translate("View Request")}
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    onClick={() => {
                      onResponse(request.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {translate("Respond to Request")}
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-red-600 transition"
                    onClick={() => {
                      handleOpenConfirmModal(request.id, "delete");
                      setIsDropdownOpen(false);
                    }}
                  >
                    {translate("Delete Request")}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
