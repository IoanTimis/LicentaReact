import RequestStatusActions from "../student/request-status-actions";

const RequestDetails = ({ topic, request, toggleConfirmActionModal, translate, role, toggleResponseModal }) => {
  return (
    <div className="bg-gray-100 p-6 flex flex-col items-center justify-center">
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
      <p className="text-black">
        {request.status === "pending"
          ? translate("Pending") + "..."
          : request.status === "confirmed"
          ? translate("Confirmed") + "!"
          : request.status === "accepted"
          ? translate("Accepted") + "!"
          : translate("Rejected") + "!"}
      </p>

      {/* Butoane de acțiuni */}
      <RequestStatusActions 
        request={request}
        toggleConfirmActionModal={toggleConfirmActionModal} 
        translate={translate} 
        role={role} 
        toggleResponseModal={toggleResponseModal}
      />
    </div>
  );
};

export default RequestDetails;
