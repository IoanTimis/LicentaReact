"use client";

export default function AcceptRejectModal({ isOpen, onClose, onSubmit, translate}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">{translate("Send Response")}</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">{translate("Accept or Reject")}:</label>
            <select
              className="border border-gray-300 text-gray-700 rounded w-full p-2"
              name="status"
              required
            >
              <option value="accepted">{translate("Accept")}</option>
              <option value="rejected">{translate("Reject")}</option>
            </select>
            <label className="block text-gray-700">{translate("Student Message")}:</label>
            <textarea
              className="border border-gray-300 text-gray-700 rounded w-full p-2"
              name="message"
              required
            />
            <span className="text-sm text-gray-700 mb-4">
              {translate("The message will be posted as comment on the request.")}
            </span>
          </div>
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              {translate("Cancel")}
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              {translate("Send")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
