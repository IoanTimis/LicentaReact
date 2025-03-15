"use client";

import { useLayoutEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { store } from "@/store/page";
import { clearUser } from "@/store/features/user/userSlice";

export default function StudentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/auth/login"); 
      localStorage.setItem("lastAttemptedPath", pathname);
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);

      console.log("Decoded token:", decoded);

      if (decoded.role !== "student") { 
        console.error("Invalid role:", decoded.role);
        alert("Acces interzis");
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
      <div className="student-container">{children}</div>
    </div>
  );
}
