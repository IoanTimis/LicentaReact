"use client";

import Table from "@/app/components/admin/table";
import AddButton from "@/app/components/admin/add-button";
import SpecializationForm from "@/app/components/admin/specialization-form";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ConfirmActionModal from "@/app/components/admin/confirm-action-modal";

export default function AdminFacultiesPage() {
  const [faculties, setFaculties] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("http://localhost:8080/admin/specializations", { withCredentials: true });
      setSpecializations(response.data.specializations);
      setFaculties(response.data.faculties);
    } catch (error) {
      console.error("Fetch specializations error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedSpecialization(null);
    setShowForm(true);
  };

  const handleEdit = (specialization) => {
    setSelectedSpecialization(specialization);
    setShowForm(true);
  };

  const handleDelete = (specialization) => {
    setSelectedSpecialization(specialization);
    setShowConfirmModal(true);
  }

  const handleSave = () => {
    setShowForm(false);
    fetchSpecializations();
  };

  const deleteSpecialization = async (specialization) => {
    try {
      await axiosInstance.delete(`http://localhost:8080/admin/specialization/delete/${specialization.id}`, { withCredentials: true });
      fetchSpecializations();
    } catch (error) {
      console.error("Delete specialization error:", error);
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
    { key: "faculty_id", label: "ID Facultate"},
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
      <Table data={specializations} columns={columns} actions={actions} />
        <AddButton onClick={handleAdd} />

      {showForm && (
        <SpecializationForm 
          specialization={selectedSpecialization}
          faculties={faculties}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmActionModal 
        objName={"specialization"}
        actionFunction={() => deleteSpecialization(selectedSpecialization) } 
        isOpen={showConfirmModal} 
        setIsOpen={setShowConfirmModal} 
      />
    </div>
  );
}
