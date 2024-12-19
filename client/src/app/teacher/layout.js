"use client"; // Este necesar pentru utilizarea `localStorage` și `useEffect`

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function TeacherLayout({ children }) {
  const router = useRouter();
  console.log("Middleware TeacherLayout");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    // Verifică dacă token-ul lipsește sau este invalid
    if (!accessToken) {
      router.push("/auth/login"); // Redirecționează la pagina de login
    } else {
      try {
        // Decodează și verifică token-ul, dacă este necesar
        const decoded = jwtDecode(accessToken);
        if (decoded.role !== "teacher") {
          router.push("/auth/login"); // Redirecționează dacă rolul nu este teacher
        }
      } catch (error) {
        console.error("Invalid token:", error);
        router.push("/auth/login");
      }
    }
  }, [router]);

  return (
    <div>
      {/* Layout global va rămâne, iar acest layout adaugă un wrapper specific pentru teacher */}
      <div className="teacher-container">{children}</div>
    </div>
  );
}
