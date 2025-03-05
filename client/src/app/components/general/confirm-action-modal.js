import { useLanguage } from "@/context/Languagecontext";

export default function ConfirmActionModal({ actionFunction, isOpen, setIsOpen, action}) {
  if (!isOpen) return null;

  const { translate } = useLanguage();

  const handleConfirm = () => {
    actionFunction();
    setIsOpen(false);
  };

  let title = "";
  let message = "";
  let buttonText = "";

  if (action === "delete") {
    title = "Delete Request"; 
    message = "Are you sure you want to delete this request?";
    buttonText = "Delete";
  } else if (action === "confirm") {
    title = "Confirm Theme";
    message = 
    "Are you sure you want to confirm this theme? This action will delete all other requests and only the teacher will be able to delete this request!";
    buttonText = "Confirm";
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold text-gray-700 mb-4">{ translate(title)}</h2>
        <p className="text-gray-700 mb-4">{ translate(message) }</p>
        <div className="flex justify-end">
          <button
            className="bg-gray-400 hover:bg-gray-600  text-white px-4 py-2 rounded mr-2"
            onClick={() => setIsOpen(false)}
          >
            {translate("Cancel")}
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={handleConfirm}
          >
            {translate(buttonText)}
          </button>
        </div>
      </div>
    </div>
  );
}
