import useAppContext from "@/context/AppContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { HiMenuAlt2 } from "react-icons/hi";

const Header = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();

  //PICKED A NAME FROM THE PATH
  const parts = pathname.split("/");
  const Result = parts[parts.length - 1];

  const { logout, loggedIn, currentUser } = useAppContext();

  const displayLoginOptions = () => {
    if (loggedIn) {
      return (
        <div className="overflow-hidden transition-all duration-300">
          <div className="flex flex-col gap-5  sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
            <div className="hs-dropdown relative inline-flex">
              <button
                id="hs-dropdown-custom-trigger"
                type="button"
                className="hs-dropdown-toggle py-1 ps-1 pe-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Dropdown"
              >
                <img
                  className="w-10 h-10 rounded-full"
                  src={
                    `${process.env.NEXT_PUBLIC_API_URL}` + currentUser.userImage
                  }
                  alt={currentUser.userName}
                />
                <span className="text-gray-600 font-medium truncate max-w-[7.5rem]">
                  {currentUser.userName}
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
              </button>

              <div
                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="hs-dropdown-custom-trigger"
              >
                <div className="p-1 space-y-0.5">
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    href="#"
                  >
                    {currentUser.userEmail}
                  </a>

                  <button
                    onClick={logout}
                    className="flex items-center gap-x-3.5 py-2 px-3 w-100 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    href="#"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <Link         
          href="/admin/login"
         className="py-2 px-6 text-md font-medium text-white bg-emerald-500 rounded shadow-md hover:bg-emerald-600 focus:outline-none focus:bg-emerald-600"
        >
          Login
        </Link>
      );
    }
  };

  return (
    <header className="relative flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-2 font-RedditSans  border-b border-gray-200">
      <nav className=" w-full mx-auto px-4 flex items-center  justify-between">
        <div className="flex items-center justify-between capitalize">
          <Link
            className="flex-none text-xl font-semibold focus:outline-none focus:opacity-80"
            href={pathname}
            aria-label="Brand"
          >
            <span className="inline-flex items-center gap-x-2 text-xl text-emerald-500 font-bold">
              <button
                className=" hidden sm:block  p-2 text-emerald-500 bg-dashGray rounded-full shadow "
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label="Toggle Sidebar"
              >
                <HiMenuAlt2
                  className={` transform transition-transform ${
                    isCollapsed ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                type="button"
                className="block sm:hidden p-2  justify-center items-center  text-start bg-quaternary text-white text-sm font-medium rounded-full shadow  hover:bg-gray-950 focus:outline-none focus:bg-gray-900"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls="hs-sidebar-footer"
                aria-label="Toggle navigation"
                data-hs-overlay="#hs-sidebar-footer"
              >
                <HiMenuAlt2 />
              </button>
              {Result}
            </span>
          </Link>
        </div>
        {displayLoginOptions()}
      </nav>
    </header>
  );
};

export default Header;
