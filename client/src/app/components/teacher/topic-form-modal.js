"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { XMarkIcon } from "@heroicons/react/24/solid";

const TopicModal = ({
  isOpen,
  toggleModal,
  formMode,
  translate,
  handleSubmit,
  handleEdit,
  title,
  setTitle,
  description,
  setDescription,
  keywords,
  setKeywords,
  slots,
  setSlots,
  educationLevel,
  setEducationLevel,
  faculties,
  selectedFacultyId,
  handleFacultyChange,
  specializations,
  selectedSpecializations,
  handleSpecializationChange,
  removeSpecializationField,
  addSpecializationField,
  dublicateError
}) => {

  const [onlyTeacher, setOnlyTeacher] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get("/teacher/api/only-teachers", { withCredentials: true });
        setOnlyTeacher(response.data.onlyTeacher);
        console.log("ONLYTEACHER setting:", response.data.onlyTeacher);
      } catch (error) {
        console.error("Error fetching ONLYTEACHER setting:", error);
      }
    };
    fetchSettings();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl h-full max-h-fit overflow-y-auto p-6 sm:p-8 relative">
        
        {/* Exit button */}
        <button
          onClick={toggleModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
          {formMode === "add" ? translate("Add Theme") : translate("Edit Theme")}
        </h2>

        <form onSubmit={formMode === "add" ? handleSubmit : handleEdit} className="space-y-4">
          
          <div>
            <label className="block text-gray-700">{translate("Title")}</label>
            <input
              type="text"
              className="border border-gray-300 text-gray-700 rounded w-full p-2"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!onlyTeacher}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">{translate("Description")}</label>
            <textarea
              className="border border-gray-300 text-gray-700 rounded w-full p-2"
              name="description"
              value={description}
              disabled={!onlyTeacher}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">{translate("Keywords")}</label>
            <input
              type="text"
              className="border border-gray-300 text-gray-700 rounded w-full p-2"
              name="keywords"
              value={keywords}
              disabled={!onlyTeacher}
              onChange={(e) => setKeywords(e.target.value)}
              required
            />
            <small className="text-gray-500">{translate("Keywords must be separated by space.")}</small>
          </div>

          <div>
            <label className="block text-gray-700">{translate("Slots")}</label>
            <input
              type="number"
              className="border border-gray-300 text-gray-700 rounded w-full p-2"
              name="slots"
              value={slots}
              onChange={(e) => setSlots(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">{translate("Education Level")}</label>
            <select
              className="border border-gray-300 text-gray-700 rounded w-full p-2"
              name="education_level"
              value={educationLevel}
              disabled={!onlyTeacher}
              onChange={(e) => setEducationLevel(e.target.value)}
              required
            >
              <option value="">{translate("Select education level")}</option>
              <option value="bsc">{translate("Bachelor")}</option>
              <option value="msc">{translate("Master")}</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">{translate("Faculty")}</label>
            <select
              className="border border-gray-300 text-gray-700 rounded w-full p-2"
              value={selectedFacultyId || ""}
              disabled={!onlyTeacher}
              onChange={(e) => handleFacultyChange(e.target.value)}
              required
            >
              <option value="">{translate("Select Faculty")}</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            {/* Specializations */}
            <label className="block text-gray-700">{translate("Specializations")}</label>
            {selectedSpecializations.map((specialization, index) => (
              <div key={index} className="flex items-center mb-2">
                <select
                  className={`border ${dublicateError ? "border-red-500" : "border-gray-300"} text-gray-700 rounded w-full p-2`}
                  value={specialization || ""}
                  disabled={!onlyTeacher}
                  onChange={(e) => handleSpecializationChange(index, e.target.value)}
                  required
                >
                  <option value="">{translate("Select Specialization")}</option>
                  {specializations.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
                {/* Delete specialization field */}
                {selectedSpecializations.length > 1 && (
                  <button
                    type="button"
                    disabled={!onlyTeacher}
                    onClick={() => removeSpecializationField(index)}
                    className="ml-2 text-gray-500 hover:text-red-500 transition"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            {/* Duplicate error message */}
            {dublicateError && <p className="text-red-500 text-sm mt-1">{translate(dublicateError)}</p>}
            {/* Add specialization button */}
            <button
            type="button"
            className={`px-4 py-2 rounded mt-2 w-full sm:w-auto transition ${
              onlyTeacher 
                ? "bg-blue-500 text-white hover:bg-blue-600" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={onlyTeacher ? addSpecializationField : null}
            disabled={!onlyTeacher}
          >
            {translate("Add Specialization")}
          </button>

          </div>

          <div className="flex flex-col sm:flex-row justify-end sm:space-x-2 sm:mt-0">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">
              {formMode === "add" ? translate("Add") : translate("Edit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicModal;
