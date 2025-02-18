import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req) {
  const url = req.nextUrl;
  const cookieStore = await cookies();
  const token = cookieStore.get("token") || "";
  const consumer_token = cookieStore.get("CToken") || "";
  
  // Check if the route is for admin
  if (url.pathname.startsWith("/admin")) {
    // Redirect logged-in users away from login/registration
    if (token?.value && (url.pathname === "/admin/login" || url.pathname === "/admin/registration")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    try {
      if (url.pathname.startsWith("/admin/login") || url.pathname.startsWith("/admin/registration")) {
        return NextResponse.next();
      }

      // Check admin authorization
      const ApiResponse = await fetch("http://localhost:8001/users/authorise", {
        headers: { "x-auth-token": token.value || "" },
      });

      if (ApiResponse.status !== 200) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Error during authorization:", error);
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Restrict access to /blog pages for consumers
  if (url.pathname.startsWith("/blog")) {
    // if (!consumer_token?.value) {
    //   return NextResponse.redirect(new URL("/login", req.url));
    // }

    if (consumer_token?.value && (url.pathname === "/login" || url.pathname === "/registration")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      const ApiResponse = await fetch("http://localhost:8001/web/authorise", {
        headers: { "x-auth-token": consumer_token.value || "" },
      });

      const { role } = await ApiResponse.json();
      
      // Restrict consumers from accessing /blog pages
      if (role === "consumer") {
        return NextResponse.redirect(new URL("/403", req.url)); // Forbidden page
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Error fetching user role:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/blog/:path*"],
};
