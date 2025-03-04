
export default function CardDetails({ request, topic,translate, isTopicRequested, requestStatus, userRole }) {
  let first_name = ""
  let name = ""
  const data = request?.topic || topic

  if (topic) {
    first_name = topic.user.first_name
    name = topic.user.name
  }

  if(request) {
    first_name = request.student?.first_name || request.teacher?.first_name
    name = request.student?.name || request.teacher?.name
  }

  const statusColors = {
    pending: "bg-yellow-400",
    confirmed: "bg-green-500",
    accepted: "bg-blue-500",
    rejected: "bg-red-500",
  };

  return (
    <div className="p-4">
      <div className="flex text-gray-700">
        <div className="flex-col w-1/2">
          {topic ? (
            userRole === "student" && (
              <div className="font-semibold text-black">{translate("Teacher")}:</div>
            ) 
          ) : (
            <div className="font-semibold">{userRole === "teacher" ? translate("Student") : translate("Teacher")}:</div>
          )}
          <div className="font-semibold">{translate("Keywords")}:</div>
          <div className="font-semibold">{translate("Slots")}:</div>
          <div className="font-semibold">{translate("Type")}:</div>
        </div>

        <div className="flex-col w-1/2 mb-2">
          <div className="truncate">
            {topic ? (
              userRole === "student" && (
                `${first_name} ${name}`
              )
            ) : (
              `${first_name} ${name}`
            )}
          </div>
          <div className="truncate">{data.keywords}</div>
          <div className="truncate">{data.slots}</div>
          <div className="truncate">{data.education_level}</div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-2 mt-2">
        {topic ? (
          userRole === "student" ? (
            <>
              <div className={`w-3 h-3 rounded-full ${isTopicRequested ? "bg-yellow-400" : "bg-green-500"}`}></div>
              <span className="text-black">{isTopicRequested ? translate("Requested") : translate("Available")}</span>
            </>
          ) : null
        ) : (
          <>
            <div className={`w-3 h-3 rounded-full ${statusColors[requestStatus]}`}></div>
            <span className="text-black">{translate(requestStatus)}</span>
          </>
        )}
      </div>
    </div>
  );
}
