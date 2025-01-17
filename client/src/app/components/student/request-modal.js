"use client";

export default function RequestModal({ isOpen, onClose, onSubmit, translate, requestedTopicId, requestedTopicTeacherId }) {
  if (!isOpen) return null; // Nu afișa modalul dacă nu este deschis
  console.log("Requested topic id: ");
  console.log(requestedTopicId);
  console.log("teacher id :",requestedTopicTeacherId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">{translate("Send Request")}</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              type="text"
              hidden
              name="topic_id"
              value={requestedTopicId || ""}
              readOnly
            />
            <input
              type="text"
              hidden
              name="teacher_id"
              value={requestedTopicTeacherId || ""}
              readOnly
            />
            <label className="block text-gray-700">{translate("Request Message")}:</label>
            <textarea
              className="border border-gray-300 text-gray-700 rounded w-full p-2"
              name="message"
              required
            />
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
              {translate("Send Request")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
