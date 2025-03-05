"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function FacultyForm({ faculty, onClose, onSave }) {
  const [name, setName] = useState(faculty?.name || "");
  const [description, setDescription] = useState(faculty?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (faculty) {
        await axiosInstance.put(`http://localhost:8080/admin/faculty/edit/${faculty.id}`, {
          name,
          description,
        }, { withCredentials: true });
      } else {
        await axiosInstance.post("http://localhost:8080/admin/faculty/add", {
          name,
          description,
        }, { withCredentials: true });
      }

      onSave();
    } catch (err) {
      setError("Eroare la salvare. Încercați din nou.");
      console.error("Save faculty error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-black mb-4">{faculty ? "Editare Facultate" : "Adăugare Facultate"}</h2>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Nume Facultate</label>
            <input 
              type="text"
              className="w-full border border-gray-400 rounded p-2 text-gray-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Descriere</label>
            <textarea 
              className="w-full border border-gray-400 rounded p-2 text-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button 
              type="button"
              className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded"
              onClick={onClose}
              disabled={loading}
            >
              Anulare
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
              disabled={loading}
            >
              {loading ? "Se salvează..." : "Salvează"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
