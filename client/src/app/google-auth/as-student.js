"use client";

import { useState } from "react";

export default function CompleteProfileStudent({ faculties }) {
  const [specializations, setSpecializations] = useState([]);

  const handleFacultyChange = (e) => {
    const facultyId = e.target.value;
    // Exemplu simplu pentru a popula specializările în funcție de facultate
    setSpecializations(
      faculties.find((f) => f.id === facultyId)?.specializations || []
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Completează-ți profilul ca student
      </h1>

      <form className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Alege facultatea
          </label>
          <select
            className="w-full border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
            onChange={handleFacultyChange}
          >
            <option value="">Selectează facultatea</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Alege specializarea
          </label>
          <select className="w-full border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500">
            <option value="">Selectează specializarea</option>
            {specializations.map((specialization) => (
              <option key={specialization.id} value={specialization.id}>
                {specialization.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Tipul de învățământ
          </label>
          <select className="w-full border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500">
            <option value="bsc">BSC</option>
            <option value="msc">MSC</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Tip</label>
          <input
            type="text"
            value="student"
            disabled
            className="w-full border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
        >
          Trimite
        </button>
      </form>
    </main>
  );
}
