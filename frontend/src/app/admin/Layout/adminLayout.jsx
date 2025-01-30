"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './layout.css'



export default function AdminLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(null);

    // UseEffect to update the state after component is mounted
    useEffect(() => {
        setIsCollapsed(false); // Set your initial state here
    }, []);

    if (isCollapsed == null) return null;

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />


            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'sm:ml-0' : 'sm:ml-64' }`} >
                {/* Header */}
                <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

                {/* Main Content */}
                <main className="p-3 sm:px-6 sm:py-2 bg-dashGray min-h-screen  w-full font-RedditSans">
                    {children}
                </main>
                
                <Footer />
            </div>
            
        </div>
    );
}
