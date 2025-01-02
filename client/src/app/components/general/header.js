'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HomeIcon, InformationCircleIcon, PhoneIcon, IdentificationIcon } from '@heroicons/react/24/solid';
import { useLanguage } from "@/context/Languagecontext";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, translate } = useLanguage();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
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
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
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
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>

            {/* Logo for desktop */}
            <div className="hidden md:flex flex-shrink-0">
              <Link href="/" className="text-white text-xl font-bold">
                <img src="/logo.png" alt="Logo" className="h-10" />
              </Link>
            </div>
          </div>

          {/* Navigation links for desktop */}
          <div className="hidden md:flex">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <span className="h-6 w-6"><HomeIcon /></span>
                  <span>{translate("Home")}</span>
                </div>
              </Link>
              <Link href="/about" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <span className="h-6 w-6"><InformationCircleIcon /></span>
                  <span>{translate("About Us")}</span>
                </div>
              </Link>
              <Link href="/contact" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <span className="h-6 w-6"><PhoneIcon /></span>
                  <span>{translate("Contact Us")}</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Login Link + Language Selector */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-navbar-gradient text-gray-300 border border-gray-700 rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ro">RO</option>
              <option value="en">EN</option>
            </select>

            {/* Login Link */}
            <Link href="/auth/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              <div className="flex items-center space-x-2 hover:bg-gray-700">
                <span className="h-6 w-6"><IdentificationIcon /></span>
                <span>{translate("Login")}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <div className="flex items-center space-x-2">
                <span className="h-6 w-6"><HomeIcon /></span>
                <span>{translate("Home")}</span>
              </div>
            </Link>
            <Link href="/about" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <div className="flex items-center space-x-2">
                <span className="h-6 w-6"><InformationCircleIcon /></span>
                <span>{translate("About Us")}</span>
              </div>
            </Link>
            <Link href="/contact" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <div className="flex items-center space-x-2">
                <span className="h-6 w-6"><PhoneIcon /></span>
                <span>{translate("Contact Us")}</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
