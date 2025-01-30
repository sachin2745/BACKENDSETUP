"use client";
import React, { useEffect, useState } from "react";

const ViewBlog = ({ slug }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/post/getbysku/${slug}`);
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

  if (!blog) return <div className="text-center py-10 text-red-600">Blog not found.</div>;

  return (
    <div className="mt-6 bg-gray-50">
      <div className="max-w-6xl px-5 md:px-10 py-6 mx-auto bg-gray-50">
        <div className="md:flex justify-between mb-5">
          <h2 className="sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-extrabold text-gray-900">
            {blog.blogTitle}
          </h2>
          <span className="px-4 py-2 font-semibold bg-blue-600 text-white rounded-md capitalize">
            {blog.blogCategory}
          </span>
        </div>

        {blog.blogImage && (
          <img
            className="object-cover w-full rounded-lg shadow"
            src={`${process.env.NEXT_PUBLIC_API_URL}${blog.blogImage}`}
            alt={blog.blogTitle}
          />
        )}

        <div className="flex justify-between p-3 border-b border-gray-300 text-sm font-bold tracking-wider">
          <span>{blog.blogCreatedTime ? new Date(blog.blogCreatedTime).toLocaleDateString() : "N/A"} Posted</span>
          <span>{blog.blogContent ? (blog.blogContent.length / 1000).toFixed(0) : 0} mins read</span>
        </div>

        <div
          className="mt-4 p-6 bg-gray-100 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.blogContent || "No content available." }}
        />
      </div>
    </div>
  );
};

export default ViewBlog;
