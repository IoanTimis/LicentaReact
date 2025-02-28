const ProfessorDetails = ({ teacher }) => {
  return (
    <div className="bg-gray-100 p-6 flex flex-col items-center justify-center">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
        <img src="/logo_uvt_profile.png" alt={teacher.name} className="w-full h-full object-cover" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {teacher.title}. {teacher.first_name} {teacher.name}
      </h2>
      <p className="text-gray-600 mb-4">{teacher.email}</p>
    </div>
  );
};

export default ProfessorDetails;