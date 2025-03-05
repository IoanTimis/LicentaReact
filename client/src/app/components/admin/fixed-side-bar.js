"use client";

import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/solid";
import { clearUser } from "@/store/features/user/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import { usePathname } from "next/navigation";

export default function FixedSidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const pathname = usePathname();

  const logout = async () => {
    try {
      await axios.get("http://localhost:8080/logout", { withCredentials: true });

      dispatch(clearUser());
      localStorage.removeItem("accessToken");
      console.log("Logout reușit");

      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      setGlobalErrorMessage("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col p-6 shadow-lg">
      {/* Logo */}
      <div className="text-2xl font-bold mb-6 text-center">Admin Dashboard</div>

      {/* Nav */}
      <nav className="flex flex-col space-y-4">
        <Link
          href="/admin"
          className={`flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 ${
            pathname === "/admin" ? "bg-gray-700" : ""
          }`}
        >
          <HomeIcon className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/admin/users"
          className={`flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 ${
            pathname === "/admin/users" ? "bg-gray-700" : ""
          }`}
        >
          <UsersIcon className="h-5 w-5" />
          <span>Utilizatori</span>
        </Link>

        <Link
          href="/admin/teachers"
          className={`flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 ${
            pathname === "/admin/teachers" ? "bg-gray-700" : ""
          }`}
        >
          <AcademicCapIcon className="h-5 w-5" />
          <span>Profesori</span>
        </Link>

        <Link
          href="/admin/faculties"
          className={`flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 ${
            pathname === "/admin/faculties" ? "bg-gray-700" : ""
          }`}
        >
          <BuildingOffice2Icon className="h-5 w-5" />
          <span>Facultăți</span>
        </Link>

        <Link
          href="/admin/specializations"
          className={`flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 ${
            pathname === "/admin/specializations" ? "bg-gray-700" : ""
          }`}
        >
          <BuildingOfficeIcon className="h-5 w-5" />
          <span>Specializări</span>
        </Link>

        <button
          onClick={logout}
          className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
