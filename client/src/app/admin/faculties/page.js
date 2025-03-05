"use client";

import Table from "@/app/components/admin/table";
import AddButton from "@/app/components/admin/add-button";
import FacultyForm from "@/app/components/admin/faculty-form";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ConfirmActionModal from "@/app/components/admin/confirm-action-modal";

export default function AdminFacultiesPage() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("http://localhost:8080/admin/faculties", { withCredentials: true });
      setFaculties(response.data);
    } catch (error) {
      console.error("Fetch faculties error:", error);
      
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedFaculty(null);
    setShowForm(true);
  };

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setShowForm(true);
  };

  const handleDelete = (faculty) => {
    setSelectedFaculty(faculty);
    setShowConfirmModal(true);
  }

  const handleSave = () => {
    setShowForm(false);
    fetchFaculties();
  };

  const deleteFaculty = async (faculty) => {
    try {
      await axiosInstance.delete(`http://localhost:8080/admin/faculty/delete/${faculty.id}`, { withCredentials: true });
      fetchFaculties();
    } catch (error) {
      console.error("Delete faculty error:", error);
      setError(error);
    }
  }

  if (loading) {
    return <p className="text-gray-500 text-center">Se încarcă...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">A apărut o eroare. Vă rugăm să încercați din nou.</p>;
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nume" },
    { key: "description", label: "Descriere" },
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
      <Table data={faculties} columns={columns} actions={actions} />
        <AddButton onClick={handleAdd} />

      {showForm && (
        <FacultyForm 
          faculty={selectedFaculty}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmActionModal 
        objName={"faculty"}
        actionFunction={() => deleteFaculty(selectedFaculty) } 
        isOpen={showConfirmModal} 
        setIsOpen={setShowConfirmModal} 
      />
    </div>
  );
}
