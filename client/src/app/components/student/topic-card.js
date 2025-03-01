import Link from "next/link";
import { ChevronDownIcon, HeartIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { truncateText } from "@/utils/truncate-text";

export default function TopicCard({ topic, onRequest, newRequestedTopic, translate, setGlobalErrorMessage }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTopicRequested, setIsTopicRequested] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/student/is-topic-requested/${topic.id}`, { withCredentials: true });
        setIsTopicRequested(response.data.requested);

        const favoriteResponse = await axiosInstance.get(`/student/is-topic-favorite/${topic.id}`, { withCredentials: true });
        setIsFavorite(favoriteResponse.data.favorite);
      } catch (error) {
        console.error("Error while getting data:", error);
        setGlobalErrorMessage(translate("An error occurred while getting the data. Please try again."));
      }
    };

    fetchData();
  }, [topic.id, newRequestedTopic]);

  const handleRequestClick = async () => {
    setIsDropdownOpen(false);
    if (isTopicRequested) return;
    onRequest(topic.id);
  };

  const handleFavoriteClick = async () => {
    try {
      if(!isFavorite) {
        const response = await axiosInstance.post(`/student/favorite/add/${topic.id}`, {}, { withCredentials: true });
        setIsFavorite(true);
      } else {
        const response = await axiosInstance.delete(`/student/favorite/delete/${topic.id}`, { withCredentials: true });
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setGlobalErrorMessage(translate("An error occurred while updating favorites."));
    }
  };

  return (
    <div className="bg-white shadow rounded hover:shadow-lg transition border border-gray-950">
      <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
        <Link href={`/student/topic/${topic.id}`} className="flex-grow">
          <h2 className="text-lg font-semibold text-white">{truncateText(topic.title, 20)}</h2>
        </Link>
        <button onClick={handleFavoriteClick} className="ml-4 focus:outline-none">
          <HeartIcon className={`h-6 w-6 transition ${isFavorite ? "text-red-500" : "text-white"}`} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-gray-700">
          <span className="font-semibold">{translate("Teacher Name")}:</span> {topic.user.first_name} {topic.user.name}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">{translate("Description")}:</span> {truncateText(topic.description,40)}
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
        {isTopicRequested ? (
          <p className="text-black">{translate("Requested Theme")}</p>
        ) : (
          <p className="text-green-700">{translate("Available Theme")}</p>
        )}
      </div>

      {/* Footer */}
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
              {!isTopicRequested && (
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  onClick={handleRequestClick}
                >
                  {translate("Request Theme")}
                </button>
              )}

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
