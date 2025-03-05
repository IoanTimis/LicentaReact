export default function ConfirmActionModal({ actionFunction, isOpen, setIsOpen, objName }) {
  if (!isOpen || !objName) return null; // Nu afișăm modalul dacă nu avem obiect

  // Setăm titlul și mesajul în funcție de `objName`
  let title = "";
  let message = "";

  switch (objName) {
    case "faculty":
      title = "Ștergere Facultate";
      message = "Sigur doriți să ștergeți această facultate? Această acțiune este ireversibilă.";
      break;
    case "specialization":
      title = "Ștergere Specializare";
      message = "Sigur doriți să ștergeți această specializare? Această acțiune este ireversibilă.";
      break;
    case "user":
      title = "Ștergere Utilizator";
      message = "Sigur doriți să ștergeți acest utilizator? Această acțiune este ireversibilă.";
      break;
    case "teacher":
      title = "Ștergere Profesor";
      message = "Sigur doriți să ștergeți acest profesor? Această acțiune este ireversibilă.";
      break;
    default:
      title = "Ștergere";
      message = "Sigur doriți să ștergeți acest element? Această acțiune este ireversibilă.";
  }

  const handleConfirm = () => {
    actionFunction();
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold text-gray-700 mb-4">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
            onClick={() => setIsOpen(false)}
          >
            Anulare
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={handleConfirm}
          >
            Șterge
          </button>
        </div>
      </div>
    </div>
  );
}
