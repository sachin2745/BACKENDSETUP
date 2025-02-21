"use client";
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

const ViewStorePage = ({ slug }) => {
  const [store, setProduct] = useState(null);
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

  // Fetching store data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/web/post/getbyslug/${slug}`
        );
        if (res.ok) {
          const data = await res.json();

          setProduct(data);
        } else {
          console.error("Failed to fetch store data");
        }
      } catch (error) {
        console.error("Error fetching store data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);
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

                {/* store Image Skeleton */}
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


  if (!currentUrl) return null;

  return (
    <section className="min-h-screen">
      <div className="p-5 xl:p-10">
        <div className="max-w-8xl mx-auto xl:flex flex-row items-start">
          {/* <!-- Main Content --> */}
          <div className="xl:w-[77%] bg-white overflow-visible ">
            <h1 className="text-2xl text-wrap sm:text-4xl font-bold mb-4 text-start font-Montserrat">
              {store.storeTitle}
            </h1>
            <div className="flex items-center font-semibold font-RedditSans space-x-4 mb-4 pb-4 border-b-2">
              <span className="bg-darkGray  text-quaternary px-3 py-1 ">
                {new Date(store.storeCreatedTime * 1000).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }
                )}
              </span>
              <span className="bg-darkGray  text-quaternary px-3 py-1 ">
                {store.storeCategory}
              </span>
            </div>
            <div className="flex flex-row items-start space-x-4 ">
              {/* <!-- Social Media Icons --> */}
              <div className="sticky top-10 flex flex-col space-y-4 mb-4">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    store.storeTitle
                  )}%20${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 shape hover:text-lightBlue"
                >
                  <FaWhatsapp />
                </a>

                {/* Instagram (No direct share link, using profile link as placeholder) */}
                <a
                  href="https://www.instagram.com/store_portal"
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
                    store.storeTitle
                  )}&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 shape hover:text-lightBlue"
                >
                  <RiTwitterXLine />
                </a>
              </div>

              {/* <!-- store Image --> */}
              <div>
                <picture>
                  <source
                    srcSet={`${process.env.NEXT_PUBLIC_API_URL}${store.storeImage}`}
                    media="(min-width: 768px)"
                  />
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${store.storeImage}`}
                    alt={store.storeImgAlt}
                    className="w-full hidden sm:block h-[503px] rounded-lg"
                  />
                  <img
                    width={690}
                    height={450}
                    src={`${process.env.NEXT_PUBLIC_API_URL}${store.storeImageMobile}`}
                    alt={store.storeImgAlt}
                    className="w-full block sm:hidden h-[158px] rounded-lg"
                  />
                </picture>
                <div className="my-6  w-full bg-white font-RedditSans">
                  <p className="pb-4 text-md border-b-2">
                    {store.storeDescription}
                  </p>
                  <div
                    className="pt-4 text-md leading-relaxed font-RedditSans"
                    dangerouslySetInnerHTML={{
                      __html: store.storeContent || "No content available.",
                    }}
                  />
                </div>
                <p className="pt-4 text-md border-t-2">
                  <span className="font-semibold">Tags :</span>{" "}
                  {store.storeKeywords}
                </p>
              </div>
            </div>
            <div>
              {slug && (
                <CommentSection storeId={store.storeId} storeSlug={store.storeSKU} />
              )}
            </div>
          </div>

        
        </div>
      </div>
    </section>
  );
};

export default ViewStorePage;
