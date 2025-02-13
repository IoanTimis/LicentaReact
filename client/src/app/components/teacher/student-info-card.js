import { useLanguage } from "@/context/Languagecontext";
import { truncateText } from "@/utils/truncate-text";

export default function StudentInfoCard({ studentInfo }) {
  const { translate } = useLanguage();
  console.log(studentInfo);

  return (
    <div className="bg-white shadow rounded hover:shadow-lg transition border border-gray-950">
      <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
        <h2 className="text-lg font-semibold text-white">{truncateText(studentInfo.topic.title, 20)}</h2>
      </div>
      <div className="p-4">
      <p className="text-gray-700">
        <span className="font-semibold">{translate("Name")}:</span> {studentInfo.student.name}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">{translate("First Name")}:</span> {studentInfo.student.first_name}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">{translate("Email")}:</span> {studentInfo.student.email}
      </p>
      </div>
    </div>
  );
}
