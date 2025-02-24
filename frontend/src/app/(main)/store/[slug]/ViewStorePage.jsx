"use client";
import Header from "@/app/(components)/Header";
import useProductContext from "@/context/ProductContext";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";

const ViewproductPage = ({ slug }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const { addItemToCart, isInCart } = useProductContext();
  const router = useRouter();

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

  // Fetching product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/web/post/getbyslug/${slug}`
        );
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          // console.log("Product data:", data);
        } else {
          console.error("Failed to fetch product data");
        }
      } catch (error) {
        console.error("Error fetching product data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);
  //END

  const images = product
    ? [
        {
          src: `${process.env.NEXT_PUBLIC_API_URL}${product.productThumbnail}`,
          alt: product.productThumbnailAlt,
        },
        {
          src: `${process.env.NEXT_PUBLIC_API_URL}${product.productImg2}`,
          alt: product.productAlt2,
        },
        {
          src: `${process.env.NEXT_PUBLIC_API_URL}${product.productImg3}`,
          alt: product.productAlt3,
        },
        {
          src: `${process.env.NEXT_PUBLIC_API_URL}${product.productImg4}`,
          alt: product.productAlt4,
        },
        {
          src: `${process.env.NEXT_PUBLIC_API_URL}${product.productImg5}`,
          alt: product.productAlt5,
        },
      ]
    : [];

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]); // Set default image when images are available
    }
  }, [product]); // Run when product data changes

  //ADD TO BAG BUTTON
  const handleClick = () => {
    if (!isInCart(product.productId)) {
      addItemToCart(product.productId);
    } else {
      router.replace("/my/bag"); // Replaces current history entry
      setTimeout(() => {
        window.location.href = "/my/bag"; // Hard reload to ensure data refresh
      }, 100);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto xl:flex flex-row pt-10 p-5 items-start animate-pulse">
        <div className="relative md:flex flex-row items-start fit w-full">
          <div className="mx-0 md:px-4 w-full md:w-[45%]">
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-2 overflow-x-auto lg:overflow-y-auto hide-scrollbar">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 bg-gray-300 rounded-md"
                  ></div>
                ))}
              </div>
              <div className="flex-1 flex items-center justify-center bg-gray-200 p-4 rounded-lg relative h-80 md:h-[500px]">
                <div className="w-full max-w-lg h-full bg-gray-300 rounded-md"></div>
              </div>
            </div>
            <div className="fixed bottom-0 lg:static left-0 right-0 px-3 lg:px-0 py-4 bg-white lg:pt-6 lg:pb-0 lg:py-0 z-20 shadow-top md:shadow-none rounded-t-lg md:rounded-none">
              <div className="grid grid-cols-2 gap-2 md:gap-6 justify-items-center">
                <div className="border-2 border-gray-300 w-full flex items-center justify-center py-3 rounded-lg"></div>
                <div className="w-full bg-gray-300 h-12 rounded-lg"></div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[55%] mx-auto my-4 mb-[2.5rem] flex flex-col pb-[4rem] relative">
            <div className="px-3">
              <div className="flex flex-col">
                <div className="h-6 bg-gray-300 md:w-3/4 rounded-md"></div>
                <div className="h-6 bg-gray-300 md:w-3/4 rounded-md mt-2"></div>
                {/* <div className="h-4 bg-gray-300 w-1/2 rounded-md mt-2"></div> */}
              </div>
              <div className="flex mt-3">
                <div className="h-5 bg-gray-300 w-24 rounded-md"></div>
              </div>
              <div className="flex mt-3 gap-3">
                <div className="h-6 bg-gray-300 w-16 rounded-md"></div>
                <div className="h-6 bg-gray-300 w-24 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // if (!product) return <p>No product found</p>;
  if (!currentUrl) return null;
  return (
    <>
      <Header />

      <section className="min-h-screen font-RedditSans">
        <div className="p-3 xl:p-10">
          <div className="max-w-7xl  mx-auto xl:flex flex-row items-start">
            {/* <!-- Main Content --> */}
            <div className="relative md:flex flex-row items-start fit">
              <div className="mx-0 md:px-4 w-full md:w-[45%] ">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col gap-2 overflow-x-auto lg:overflow-y-auto hide-scrollbar">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer border-2 rounded-md transition-all ${
                          selectedImage?.src === image.src
                            ? "border-emerald-500"
                            : "border-transparent"
                        } hover:border-emerald-400`}
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image.src}
                          alt={image.alt || "Product Thumbnail"}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Right: Main Image */}
                  <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 rounded-lg relative">
                    {selectedImage ? (
                      <img
                        src={selectedImage.src}
                        alt={selectedImage.alt || "Product Image"}
                        className="w-full max-w-lg object-cover rounded-md"
                      />
                    ) : (
                      <p>Loading image...</p>
                    )}

                    {/* Preview Book Button */}
                    <div className="absolute bottom-3 right-3 bg-white px-3 py-1.5 shadow-md rounded-lg flex items-center cursor-pointer">
                      <span className="text-xs text-gray-700 font-medium">
                        Preview Book
                      </span>
                      <span className="pl-2">
                        <svg
                          width={15}
                          height={17}
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.02 0a1.01 1.01 0 0 0-1 1v14.1a1.01 1.01 0 0 0 1 1.01H13.1a1.01 1.01 0 0 0 1-1V4.03L10.08 0H3.02Z"
                            fill="#E2E5E7"
                          />
                          <path
                            d="M11.08 4.03h3.02L10.07 0v3.02a1.01 1.01 0 0 0 1 1Z"
                            fill="#B0B7BD"
                          />
                          <path
                            d="m14.1 7.05-3.02-3.02h3.02v3.02Z"
                            fill="#CAD1D8"
                          />
                          <path
                            d="M12.08 13.1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5V8.04a.5.5 0 0 1 .5-.5h11.08a.5.5 0 0 1 .5.5v5.04Z"
                            fill="#F15642"
                          />
                          <path
                            d="M2.2 9.54a.28.28 0 0 1 .27-.28h.93a1 1 0 0 1 0 2.02h-.67v.53a.25.25 0 0 1-.26.28.27.27 0 0 1-.28-.28V9.54Zm.53.23v1h.67a.5.5 0 0 0 0-1h-.67Zm2.45 2.31a.25.25 0 0 1-.28-.24v-2.3a.27.27 0 0 1 .28-.24h.92a1.4 1.4 0 0 1 .04 2.78h-.96Zm.25-2.3v1.8h.67a.9.9 0 1 0 0-1.8h-.67Zm3.13.04v.64h1.02a.31.31 0 0 1 .3.29.28.28 0 0 1-.3.24H8.56v.84a.24.24 0 0 1-.25.25.26.26 0 0 1-.28-.25V9.55a.25.25 0 0 1 .28-.25h1.42a.25.25 0 0 1 .26.35.28.28 0 0 1-.26.17H8.56Z"
                            fill="#fff"
                          />
                          <path
                            d="M11.58 13.6H2.01v.5h9.57a.5.5 0 0 0 .5-.5v-.5a.5.5 0 0 1-.5.5Z"
                            fill="#CAD1D8"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="
  fixed bottom-0 lg:static left-0 right-0 px-3 lg:px-0 py-4 bg-white
  lg:pt-6 lg:pb-0 lg:py-0 z-20 shadow-top md:shadow-none rounded-t-lg md:rounded-none
  "
                >
                  <div className="grid grid-cols-2 gap-2 md:gap-6 justify-items-center">
                    <button
                      onClick={handleClick}
                      type="button"
                      className="border-2 border-emerald-300 w-full flex cursor-pointer items-center justify-center py-3 rounded-lg font-medium"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        className="mr-2 md:mr-0.5"
                      >
                        <path
                          data-name="Rectangle 159"
                          fill="none"
                          d="M0 0h24v24H0z"
                        />
                        <path
                          data-name="Path 77525"
                          d="M7.611 7.248a3.169 3.169 0 0 0-3.137 3.617l.809 5.657a3.961 3.961 0 0 0 3.921 3.4h5.594a3.961 3.961 0 0 0 3.921-3.4l.808-5.657a3.169 3.169 0 0 0-3.138-3.617Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        />
                        <path
                          data-name="Path 77526"
                          d="M8.039 4.684a3.96 3.96 0 0 1 3.543-2.189h.836a3.961 3.961 0 0 1 3.542 2.189l.708 1.417a.794.794 0 1 1-1.421.709l-.7-1.415a2.376 2.376 0 0 0-2.126-1.314h-.836a2.376 2.376 0 0 0-2.129 1.314L8.747 6.81a.792.792 0 1 1-1.417-.708Z"
                          fill="currentColor"
                          fillRule="evenodd"
                        />
                      </svg>
                      {isInCart(product.productId)
                        ? "Go to Bag"
                        : "Add to Cart"}
                    </button>
                    <a
                      href="/my/bag"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default redirection
                        if (!isInCart(product.productId)) {
                          addItemToCart(product.productId);
                        }
                        window.location.href = "/my/bag"; // Redirect after handling cart logic
                      }}
                      className="w-full bg-emerald-500 text-white flex items-center justify-center py-3 rounded-lg font-medium"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-[55%] mx-auto my-4 mb-[2.5rem] flex flex-col  pb-[4rem] relative">
                <div>
                  <div className="px-3">
                    <div className="flex flex-col">
                      <div className="flex flex-col flex-1">
                        <h1
                          className="text-[16px] md:text-[20px] font-semibold text-secondary text-justify"
                          itemProp="name"
                        >
                          {product.productName}
                        </h1>
                        <span className="pt-0 md:pt-2">
                          <span className="text-[14px] md:text-[16px] font-medium text-grey">
                            {product.productTagLine}
                          </span>
                        </span>
                      </div>
                      <div className="flex">
                        <a href="#reviews-section">
                          <div className="flex flex-row items-center pt-3">
                            <div className="flex items-center  rounded space-x-1.5 px-2 py-0.5 bgEmerald">
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
                                  {product.productStar}
                                </span>
                              </div>
                            </div>
                            <div className="text-accent-6 pr-1 font-medium text-sm ml-2 text-grey">
                              <span className="text-[14px] text-grey font-semibold">
                                {product.productRating}&nbsp;ratings&nbsp;
                              </span>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div
                      className="schema-item"
                      itemProp="offers"
                      itemScope=""
                      itemType="https://schema.org/Offer"
                    >
                      <div className="mt-4 lg:mt-5">
                        <div>
                          <div className="flex justify-start items-center">
                            <meta itemProp="priceCurrency" content="INR" />
                            <meta
                              itemProp="priceValidUntil"
                              content="2025-03-31"
                            />
                            <meta itemProp="price" content={2749.0} />
                            <span className="text-[20px] md:text-[28px] font-bold text-secondary">
                              ₹{product.productDiscountPrice}
                            </span>
                            <span className="ml-2">
                              <del
                                className="text-[14px] md:text-[16px] text-[#8D9091] font-medium"
                                content={product.productOriginalPrice}
                              >
                                ₹{product.productOriginalPrice}
                              </del>
                            </span>
                            <span className="ml-2">
                              <span className="text-[16px] md:text-[18px] text-[color:var(--green)] font-bold">
                                (
                                {Math.round(
                                  ((product.productOriginalPrice -
                                    product.productDiscountPrice) /
                                    product.productOriginalPrice) *
                                    100
                                )}
                                % OFF)
                              </span>
                            </span>
                          </div>
                          <div />
                        </div>
                      </div>
                      <div>
                        <link
                          itemProp="itemCondition"
                          href="http://schema.org/NewCondition"
                        />
                        <link
                          itemProp="availability"
                          href="http://schema.org/InStock"
                        />
                        <div className="flex justify-start items-center">
                          <span className="text-[14px] font-bold textEmerald">
                            {product.productStock === 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center">
                        <div className="flex flex-row items-center my-4 md:my-0">
                          <span className="pr-2 font-semibold text-gray-600">
                            Quantity :
                          </span>
                          <select className="select select-bordered select-sm w-16">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 mb-10 w-full">
                      <div className="hidden md:block w-full max-w-2xl mx-auto  border-2  border-gray-200 rounded-lg">
                        <div className="flex  border-b bg-gray-100">
                          {[
                            { id: "description", label: "Book Description" },
                            { id: "structure", label: "Book Structure" },
                            {
                              id: "help",
                              label: "How will this book help you?",
                            },
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`w-full  py-3 text-[12px] font-semibold border-b-2 transition-all duration-300 ${
                                activeTab === tab.id
                                  ? "border-gray-700 text-gray-900"
                                  : "border-transparent text-gray-600"
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        <div className="p-4 bg-white rounded-lg font-RedditSans">
                          {activeTab === "description" && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: product.productDescription,
                              }}
                            />
                          )}
                          {activeTab === "structure" && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: product.prodStructure,
                              }}
                            />
                          )}
                          {activeTab === "help" && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: product.prodHelp,
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="block md:hidden">
                        <div className="collapse collapse-arrow bg-base-200 mb-2">
                          <input
                            type="radio"
                            name="my-accordion-2"
                            defaultChecked
                            className=""
                          />
                          <div className="collapse-title  py-1 flex justify-start items-center text-sm font-medium">
                            Book Description
                          </div>
                          <div className="collapse-content bg-white border-2">
                            <div
                              className="p-1 text-xs leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: product.productDescription,
                              }}
                            />
                          </div>
                        </div>
                        <div className="collapse collapse-arrow bg-base-200 mb-2">
                          <input type="radio" name="my-accordion-2" />
                          <div className="collapse-title   py-1 flex justify-start items-center text-sm font-medium">
                            Book Structure
                          </div>
                          <div className="collapse-content bg-white border-2">
                            <div
                              className="p-1 text-xs leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: product.prodStructure,
                              }}
                            />
                          </div>
                        </div>
                        <div className="collapse collapse-arrow bg-base-200 mb-2">
                          <input type="radio" name="my-accordion-2" />
                          <div className="collapse-title  py-1  flex justify-start items-center text-sm font-medium">
                            How will this book help you?
                          </div>
                          <div className="collapse-content bg-white border-2">
                            <div
                              className="p-1 text-xs leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: product.prodHelp,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-hidden" itemProp="description">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.ProductDetail,
                        }}
                      />
                    </div>
                    <div className="w-full grid grid-cols-3 md:flex justify-between items-center px-0 py-3.5 mt-8 md:px-4">
                      <div className="flex flex-col items-center gap-2.5 pr-3">
                        <img
                          src="/security.svg"
                          loading="lazy"
                          alt="security"
                        />
                        <span className="text-[10px] md:text-[14px] font-semibold text-center text-greyish-black">
                          100% Safe &amp; Secure Payments
                        </span>
                      </div>
                      <div className="hidden md:block h-12 bg-transparent px-3">
                        <div
                          className="h-full bg-gray-200 w-px "
                          style={{ backgroundColor: "rgb(186, 186, 186)" }}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-2.5 px-3">
                        <img src="/order.svg" loading="lazy" alt="order" />
                        <span className="text-[10px] md:text-[14px] font-semibold text-center text-greyish-black">
                          Easy return and replacements
                        </span>
                      </div>
                      <div className="hidden md:block h-12 bg-transparent px-3">
                        <div
                          className="h-full bg-gray-200 w-px "
                          style={{ backgroundColor: "rgb(186, 186, 186)" }}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-2.5 pl-3">
                        <img
                          src="/delivery.svg"
                          loading="lazy"
                          alt="delivery"
                        />
                        <span className="text-[10px] md:text-[14px] font-semibold text-center text-greyish-black">
                          Trusted Shipping
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewproductPage;
