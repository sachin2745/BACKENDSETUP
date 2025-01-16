"use client";
import Link from 'next/link';
import React, { useEffect } from 'react';

const HomePage = () => {
 

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="mx-auto p-24 text-center border-2 border-sky-500 bg-sky-500 text-white rounded-lg">
        <h1 className="text-3xl font-bold">Welcome to TailAdmin Dashboard</h1>
        <p className="mt-2 text-white">
          Want to see click below on this <br />
          <Link href="http://localhost:3000/admin/dashboard" className="text-white font-bold">
            Link
          </Link>
        </p>
        
      </div>
    </div>
  );
};

export default HomePage;
