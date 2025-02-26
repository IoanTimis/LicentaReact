"use client";

import { useState } from "react";
import Link from "next/link";
import { HomeIcon, UsersIcon, AcademicCapIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { clearUser } from "@/store/features/user/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";

export default function FixedSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { setGlobalErrorMessage } = useContext(ErrorContext);

  const logout = async () => {
    try {
      await axios.get("http://localhost:8080/logout", { withCredentials: true });

      dispatch(clearUser());
      localStorage.removeItem("accessToken");
      console.log("Logout reusit");
      
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      setGlobalErrorMessage("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <>
      {/*Mobile button*/}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg 
        transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0 lg:flex`}
      >
        {/* Logo */}
        <div className="text-2xl font-bold mb-6 text-center">Admin Dashboard</div>

        {/* Nav */}
        <nav className="flex flex-col space-y-4">
          <Link href="/admin" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
            <HomeIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/users" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
            <UsersIcon className="h-5 w-5" />
            <span>Utilizatori</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
            <AcademicCapIcon className="h-5 w-5" />
            <span>Profesori</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700"
          >
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Background overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
