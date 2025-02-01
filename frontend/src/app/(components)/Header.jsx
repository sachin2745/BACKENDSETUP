"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <>
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white shadow-md text-sm py-1 font-RedditSans">
        <nav className="max-w-[90rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between">
          <div className="flex flex-wrap items-center">
            <button
              type="button"
              className="sm:hidden hs-collapse-toggle relative size-7 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="hs-offcanvas-body-scrolling-with-backdrop"
              data-hs-overlay="#hs-offcanvas-body-scrolling-with-backdrop"
            >
              <svg
                className="hs-collapse-open:hidden shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <svg
                className="hs-collapse-open:block hidden shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Toggle</span>
            </button>
            <Link
              className="sm:order-1 flex text-xl font-semibold focus:outline-none focus:opacity-80"
              href="/"
            >
              <Image
                src="/logo.png"
                width={56}
                height={56}
                className="h-14  md:h-14  md:mr-3 rounded-full shadow-md"
                alt="Logo"
              />
            </Link>
          </div>
          <div className="sm:order-3 flex items-center gap-x-2">
            <Link
              href="/login"
              className="py-2 px-5 inline-flex items-center gap-x-2 text-[16px] font-medium rounded  bg-black text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
            >
              Login
            </Link>
          </div>

          <div className=" hidden overflow-hidden transition-all duration-300 basis-full grow sm:grow-0 sm:basis-auto sm:block sm:order-2">
            <div className="flex flex-col gap-10 text-[16px] mt-5 sm:flex-row sm:items-center sm:mt-0 sm:ps-5">
              <Link
                className={`font-semibold  hover:text-primary focus:outline-none focus:text-primary ${
                  pathname === "/" ? "text-primary" : "text-spaceblack"
                }`}
                href="/"
                aria-current="page"
              >
                Home
              </Link>
              <Link
                className={`font-semibold  hover:text-primary focus:outline-none focus:text-primary ${
                  pathname === "/about" ? "text-primary" : "text-spaceblack"
                }`}
                href="/about"
              >
                About
              </Link>
              <Link
                className={`font-semibold  hover:text-primary focus:outline-none focus:text-primary ${
                  pathname === "/blog" ? "text-primary" : "text-spaceblack"
                }`}
                href="/blog"
              >
                Blog
              </Link>
              <Link
                className={`font-semibold  hover:text-primary focus:outline-none focus:text-primary ${
                  pathname === "/contact-us" ? "text-primary" : "text-spaceblack"
                }`}
                href="/contact-us"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </nav>

        <div
          id="hs-offcanvas-body-scrolling-with-backdrop"
          className="hs-overlay [--body-scroll:true] hs-overlay-open:translate-x-0 hidden -translate-x-full fixed top-0 start-0 transition-all duration-300 transform h-full max-w-xs w-full z-[80] bg-white border-e "
          role="dialog"
          tabIndex={-1}
          aria-labelledby="hs-offcanvas-body-scrolling-with-backdrop-label"
        >
          <div className="flex justify-between items-center py-3 px-4 border-b ">
            <a
              id="hs-offcanvas-body-scrolling-with-backdrop-label"
              className="sm:order-1 flex text-xl font-semibold focus:outline-none focus:opacity-80"
              href="/"
            >
              <Image
                src="/logo.png"
                width={56}
                height={56}
                className="h-12  md:h-14  md:mr-3 rounded-full shadow-md"
                alt="Logo"
              />
            </a>
            <button
              type="button"
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
              aria-label="Close"
              data-hs-overlay="#hs-offcanvas-body-scrolling-with-backdrop"
            >
              <span className="sr-only">Close</span>
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          <div className="text-md font-medium">
            <a
              href="/"
              className="block border-b-2 border-gray-200 p-4 hover:bg-emerald-100 transition ease-in-out delay-150"
            >
              Home
            </a>
            <a
              href="/about"
              className="block border-b-2 border-gray-200 p-4 hover:bg-emerald-100 transition ease-in-out delay-150"
            >
              About Us
            </a>
            <a
              href="/blog"
              className="block border-b-2 border-gray-200 p-4 hover:bg-emerald-100 transition ease-in-out delay-150"
            >
              Blog
            </a>
            <a
              href="/contact-us"
              className="block border-b-2 border-gray-200 p-4 hover:bg-emerald-100 transition ease-in-out delay-150"
            >
              Contact Us
            </a>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
