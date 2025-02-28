import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const CommentInput = ({ commentMessage, setCommentMessage, handleAddComment }) => {
  return (
    <div className="bg-gray-100 p-3 max-w-7xl mx-auto">
      <form
        className="flex items-center w-full border border-gray-300 rounded-lg p-2 bg-white"
        onSubmit={handleAddComment}
      >
        <textarea
          className="w-full text-black p-2 resize-none focus:outline-none focus:ring-0 overflow-hidden"
          placeholder="Write your comment here..."
          value={commentMessage}
          rows="1"
          maxLength={500}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              setCommentMessage(e.target.value);
            }
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />

        {/* Buton Send */}
        <button
          type="submit"
          disabled={!commentMessage || commentMessage.trim() === ""}
          className={`ml-2 flex items-center justify-center p-2 rounded-full transition ${
            !commentMessage || commentMessage.trim() === ""
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          <PaperAirplaneIcon className="w-4 h-4 text-white transform" />
        </button>
      </form>
      {commentMessage.length === 500 && (
        <div>
          <p className="text-red-500 text-sm">Maximum 500 characters</p>
        </div>
      )}
    </div>
  );
};

export default CommentInput;