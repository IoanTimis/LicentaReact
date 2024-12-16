import {
    NextFetchEvent,
    NextRequest,
    NextResponse
  } from "next/server";
  
  function getSearchParam(param, url) {
    return url.searchParams.get(param);
  }
  
  export const withUser = (next) => {
    return async(request, _next) => {
      const pathname = request.nextUrl.pathname;
  
      if (["/admin", "/teacher", "/student"]?.some((path) => pathname.startsWith(path))) {
        const session = request.cookies.get("session");
        if (!session) {
          console.log("Nu există sesiunea");
          const url = new URL(`/auth/login`, request.url);
          return NextResponse.redirect(url);
        } else {
            const session = JSON.parse(sessionCookie.value); // Parsează cookie-ul
            const role = session?.role; // Extrage rolul utilizatorului
            console.log("Rolul utilizatorului este:", role);

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
        }
      }
      return next(request, _next);
    };
  };