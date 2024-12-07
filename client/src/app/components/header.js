"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import useSession from "../../hooks/useSession";
import logout from "../../utils/logout";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const { loggedInUser, isLoading, setLoggedInUser } = useSession();

  if (isLoading) {
    return null; // Afișează nimic până când starea este încărcată
  }

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setLoggedInUser(null); // Resetează starea utilizatorului conectat
      router.push("/auth/login"); // Redirecționează către pagina de login
    }
  };

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo-ul */}
        <Link href="/" className="text-xl font-bold text-white">
          Navbar
        </Link>

        {/* Butonul de meniu pentru mobil */}
        <button
          className="block lg:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Link-uri */}
        <div
          className={`lg:flex flex-col lg:flex-row lg:items-center lg:space-x-6 ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          {/* Dropdown pentru cont */}
          <div className="relative">
            <button
              className="flex items-center py-2 px-4 text-white hover:bg-blue-700 rounded lg:mt-0"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              Cont
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <ul
              className={`absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg ${
                menuOpen ? "block" : "hidden"
              }`}
            >
              {loggedInUser ? (
                <li>
                  <button
                    onClick={handleLogout} // Apelează funcția de logout
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                  >
                    Deconectare
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/auth/login"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Loghează-te
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register/teacher"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Înregistrează-te ca profesor
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register/student"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Înregistrează-te ca student
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
