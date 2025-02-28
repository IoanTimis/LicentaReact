import Link from "next/link";
import { truncateText } from "@/utils/truncate-text";
import { useLanguage } from "@/context/Languagecontext";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { jwtDecode }  from "jwt-decode";

export default function RequestCard({ request, onResponse, handleOpenConfirmModal }) {
  const { translate } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);

  const accessToken = localStorage.getItem("accessToken");
  const userRole = jwtDecode(accessToken).role;

  if ( userRole === "student" ) {
// Student request card
    return (
      <div className="bg-white shadow rounded hover:shadow-lg transition border border-gray-950">
        <Link href={`/student/my-request/${request.id}`}>
          <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
            <h2 className="text-lg font-semibold text-white">{truncateText(request.topic.title, 27)}</h2>
          </div>
          <div className="p-4">
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">{translate("Description")}:</span> {truncateText(request.topic.description, 40)}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">{translate("Slots")}:</span> {request.topic.slots}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">{translate("Teacher")}:</span> {request.teacher.name} {request.teacher.first_name}
            </p>
            {request.status === "pending" ? (
              <p className="text-black">{ translate("Pending") }...</p>
            ) : request.status === "confirmed" ? (
              <p className="text-black ">{ translate("Confirmed") }!</p>
            ) : request.status === "accepted" ? (
              <p className="text-black">{ translate("Accepted") }!</p>
            ) : (
              <p className="text-black">{ translate("Rejected") }!</p>
            )}
          </div>
        </Link>

        {/*modal footer */}
        <div className="px-4 py-2 flex justify-between items-center bg-gray-50 border-t border-gray-200 rounded-b">
          <span className="text-gray-500">{translate("")}</span>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <span>{translate("Actions")}</span>
              <ChevronDownIcon className="h-5 w-5 ml-1" />
            </button>
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200"
              >
                {request.status === "accepted" && (
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-green-600 transition"
                    onClick={() => {
                      handleOpenConfirmModal(request.id, "confirm")
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
                {!request.status === "confirmed" && (
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-red-600 transition"
                    onClick={() => {
                      handleOpenConfirmModal(request.id, "delete")
                      setIsDropdownOpen(false);
                    }}
                  >
                    {translate("Delete Request")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

//teacher request card
  return (
    <div className="bg-white shadow rounded hover:shadow-lg transition border border-gray-950">
        <Link href={`/teacher/student-request/${request.id}`}>
          <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
            <h2 className="text-lg font-semibold text-white">{truncateText(request.topic.title, 27)}</h2>
          </div>
          <div className="p-4">
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">{translate("Description")}:</span> {truncateText(request.topic.description, 40)}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">{translate("Slots")}:</span> {request.topic.slots}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">{translate("Student")}:</span> {request.student.name} {request.student.first_name}
            </p>
            {request.status === "pending" ? (
              <p className="text-black">{ translate("Pending") }...</p>
            ) : request.status === "confirmed" ? (
              <p className="text-black">{ translate("Confirmed") }!</p>
            ) : request.status === "accepted" ? (
              <p className="text-black">{ translate("Accepted") }!</p>
            ) : (
              <p className="text-black">{ translate("Rejected") }!</p>
            )}
          </div>
        </Link>

        {/*modal footer */}
        <div className="px-4 py-2 flex justify-between items-center bg-gray-50 border-t border-gray-200 rounded-b">
          <span className="text-gray-500">{translate("")}</span>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <span>{translate("Actions")}</span>
              <ChevronDownIcon className="h-5 w-5 ml-1" />
            </button>
            {isDropdownOpen && (
              <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200"
            >
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
            </div>
            )}
          </div>
        </div>
      </div>
  );
}
