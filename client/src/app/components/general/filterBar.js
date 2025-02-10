"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function FilterBar({ onSearch, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const pathname = usePathname();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    onFilterChange(value);
  };



  return (
    <div className="w-full lg:w-1/4 bg-gray-100 p-4 shadow-lg rounded-lg">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Filters */}
      {/* Teacher */}

      {/*My-Students Filters*/}
      { pathname === "/teacher/my-students" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        <select
          className="w-full p-2 border border-gray-500 text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          onChange={handleFilterChange}
        >
          <option value="">{`All Status`}</option>
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
          <option value="">{`All Status`}</option>
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
          <option value="">{`All Status`}</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      )}
    </div>
  );
}
