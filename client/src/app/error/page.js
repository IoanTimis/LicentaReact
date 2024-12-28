"use client";

import { useSelector } from "react-redux";

export default function Error() {
  const errorMessage = useSelector((state) => state.error.message);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Eroare</h1>
      <p className="text-gray-600 mt-4">{errorMessage || "Eroare necunoscută"}</p>
    </div>
  );
}
