"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/Languagecontext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function FilterBar({ onSearch, onFilterChange, filterOnDatabase, filterSearchDatabase, noMatch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    educationLevel: "",
    slots: "",
    status: "",
  });
  
  const pathname = usePathname();
  const { translate } = useLanguage();

  const handleSearch = (e) => {
    if (!filterOnDatabase) {
      const value = e.target.value;
      setSearchTerm(value);
      onSearch(value);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  
    if (filterOnDatabase) {
      filterSearchDatabase(searchTerm,  { ...selectedFilters, [filterName]: value });
    } else {
      onFilterChange({ ...selectedFilters, [filterName]: value });
    }
  };
  
  

  return (
    <div className="w-full lg:w-1/4 bg-gray-100 p-4 shadow-lg rounded-lg">
      {/* Search Bar */}
      {!filterOnDatabase ? (
        <div className="mb-4">
          <input
            type="text"
            placeholder= {translate("Search...")}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      ) : (
        <div className="mb-4 flex">
          <input
            type="text"
            placeholder={translate("Search...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-500 border-r-0 text-black rounded-l-lg focus:outline-none"
          />
          <button
            onClick={() => filterSearchDatabase(searchTerm, selectedFilters)}
            className="text-black hover:text-blue-600 font-semibold px-4 py-2 rounded-r-lg border border-gray-500 border-l-0 "
          >
            <MagnifyingGlassIcon className="h-6 w-6 transition" />
          </button>
        </div>
      )}


      {/* Filters */}

      {/*Teacher Filters*/}

      {/*My-Students Filters*/}
      { pathname === "/teacher/my-students" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        <select
          className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          value={selectedFilters.educationLevel}
          onChange={(e) => handleFilterChange("educationLevel", e.target.value)}
        >
          <option value="">{translate("All")}</option>
          <option value="bsc">{translate("Bachelor")}</option>
          <option value="msc">{translate("Master")}</option>
        </select>
      </div>
      )}

      {/*Request Filters*/}
      { (pathname === "/teacher/student-requests") && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        <select
          className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          value={selectedFilters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">{translate("All")}</option>
          <option value="pending">{translate("Pending")}</option>
          <option value="accepted">{translate("Accepted")}</option>
          <option value="confirmed">{translate("Confirmed")}</option>
          <option value="rejected">{translate("Rejected")}</option>
        </select>
      </div>
      )}

      {/*Topics Filters*/}
      { pathname === "/teacher/my-topics" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        <select
          className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          value={selectedFilters.educationLevel}
          onChange={(e) => handleFilterChange("educationLevel", e.target.value)}
        >
          <option value="">{translate("Any Education Level")}</option>
          <option value="bsc">{translate("Bachelor")}</option>
          <option value="msc">{translate("Master")}</option>
        </select>
        <select
          className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          value={selectedFilters.slots}
          onChange={(e) => handleFilterChange("slots", e.target.value)}
        >
          <option value="">{translate("Any Slot Number")}</option>
          <option value="0">{translate("0 Slots")}</option>
          <option value="1">{translate("1+ Slots")}</option>
        </select>
      </div>
      )}

      {/*Student Filters*/}

      {/*My-Requests Filters*/}
      { pathname === "/student/my-requests" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        <select
          className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          value={selectedFilters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">{translate("All")}</option>
          <option value="pending">{translate("Pending")}</option>
          <option value="accepted">{translate("Accepted")}</option>
          <option value="rejected">{translate("Rejected")}</option>
        </select>
      </div>
      )}


      {/*No Match*/}
      { noMatch && (
        <div className="w-full text-center bg-yellow-100 text-yellow-800 py-3 px-4 rounded-lg mt-4">
          🔍 {translate("No results found for your search or filters.")}
        </div>
      )}
    </div>
  );
}
