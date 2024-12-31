'use client';

import React from "react";
import { Provider } from "react-redux";
import Navbar from "./components/general/header";
import StudentNavBar from "./components/student/header";
import TeacherNavBar from "./components/teacher/header";
import Footer from "./components/general/footer";
import store from "@/store/page";
import { usePathname } from "next/navigation";

export default function AppProvider({ children }) {
  const pathname = usePathname();

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
      {getNavbar()} {/* Afișăm navbar-ul corespunzător */}
      <main className="flex-grow bg-gray-500">
        <div className="lg:mx-24 xl:mx-32 2xl:mx-64">
          {children}
        </div>
      </main>
      <Footer />
    </Provider>
  );
}
