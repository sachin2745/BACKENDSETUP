"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import useConsumerContext from "@/context/ConsumerContext";
import useProductContext from "@/context/ProductContext";

const Header = () => {
  const { getCartItemsCount } = useProductContext();
  const pathname = usePathname();
  const { consumerLogout, consumerLoggedIn, currentConsumer } =
    useConsumerContext();
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/web/header-data`
        );

        if (response.status === 200) {
          setHeaderData(response.data.headerData);
          // console.log("Header data:", response.data.headerData);
        } else {
          console.error(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching header data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white shadow-md text-sm py-1 font-RedditSans">
        <nav className="max-w-[90rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between">
          {/* Logo and Mobile Toggle Skeleton */}
          <div className="flex items-center">
            <button
              type="button"
              className="sm:hidden size-7 flex justify-center items-center rounded-lg border bg-gray-200 text-gray-800 shadow-sm"
              aria-expanded="false"
              disabled
            >
              <span className="sr-only">Toggle</span>
            </button>
            <div className="h-12 w-12 md:h-14 md:w-14 md:mr-3 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Navigation Links Skeleton */}
          <div className="hidden sm:flex items-center gap-10 text-[16px]">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-6 w-20 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>

          {/* Login Button Skeleton */}
          <div className="flex items-center gap-x-2">
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </nav>

        {/* Mobile Menu Skeleton */}
        <div
          id="hs-offcanvas-body-scrolling-with-backdrop"
          className="hs-overlay hidden fixed top-0 start-0 h-full max-w-xs w-full bg-white border-e"
        >
          <div className="flex justify-between items-center py-3 px-4 border-b">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            <button
              type="button"
              className="size-8 bg-gray-100 text-gray-800 hover:bg-gray-200"
              disabled
            >
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="text-md font-medium">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-12 bg-gray-200 border-b-2 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </header>
    );
  }

  const displayLoginOptions = () => {
    if (consumerLoggedIn) {
      return (
        <div className="dropdown dropdown-hover relative">
          <div
            tabIndex={0}
            role="button"
            className="btn m-1 bg-white border-2 px-1 rounded-full hover:bg-dashGray inline-flex items-center gap-x-2"
          >
            {currentConsumer?.consumerImage ? (
              <img
                className="w-10 h-10 rounded-full"
                src={`${process.env.NEXT_PUBLIC_API_URL}${currentConsumer.consumerImage}`}
                alt={currentConsumer.consumerName}
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-full bgEmerald text-white text-md font-semibold">
                {`${currentConsumer?.consumerName?.split(" ")[0][0] || ""}${
                  currentConsumer?.consumerName?.split(" ")[1]?.[0] || ""
                }`.toUpperCase()}
              </div>
            )}

            <span className="hidden sm:block text-quaternary font-semibold truncate max-w-[7.5rem]">
              {currentConsumer.consumerName}
            </span>
            <span className="block sm:hidden text-quaternary font-semibold truncate max-w-[7.5rem]">
              {currentConsumer.consumerName.split(" ")[0]}
            </span>
            <svg
              className="hs-dropdown-open:rotate-180 size-4"
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-md z-50 w-60 sm:w-60 p-1 shadow-lg text-wrap absolute right-0 mt-1"
          >
            <li className="text-sm">
              <button
                className="btn  btn-sm flex justify-start rounded-md text-red-500 bg-white border-none shadow-none hover:bg-red-100 font-medium"
                onClick={consumerLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <Link
          href="/login"
          className="py-2 px-6 inline-flex items-center gap-x-2 text-[16px] font-bold rounded  bg-black text-white shadow-sm hover:bg-gray-800 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
        >
          Login/Register
        </Link>
      );
    }
  };

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white shadow-md text-sm py-3 font-RedditSans">
      <nav className="max-w-[90rem] w-full mx-auto px-4 flex flex-nowwrap basis-full items-center justify-between">
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
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${headerData?.companyLogo}`}
              width={56}
              height={56}
              className="h-12 w-12 md:h-14 md:w-14 md:mr-3 "
              alt="Company Logo"
            />
          </Link>
        </div>

        <div className="sm:order-3 flex items-center gap-x-2">
          <a
            href="/mybag/order-history"
            className="bg-white  py-1 sm:px-4 rounded-full flex items-center gap-3 group"
          >
            <div className="relative scale-110 hidden sm:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="m-auto"
              >
                <g
                  id="Group_35298"
                  data-name="Group 35298"
                  transform="translate(-317 -21)"
                >
                  <rect
                    id="Rectangle_8867"
                    data-name="Rectangle 8867"
                    width="24"
                    height="24"
                    transform="translate(317 21)"
                    fill="none"
                  ></rect>
                  <g
                    id="box_1_"
                    data-name="box (1)"
                    transform="translate(309.878 23.735)"
                  >
                    <g
                      id="Group_35301"
                      data-name="Group 35301"
                      transform="translate(10.25)"
                    >
                      <path
                        id="Path_77527"
                        data-name="Path 77527"
                        d="M27.975,4.583V4.544c-.02-.039-.02-.078-.039-.118v-.02a.427.427,0,0,0-.078-.1l-.02-.02c-.02-.02-.059-.039-.078-.059l-.02-.02h-.02l-.02-.02L19.377.059a.624.624,0,0,0-.529,0l-2.8,1.391,8.363,4.289.02.02c.02,0,.02.02.039.02.02.02.02.039.039.059v4.6a.206.206,0,0,1-.1.176l-1.684.881a.2.2,0,0,1-.274-.078.147.147,0,0,1-.02-.1V6.875L13.971,2.507l-.02-.02L10.563,4.172l-.02.02h-.02l-.02.02c-.02.02-.059.039-.078.059l-.02.02c-.039.039-.059.078-.1.118v.02a.278.278,0,0,0-.039.118v.039c0,.039-.02.059-.02.1v9.147a.577.577,0,0,0,.333.529l8.246,4.113a.538.538,0,0,0,.392.039l.039-.02c.039,0,.059-.02.1-.039l8.3-4.113A.59.59,0,0,0,28,13.808V4.681A.177.177,0,0,1,27.975,4.583Z"
                        transform="translate(-10.25)"
                        fill="currentColor"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>

              <span className="text-[11px] sm:text-xs font-bold">My Orders</span>
            </div>
          </a>
          <a
            href="/mybag"
            className="bg-white py-1 px-1 sm:px-4 rounded-full flex items-center gap-3 group"
          >
            <div className="relative scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                className="m-auto text-black"
              >
                <path
                  data-name="Rectangle 159"
                  fill="none"
                  d="M0 0h24v24H0z"
                ></path>
                <path
                  data-name="Path 77525"
                  d="M7.611 7.248a3.169 3.169 0 0 0-3.137 3.617l.809 5.657a3.961 3.961 0 0 0 3.921 3.4h5.594a3.961 3.961 0 0 0 3.921-3.4l.808-5.657a3.169 3.169 0 0 0-3.138-3.617Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                ></path>
                <path
                  data-name="Path 77526"
                  d="M8.039 4.684a3.96 3.96 0 0 1 3.543-2.189h.836a3.961 3.961 0 0 1 3.542 2.189l.708 1.417a.794.794 0 1 1-1.421.709l-.7-1.415a2.376 2.376 0 0 0-2.126-1.314h-.836a2.376 2.376 0 0 0-2.129 1.314L8.747 6.81a.792.792 0 1 1-1.417-.708Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 left-6 bg-emerald-500 rounded-full p-0.5 px-2 text-sm text-white font-bold">
                  {getCartItemsCount()}
                </span>
              )}
              <span className="text-[11px] sm:text-xs font-bold">My Bag</span>
            </div>
          </a>

          {displayLoginOptions()}
        </div>

        <div className=" ml-56 hidden overflow-hidden transition-all duration-300 basis-full grow sm:grow-0 sm:basis-auto sm:block sm:order-2">
          <div className="flex flex-col gap-10 text-[16px] mt-5 sm:flex-row sm:items-center sm:mt-0 sm:ps-5">
            <Link
              className={`font-semibold  hover:text-emerald-500  focus:outline-none focus:textEmerald ${
                pathname === "/" ? "textEmerald" : "text-spaceblack"
              }`}
              href="/"
              aria-current="page"
            >
              Home
            </Link>
            <Link
              className={`font-semibold  hover:text-emerald-500  focus:outline-none focus:textEmerald ${
                pathname === "/about-us" ? "textEmerald" : "text-spaceblack"
              }`}
              href="/about-us"
            >
              About
            </Link>
            <Link
              className={`font-semibold  hover:text-emerald-500  focus:outline-none focus:textEmerald ${
                pathname === "/blog" ? "textEmerald" : "text-spaceblack"
              }`}
              href="/blog"
            >
              Blog
            </Link>
            <Link
              className={`font-semibold  hover:text-emerald-500  focus:outline-none focus:textEmerald ${
                pathname === "/contact-us" ? "textEmerald" : "text-spaceblack"
              }`}
              href="/contact-us"
            >
              Contact Us
            </Link>
            <Link
              className={`font-semibold  hover:text-emerald-500  focus:outline-none focus:textEmerald ${
                pathname === "/store" ? "textEmerald" : "text-spaceblack"
              }`}
              href="/store"
            >
              Store
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
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${headerData?.companyLogo}`}
              width={56}
              height={56}
              className="h-10 w-10  md:h-14  md:mr-3 rounded-full shadow-md"
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
          <a
            href="/store"
            className="block border-b-2 border-gray-200 p-4 hover:bg-emerald-100 transition ease-in-out delay-150"
          >
            Store
          </a>
          <a
            href="/mybag/order-history"
            className="block border-b-2 border-gray-200 p-4 hover:bg-emerald-100 transition ease-in-out delay-150"
          >
            My Orders
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
