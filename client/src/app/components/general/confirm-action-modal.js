import { useState } from "react";

export default function ConfirmActionModal({ title, message, onConfirm }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm(); // Apelează funcția de acțiune
    setIsOpen(false); // Închide modalul
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => setIsOpen(true)}
      >
        {title}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-700 mb-4">{title}</h2>
            <p className="text-gray-700 mb-4">{message}</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsOpen(false)}
              >
                Anulează
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleConfirm}
              >
                Confirmă
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
