"use client";
import React, { useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";

const ViewBlog = ({ slug }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("Slug:", slug);
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/web/post/getbysku/${slug}`
        );
        if (res.ok) {
          const data = await res.json();

          setBlog(data);
        } else {
          console.error("Failed to fetch blog data");
        }
      } catch (error) {
        console.error("Error fetching blog data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [slug]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!blog)
    return (
      <div className="text-center py-10 text-red-600">Blog not found.</div>
    );

  return (
    <section className="min-h-screen">
      <div className="p-5 xl:p-10">
        <div className="max-w-8xl mx-auto xl:flex flex-row items-start  space-x-4 ">
          {/* <!-- Main Content --> */}
          <div className="xl:w-[77%] bg-white overflow-visible ">
            <h1 className="text-2xl text-wrap sm:text-4xl font-bold mb-4 text-start font-Montserrat">
              {blog.blogTitle}
            </h1>
            <div className="flex items-center font-semibold font-RedditSans space-x-4 mb-4 pb-4 border-b-2">
              <span className="bg-darkGray  text-quaternary px-3 py-1 ">
                {new Date(blog.blogCreatedTime * 1000).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }
                )}
              </span>
              <span className="bg-darkGray  text-quaternary px-3 py-1 ">
                {blog.blogCategory}
              </span>
            </div>
            
            <div className="flex flex-row items-start space-x-4 ">
              {/* <!-- Social Media Icons --> */}
              <div className="sticky  top-10  flex flex-col space-x-0 space-y-4 mb-4 ">
                <a href="#" className="p-2 shape">
                  <FaWhatsapp />
                </a>
                <a href="#" className="p-2 shape">
                  <FaInstagram />
                </a>
                <a href="#" className="p-2 shape">
                  <FaLinkedinIn />
                </a>
                <a href="#" className="p-2 shape">
                  <FaFacebook />
                </a>
                <a href="#" className="p-2 shape">
                  <RiTwitterXLine />
                </a>
              </div>
              {/* <!-- Blog Image --> */}
              <div>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${blog.blogImage}`}
                  alt={blog.blogImgAlt}
                  className="w-full hidden sm:block h-[503px] rounded-lg"
                />
                 <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${blog.blogImageMobile}`}
                  alt={blog.blogImgAlt}
                  className="w-full block sm:hidden h-[158px] rounded-lg"
                />
                <div className="my-6  w-full bg-white font-RedditSans ">
                  <p className="pb-4 text-md border-b-2">
                    {blog.blogDescription}
                  </p>
                  <div
                    className="pt-4 text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: blog.blogContent || "No content available.",
                    }}
                  />
                </div>
                <p className="pt-4 text-md border-t-2">
                  <span className="font-semibold">Tags :</span>  {blog.blogKeywords}
                  </p>
              </div>
            </div>
          </div>

          {/* <!-- Sidebar --> */}
          <div className="sm:sticky top-10  xl:w-[27%] bg-white sm:px-6 py-7 sm:py-2 min-h-[400px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border border-gray-300 bg-darkGray rounded mb-4 "
            />
            <hr className="mb-4" />
            <div className="border shadow-md rounded px-5 py-4 font-RedditSans">
              <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
              <ul className="space-y-4 font-medium text-gray-900">
                <li className="flex items-center space-x-4 border-b-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${blog.blogImage}`}
                    alt="Gen AI"
                    className="w-16 h-16 rounded"
                  />
                  <span className="text-sm ">
                    What Is Generative AI? Meaning, Uses, and Features
                  </span>
                </li>
                <li className="flex items-center space-x-4 border-b-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${blog.blogImage}`}
                    alt="AI Blog"
                    className="w-16 h-16 rounded"
                  />
                  <span className="text-sm ">
                    The Good and Bad of AI for the Future of Humans | Is AI...
                  </span>
                </li>
                <li className="flex items-center space-x-4 border-b-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${blog.blogImage}`}
                    alt="Real Estate"
                    className="w-16 h-16 rounded"
                  />
                  <span className="text-sm ">
                    Best Real Estate Software Development Company in...
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewBlog;
