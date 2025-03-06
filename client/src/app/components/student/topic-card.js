import Link from "next/link";
import { HeartIcon, NewspaperIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { truncateText } from "@/utils/truncateText";
import CardDetails from "../general/card-details";

export default function TopicCard({ topic, onRequest, newRequestedTopic, translate, setGlobalErrorMessage, hasConfirmedRequest }) {
  const [isTopicRequested, setIsTopicRequested] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tooltip, setTooltip] = useState(null);

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
    if (isTopicRequested) return;
    onRequest(topic.id);
  };

  const handleFavoriteClick = async () => {
    try {
      if (!isFavorite) {
        await axiosInstance.post(`/student/favorite/add/${topic.id}`, {}, { withCredentials: true });
        setIsFavorite(true);
      } else {
        await axiosInstance.delete(`/student/favorite/delete/${topic.id}`, { withCredentials: true });
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setGlobalErrorMessage(translate("An error occurred while updating favorites."));
    }
  };

  return (
    <div className="bg-white shadow rounded border border-gray-400
      hover:shadow-xl hover:-translate-y-1 transition-transform duration-200"
    >
      {/* Title + Favorite */}
      <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
        <Link href={`/student/topic/${topic.id}`} className="flex-grow">
          <h2 className="text-lg font-semibold text-white">{truncateText(topic.title, 20)}</h2>
        </Link>
        <div className="relative flex flex-col items-center">
          <button
            onClick={handleFavoriteClick}
            className="focus:outline-none"
            onMouseEnter={() => setTooltip("favorite")}
            onMouseLeave={() => setTooltip(null)}
          >
            <HeartIcon className={`h-6 w-6 transition ${isFavorite ? "text-red-500" : "text-white"}`} />
          </button>
          {tooltip === "favorite" && (
            <span className="absolute top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
              {isFavorite ? translate("Remove Favorite") : translate("Add to Favorites")}
            </span>
          )}
        </div>
      </div>
  
      {/* Details */}
      <CardDetails topic={topic} translate={translate} isTopicRequested={(isTopicRequested)} hasConfirmedRequest={hasConfirmedRequest} userRole={"student"} />
  
      {/* Buttons */}
      <div className="px-4 py-2 flex justify-end bg-gray-50 border-t border-gray-400 rounded-b">
        <div
          className="relative flex flex-col items-center"
          onMouseEnter={() => setTooltip("request")}
          onMouseLeave={() => setTooltip(null)}
        >
          <button
            onClick={handleRequestClick}
            disabled={isTopicRequested || hasConfirmedRequest}
            className={`p-2 rounded-full transition text-white ${
              (isTopicRequested || hasConfirmedRequest) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <NewspaperIcon className="w-5 h-5" />
          </button>
          {tooltip === "request" && (
            <span className="absolute top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
              {(isTopicRequested && hasConfirmedRequest) 
              ? translate("Already Confirmed a Theme") : hasConfirmedRequest ? 
              translate("Already Confirmed a Theme") : isTopicRequested ? translate("Already Requested") :translate("Request Theme")}
            </span>
          )}
        </div>
      </div>
    </div>
  );  
}
