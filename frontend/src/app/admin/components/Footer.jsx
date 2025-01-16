import React from 'react'

const Footer = () => {
    return (
        <footer className="mt-auto w-full  py-4 px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center text-center md:text-left">
                <div>
                    <div className="flex-none text-md md:text-sm font-RedditSans  text-gray-500 focus:outline-none" href="#" aria-label="Brand">
                        <span className='text-emerald-500'>@2025</span> Made with 🖤 by <a href="/" className="text-emerald-500">Sachin</a>
                    </div>
                </div>

                <div className="md:text-end space-x-2 hidden md:block">
                    <li className="inline-block  relative pe-8 font-RedditSans last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300">
                        <div className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800" >
                            Version 1.0
                        </div>
                    </li>
                </div>
            </div>
        </footer>
    )
}

export default Footer