import { useLanguage } from "@/context/Languagecontext";

export default function StudentInfoCard({ studentInfo }) {
  const { translate } = useLanguage();
  console.log(studentInfo);

  return (
    <div className="bg-white shadow rounded border border-gray-950
      hover:shadow-xl hover:-translate-y-1 transition-transform duration-200"
    >
      <div className="bg-navbar-gradient flex justify-between items-center py-2 px-4 rounded-t">
        <h2 className="text-lg font-semibold text-white truncate">{studentInfo.request.topic.title}</h2>
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
