"use client";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    blogs: 0,
    categories: 0,
    users: 0,
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/getCounts`);
        const data = await response.json();
        setCounts({
          blogs: data.blogsCount,
          categories: data.categoriesCount,
          users: data.usersCount,
        });
        //   console.log("Fetched Data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="py-2  min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Blog Card */}
        <a
          href="/admin/blog"
          className="bg-[url('/green.webp')] shadow-md border  rounded-lg p-3 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="ml-4">
              <h2 className="font-semibold text-4xl text-white mb-2">
                {counts.blogs}
              </h2>
              <p className="text-white font-bold text-lg">Total Blogs</p>
            </div>
            <div className="bg-white p-3 rounded-full">
              <img src="/blog.png" alt="Users Icon" className="w-16 h-16" />
            </div>
          </div>
        </a>

        {/* Blog Categories Card */}
        <a
          href="/admin/blog-category"
          className="bg-[url('/green.webp')] shadow-md border  rounded-lg p-3 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="ml-4">
              <h2 className="font-semibold text-4xl text-white mb-2">
                {counts.categories}{" "}
              </h2>
              <p className="text-white font-bold text-lg">
                Total Blogs Categories
              </p>
            </div>
            <div className="bg-white p-3 rounded-full">
              <img src="/cat.png" alt="Users Icon" className="w-14 h-14" />
            </div>
          </div>
        </a>

        {/* Users Card */}
        <a
          href="/admin/user"
          className="bg-[url('/green.webp')] shadow-md border  rounded-lg p-3 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="ml-4">
              <h2 className="font-semibold text-4xl text-white mb-2">
                {counts.users}
              </h2>
              <p className="text-white font-bold text-lg">Total Users</p>
            </div>
            <div className="bg-white p-3 rounded-full">
              <img src="/users.png" alt="Users Icon" className="w-16 h-16" />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
