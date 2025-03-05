"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function UserForm({ user, onClose, onSave, faculties }) {
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [passwordDisabled, setPasswordDisabled] = useState(!!user); // ✅ Parola e dezactivată la editare
  const [title, setTitle] = useState(user?.title || "");
  const [educationLevel, setEducationLevel] = useState(user?.education_level || "");
  const [type, setType] = useState(user?.type || "student");
  const [facultyId, setFacultyId] = useState(user?.faculty_id || "");
  const [specializationId, setSpecializationId] = useState(user?.specialization_id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    if (facultyId) {
      const selectedFaculty = faculties.find(faculty => faculty.id === parseInt(facultyId));
      setSpecializations(selectedFaculty ? selectedFaculty.specializations : []);
    } else {
      setSpecializations([]);
    }
  }, [facultyId, faculties]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = {
        first_name: firstName,
        name: lastName,
        email,
        title: title || null,
        education_level: educationLevel || null,
        type,
        faculty_id: facultyId || null,
        specialization_id: specializationId || null,
      };

      if (!passwordDisabled && password.trim()) {
        userData.password = password; // ✅ Se trimite parola doar dacă este modificată
      }

      if (user) {
        await axiosInstance.put(`http://localhost:8080/admin/user/edit/${user.id}`, userData, { withCredentials: true });
      } else {
        await axiosInstance.post("http://localhost:8080/admin/user/add", userData, { withCredentials: true });
      }

      onSave();
    } catch (err) {
      setError("Eroare la salvare. Încercați din nou.");
      console.error("Save user error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-black mb-4">
          {user ? "Editare Utilizator" : "Adăugare Utilizator"}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Prenume</label>
            <input 
              type="text"
              className="w-full border border-gray-400 rounded p-2 text-gray-700"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Nume</label>
            <input 
              type="text"
              className="w-full border border-gray-400 rounded p-2 text-gray-700"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Email</label>
            <input 
              type="email"
              className="w-full border border-gray-400 rounded p-2 text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Parolă</label>
            <div className="flex items-center">
              <input
                type="password"
                className="w-full border border-gray-400 rounded p-2 text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={passwordDisabled} // ✅ Parola este inițial dezactivată
              />
            </div>
            {passwordDisabled && (
              <button
                type="button"
                className="text-blue-500 text-sm mt-1 underline"
                onClick={() => setPasswordDisabled(false)}
              >
                Schimbă parola
              </button>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Titlu</label>
            <input 
              type="text"
              className="w-full border border-gray-400 rounded p-2 text-gray-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Nivel Educational</label>
            <select 
              className="w-full border border-gray-400 rounded p-2 text-gray-700"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
            >
              <option value="">Selectați Nivel Educatie...</option>
              <option value="bsc">BSC</option>
              <option value="msc">MSC</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Tip Utilizator</label>
            <select 
              className="w-full border border-gray-400 rounded p-2 text-gray-700"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="teacher">Profesor</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Facultate</label>
            <select 
              className="w-full border border-gray-400 rounded p-2 text-gray-700"
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
            >
              <option value="">Selectați o facultate...</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
              ))}
            </select>
          </div>

          {facultyId && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">Specializare</label>
              <select 
                className="w-full border border-gray-400 rounded p-2 text-gray-700"
                value={specializationId}
                onChange={(e) => setSpecializationId(e.target.value)}
              >
                <option value="">Selectați o specializare...</option>
                {specializations.map((specialization) => (
                  <option key={specialization.id} value={specialization.id}>{specialization.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded" onClick={onClose} disabled={loading}>Anulare</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded" disabled={loading}>{loading ? "Se salvează..." : "Salvează"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
