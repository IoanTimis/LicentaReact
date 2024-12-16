"use client";

export default function CompleteProfileTeacher() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Completează-ți profilul ca profesor
      </h1>

      <form
        method="PUT"
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Titlu
          </label>
          <input
            id="title"
            name="title"
            placeholder="Introdu titlul"
            className="w-full border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
            Tip
          </label>
          <input
            id="type"
            value="teacher"
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
