import TopicActions from "./topic-actions";

const TopicDetails = ({ topic, toggleConfirmActionModal, toggleEditModal, translate, role, isRequested }) => {
  return (
    <div className="bg-gray-100 p-6 flex flex-col items-center justify-center">
      <p className="text-gray-700 mb-4">
        <span className="font-semibold">{translate("Keywords")}:</span> {topic.keywords}
      </p>
      <p className="text-gray-700 mb-4">
        {topic.slots === 0 ? (
          <span className="text-black">{translate("No slots available")}</span>
        ) : (
          <span>
            <span className="font-semibold">{translate("Slots")}:</span> {topic.slots}
          </span>
        )}
      </p>
      <p className="text-gray-700 mb-4">
        <span className="font-semibold">{translate("Education Level")}:</span> {topic.education_level}
      </p>
      {role === "student" && (<p className="text-black">
        {isRequested
          ? translate("Requested Theme")
          : translate("Available Theme")
        }
      </p>)}

      <TopicActions
        toggleConfirmActionModal={toggleConfirmActionModal}
        translate={translate}
        role={role}
        toggleEditModal={toggleEditModal}
      />

    </div>
  );
};

export default TopicDetails;
