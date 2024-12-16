"use client";

import Link from "next/link";

export default function CompleteProfile() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Pentru a avea acces complet, te rog finalizează-ți profilul
      </h1>

      <div className="flex flex-col md:flex-row gap-4">
        <Link
          href="/complete-profile/as-teacher"
          className="px-6 py-3 bg-red-600 text-white font-medium text-lg rounded-md hover:bg-red-700 transition"
        >
          Completează-ți contul ca profesor
        </Link>
        <Link
          href="/complete-profile/as-student"
          className="px-6 py-3 bg-blue-600 text-white font-medium text-lg rounded-md hover:bg-blue-700 transition"
        >
          Completează-ți contul ca student
        </Link>
      </div>
    </main>
  );
}
