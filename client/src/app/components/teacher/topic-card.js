import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { truncateText } from "@/utils/truncate-text";

export default function TopicCard({ topic, translate, onEdit, handleOpenConfirmModal }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="bg-white shadow rounded hover:shadow-lg transition border border-gray-950">
      <Link href={`/teacher/my-topic/${topic.id}`}>
        <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
          <h2 className="text-lg font-semibold text-white">{truncateText(topic.title, 20)}</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-700">
            <span className="font-semibold">{translate("Description")}:</span> {truncateText(topic.description, 40)}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{translate("Keywords")}:</span> {topic.keywords}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{translate("Slots")}:</span> {topic.slots}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{translate("Type")}:</span> {topic.education_level}
          </p>
        </div>
      </Link>
      {/* Footer */}
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
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                onClick={() => {
                  onEdit(topic.id);
                  setIsDropdownOpen(false);
                  }
                }
              >
                {translate("Edit")}
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                onClick={() => {
                  handleOpenConfirmModal(topic.id, "delete");
                  setIsDropdownOpen(false);
                  }
                }
              >
                {translate("Delete")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
