"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./layout.css";
import { usePathname } from "next/navigation";


export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(null);
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  // UseEffect to update the state after component is mounted
  useEffect(() => {
    setIsCollapsed(false); // Set your initial state here
    setWidth(window.innerWidth);
    // console.log(window.innerWidth);
  }, []);

  //LOGIN PAGE NOT ACCESSED ITS ADMINLAYOUT STRUCTURE
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login"; // Detect login page

  if (isLoginPage) {
    return <>{children}</>; // ✅ No layout for login page
  }
  //END

  if (isCollapsed == null) return null;

  return (
    <>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <div
          className={`flex-1 transition-all duration-300 ${
            isCollapsed ? "lg:ml-0" : "lg:ml-64"
          }`}
        >
          {/* Header */}
          <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

          {/* Main Content */}
          <main className="p-3 sm:px-6 sm:py-2 bg-dashGray min-h-screen  w-full font-RedditSans">
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
