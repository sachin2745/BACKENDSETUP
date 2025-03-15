"use client";
import { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/web/blogs/getall`
        );
        setBlogs(response.data.blogs);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="body-font ">
      <div className="text-center font-RedditSans text-quaternary p-4 sm:pt-10 max-w-[900px] mx-auto">
        <h1 className="font-bold text-xl sm:text-3xl pb-4">
          Explore, Discover & Inspire – Welcome to My Blog!
        </h1>
        <h3 className="text-sm text-pretty     leading-relaxed">
          Dive into a world of insightful stories, travel guides, tech trends,
          and lifestyle tips. Stay updated with engaging content, expert
          opinions, and fresh perspectives—all in one place. Start exploring
          now! 🚀✨
        </h3>
      </div>

      <div className="container-fluid px-4 py-7 lg:px-16 sm:py-16 mx-auto">
        {loading ? (
          <div className="flex flex-wrap -m-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 md:w-1/3">
                <div className="h-full relative border-2 shadow-xl border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                  <div className="lg:h-48 md:h-36 w-full bg-gray-300" />
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 mb-2" />
                    <div className="h-4 bg-gray-300 mb-2 w-1/2" />
                    <div className="h-16 bg-gray-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap -m-4">
            {blogs.map((post, index) => (
              <div key={post.blogId} className="p-4 w-full md:w-1/3">
                <div className="h-full border border-gray-200 shadow-lg rounded-lg overflow-hidden ">
                  <img
                    width={424}
                    height={220}
                    className="block sm:hidden h-48 lg:h-48 md:h-36 w-full object-fit opacity-80 hover:opacity-100 transition-opacity duration-300"
                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.blogImageMobile}`}
                    alt={post.blogTitle}
                    loading="lazy"
                  />
                  <img
                    className="hidden sm:block h-48 lg:h-48 md:h-36 w-full object-fit opacity-80 hover:opacity-100 transition-opacity duration-300"
                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.blogImage}`}
                    alt={post.blogTitle}
                    loading="lazy"
                  />
                  <div className="px-6 py-3  text-center space-y-3">
                    <Link
                      href={`/blog/${post.blogSKU}`}
                      className="text-lg font-RedditSans font-semibold capitalize text-quaternary"
                    >
                      {post.blogTitle}
                    </Link>
                    <p className="text-sm text-gray-600 font-RedditSans line-clamp-2">
                      {post.blogDescription.split(" ").slice(0, 30).join(" ")}
                      ...
                    </p>
                    <p className="text-xs text-gray-800 font-Josefin_Sans ">
                      {new Date(post.blogCreatedTime * 1000).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <div className="flex justify-center">
                      <Link
                        href={`/blog/${post.blogSKU}`}
                        className=" font-RedditSans text-quaternary hover:text-white text-sm font-semibold  bg-white border-b-2 border-quaternary hover:bg-quaternary px-3 py-2 rounded-md transition-all duration-300 ease-in-out "
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
