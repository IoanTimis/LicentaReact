"use client";

import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Fără "{" deoarece e un export default
console.log("middleware teacher layout.js");

export default function TeacherLayout({ children }) {
  const router = useRouter();

  useLayoutEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken", accessToken);

    // Verifică dacă token-ul lipsește sau este invalid
    if (!accessToken) {
      router.push("/auth/login"); // Redirecționează la pagina de login
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);
      if (decoded.role !== "teacher") {
        localStorage.removeItem("accessToken");
        router.push("/auth/login"); // Redirecționează dacă rolul nu este "teacher"
      }
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/auth/login"); // Redirecționează în caz de eroare la token
    }
  }, [router]);

  return (
    <div>
      <div className="teacher-container">{children}</div>
    </div>
  );
}
