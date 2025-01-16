import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { TbLayoutDashboardFilled } from "react-icons/tb";

const Sidebar = ({ isCollapsed }) => {

    const pathname = usePathname()

    console.log(pathname);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);

    // Sample data for demonstration
    const options = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Calendar', path: '/admin/calendar' },
        { name: 'Users', path: '/admin/users' },
        // Add more options as needed
    ];

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Filter options based on the input
        if (value) {
            const filtered = options.filter(option =>
                option.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions([]);
        }
    };

    const handleOptionClick = (path) => {
        router.push(path);
        setSearchTerm('');
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
                        <div
                            className="flex items-center gap-1 font-bold text-xl text-quaternary "                           
                        >
                            {!isCollapsed &&  <TbLayoutDashboardFilled />}
                            {!isCollapsed && <span >Dashboard</span>}
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
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {filteredOptions.length > 0 && (
                                <ul className="absolute z-10  w-[87%] bg-white border border-gray-300 rounded mt-1">
                                    {filteredOptions.map(option => (
                                        <li
                                            key={option.path}
                                            onClick={() => handleOptionClick(option.path)}
                                            className="p-2 hover:bg-emerald-100 cursor-pointer"
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
                                        className={` ${pathname === '/admin/dashboard' ? 'bg-emerald-200 ' : ''} flex items-center gap-x-3 py-2 px-2.5  text-sm text-quaternary rounded-lg hover:bg-emerald-100 hover:font-semibold`}
                                        href="/admin/dashboard"
                                    >
                                        <svg
                                            className="size-4 "
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
                                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>

                                        Dashboard
                                    </Link>
                                </li>
                                <li className="hs-accordion" id="users-accordion">
                                    <button
                                        type="button"
                                        className="hs-accordion-toggle w-full text-start flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                        aria-expanded="true"
                                        aria-controls="users-accordion-collapse-1"
                                    >
                                        <svg
                                            className="size-4"
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
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <circle cx={9} cy={7} r={4} />
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                        Users
                                        <svg
                                            className="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
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
                                            className="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
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
                                        id="users-accordion-collapse-1"
                                        className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                                        role="region"
                                        aria-labelledby="users-accordion"
                                    >
                                        <ul
                                            className="hs-accordion-group pt-1 ps-7 space-y-1"
                                            data-hs-accordion-always-open=""
                                        >
                                            <li className="hs-accordion" id="users-accordion-sub-1">
                                                <button
                                                    type="button"
                                                    className="hs-accordion-toggle w-full text-start flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                    aria-expanded="true"
                                                    aria-controls="users-accordion-sub-1-collapse-1"
                                                >
                                                    Sub Menu 1
                                                    <svg
                                                        className="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
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
                                                        className="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
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
                                                    id="users-accordion-sub-1-collapse-1"
                                                    className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                                                    role="region"
                                                    aria-labelledby="users-accordion-sub-1"
                                                >
                                                    <ul className="pt-1 ps-2 space-y-1">
                                                        <li>
                                                            <a
                                                                className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                                href="#"
                                                            >
                                                                Link 1
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                                href="#"
                                                            >
                                                                Link 2
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                                href="#"
                                                            >
                                                                Link 3
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>
                                            <li className="hs-accordion" id="users-accordion-sub-2">
                                                <button
                                                    type="button"
                                                    className="hs-accordion-toggle w-full text-start flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                    aria-expanded="true"
                                                    aria-controls="users-accordion-sub-2-collapse-1"
                                                >
                                                    Sub Menu 2
                                                    <svg
                                                        className="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
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
                                                        className="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
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
                                                    id="users-accordion-sub-2-collapse-1"
                                                    className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                                                    role="region"
                                                    aria-labelledby="users-accordion-sub-2"
                                                >
                                                    <ul className="pt-1 ps-2 space-y-1">
                                                        <li>
                                                            <a
                                                                className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                                href="#"
                                                            >
                                                                Link 1
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                                href="#"
                                                            >
                                                                Link 2
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                                href="#"
                                                            >
                                                                Link 3
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="hs-accordion" id="account-accordion">
                                    <button
                                        type="button"
                                        className="hs-accordion-toggle w-full text-start flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                        aria-expanded="true"
                                        aria-controls="account-accordion-sub-1-collapse-1"
                                    >
                                        <svg
                                            className="size-4"
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
                                            <circle cx={18} cy={15} r={3} />
                                            <circle cx={9} cy={7} r={4} />
                                            <path d="M10 15H6a4 4 0 0 0-4 4v2" />
                                            <path d="m21.7 16.4-.9-.3" />
                                            <path d="m15.2 13.9-.9-.3" />
                                            <path d="m16.6 18.7.3-.9" />
                                            <path d="m19.1 12.2.3-.9" />
                                            <path d="m19.6 18.7-.4-1" />
                                            <path d="m16.8 12.3-.4-1" />
                                            <path d="m14.3 16.6 1-.4" />
                                            <path d="m20.7 13.8 1-.4" />
                                        </svg>
                                        Account
                                        <svg
                                            className="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
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
                                            className="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
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
                                        id="account-accordion-sub-1-collapse-1"
                                        className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                                        role="region"
                                        aria-labelledby="account-accordion"
                                    >
                                        <ul className="pt-1 ps-7 space-y-1">
                                            <li>
                                                <a
                                                    className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                    href="#"
                                                >
                                                    Link 1
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                    href="#"
                                                >
                                                    Link 2
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                    href="#"
                                                >
                                                    Link 3
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="hs-accordion" id="projects-accordion">
                                    <button
                                        type="button"
                                        className="hs-accordion-toggle w-full text-start flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                        aria-expanded="true"
                                        aria-controls="projects-accordion-sub-1-collapse-1"
                                    >
                                        <svg
                                            className="size-4"
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
                                            <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
                                            <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
                                            <path d="M15 2v5h5" />
                                        </svg>
                                        Projects
                                        <svg
                                            className="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
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
                                            className="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
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
                                        className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                                        role="region"
                                        aria-labelledby="projects-accordion"
                                    >
                                        <ul className="pt-1 ps-7 space-y-1">
                                            <li>
                                                <a
                                                    className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                    href="#"
                                                >
                                                    Link 1
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                    href="#"
                                                >
                                                    Link 2
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100"
                                                    href="#"
                                                >
                                                    Link 3
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li>
                                    <Link
                                        className={` ${pathname === '/admin/calendar' ? 'bg-emerald-200' : ''} flex items-center gap-x-3 py-2 px-2.5 text-sm text-quaternary rounded-lg hover:bg-emerald-100 hover:font-semibold`}
                                        href="/admin/calendar"
                                    >
                                        <svg
                                            className="size-4"
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
                                            <rect width={18} height={18} x={3} y={4} rx={2} ry={2} />
                                            <line x1={16} x2={16} y1={2} y2={6} />
                                            <line x1={8} x2={8} y1={2} y2={6} />
                                            <line x1={3} x2={21} y1={10} y2={10} />
                                            <path d="M8 14h.01" />
                                            <path d="M12 14h.01" />
                                            <path d="M16 14h.01" />
                                            <path d="M8 18h.01" />
                                            <path d="M12 18h.01" />
                                            <path d="M16 18h.01" />
                                        </svg>
                                        Calendar
                                        
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-quaternary rounded-lg hover:bg-emerald-100 hover:font-semibold"
                                        href="#"
                                    >
                                        <svg
                                            className="size-4"
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
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                        </svg>
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-quaternary rounded-lg hover:bg-emerald-100 hover:font-semibold"
                                        href="/admin/login"
                                    >
                                        <svg
                                            className="size-4"
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
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                        </svg>
                                        Logout
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

    )
}

export default Sidebar