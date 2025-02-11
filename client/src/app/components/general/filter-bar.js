"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/Languagecontext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function FilterBar({ onSearch, onFilterChange, filterOnDatabase, filterSearchDatabase, noMatch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const pathname = usePathname();
  const { translate } = useLanguage();

  const handleSearch = (e) => {
    if (!filterOnDatabase) {
      const value = e.target.value;
      setSearchTerm(value);
      onSearch(value);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
  
    if (filterOnDatabase) {
      filterSearchDatabase(searchTerm, value); // corectăm apelul
    } else {
      onFilterChange(value);
    }
  };
  

  return (
    <div className="w-full lg:w-1/4 bg-gray-100 p-4 shadow-lg rounded-lg">
      {/* Search Bar */}
      {!filterOnDatabase ? (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      ) : (
        <div className="mb-4 flex">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-500 text-black rounded-l-lg focus:outline-none"
          />
          <button
            onClick={() => filterSearchDatabase(searchTerm, selectedFilter)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-r-lg"
          >
            <MagnifyingGlassIcon className="h-6 w-6 transition" />
          </button>
        </div>
      )}


      {/* Filters */}
      {/* Teacher */}

      {/*My-Students Filters*/}
      { pathname === "/teacher/my-students" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        <select
          className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          onChange={handleFilterChange}
        >
          <option value="">{translate("All")}</option>
          <option value="bsc">BSC</option>
          <option value="msc">MSC</option>
        </select>
      </div>
      )}

      {/*Request Filters*/}
      { pathname === "/teacher/student-requests" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        <select
          className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          onChange={handleFilterChange}
        >
          <option value="">{translate("All")}</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      )}

      {/*Topics Filters*/}
      { pathname === "/teacher/my-topics" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        <select
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">{`All`}</option>
          <option value="bsc">Bachelor</option>
          <option value="msc">Master</option>
        </select>
        <select
          className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">{translate("All")}</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      )}

      { noMatch && (
        <div className="w-full text-center bg-yellow-100 text-yellow-800 py-3 px-4 rounded-lg mt-4">
          🔍 {translate("No results found for your search or filters.")}
        </div>
      )}
    </div>
  );
}
