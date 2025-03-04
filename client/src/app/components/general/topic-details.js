import TopicActions from "./topic-actions";

const TopicDetails = ({ topic, toggleConfirmActionModal, toggleEditModal, toggleRequestModal, translate, role, isRequested }) => {
  return (
    <div className="bg-gray-100 p-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-[40%_60%] gap-y-4 text-gray-700">
        
        <span className="font-semibold">{translate("Keywords")}:</span>
        <span className="break-words">{topic.keywords}</span>

        <span className="font-semibold">{translate("Slots")}:</span>
        <span>{topic.slots === 0 ? translate("No slots available") : topic.slots}</span>

        <span className="font-semibold">{translate("Education Level")}:</span>
        <span>{topic.education_level}</span>

        {role === "student" && (
          <>
            <span className="font-semibold">{translate("Status")}:</span>
            <span className={`font-semibold ${isRequested ? "text-yellow-500" : "text-green-500"}`}>
              {isRequested ? translate("Requested Theme") : translate("Available Theme")}
            </span>
          </>
        )}
      </div>

      {/* Acțiuni */}
      <div className="mt-6 flex justify-center">
        <TopicActions
          toggleConfirmActionModal={toggleConfirmActionModal}
          toggleRequestModal={toggleRequestModal}
          isRequested={isRequested}
          translate={translate}
          role={role}
          toggleEditModal={toggleEditModal}
        />
      </div>
    </div>
  );
};

export default TopicDetails;
