import { objectAge } from "@/utils/objectAge";

const CommentList = ({ comments, language, translate }) => {
  if (comments.length === 0) return (
    <div className="bg-gray-100 p-3 max-w-7xl mx-auto rounded-bl-lg rounded-br-lg">
      <div className="text-l font-bold text-gray-800 mb-6">{translate("Comments on request")}</div>
    </div>
  );

  return (
    <div className="bg-gray-100 p-3 max-w-7xl mx-auto rounded-bl-lg rounded-br-lg">
      <div className="text-l font-bold text-gray-800 mb-2">{translate("Comments on request")}</div>
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 rounded-lg">
          <span className="font-bold text-gray-800">
            {comment.user.name} {comment.user.first_name}
          </span>
          <span className="text-gray-500 text-sm ml-2">
            {objectAge(comment, language)}
          </span>
          <p className="text-gray-700">
            {comment.message}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
