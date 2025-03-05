import { useState } from "react";

export default function Table({ data, columns, actions }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center">Nu există date disponibile.</p>;
  }

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Funcția de sortare a datelor
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

  return (
    <div className="overflow-x-auto bg-white">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-300 border-b-2 border-gray-900"
                onClick={() => handleSort(col.key)}
              >
                {col.label} {sortConfig.key === col.key ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
            ))}
            {actions && <th className="px-4 py-2 text-left">Acțiuni</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-900">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2 text-black">
                  {row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-2 flex space-x-2">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      className={`px-2 py-1 rounded ${action.className}`}
                      onClick={() => action.onClick(row)}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
