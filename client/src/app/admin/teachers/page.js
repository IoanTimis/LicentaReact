"use client";

import Table from "@/app/components/admin/table";
import AddButton from "@/app/components/admin/add-button";
import TeacherForm from "@/app/components/admin/teacher-form";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ConfirmActionModal from "@/app/components/admin/confirm-action-modal";

export default function AdminTeacherspage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("http://localhost:8080/admin/teachers", { withCredentials: true });
      setTeachers(response.data);
    } catch (error) {
      console.error("Fetch teachers error:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedTeacher(null);
    setShowForm(true);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setShowForm(true);
  };

  const handleDelete = (teacher) => {
    setSelectedTeacher(teacher);
    setShowConfirmModal(true);
  }

  const handleSave = () => {
    setShowForm(false);
    fetchTeachers();
  };

  const deleteTeacher = async (teacher) => {
    try {
      await axiosInstance.delete(`http://localhost:8080/admin/teacher/delete/${teacher.id}`, { withCredentials: true });
      fetchTeachers();
    } catch (error) {
      console.error("Delete teacher error:", error);
      setError(error);
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-center">Se încarcă...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">A apărut o eroare. Vă rugăm să încercați din nou.</p>;
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "email", label: "Email" },
    { key: "createdAt", label: "Creat la" },
    { key: "updatedAt", label: "Actualizat la" },
  ];

  const actions = [
    { 
      className: "bg-blue-500 hover:bg-blue-700 text-white",
      onClick: handleEdit,
      icon: <PencilIcon className="h-5 w-5" />
    },
    { 
      className: "bg-red-500 hover:bg-red-700 text-white",
      onClick: handleDelete,
      icon: <TrashIcon className="h-5 w-5" />
    },
  ];

  return (
    <div className="">
      <Table data={teachers} columns={columns} actions={actions} />
        <AddButton onClick={handleAdd} />

      {showForm && (
        <TeacherForm 
          teacher={selectedTeacher}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmActionModal 
        objName={"teacher"}
        actionFunction={() => deleteTeacher(selectedTeacher) } 
        setIsOpen={setShowConfirmModal} 
        isOpen={showConfirmModal}
      />
    </div>
  );
}