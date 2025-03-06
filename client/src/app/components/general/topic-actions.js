import { useState } from "react";
import { CheckIcon, EllipsisVerticalIcon, TrashIcon, PencilIcon, NewspaperIcon } from "@heroicons/react/20/solid";

const TopicActions = ({toggleConfirmActionModal, translate, role, toggleEditModal, toggleRequestModal, isRequested, hasConfirmedRequest }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div className="bg-gray-100 p-6 flex flex-col items-center justify-center relative">
      {role === "student" ? (
        <div className="flex space-x-4 mt-2">
          {( isRequested || hasConfirmedRequest) ? (
            <CheckIcon className="w-6 h-6 text-green-500 cursor-not-allowed" />
          ) : (
            <div
              className="relative flex flex-col items-center"
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              <button
                className="p-2 hover:bg-blue-100 text-blue-600 transition duration-200 rounded-md"
                onClick={() => toggleRequestModal()}
              >
                <NewspaperIcon className="w-5 h-5 text-blue-500" />
              </button>

              {/* Tooltip */}
              {tooltipVisible && (
                <div className="absolute top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
                  {translate("Request Theme")}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex space-x-4 mt-2">
          {/* Profesor */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 text-gray-600 hover:text-gray-800 transition duration-200"
              >
                <EllipsisVerticalIcon />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md">
                  <button
                    onClick={() => {
                      toggleEditModal()
                      setMenuOpen(false)
                    }}
                    className="flex items-center p-2 w-full text-black hover:bg-gray-200 transition duration-200"
                  >
                    <PencilIcon className="w-5 h-5 text-gray-700 mr-2" />
                    {translate("Edit")}
                  </button>
                  <button
                    onClick={() => {
                      toggleConfirmActionModal("delete");
                      setMenuOpen(false);
                    }}
                    className="flex items-center p-2 w-full hover:bg-red-100 text-red-600 transition duration-200"
                  >
                    <TrashIcon className="w-5 h-5 text-red-500 mr-2" />
                    {translate("Delete")}
                  </button>
                </div>
              )}
            </div>
        </div>
      )}
    </div>
  );
};

export default TopicActions;
