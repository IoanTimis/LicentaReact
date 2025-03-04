import Link from "next/link";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { truncateText } from "@/utils/truncateText";
import CardDetails from "../general/card-details";

export default function TopicCard({ topic, translate, onEdit, handleOpenConfirmModal }) {
  const [tooltip, setTooltip] = useState(null);


  return (
    <div 
      className="bg-white shadow rounded border border-gray-400 
        hover:shadow-xl hover:-translate-y-1 transition-transform duration-200"
    >
      {/* Title */}
      <Link href={`/teacher/my-topic/${topic.id}`}>
        <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
          <h2 className="text-lg font-semibold text-white truncate">{topic.title}</h2>
        </div>

        {/* Details */}
        <CardDetails topic={topic} translate={translate} isTopic={true} userRole={"teacher"} />
      </Link>

      {/* Buttons */}
      <div className="px-4 py-2 flex justify-end space-x-4 bg-gray-50 border-t border-gray-400 rounded-b">
        {/* Edit */}
        <div 
          className="relative flex flex-col items-center"
          onMouseEnter={() => setTooltip("edit")}
          onMouseLeave={() => setTooltip(null)}
        >
          <button 
            onClick={() => onEdit(topic.id)}
            className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition text-white"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
          {tooltip === "edit" && (
            <span className="absolute top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
              {translate("Edit")}
            </span>
          )}
        </div>

        {/* Delete */}
        <div 
          className="relative flex flex-col items-center"
          onMouseEnter={() => setTooltip("delete")}
          onMouseLeave={() => setTooltip(null)}
        >
          <button 
            onClick={() => handleOpenConfirmModal(topic.id, "delete")}
            className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition text-white"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
          {tooltip === "delete" && (
            <span className="absolute top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
              {translate("Delete")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
