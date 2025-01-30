"use client";
import { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import axios from "axios";
import Link from "next/link";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:8001/admin/blogs/getall");
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
    <section className="text-gray-600 body-font bg-mate_black">
      <div className="text-center font-Jost text-black dark:text-black pt-10">
        <h1 className="font-bold text-3xl font-Montserrat">My Blog</h1>
        <h3 className="text-sm font-Montserrat">Home &rsaquo; My Blog</h3>
      </div>
      <div className="container px-5 py-24 mx-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-wrap -m-4">
            {blogs.map((post, index) => (
              <div key={post.blogId} className="p-4 md:w-1/3">
                <div className="h-full border-2 shadow-xl rounded-lg overflow-hidden">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover opacity-75 transition duration-200 transform hover:opacity-100"
                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.blogImage}`}
                    alt="blog"
                  />
                  <div className="p-6">
                    <h2 className="tracking-widest text-xs font-medium text-gray-600">
                      {post.blogCategory}
                    </h2>
                    <h2 className="leading-relaxed mb-3 font-Montserrat font-bold capitalize">
                      {post.blogTitle}
                    </h2>
                    <Link
                      href={`/blog/${post.blogSKU}`}
                      className="text-quaternary hover:text-white bg-white hover:bg-quaternary px-2 py-2 rounded-md inline-flex items-center"
                    >
                      Learn More <MdKeyboardDoubleArrowRight />
                    </Link>
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
