"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/features/user/userSlice";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useLanguage } from "@/context/Languagecontext";
import { ErrorContext } from "@/context/errorContext";
import { useContext } from "react";
import { usePathname } from "next/navigation";

import { HomeIcon, AcademicCapIcon, HeartIcon, UserIcon, NewspaperIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

export default function studentNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { language, setLanguage, translate } = useLanguage();
  const { setGlobalErrorMessage } = useContext(ErrorContext);
  const pathname = usePathname();
  console.log("Current path:", pathname);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage); 
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:8080/logout", { withCredentials: true });

      router.push("/auth/login");
      dispatch(clearUser());
      localStorage.removeItem("accessToken");
      console.log("Logout reusit");
      
    } catch (error) {
      console.error("Logout error:", error);
      setGlobalErrorMessage(translate("An error occurred while logging out. Please try again."));
    }
  };

  return (
    <nav className="bg-navbar-gradient shadow-md sticky top-0 z-50">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Hamburger icon for mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>

            {/* Logo for desktop */}
            <div className="hidden md:flex flex-shrink-0">
              <Link href="/student" className="text-white text-xl font-bold">
                <img src="/logo.png" alt="Logo" className="h-10" />
              </Link>
            </div>
          </div>

          {/* Navigation links for desktop */}
          <div className="hidden md:flex">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/student" 
                className={`text-white hover:text-black px-3 py-2 text-sm font-medium 
                  ${pathname === "/student" ? "border-b border-white" : ""}`}
              >
               <div className="flex items-center space-x-2">
                  <span className="h-6 w-6"><HomeIcon/></span>
                  <span>{ translate("Home") }</span>
               </div>
              </Link>
              <Link
                href="/student/topics"
                className={`text-white hover:text-black px-3 py-2 text-sm font-medium 
                  ${pathname === "/student/topics" ? "border-b border-white" : ""}`}
              >
                <div className="flex items-center space-x-2">
                  <span className="h-6 w-6"><AcademicCapIcon/></span>
                  <span>{ translate("Themes") }</span>
                </div>
              </Link>
              <Link
                href="/student/favorite-topics"
                className={`text-white hover:text-black px-3 py-2 text-sm font-medium 
                  ${pathname === "/student/favorite-topics" ? "border-b border-white" : ""}`}
              >
                <div className="flex items-center space-x-2">
                  <span className="h-6 w-6"><HeartIcon/></span>
                  <span>{ translate("Favorites") }</span>
                </div>
              </Link>
              <Link
                href="/student/my-requests"
                className={`text-white hover:text-black px-3 py-2 text-sm font-medium 
                  ${pathname === "/student/my-requests" ? "border-b border-white" : ""}`}
              >
                <div className="flex items-center space-x-2">
                  <span className="h-6 w-6"><NewspaperIcon/></span>
                  <span>{ translate("My Requests") }</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Dropdown menu for "Profile" + Language Selector */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex">
              <button
                onClick={() => handleLanguageChange("ro")}
                className={`px-1 rounded-tl rounded-bl text-sm font-medium ${
                  language === "ro" ? "bg-gray-300 text-black" : "bg-blue-500 text-white"
                }`}
              >
                RO
              </button>
              <button
                onClick={() => handleLanguageChange("en")}
                className={`px-1 rounded-tr rounded-br text-sm font-medium ${
                  language === "en" ? "bg-gray-300 text-black" : "bg-blue-500 text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-white px-3 py-2 text-sm font-medium focus:outline-none"
              >
                <div className="flex items-center space-x-2 hover:text-black">
                  <span className="h-6 w-6">
                    <UserIcon />
                  </span>
                  <span>{translate("Account")}</span>
                  <span className="h-4 w-4">
                    <ChevronDownIcon />
                  </span>
                </div>
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 top-12 w-48 bg-white border rounded-md shadow-lg"
                  style={{ zIndex: 50 }}
                >
                  <Link
                    href="/profile"
                    className={`block w-full text-left px-4 py-2 text-gray-600 hover:text-black 
                      ${pathname === "/profile" ? "border-b border-black" : ""}`}
                  >
                    {translate("Profile")}
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:text-black"
                  >
                    {translate("Logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/student"
              className={`text-white block px-3 py-2 text-base font-medium 
                ${pathname === "/student" ? "border-b border-white" : ""}`}
            >
              <div className="flex items-center space-x-2">
                <span className="h-6 w-6"><HomeIcon/></span>
                <span>{ translate("Home") }</span>
              </div>
            </Link>
            <Link
              href="/student/topics"
              className={`text-white block px-3 py-2 text-base font-medium 
                ${pathname === "/student/topics" ? "border-b border-white" : ""}`}
            >
              <div className="flex items-center space-x-2">
                <span className="h-6 w-6"><AcademicCapIcon/></span>
                <span>{ translate("Themes") }</span>
              </div>
            </Link>
            <Link
              href="/student/favorite-topics"
              className={`text-white block px-3 py-2 text-base font-medium 
                ${pathname === "/student/favorite-topics" ? "border-b border-white" : ""}`}
            >
              <div className="flex items-center space-x-2">
                <span className="h-6 w-6"><HeartIcon/></span>
                <span>{ translate("Favorites") }</span>
              </div>
            </Link>
            <Link
              href="/student/my-requests"
              className={`text-white block px-3 py-2 text-base font-medium 
                ${pathname === "/student/my-requests" ? "border-b border-white" : ""}`}
            >
              <div className="flex items-center space-x-2">
                <span className="h-6 w-6"><NewspaperIcon/></span>
                <span>{ translate("My Requests") }</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
