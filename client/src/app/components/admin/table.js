import { useState } from "react";
import React from "react";

export default function Table({ data, columns, actions }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [modalContent, setModalContent] = useState(null);

  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center">Nu există date disponibile.</p>;
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // ✅ Adaugă automat coloana "Acțiuni" în `columns` dacă există acțiuni
  const updatedColumns = actions ? [...columns, { key: "actions", label: "Acțiuni" }] : columns;

  return (
    <div className="overflow-x-auto bg-white flex"> {/* ✅ Flex pentru scroll corect */}
      <div className="w-full overflow-x-auto"> {/* ✅ Scroll pe orizontală activ */}
        <table className="min-w-max w-full border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {updatedColumns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 text-left cursor-pointer text-black hover:bg-gray-300 border-b-2 border-gray-900 whitespace-nowrap"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label} {sortConfig.key === col.key ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-900">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-black whitespace-nowrap">
                    {col.key === "description" ? (
                      <>
                        {row[col.key]?.length > 50 ? (
                          <>
                            {row[col.key].slice(0, 50)}...
                            <button
                              className="text-blue-500 underline ml-2"
                              onClick={() => setModalContent(row[col.key])}
                            >
                              Vezi mai mult
                            </button>
                          </>
                        ) : (
                          row[col.key]
                        )}
                      </>
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-2 flex space-x-2 whitespace-nowrap">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        className={`px-2 py-1 rounded ${action.className}`}
                        onClick={() => action.onClick(row)}
                      >
                        {React.cloneElement(action.icon)}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal pentru afișarea descrierii complete */}
      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold text-black mb-4">Descriere completă</h2>
            <p className="text-gray-700">{modalContent}</p>
            <div className="flex justify-end mt-4">
              <button 
                className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
                onClick={() => setModalContent(null)}
              >
                Închide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
