import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function TopicCard({ topic, translate, onRequest }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  console.log(topic);

  const handleRequestClick = () => {
    setIsDropdownOpen(false);
    onRequest(topic.id); // Transmite topic.id corect
  };
  

  return (
    <div className="bg-white shadow rounded hover:shadow-lg transition border border-gray-950">
      <Link href={`/student/topic/${topic.id}`}>
        <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
          <h2 className="text-lg font-semibold text-white">{topic.title}</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-700">
            <span className="font-semibold">{translate("Teacher Name")}:</span> {topic.user.first_name} {topic.user.name}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">{translate("Description")}:</span> {topic.description}
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
                onClick={ handleRequestClick }
              >
                {translate("Request Theme")}
              </button>
              <Link
                href={`/student/topic/${topic.id}`}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                {translate("View Theme")}
             </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
