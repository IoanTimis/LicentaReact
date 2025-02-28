import { useState } from "react";
import { CheckCircleIcon, EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/20/solid";

const RequestStatusActions = ({ status, handleModal, translate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-gray-100 p-6 flex flex-col items-center justify-center relative">
      <div className="flex space-x-4 mt-2">
        {status === "confirmed" ? (
          <CheckCircleIcon className="w-6 h-6 text-green-500 cursor-not-allowed" />
        ) : status === "accepted" ? (
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
                    handleModal("confirm");
                    setMenuOpen(false);
                  }}
                  className="flex items-center p-2 w-full text-black hover:bg-gray-200 transition duration-200"
                >
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  {translate("Confirm")}
                </button>
                <button
                  onClick={() => {
                    handleModal("delete");
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
        ) : (
          <div className="relative">
            <button
              className="w-6 h-6 text-red-400 hover:text-red-600 transition duration-200"
              onClick={() => handleModal("delete")}
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestStatusActions;
