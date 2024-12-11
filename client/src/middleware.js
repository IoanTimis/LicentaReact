import { NextResponse } from 'next/server'
console.log("A fost apelat middleware.js");
 
export function middleware(request) {
  console.log("A fost apelat fucntia middleware");
  const { pathname } = request.nextUrl; // Obține URL-ul curent
  console.log("Middleware apelat pentru ruta:", pathname);

  const session = request.cookies.get("session"); // Obține cookie-ul `session`
  console.log("Cookie session:", session);

  if (!session) {
    console.log("Utilizator nelogat - redirecționare la /auth/login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  } else {
    const { role } = JSON.parse(session.value);
    console.log("Utilizator logat cu rolul:", role);

    if (pathname.startsWith("/admin") && role !== "admin") {
      console.log("Redirecționare: Utilizatorul nu are rol admin");
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/teacher") && role !== "teacher") {
      console.log("Redirecționare: Utilizatorul nu are rol teacher");
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/student") && role !== "student") {
      console.log("Redirecționare: Utilizatorul nu are rol student");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  console.log("Acces permis");
  return NextResponse.next(); // Permite accesul
}
 
export const config = {
  matcher: '/teacher/:path*',
}