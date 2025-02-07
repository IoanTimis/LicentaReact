'use client';

import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import Navbar from "./components/general/header";
import StudentNavBar from "./components/student/header";
import TeacherNavBar from "./components/teacher/header";
import Footer from "./components/general/footer";
import store from "@/store/page";
import { usePathname } from "next/navigation";

export default function AppProvider({ children }) {
  const pathname = usePathname();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setErrorMessage(null);
  }, [pathname]); // Se va executa de fiecare dată când se schimbă pagina

  const getNavbar = () => {
    if (pathname.startsWith("/admin")) {
      return null;
    } else if (pathname.startsWith("/teacher")) {
      return <TeacherNavBar />;
    } else if (pathname.startsWith("/student")) {
      return <StudentNavBar />;
    } else {
      return <Navbar />;
    }
  };

  return (
    <Provider store={store}>
      {getNavbar()} 

      {/* Afișează eroarea doar dacă există */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      <main className="flex-grow bg-gray-200">
        <div className="lg:mx-24 xl:mx-32 2xl:mx-64">
          {/* Pasăm funcția `setErrorMessage` ca prop către children */}
          {React.cloneElement(children, { setGlobalError: setErrorMessage })}
        </div>
      </main>

      <Footer />
    </Provider>
  );
}
