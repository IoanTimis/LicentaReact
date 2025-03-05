"use client";

import Table from "@/app/components/admin/table";
import AddButton from "@/app/components/admin/add-button";
import UserForm from "@/app/components/admin/user-form";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ConfirmActionModal from "@/app/components/admin/confirm-action-modal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("http://localhost:8080/admin/users", { withCredentials: true });
      setFaculties(response.data.faculties);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Fetch users error:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  }

  const handleSave = () => {
    setShowForm(false);
    fetchUsers();
  };

  const deleteUser = async (user) => {
    try {
      await axiosInstance.delete(`http://localhost:8080/admin/user/delete/${user.id}`, { withCredentials: true });
      fetchUsers();
    } catch (error) {
      console.error("Delete user error:", error);
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
    { key: "first_name", label: "Prenume" },
    { key: "name", label: "Nume" },
    { key: "email", label: "Email" },
    { key: "education_level", label: "Nivel Edu" },
    { key: "title", label: "Titlu" },
    { key: "type", label: "Tip" },
    { key: "complete_profile", label: "P Complet" },
    { key: "faculty_id", label: "F_ID" },
    { key: "specialization_id", label: "SP_ID" },
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

  return(
    <div className="">
      <Table columns={columns} data={users} actions={actions} />
      
      <AddButton onClick={handleAdd} />

      {showForm && (
        <UserForm 
          user={selectedUser} 
          faculties={faculties} 
          onSave={handleSave}
          onClose={() => setShowForm(false)} 
        />
      )}

      {showConfirmModal && (
        <ConfirmActionModal
          objName={"user"}
          actionFunction={() => deleteUser(selectedUser)}
          isOpen={showConfirmModal}
          setIsOpen={setShowConfirmModal}
        />
      )}
    </div>
  );
}