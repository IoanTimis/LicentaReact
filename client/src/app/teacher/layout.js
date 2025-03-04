"use client";

import { useLayoutEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { store } from "@/store/page";
import { clearUser } from "@/store/features/user/userSlice";

export default function TeacherLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      localStorage.setItem("lastAttemptedPath", pathname);
      router.push("/auth/login"); 
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);

      if (decoded.role !== "teacher") {
        alert("Acces interzis");
        console.log("Nu ai acces la aceasta pagina, rolul tau este: ", decoded.role);
        router.push(`/${decoded.role}`);
      }

    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("accessToken");
      store.dispatch(clearUser());
      router.push("/auth/login"); 
    }
  }, [router]);

  return (
    <div>
      <div className="teacher-container">{children}</div>
    </div>
  );
}
