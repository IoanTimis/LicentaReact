import RequestStatusActions from "../student/request-status-actions";

const RequestDetails = ({ topic, request, toggleConfirmActionModal, translate, role, toggleResponseModal }) => {
  return (
    <div className="bg-gray-100 p-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-[40%_60%] gap-y-4 text-gray-700">

        <span className="font-semibold">{translate("Slots")}:</span>
        <span>{topic.slots === 0 ? translate("No slots available") : topic.slots}</span>

        <span className="font-semibold">{translate("Education Level")}:</span>
        <span>{topic.education_level}</span>

        <span className="font-semibold">{translate("Status")}:</span>
        <span className="font-semibold">
          {request.status === "pending"
            ? translate("Pending") + "..."
            : request.status === "confirmed"
            ? translate("Confirmed") + "!"
            : request.status === "accepted"
            ? translate("Accepted") + "!"
            : translate("Rejected") + "!"}
        </span>
      </div>

      {/* Butoane de acțiuni */}
      <div className="mt-6 flex justify-center">
        <RequestStatusActions 
          request={request}
          toggleConfirmActionModal={toggleConfirmActionModal} 
          translate={translate} 
          role={role} 
          toggleResponseModal={toggleResponseModal}
        />
      </div>
    </div>
  );
};

export default RequestDetails;
