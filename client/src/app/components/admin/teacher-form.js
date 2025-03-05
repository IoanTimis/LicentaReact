"use client";

import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function TeacherForm({ teacher, onClose, onSave }) {
  const [email, setEmail] = useState(teacher?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log("email:", email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (teacher) {
        await axiosInstance.put(`http://localhost:8080/admin/teacher/edit/${teacher.id}`, {
          email,
        }, { withCredentials: true });
      } else {
        await axiosInstance.post("http://localhost:8080/admin/teacher/add", {
          email,
        }, { withCredentials: true });
      }

      onSave();
    } catch (err) {
      setError("Eroare la salvare. Încercați din nou.");
      console.error("Save teacher error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-black mb-4">
          {teacher ? "Editare Profesor" : "Adăugare Profesor"}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Email Profesor</label>
            <input 
              type="email"
              className="w-full border border-gray-400 rounded p-2 text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button 
              type="button"
              className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
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
