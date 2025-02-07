import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiUsers } from "react-icons/fi";
import { MdOutlineSpeakerNotes } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { LiaArtstation } from "react-icons/lia";
import { FaAtlassian } from "react-icons/fa";

const Sidebar = ({ isCollapsed }) => {
  const pathname = usePathname();

  // console.log(pathname);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  // Sample data for demonstration
  const options = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Blog", path: "/admin/blog" },
    { name: "User", path: "/admin/user" },
    { name: "Blog Category", path: "/admin/blog-category" },
    { name: "Mission & Vision", path: "/admin/about/mission-vision" },
    { name: "Founder", path: "/admin/about/founder" },
    { name: "General Setting", path: "/admin/appearance/general" },
    { name: "Page Content", path: "/admin/appearance/page-content" },
    // Add more options as needed
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter options based on the input
    if (value) {
      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  const handleOptionClick = (path) => {
    router.push(path);
    setSearchTerm("");
    setFilteredOptions([]);
  };
  return (
    <>
      {/* Sidebar */}
      <div
        id="hs-sidebar-footer"
        className={`hs-overlay [--auto-close:lg] lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 
                    ${isCollapsed ? "w-0" : "w-64"}
                hs-overlay-open:translate-x-0
                -translate-x-full transition-all duration-300 transform
                h-full
                hidden
                fixed top-0 start-0 bottom-0 z-[60]
                bg-white border-e border-gray-200`}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full font-RedditSans">
          {/* Header */}
          <header className="p-4 flex justify-between items-center gap-x-2">
            <div className="flex items-center gap-1 font-bold text-xl text-quaternary ">
              {!isCollapsed && (
                <img
                  className="mx-auto h-10 w-auto rounded-full "
                  src="/logo.png"
                  alt="Blog Logo"
                />
              )}
              {!isCollapsed && <span>Blog Portal</span>}
            </div>
            <div className="lg:hidden -me-2">
              {/* Close Button */}
              <button
                type="button"
                className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-emerald-100  rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-emerald-100"
                data-hs-overlay="#hs-sidebar-footer"
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
              {/* End Close Button */}
            </div>
          </header>
          {/* End Header */}

          {/* Body */}
          <nav className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-emerald-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            {/* Search Bar */}
            <div className="relative p-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleInputChange}
                className="w-full p-2 capitalize text-sm border-2 border-gray-300 rounded"
              />
              {filteredOptions.length > 0 && (
                <ul className="absolute z-10  w-[87%] bg-white border border-gray-300 rounded mt-1">
                  {filteredOptions.map((option) => (
                    <li
                      key={option.path}
                      onClick={() => handleOptionClick(option.path)}
                      className="p-2 hover:bg-emerald-100 text-sm text-quaternary font-semibold cursor-pointer"
                    >
                      {option.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* End Search Bar */}
            <div
              className="hs-accordion-group pb-0 px-2  w-full flex flex-col flex-wrap"
              data-hs-accordion-always-open=""
            >
              <ul className="space-y-1">
                <li>
                  <Link
                    className={` ${
                      pathname === "/admin/dashboard" ? "bg-emerald-200 border-b-2 border-emerald-500" : ""
                    } flex items-center gap-x-3 py-2 px-2.5  text-sm text-quaternary rounded-lg hover:bg-emerald-100 hover:font-semibold`}
                    href="/admin/dashboard"
                  >
                    <LuLayoutDashboard className="size-4 text-bold" />
                    Dashboard
                  </Link>
                </li>

                <li
                  className={`${
                    pathname.startsWith("/admin/about/") ? "active" : ""
                  } hs-accordion`}
                  id="projects-accordion"
                >
                  <button
                    type="button"
                    className="hs-accordion-toggle w-full text-start flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                    aria-expanded={
                      pathname.startsWith("/admin/about/") ? "true" : "false"
                    }
                    aria-controls="projects-accordion-sub-1-collapse-1"
                  >
                    <FaAtlassian />
                    About
                    <svg
                      className={`hs-accordion-active:block ms-auto ${
                        pathname.startsWith("/admin/about/")
                          ? "block"
                          : "hidden"
                      } size-4 text-gray-600 group-hover:text-gray-500`}
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                    <svg
                      className={`hs-accordion-active:hidden ms-auto ${
                        pathname.startsWith("/admin/about/")
                          ? "hidden"
                          : "block"
                      } size-4 text-gray-600 group-hover:text-gray-500`}
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    id="projects-accordion-sub-1-collapse-1"
                    className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${
                      pathname.startsWith("/admin/about/") ? "block" : "hidden"
                    }`}
                    role="region"
                    aria-labelledby="projects-accordion"
                  >
                    <ul className="pt-1 ps-7 space-y-1">
                      <li>
                        <Link
                          className={` ${
                            pathname === "/admin/about/mission-vision"
                              ? "bg-emerald-200 border-b-2 border-emerald-500"
                              : ""
                          } flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100`}
                          href="/admin/about/mission-vision"
                        >
                          Mission & Vision
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={` ${
                            pathname === "/admin/about/founder"
                              ? "bg-emerald-200 border-b-2 border-emerald-500"
                              : ""
                          } flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100`}
                          href="/admin/about/founder"
                        >
                          Founder
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li
                  className={`${
                    pathname.startsWith("/admin/appearance/") ? "active" : ""
                  } hs-accordion`}
                  id="projects-accordion"
                >
                  <button
                    type="button"
                    className="hs-accordion-toggle w-full text-start flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                    aria-expanded={
                      pathname.startsWith("/admin/appearance/") ? "true" : "false"
                    }
                    aria-controls="projects-accordion-sub-1-collapse-1"
                  >                    
                    <LiaArtstation className="text-xl" />
                    Appearance
                    <svg
                      className={`hs-accordion-active:block ms-auto ${
                        pathname.startsWith("/admin/appearance/")
                          ? "block"
                          : "hidden"
                      } size-4 text-gray-600 group-hover:text-gray-500`}
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                    <svg
                      className={`hs-accordion-active:hidden ms-auto ${
                        pathname.startsWith("/admin/appearance/")
                          ? "hidden"
                          : "block"
                      } size-4 text-gray-600 group-hover:text-gray-500`}
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    id="projects-accordion-sub-1-collapse-1"
                    className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${
                      pathname.startsWith("/admin/appearance/") ? "block" : "hidden"
                    }`}
                    role="region"
                    aria-labelledby="projects-accordion"
                  >
                    <ul className="pt-1 ps-7 space-y-1">
                      <li>
                        <Link
                          className={` ${
                            pathname === "/admin/appearance/general"
                              ? "bg-emerald-200 border-b-2 border-emerald-500"
                              : ""
                          } flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100`}
                          href="/admin/appearance/general"
                        >
                          General Setting
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={` ${
                            pathname === "/admin/appearance/page-content"
                              ? "bg-emerald-200 border-b-2 border-emerald-500"
                              : ""
                          } flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100`}
                          href="/admin/appearance/page-content"
                        >
                          Page Content
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li>
                  <Link
                    className={` ${
                      pathname === "/admin/blog" ? "bg-emerald-200 border-b-2 border-emerald-500" : ""
                    } flex items-center gap-x-3 py-2 px-2.5 text-sm text-quaternary rounded-lg hover:bg-emerald-100 hover:font-semibold`}
                    href="/admin/blog"
                  >
                    <svg
                      className="size-4 text-bold"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      height={25}
                      width={25}
                      strokeWidth={2}
                    >
                      <path
                        style={{
                          textIndent: "0",
                          textAlign: "start",
                          lineHeight: "normal",
                          textTransform: "none",
                          blockProgression: "tb",
                          marker: "none",
                          InkscapeFontSpecification: "Sans",
                        }}
                        d="M12.5 0C5.602 0 0 5.602 0 12.5S5.602 25 12.5 25 25 19.398 25 12.5 19.398 0 12.5 0zm0 .969A11.519 11.519 0 0124.031 12.5c0 6.378-5.153 11.563-11.531 11.563C6.122 24.063.969 18.878.969 12.5A11.519 11.519 0 0112.5.969zm3.688 4.656a.5.5 0 00-.282.281L14.97 7.75 7 12.063V19h.5l6.469.031 4.219-7.843a.5.5 0 00.156-.063l1.812-1a.5.5 0 00.094-.813l-3.531-3.53a.5.5 0 00-.375-.157.5.5 0 00-.094 0 .5.5 0 00-.063 0zm.312 1.344l2.594 2.593-.907.5L16 7.906l.5-.937zM6 7v1h5.031V7H6zm9.344 1.656l2 2L13.375 18H8.719l2.375-2.344a1.48 1.48 0 001.687-.281 1.512 1.512 0 000-2.125 1.512 1.512 0 00-2.125 0 1.482 1.482 0 00-.281 1.688L8 17.343v-4.688l7.344-4zm-3.625 5.156c.127 0 .275.026.375.126.2.199.2.519 0 .718-.2.2-.52.2-.719 0-.2-.2-.2-.519 0-.719.1-.1.217-.124.344-.124z"
                      />
                    </svg>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    className={`${
                      pathname === "/admin/blog-category"
                        ? "bg-emerald-200 border-b-2 border-emerald-500"
                        : ""
                    } flex items-center gap-x-3 py-2 px-2.5 text-sm text-quaternary rounded-lg hover:bg-emerald-100 hover:font-semibold`}
                    href="/admin/blog-category"
                  >
                    {/* <BiCategory  /> */}
                    <MdOutlineSpeakerNotes className="size-4" />
                    Blog Category
                  </Link>
                </li>
                <li>
                  <Link
                    className={`${
                      pathname === "/admin/user" ? "bg-emerald-200 border-b-2 border-emerald-500" : ""
                    } flex items-center gap-x-3 py-2 px-2.5 text-sm text-quaternary rounded-lg hover:bg-emerald-100 hover:font-semibold`}
                    href="/admin/user"
                  >
                    <FiUsers className="size-4" />
                    User
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          {/* End Body */}
        </div>
      </div>
      {/* End Sidebar */}
    </>
  );
};

export default Sidebar;
