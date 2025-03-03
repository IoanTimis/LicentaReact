"use client";
import { useLanguage } from "@/context/Languagecontext";

export default function RequestModal({ isOpen, onClose, onSubmit, requestedTopicId, requestedTopicTeacherId, requestedTopicEducationLevel }) {
  if (!isOpen) return null; // Nu afișa modalul dacă nu este deschis
  
  const { translate } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
            <input
              type="text"
              hidden
              name="education_level"
              value={requestedTopicEducationLevel || ""}
              readOnly
            />
            <label className="block text-gray-700">{translate("Request Message")}:</label>
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
              {translate("Send Request")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
