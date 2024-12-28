"use client";

import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
console.log("middleware student layout.js");

export default function StudentLayout({ children }) {
  const router = useRouter();

  useLayoutEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/auth/login"); 
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);
      console.log("decoded", decoded);
      if (decoded.role !== "student") { //Solutie temporara
        console.log("Nu ai acces la aceasta pagina, rolul tau este: ", decoded.role);
        router.push(`/${decoded.role}`); 
      }
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/auth/login"); 
    }
  }, [router]);

  return (
    <div>
      <div className="student-container">{children}</div>
    </div>
  );
}
