import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { HiMenuAlt2 } from "react-icons/hi";

const Header = ({ isCollapsed, setIsCollapsed }) => {

    const pathname = usePathname();

    //PICKED A NAME FROM THE PATH
    const parts = pathname.split("/"); 
    const Result = parts[parts.length - 1];

    return (
        <header className="relative flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-2 font-RedditSans">

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
                                <HiMenuAlt2 className={` transform transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
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
                <div className="overflow-hidden transition-all duration-300">
                    <div className="flex flex-col gap-5  sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
                        <div className="hs-dropdown relative inline-flex">
                            <button id="hs-dropdown-custom-trigger" type="button" className="hs-dropdown-toggle py-1 ps-1 pe-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                                <img className="w-8 h-auto rounded-full" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Avatar" />
                                <span className="text-gray-600 font-medium truncate max-w-[7.5rem]">Maria</span>
                                <svg className="hs-dropdown-open:rotate-180 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </button>

                            <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-custom-trigger">
                                <div className="p-1 space-y-0.5">
                                    <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">
                                        Newsletter
                                    </a>
                                    <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">
                                        Purchases
                                    </a>
                                    <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">
                                        Downloads
                                    </a>
                                    <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">
                                        Team Account
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>


    )
}

export default Header