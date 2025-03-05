"use client";

import Table from "@/app/components/admin/table";
import AddButton from "@/app/components/admin/add-button";
import FacultyForm from "@/app/components/admin/faculty-form";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

export default function AdminFacultiesPage() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
      setError(error);
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

  const handleSave = () => {
    setShowForm(false);
    fetchFaculties();
  };

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
    { 
      key: "actions",
      label: "Acțiuni",
      render: (faculty) => (
        <button 
          className="text-blue-600 underline" 
          onClick={() => handleEdit(faculty)}
        >
          Editează
        </button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Table data={faculties} columns={columns} />
        <AddButton onClick={handleAdd} />

      {showForm && (
        <FacultyForm 
          faculty={selectedFaculty}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
