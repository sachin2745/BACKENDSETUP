'use client';
import axios from "axios";
import React, { useEffect, useState } from "react";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [founderData, setFounderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/web/about-data/getall`
        );

        if (response.status === 200) {
          setAboutData(response.data.aboutData);
          setFounderData(response.data.founderData);
          console.log("About Data:", response.data);
          
          
        } else {
          console.error(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen">Loading</div>;
  }

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
};

export default About;
