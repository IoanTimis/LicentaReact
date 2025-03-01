"use client";

import FixedSidebar from "@/app/components/admin/fixed-side-bar";
import { useLayoutEffect } from "react";
import { useRouter, usePathname} from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Provider } from "react-redux";
import store from "@/store/page";
import { ErrorProvider } from "@/context/errorContext";
import ErrorDiv from "@/app/components/general/error-div";

export default function AdminLayout({ children }) {
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

      if (decoded.role !== "admin") {
        console.log("Nu ai acces la această pagină, rolul tău este: ", decoded.role);
        alert("Acces interzis");
        router.push(`/${decoded.role}`);
      }

    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <Provider store={store}>
      <ErrorProvider>
        <div className="flex">
          <FixedSidebar />
          <main className="w-full min-h-screen p-6 bg-gray-100 lg:ml-64 transition-all">
            <ErrorDiv />
            {children}
          </main>
        </div>
      </ErrorProvider>
    </Provider>
  );
}
