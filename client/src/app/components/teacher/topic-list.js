import TopicCard from "./topic-card";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const TopicList = ({ topics, loading, handleEditData, handleAddData, handleOpenConfirmModal, translate }) => {
  return (
    <div className="lg:w-3/4 w-full p-4 flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-6">
        {/* Add Topic Card */}
        <div className="bg-white shadow rounded cursor-pointer border border-gray-400
          hover:shadow-xl hover:-translate-y-1 transition-transform duration-200" 
          onClick={handleAddData}
        >
          <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
            <h2 className="text-lg text-white font-semibold">Add a new theme</h2>
          </div>
          <div className="px-4 py-2">
            <p className="text-gray-700">Click here to add a new theme</p>
          </div>
          <div className="pb-4">
            <PlusCircleIcon className="h-9 w-9 text-blue-500 mx-auto" />
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && <div className="text-center text-gray-700">Se încarcă...</div>}

        {/* Topic Cards */}
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic}  translate={translate} onEdit={handleEditData} handleOpenConfirmModal={handleOpenConfirmModal} />
        ))}
      </div>
    </div>
  );
};

export default TopicList;
