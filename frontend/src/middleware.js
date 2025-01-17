import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req) {
  const url = req.nextUrl;
  const cookieStore = await cookies();
    const token = cookieStore.get("token") || "";

  // Handle logged-in users trying to access login/registration pages
  if (token?.value && (url.pathname === "/admin/login" || url.pathname === "/admin/registration")) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url)); // Redirect to admin dashboard
  }

  try {
    // Avoid redirect loop for login and registration routes
    if (url.pathname.startsWith("/admin/login") || url.pathname.startsWith("/admin/registration")) {
      return NextResponse.next();
    }

    // Check authorization for protected admin routes
    const ApiResponse = await fetch("http://localhost:8001/users/authorise", {
      headers: {
        "x-auth-token": token.value || "",
      },
    });

    // Redirect to login if not authorized
    if (ApiResponse.status !== 200) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Allow access if authorized
    return NextResponse.next();
  } catch (error) {
    console.error("Error during authorization:", error);
    // Redirect to login on API fetch failure
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
