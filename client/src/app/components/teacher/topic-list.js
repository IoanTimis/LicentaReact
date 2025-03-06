import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import TopicCard from "./topic-card";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const TopicList = ({ topics, loading, handleEditData, handleAddData, handleOpenConfirmModal, translate }) => {
  const [onlyTeacher, setOnlyTeacher] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get("/teacher/api/only-teachers", { withCredentials: true });
        setOnlyTeacher(response.data.onlyTeacher);
        console.log("ONLYTEACHER setting:", response.data.onlyTeacher);
      } catch (error) {
        console.error("Error fetching ONLYTEACHER setting:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="lg:w-3/4 w-full p-4 flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-6">
        
        {/* Add Topic Card - Disabled if onlyTeacher is false */}
        <div 
          className={`shadow rounded border border-gray-400 transition-transform duration-200
            ${onlyTeacher 
              ? "bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer" 
              : "bg-gray-300 cursor-not-allowed opacity-50"
            }`}
          onClick={onlyTeacher ? handleAddData : null}
        >
          <div className={`flex justify-between items-center py-2 px-4 rounded-t 
            ${onlyTeacher ? "bg-navbar-gradient" : "bg-gray-500"}`}>
            <h2 className="text-lg text-white font-semibold">
              {onlyTeacher ? "Add a new theme" : "You can no longer add topics"}
            </h2>
          </div>
          <div className="px-4 py-2">
            <p className="text-gray-700">
              {onlyTeacher ? "Click here to add a new theme" : "Adding topics is now restricted."}
            </p>
          </div>
          <div className="pb-4">
            <PlusCircleIcon className={`h-9 w-9 mx-auto ${onlyTeacher ? "text-blue-500" : "text-gray-500"}`} />
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && <div className="text-center text-gray-700">Se încarcă...</div>}

        {/* Topic Cards */}
        {topics.map((topic) => (
          <TopicCard 
            key={topic.id} 
            topic={topic}  
            translate={translate} 
            onEdit={handleEditData} 
            handleOpenConfirmModal={handleOpenConfirmModal} 
          />
        ))}
      </div>
    </div>
  );
};

export default TopicList;
