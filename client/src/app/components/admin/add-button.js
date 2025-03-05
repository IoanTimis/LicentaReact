import { PlusCircleIcon } from "@heroicons/react/24/solid";

export default function AddButton({ onClick }) {
  return (
    <div className="flex justify-end mt-4">
      <button
        onClick={onClick}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white 
                  p-3 rounded-full shadow-lg transition-transform transform hover:scale-110"
        aria-label="Add"
      >
        <PlusCircleIcon className="w-10 h-10" />
      </button>
    </div>
  );
}
