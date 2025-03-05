"use client";

import Table from "@/app/components/admin/table";
import AddButton from "@/app/components/admin/add-button";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

export default function AdminFacultiesPage() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaculties = async () => {
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

    fetchFaculties();
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-center">Se încarcă...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">A apărut o eroare. Vă rugăm să încercați din nou.</p>;
  }

  const handleAdd = () => {
    
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nume" },
    { key: "description", label: "Descriere" },
    { key: "createdAt", label: "Creat la" },
    { key: "updatedAt", label: "Actualizat la" },
  ];

  return (
    <div className="p-6">
      <p className="text-gray-700 text-5xl text-center">Facultăți</p>
      <Table data={faculties} columns={columns} />
      <AddButton onClick={console.log("click")} />
    </div>
  );
}