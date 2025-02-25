"use client";
import { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineHome } from "react-icons/ai";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/web/products/getall`
        );
        setProducts(response.data.products);
        // console.log(response.data.products);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [store, setStore] = useState(null);
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/web/store/getall`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch store");
        setStore(Array.isArray(data.store) ? data.store[0] : data.store); // console.log(data.store);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchStore();
  }, []);

  return (
    <section className="font-RedditSans">
      <div className=" text-quaternary px-4 py-6 sm:pt-10 max-w-[78rem] mx-auto">
        <div className="relative w-full bg-white">
          {/* Breadcrumb Navigation */}
          <nav>
            <ol className="flex flex-wrap items-center gap-2 text-gray-600">
              <li>
                <a href="/" className="hover:text-gray-900">
                  <AiOutlineHome className="text-xl" />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className="w-4 h-4"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <a
                  href=""
                  className="text-sm sm:text-base font-medium hover:text-gray-900"
                >
                  {store?.storeTitle || ""}
                </a>
              </li>
            </ol>
          </nav>

          {/* Heading Section */}
          <div className="text-headings mt-6">
            <h1 className="mb-6 font-bold text-[24px] sm:text-[32px] md:text-[40px] text-gray-900">
              {store?.storeTitle || ""}
            </h1>
            <p
              className="text-gray-700 text-[14px] text-base sm:text-[16px] leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: store?.storeDescription || "",
              }}
            ></p>
          </div>
        </div>
      </div>
      <div className=" bg-gray-100 shadow-md ">
        <div className="flex justify-between items-center  max-w-[78rem] mx-auto">
          {/* Tab Container */}
          <div className="flex ">
            <div className="relative group">
              {/* Tab Item */}
              <div className="px-4 py-4 text-black font-semibold cursor-pointer">
                All Store Products
              </div>
              {/* Bottom Active Bar */}
              <div className="absolute left-0 bottom-0 w-full h-[2.5px] bg-black scale-x-100 transition-transform duration-300 group-hover:scale-x-105"></div>
            </div>
          </div>
        </div>
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
          <div className=" max-w-[78rem] mx-auto">
            <div
              className="
    grid grid-cols-2 gap-3 lg:gap-5
     sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5
    "
            >
              {products.map((post, index) => (
                <div key={post.productId}>
                  <div className="relative">
                    <Link href={`/store/${post.productSlug}`}>
                      <div
                        className="border border-[#DCDCDC] rounded-md md:rounded-lg
                            cursor-pointer
                            overflow-hidden
                            transition-all duration-300
                        hover:border-transparent custom-shadow-on-hover"
                      >
                        <div className="absolute -translate-y-1/2 z-10">
                          <div className="translate-x-[-5px] translate-y-[2px]">
                            {[
                              "/new.svg",
                              "/trending.svg",
                              "/bestselling.svg",
                              "/pre-order.svg",
                            ][post.productSet] && (
                              <img
                                src={
                                  [
                                    "/new.svg",
                                    "/trending.svg",
                                    "/bestselling.svg",
                                    "/pre-order.svg",
                                  ][post.productSet]
                                }
                                loading="lazy"
                                alt="Product Badge"
                              />
                            )}
                          </div>
                        </div>
                        <div className="relative aspect-square ">
                          <span
                            style={{
                              boxSizing: "border-box",
                              display: "block",
                              overflow: "hidden",
                              width: "initial",
                              height: "initial",
                              background: "none",
                              opacity: 1,
                              border: 0,
                              margin: 0,
                              padding: 0,
                              position: "absolute",
                              inset: 0,
                            }}
                          >
                            <img
                              alt=" Arjuna For NEET Class 11 Physics, Chemistry, Botany and Zoology Modules with Solutions & 15 OMR Sheets Combo Set of 15 Books For (2025 Edition)"
                              itemProp="image"
                              src={`${process.env.NEXT_PUBLIC_API_URL}${post.productThumbnail}`}
                              decoding="async"
                              data-nimg="fill"
                              className="aspect-square object-contain w-full"
                              style={{
                                position: "absolute",
                                inset: 0,
                                boxSizing: "border-box",
                                padding: 0,
                                border: "none",
                                margin: "auto",
                                display: "block",
                                width: 0,
                                height: 0,
                                minWidth: "100%",
                                maxWidth: "100%",
                                minHeight: "100%",
                                maxHeight: "100%",
                              }}
                              sizes="100vw"
                              srcSet={`${process.env.NEXT_PUBLIC_API_URL}${post.productThumbnail}`}
                            />
                            <noscript />
                          </span>
                        </div>
                        <div className="py-1 md:py-2 bg-white">
                          <div className="px-1 lg:px-2">
                            <span
                              className="text-[12px] md:text-[14px] font-semibold line-clamp-2 h-[36px] sm:h-[40px] text-secondary"
                              itemProp="name"
                            >
                              {post.productName}
                            </span>
                            <div className="pb-1 pt-2 md:pb-1 md:pt-4">
                              <div>
                                <span className="flex">
                                  <div
                                    className="
                                                    bgBlueGradient rounded-sm md:rounded-[4px]
                                                    px-1.5 md:px-2 py-0.5 flex justify-center items-start 
                                                    "
                                  >
                                    <span
                                      className="
                                    text-white
                                    font-semibold text-[10px] md:text-sm
                                    "
                                    >
                                      {post.ProductEdition} Edition
                                    </span>
                                  </div>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="pl-1 lg:pl-2 pt-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <div>
                                  <div className="flex justify-start items-center">
                                    <span className="text-[16px] md:text-[18px] font-bold text-secondary">
                                      ₹{post.productDiscountPrice}
                                    </span>
                                    <span className="ml-1">
                                      <span className="text-[12px] md:text-[14px] text-[color:var(--green)] font-bold">
                                        (
                                        {Math.round(
                                          ((post.productOriginalPrice -
                                            post.productDiscountPrice) /
                                            post.productOriginalPrice) *
                                            100
                                        )}
                                        % OFF)
                                      </span>
                                    </span>
                                  </div>
                                  <div>
                                    <div className="h-3 flex items-center">
                                      <del
                                        className="text-[12px] md:text-[14px] text-[#8D9091] font-medium"
                                        content={post.productOriginalPrice}
                                      >
                                        ₹{post.productOriginalPrice}
                                      </del>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex my-1">
                                <div
                                  className="flex items-center  
                                rounded-tl-[4px] rounded-bl-[4px]  
                                space-x-0.5 pl-1 px-1.5
                                bgEmerald"
                                >
                                  <span className="scale-90 md:scale-100">
                                    <svg
                                      width={11}
                                      height={10}
                                      viewBox="0 0 11 10"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M5.62137 0.30161L6.77837 2.60161C6.81819 2.6816 6.87686 2.7507 6.94934 2.80296C7.02181 2.85523 7.1059 2.88908 7.19437 2.90161L9.78037 3.26961C9.88125 3.28241 9.97645 3.32348 10.055 3.38809C10.1335 3.45269 10.1921 3.53819 10.2241 3.63471C10.2561 3.73123 10.2602 3.83483 10.2358 3.93355C10.2114 4.03227 10.1596 4.12208 10.0864 4.19261L8.21437 5.97661C8.1505 6.03721 8.10257 6.11263 8.07484 6.19618C8.0471 6.27974 8.04041 6.36885 8.05537 6.45561L8.49937 8.98061C8.51503 9.08135 8.50238 9.18447 8.46284 9.27844C8.42329 9.37241 8.3584 9.45354 8.27542 9.51276C8.19244 9.57199 8.09462 9.60699 7.9929 9.61385C7.89118 9.62071 7.78955 9.59916 7.69937 9.55161L5.38337 8.35961C5.30385 8.31881 5.21575 8.29753 5.12637 8.29753C5.03699 8.29753 4.94889 8.31881 4.86937 8.35961L2.55637 9.55161C2.46619 9.59916 2.36456 9.62071 2.26284 9.61385C2.16112 9.60699 2.0633 9.57199 1.98032 9.51276C1.89734 9.45354 1.83245 9.37241 1.7929 9.27844C1.75336 9.18447 1.74071 9.08135 1.75637 8.98061L2.19937 6.45561C2.21433 6.36885 2.20764 6.27974 2.1799 6.19618C2.15217 6.11263 2.10424 6.03721 2.04037 5.97661L0.16637 4.18861C0.092721 4.11825 0.0405573 4.02843 0.0159443 3.9296C-0.00866863 3.83076 -0.00471952 3.72697 0.0273325 3.63029C0.0593844 3.53361 0.118222 3.44802 0.197005 3.38346C0.275787 3.3189 0.371276 3.27804 0.47237 3.26561L3.05937 2.90161C3.14784 2.88908 3.23193 2.85523 3.3044 2.80296C3.37688 2.7507 3.43555 2.6816 3.47537 2.60161L4.63137 0.30161C4.67825 0.210748 4.74923 0.134542 4.83655 0.0813419C4.92386 0.0281418 5.02413 0 5.12637 0C5.22861 0 5.32888 0.0281418 5.41619 0.0813419C5.50351 0.134542 5.57449 0.210748 5.62137 0.30161V0.30161Z"
                                        fill="white"
                                      />
                                    </svg>
                                  </span>
                                  <div>
                                    <span
                                      className="text-[12px] md:text-[14px] font-semibold text-white"
                                      itemProp="ratingValue"
                                    >
                                      4.8
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
