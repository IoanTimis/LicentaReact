import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Middleware pentru protejarea rutelor
export const withUser = (next) => {
  return async (request) => {
    const pathname = request.nextUrl.pathname;

    // Rutele care necesită autentificare
    const protectedRoutes = ["/admin", "/teacher", "/student"];
    const isProtectedRoute = protectedRoutes.some((path) =>
      pathname.startsWith(path)
    );

    if (!isProtectedRoute) {
      // Continuă cu ruta originală
      return next(request);
    }

    // Extrage Access Token-ul din header sau cookie
    const accessToken = request.headers.get("Authorization")?.split("Bearer ")[1]

    if (accessToken) {
      try {
        // Verifică Access Token-ul
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        // Verifică rolul utilizatorului
        const role = decoded.role;
        if (role === "admin" && !pathname.startsWith("/admin")) {
          const url = new URL(`/admin`, request.url);
          return NextResponse.redirect(url);
        }
        if (role === "teacher" && !pathname.startsWith("/teacher")) {
          const url = new URL(`/teacher`, request.url);
          return NextResponse.redirect(url);
        }
        if (role === "student" && !pathname.startsWith("/student")) {
          const url = new URL(`/student`, request.url);
          return NextResponse.redirect(url);
        }

        // Continuă cu ruta originală
        return next(request);
      } catch (err) {
        console.error("Access Token invalid sau expirat:", err);
      }
    }

  

    // Dacă nu există Refresh Token sau reîmprospătarea a eșuat, redirecționează la login
    const url = new URL(`/auth/login`, request.url);
    return NextResponse.redirect(url);
  };
};
