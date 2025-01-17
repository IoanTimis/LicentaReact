import Link from "next/link";
import { truncateText } from "@/utils/truncate-text";

export default function RequestCard({ request, handleDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Link href={`/student/request-topic/${request.id}`}>
        <div className="p-4">
          <h5 className="font-bold text-lg mb-2">
            Titlu: {truncateText(request.topic.title, 40)}
          </h5>
          <p className="text-gray-600 mb-2">
            Descriere: {truncateText(request.topic.description, 40)}
          </p>
          <p className="text-sm text-gray-600 mb-1">Cuvinte cheie: {request.topic.keywords}</p>
          <p className="text-sm text-gray-600 mb-1">Locuri: {request.topic.slots}</p>
          <p className="text-sm text-gray-600 mb-1">Tip: {request.topic.education_level}</p>
          <p className="text-sm text-gray-600 mb-1">Profesor: {request.teacher.name}</p>
          <p className="text-sm text-gray-600 mb-1">
            Mesaj către profesor:{" "}
            {request.student_message
              ? truncateText(request.student_message, 40)
              : "Nu a fost trimis niciun mesaj de către student."}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            Răspuns de la profesor:{" "}
            {request.teacher_message
              ? truncateText(request.teacher_message, 40)
              : "Nu a fost primit niciun răspuns."}
          </p>
          <p className="text-sm text-gray-600 font-bold">Status: {request.status}</p>
        </div>
      </Link>
      <div className="p-4 border-t bg-gray-50 flex justify-end">
        <button
          type="button"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => handleDelete(request.id)}
        >
          Șterge
        </button>
      </div>
    </div>
  );
}
