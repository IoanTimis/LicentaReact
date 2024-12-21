'use client';

import React from "react";
import { Provider } from "react-redux";
import Navbar from "./components/general/header";
import StudentNavbar from "./components/student/header";
import TeacherNavbar from "./components/teacher/header";
import Footer from "./components/general/footer";
import store from "@/store/page";
import { usePathname } from "next/navigation";

export default function AppProvider({ children }) {
  const pathname = usePathname();

  const getNavbar = () => {
    if (pathname.startsWith("/admin")) {
      return null;
    } else if (pathname.startsWith("/teacher")) {
      return <TeacherNavbar />;
    } else if (pathname.startsWith("/student")) {
      return <StudentNavbar />;
    } else {
      return <Navbar />;
    }
  };

  return (
    <Provider store={store}>
      {getNavbar()} {/* Afișăm navbar-ul corespunzător */}
      <main className="flex-grow">{children}</main>
      <Footer />
    </Provider>
  );
}
