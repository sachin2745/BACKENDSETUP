"use client";
import CommentSection from "@/app/(components)/CommentSection";
import axios from "axios";
import Link from "next/link";
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

  // Get current URL
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      // console.log("Current URL:", url); // Debugging
      setCurrentUrl(url);
    }
  }, []);
  //END

  // Fetching blog data
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
  //END

  // Fetching recent blogs
  const [recentBlogs, setRecentBlogs] = useState([]);

  const fetchRecentBlogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/web/recent-blogs`
      ); // Making GET request to the API endpoint
      // console.log(response.data);
      const data = response.data; // Extracting the data from the response

      // Setting the state with the fetched data
      setRecentBlogs(data.recentBlogs);
    } catch (err) {
      console.log(err.message); // Catching any error and setting the error state
    }
  };

  useEffect(() => {
    fetchRecentBlogs();
  }, []);
  //END

  //Search Functionality
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (search.trim()) {
      const fetchData = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/web/search?query=${search}`
        );
        const data = await response.json();
        setResults(data);
      };

      fetchData();
    } else {
      setResults([]);
    }
  }, [search]);

  const highlightText = (text, query) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-emerald-100 text-black">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  //END

  if (loading)
    return (
      <section className="min-h-screen">
        <div className="p-5 xl:p-10">
          <div className="max-w-8xl mx-auto xl:flex flex-row items-start space-x-4">
            {/* Main Content Skeleton */}
            <div className="xl:w-[77%] bg-white overflow-visible">
              <div className="bg-gray-300 w-3/4 h-8 mb-4 rounded animate-pulse"></div>
              <div className="flex items-center font-semibold font-RedditSans space-x-4 mb-4 pb-4 border-b-2">
                <span className="bg-gray-300 w-24 h-6 rounded animate-pulse"></span>
                <span className="bg-gray-300 w-24 h-6 rounded animate-pulse"></span>
              </div>

              <div className="flex flex-row items-start space-x-4">
                {/* Social Media Icons Skeleton */}
                <div className="sticky top-10 flex flex-col space-y-4 mb-4">
                  <div className="bg-gray-300 w-10 h-10 rounded animate-pulse"></div>
                  <div className="bg-gray-300 w-10 h-10 rounded animate-pulse"></div>
                  <div className="bg-gray-300 w-10 h-10 rounded animate-pulse"></div>
                  <div className="bg-gray-300 w-10 h-10 rounded animate-pulse"></div>
                  <div className="bg-gray-300 w-10 h-10 rounded animate-pulse"></div>
                </div>

                {/* Blog Image Skeleton */}
                <div className="w-full sm:block h-[503px] bg-gray-300 rounded-lg animate-pulse mb-4"></div>
                <div className="w-full sm:hidden h-[158px] bg-gray-300 rounded-lg animate-pulse mb-4"></div>

                <div className="my-6 w-full bg-white font-RedditSans">
                  <div className="bg-gray-300 w-full h-6 mb-4 rounded animate-pulse"></div>
                  <div className="bg-gray-300 w-full h-16 mb-4 rounded animate-pulse"></div>
                  <div className="bg-gray-300 w-full h-6 mb-4 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="sm:sticky top-10 xl:w-[27%] bg-white sm:px-6 py-7 xl:py-2 min-h-[400px] font-RedditSans">
              <div className="bg-gray-300 w-full h-10 mb-4 rounded animate-pulse"></div>
              <div className="bg-gray-300 w-full h-10 mb-4 rounded animate-pulse"></div>
              <div className="bg-gray-300 w-full h-10 mb-4 rounded animate-pulse"></div>

              <hr className="my-4" />
              <div className="border shadow-md rounded px-5 py-4 font-RedditSans">
                <div className="bg-gray-300 w-3/4 h-6 mb-4 rounded animate-pulse"></div>
                <div className="space-y-4">
                  <div className="bg-gray-300 w-full h-6 mb-2 rounded animate-pulse"></div>
                  <div className="bg-gray-300 w-full h-6 mb-2 rounded animate-pulse"></div>
                  <div className="bg-gray-300 w-full h-6 mb-2 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );

  if (!blog)
    return (
      <div className="text-center py-10 text-red-600">Blog not found.</div>
    );

  if (!currentUrl) return null;

  return (
    <section className="min-h-screen">
      <div className="p-5 xl:p-10">
        <div className="max-w-8xl mx-auto xl:flex flex-row items-start">
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
              <div className="sticky top-10 flex flex-col space-y-4 mb-4">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    blog.blogTitle
                  )}%20${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 shape hover:text-lightBlue"
                >
                  <FaWhatsapp />
                </a>

                {/* Instagram (No direct share link, using profile link as placeholder) */}
                <a
                  href="https://www.instagram.com/blog_portal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 shape hover:text-lightBlue"
                >
                  <FaInstagram />
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 shape hover:text-lightBlue"
                >
                  <FaLinkedinIn />
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 shape hover:text-lightBlue"
                >
                  <FaFacebook />
                </a>

                {/* Twitter (Now X) */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    blog.blogTitle
                  )}&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 shape hover:text-lightBlue"
                >
                  <RiTwitterXLine />
                </a>
              </div>

              {/* <!-- Blog Image --> */}
              <div>
                <picture>
                  <source
                    srcSet={`${process.env.NEXT_PUBLIC_API_URL}${blog.blogImage}`}
                    media="(min-width: 768px)"
                  />
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${blog.blogImage}`}
                    alt={blog.blogImgAlt}
                    className="w-full hidden sm:block h-[503px] rounded-lg"
                  />
                  <img
                    width={690}
                    height={450}
                    src={`${process.env.NEXT_PUBLIC_API_URL}${blog.blogImageMobile}`}
                    alt={blog.blogImgAlt}
                    className="w-full block sm:hidden h-[158px] rounded-lg"
                  />
                </picture>
                <div className="my-6  w-full bg-white font-RedditSans">
                  <p className="pb-4 text-md border-b-2">
                    {blog.blogDescription}
                  </p>
                  <div
                    className="pt-4 text-md leading-relaxed font-RedditSans"
                    dangerouslySetInnerHTML={{
                      __html: blog.blogContent || "No content available.",
                    }}
                  />
                </div>
                <p className="pt-4 text-md border-t-2">
                  <span className="font-semibold">Tags :</span>{" "}
                  {blog.blogKeywords}
                </p>
              </div>
            </div>
            <div>
              {slug && (
                <CommentSection blogId={blog.blogId} blogSlug={blog.blogSKU} />
              )}
            </div>
          </div>

          {/* <!-- Sidebar --> */}
          <div className="xl:sticky rounded top-10  xl:w-[27%] bg-white sm:px-6 py-7 xl:py-2 min-h-[400px] font-RedditSans">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 text-sm font-medium  bg-darkGray rounded focus:outline-none focus:ring-1 focus:ring-lightBlue "
            />
            {results.length > 0 && (
              <ul className="absolute bg-white border mt-2 border-gray-300 rounded w-[86%] sm:w-[95%] xl:w-[87%] max-h-60 overflow-y-auto">
                {results.map((result) => (
                  <li
                    key={result.blogId}
                    className="p-2 cursor-pointer text-sm font-medium text-spaceblack hover:bg-emerald-100"
                  >
                    <a href={`/blog/${result.blogSKU}`}>
                      {highlightText(result.blogTitle, search)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <hr className="my-4" />
            <div className="border shadow-md rounded px-5 py-4 font-RedditSans">
              <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
              <ul className="space-y-4 font-medium text-gray-900">
                {recentBlogs.length > 0 ? (
                  recentBlogs.map((blog) => (
                    <li
                      key={blog.blogId}
                      className="flex items-center space-x-4 border-b-2 pb-2"
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${blog.blogImage}`}
                        alt={blog.blogImgAlt}
                        className="w-16 h-16 rounded"
                      />
                      <Link
                        href={`/blog/${blog.blogSKU}`}
                        className="text-sm cursor-pointer hover:text-lightBlue"
                      >
                        {blog.blogTitle}
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No recent posts available.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewBlog;
