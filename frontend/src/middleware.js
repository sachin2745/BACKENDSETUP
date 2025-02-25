import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req) {
  const url = req.nextUrl;
  const cookieStore = await cookies();
  const token = cookieStore.get("token") || ""; // Admin token
  const consumer_token = cookieStore.get("CToken") || ""; // Consumer token

  // Check if the user is logged in
  const isAdminLoggedIn = token?.value;
  const isConsumerLoggedIn = consumer_token?.value;

  // Redirect logged-in consumers away from login, signup, and reset password pages
  if (isConsumerLoggedIn && (url.pathname === "/login" || url.pathname === "/signup" || url.pathname === "/reset-password")) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect to consumer dashboard or home page
  }

  // Redirect logged-in admins away from admin login and registration pages
  if (isAdminLoggedIn && (url.pathname === "/admin/login" || url.pathname === "/admin/registration")) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url)); // Redirect to admin dashboard
  }

  // Admin authorization logic
  if (url.pathname.startsWith("/admin")) {
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
      console.error("Error during admin authorization:", error);
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Consumer authorization logic for /mybag pages
  if (url.pathname.startsWith("/mybag")) {
    try {
      const ApiResponse = await fetch("http://localhost:8001/web/authorise", {
        headers: { "x-auth-token": consumer_token.value || "" },
      });

      if (ApiResponse.status === 200) {
        const { role } = await ApiResponse.json();
        if (role === "consumer") {
          return NextResponse.next(); // Allow access to mybag pages for consumers
        }
      } else {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Error fetching consumer role:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mybag/:path*", "/login", "/signup", "/reset-password"],
};