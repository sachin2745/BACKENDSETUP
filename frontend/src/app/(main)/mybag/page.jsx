"use client";
import useConsumerContext from "@/context/ConsumerContext";
import useProductContext from "@/context/ProductContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ImHome3 } from "react-icons/im";
import { toast } from "react-toastify";

const bag = () => {
  const {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    isInCart,
    getCartTotal,
    getCartItemsCount,
    removeOneItem,
    getSingleItemCartTotal,
  } = useProductContext();

  const { currentConsumer } = useConsumerContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    if (currentConsumer && cartItems.length > 0) {
      fetchCartProducts();
    }
  }, [cartItems, currentConsumer]);

  const fetchCartProducts = async () => {
    try {
      const productIds = cartItems.map((item) => item.productId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/web/cart-products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": currentConsumer.token,
          },
          body: JSON.stringify({
            productIds,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch cart products");

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching cart products:", error);
    }
  };
  // if (loading) {
  //   return (
  //     <div className="py-2 lg:py-5 mx-auto max-w-7xl px-0 md:px-3 w-full font-RedditSans">
  //       <div className="px-3 lg:px-0">
  //         <div className="animate-pulse flex space-x-4">
  //           <div className="h-6 bg-gray-300 rounded w-10"></div>
  //           <div className="h-6 bg-gray-300 rounded w-24"></div>
  //         </div>
  //       </div>
  //       <div className="lg:flex justify-between lg:space-x-4 lg:pr-3 mt-4">
  //         <div className="flex-1">
  //           <div className="flex flex-col space-y-4">
  //             {Array(3)
  //               .fill(0)
  //               .map((_, index) => (
  //                 <div
  //                   key={index}
  //                   className="shadow rounded-lg p-4 w-full animate-pulse bg-gray-200"
  //                 >
  //                   <div className="h-24 bg-gray-300 rounded"></div>
  //                   <div className="h-6 bg-gray-300 rounded w-3/4 mt-4"></div>
  //                   <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
  //                 </div>
  //               ))}
  //           </div>
  //         </div>
  //         <div className="mt-4 lg:mt-0 flex justify-center lg:sticky lg:top-[130px]">
  //           <div className="w-[400px] max-w-[100vw] px-3 md:px-0">
  //             <div className="rounded-xl p-4 lg:p-6 shadow-lg animate-pulse bg-gray-200">
  //               <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
  //               <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
  //               <div className="h-5 bg-gray-300 rounded w-24 mb-2"></div>
  //               <div className="h-5 bg-gray-300 rounded w-24"></div>
  //               <div className="h-8 bg-gray-300 rounded w-full mt-4"></div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  const getQuantity = (productId) => {
    const item = cartItems.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const openModal = (productId) => {
    setSelectedProductId(productId);

    document.getElementById("my_modal_2").showModal();
  };

  const handleRemove = () => {
    if (selectedProductId) {
      // console.log(selectedProductId);

      // Check if it's the last item
      if (products.length === 1) {
        removeOneItem(selectedProductId);
        toast.success("Item removed successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        removeOneItem(selectedProductId);
        toast.success("Item removed successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
    document.getElementById("my_modal_2").close();
  };

  return (
    <div>
      <div className="py-2 lg:py-5  mx-auto max-w-7xl px-0 md:px-3  w-full font-RedditSans">
        <div className="px-3 lg:px-3">
          <div
            className="schema-item"
            itemScope=""
            itemType="https://schema.org/BreadcrumbList"
          >
            <div className="flex space-x-2 items-center">
              <div>
                <a itemProp="item" className="flex items-center" href="/">
                  <span className="whitespace-nowrap">
                    <span className="flex">
                      <ImHome3 />
                    </span>
                  </span>
                  <span className="ml-1">
                    <svg
                      width={12}
                      height={12}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#arrow_svg__a)">
                        <path
                          d="M6.586 6.001 4.111 3.526l.707-.707L8 6.001 4.818 9.183l-.707-.707 2.475-2.475Z"
                          fill="#757575"
                        />
                      </g>
                      <defs>
                        <clipPath id="arrow_svg__a">
                          <path fill="#fff" d="M0 0h12v12H0z" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </a>
              </div>
              <div>
                <a itemProp="item" className="flex items-center" href="/mybag">
                  <span className="whitespace-nowrap">
                    <span
                      className="text-[12px] hover:text-primary-500 text-darkGrey text-primary-500 font-semibold"
                      itemProp="name"
                    >
                      My Bag
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:flex justify-between lg:space-x-4 lg:pr-3">
          <div className="overflow-auto flex-1">
            <div>
              <div className="flex-1 flex-col mb-0 px-3 pt-3.5">
                {products.length === 0 ? (
                  <div className="flex flex-col justify-center items-center">
                    <div className="shadow rounded-md flex flex-col items-center min-h-[70vh] justify-center mx-auto max-w-7xl px-0 md:px-3  w-full">
                      <div className="pt-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={212}
                          height={212}
                          viewBox="0 0 212 212"
                          stroke="currentColor"
                          fill="none"
                        >
                          <path
                            d="M179.385 13.978H33.7808C32.4942 13.978 31.4512 15.0211 31.4512 16.3077V38.4396C31.4512 39.7262 32.4942 40.7692 33.7808 40.7692H179.385C180.672 40.7692 181.715 39.7262 181.715 38.4396V16.3077C181.715 15.0211 180.672 13.978 179.385 13.978Z"
                            fill="#F2F0FF"
                          />
                          <path
                            d="M179.385 15.1429H33.781C33.1377 15.1429 32.6162 15.6644 32.6162 16.3077V38.4396C32.6162 39.0829 33.1377 39.6044 33.781 39.6044H179.385C180.029 39.6044 180.55 39.0829 180.55 38.4396V16.3077C180.55 15.6644 180.029 15.1429 179.385 15.1429Z"
                            stroke="#1B2124"
                            strokeWidth={2}
                          />
                          <path
                            d="M32.374 39.2375L43.5878 26.6794L32.374 15.7299V39.2375Z"
                            fill="#D9D9D9"
                            stroke="#1B2124"
                            strokeWidth={2}
                            strokeLinejoin="round"
                          />
                          <path
                            d="M181.039 38.9451L169.825 26.556L181.039 15.7486V38.9451Z"
                            fill="#D9D9D9"
                            stroke="#1B2124"
                            strokeWidth={2}
                            strokeLinejoin="round"
                          />
                          <path
                            d="M167.51 198.951H45.6476C36.5211 198.951 29.1221 192.65 29.1221 184.874V43.842C29.1221 41.5776 31.277 39.7407 33.9363 39.7407H179.222C181.88 39.7407 184.036 41.5764 184.036 43.842V184.876C184.03 192.65 176.637 198.951 167.51 198.951Z"
                            stroke="#1B2124"
                            strokeWidth={2}
                          />
                          <path
                            d="M106.578 144.442C96.3002 144.43 86.4471 140.342 79.1799 133.075C71.9127 125.808 67.8248 115.955 67.8131 105.677V77.0562C67.8045 76.5835 67.8902 76.1139 68.0652 75.6747C68.2402 75.2356 68.5009 74.8357 68.8321 74.4984C69.1634 74.1611 69.5585 73.8932 69.9944 73.7103C70.4303 73.5274 70.8983 73.4332 71.3711 73.4332C71.8438 73.4332 72.3118 73.5274 72.7477 73.7103C73.1837 73.8932 73.5788 74.1611 73.91 74.4984C74.2413 74.8357 74.502 75.2356 74.6769 75.6747C74.8519 76.1139 74.9376 76.5835 74.9291 77.0562V105.679C74.9291 114.072 78.2633 122.122 84.1984 128.057C90.1334 133.992 98.1831 137.326 106.576 137.326C114.97 137.326 123.02 133.992 128.955 128.057C134.89 122.122 138.224 114.072 138.224 105.679V76.8791C138.224 75.9353 138.599 75.0302 139.266 74.3628C139.934 73.6955 140.839 73.3206 141.782 73.3206C142.726 73.3206 143.631 73.6955 144.299 74.3628C144.966 75.0302 145.341 75.9353 145.341 76.8791V105.679C145.33 115.956 141.242 125.809 133.975 133.076C126.708 140.343 116.855 144.431 106.578 144.443V144.442Z"
                            fill="#1B2124"
                          />
                          <path
                            d="M141.784 77.0562C146.223 77.0562 149.82 73.4582 149.82 69.02C149.82 64.5817 146.223 60.9838 141.784 60.9838C137.346 60.9838 133.748 64.5817 133.748 69.02C133.748 73.4582 137.346 77.0562 141.784 77.0562Z"
                            fill="white"
                            stroke="#1B2124"
                            strokeWidth={2}
                          />
                          <path
                            d="M71.3712 77.0562C75.8094 77.0562 79.4074 73.4582 79.4074 69.02C79.4074 64.5817 75.8094 60.9838 71.3712 60.9838C66.9329 60.9838 63.335 64.5817 63.335 69.02C63.335 73.4582 66.9329 77.0562 71.3712 77.0562Z"
                            fill="white"
                            stroke="#1B2124"
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                      <div className="mt-3 ">
                        <span className="Text_textNormal__eX6Yw font-semibold">
                          Your bag is empty
                        </span>
                      </div>
                      <div className="mt-1 mb-10">
                        <span className="Text_textNormal__eX6Yw font-medium">
                          Let's fill some fantastic products
                        </span>
                      </div>
                      <div className="mb-10">
                        <Link
                          href="/store"
                          className="bgEmerald text-white rounded px-6 py-3 font-medium"
                        >
                          Continue shopping
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  products.map((item) => {
                    const quantity = getQuantity(item.productId);
                    return (
                      <div key={item.productId} className="mb-4 cursor-pointer">
                        <div className="shadow-all-round rounded-[12px]">
                          <div className="flex flex-row w-full h-full overflow-hidden px-5 py-2 md:p-[15px] ">
                            <div className="flex items-center">
                              <Link
                                className="
                                    inline-block
                                rounded-[12px] bg-[#F2F2F2] p-1 lg:p-3
                                w-[100px] h-[100px] lg:w-[145px] lg:h-[145px]
                                "
                                href={`/store/${item.productSlug}`}
                              >
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.productThumbnail}`}
                                  alt={item.productThumbnailAlt}
                                  className="object-cover w-full h-full rounded-[12px]"
                                />
                              </Link>
                            </div>
                            <div className="flex flex-col justify-between lg:h-[145px] h-full w-full rounded-[12px]">
                              <div className=" w-full flex-col md:flex-row">
                                <Link href={`/store/${item.productSlug}`}>
                                  <div className="line-clamp-1 md:line-clamp-2">
                                    <span className="text-[12px] md:text-[18px] font-semibold">
                                      <span className="text-black">
                                        {item.productName}
                                      </span>
                                    </span>
                                  </div>
                                </Link>
                                <div className="flex-row flex body-1 ">
                                  <div className="flex flex-row items-center leading-[14px] font-medium caption-1">
                                    <span className="text-[10px] md:text-[12px] text-black font-semibold">
                                      Qty :
                                    </span>
                                    <span className="my-3 px-2 text">
                                      <button
                                        className="heading-5 py-1 rounded mr-2 shadow-xl  bgEmerald text-white px-1.5 md:px-2"
                                        onClick={() =>
                                          removeItemFromCart(item.productId)
                                        }
                                        disabled={quantity === 1}
                                      >
                                        -
                                      </button>
                                      <span className="text-[12px] md:text-[14px] text-black font-semibold">
                                        {quantity}
                                      </span>
                                      <button
                                        className="heading-5 py-1 rounded ml-2 shadow-xl  bgEmerald text-white px-1.5 md:px-2"
                                        onClick={() =>
                                          addItemToCart(
                                            item.productId,
                                            item.productDiscountPrice,
                                            item.productOriginalPrice
                                          )
                                        }
                                      >
                                        +
                                      </button>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="">
                                <div className="flex justify-between items-center h-full space-x-0 md:space-x-5">
                                  <span className=" flex items-center gap-2">
                                    <span className="text-[12px] md:text-[16px] font-bold text-black">
                                      <span className="text-black">
                                        ₹{item.productDiscountPrice}
                                      </span>
                                    </span>
                                    <span className="text-[12px] md:text-[16px] font-normal text-[#A1A3A4] ">
                                      <span className="text-gray-400 font-normal line-through">
                                        ₹{item.productOriginalPrice}
                                      </span>
                                    </span>
                                    <span className="text-[12px] md:text-[16px] font-semibold ">
                                      <span className="textEmerald">
                                        {Math.round(
                                          ((item.productOriginalPrice -
                                            item.productDiscountPrice) /
                                            item.productOriginalPrice) *
                                            100
                                        )}
                                        % OFF
                                      </span>
                                    </span>
                                  </span>
                                  <button
                                    onClick={() => openModal(item.productId)}
                                    className="md:mb-2 flex items-center"
                                  >
                                    <svg
                                      width={24}
                                      height={24}
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="scale-75  text-red-500  font-bold"
                                    >
                                      <path
                                        d="M3 6H21"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M10 11V17"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M14 11V17"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <span className="text-gary-500 text-[10px] mt-1 md:text-[12px] font-semibold">
                                      {" "}
                                      Remove
                                    </span>
                                  </button>
                                  <dialog id="my_modal_2" className="modal">
                                    <div className="modal-box rounded">
                                      <h3 className="font-bold text-xl">
                                        Remove Item
                                      </h3>
                                      <p className="py-4">
                                        You are about to remove this item. You
                                        cannot undo this action.
                                      </p>
                                      <div className="flex items-center w-full gap-2 ">
                                        <button
                                          className="btn w-1/2 btn-sm btn-outline"
                                          onClick={() =>
                                            document
                                              .getElementById("my_modal_2")
                                              .close()
                                          }
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className="btn btn-error text-white w-1/2 btn-sm"
                                          onClick={handleRemove}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </dialog>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          {products.length > 0 && (
            <div className="mt-0 lg:mt-4 flex h-fit justify-center lg:sticky lg:top-[130px] mb-4">
              <div className="w-[400px] max-w-[100vw] px-3 md:px-0">
                <div>
                  <div>
                    <div>
                      <div>
                        <div className="rounded-xl p-4 lg:p-6 shadow-all-round lg:pb-6 w-full transform">
                          <div className="pb-2 border-b mb-3">
                            <span className="Typography_heading6__f9EKE font-bold Typography_root__TxCor">
                              <span className="text-black">Order Details</span>
                            </span>
                          </div>
                          <div className="pb-3 flex justify-between space-x-2">
                            <span className="font-medium Typography_root__TxCor">
                              <span className="text-black text-[16px] leading-[24px]">
                                Products Total ({getCartItemsCount()} Items)
                              </span>
                            </span>
                            <span className="Typography_whitespaceNowrap__nm0U6 Typography_heading7__gujRQ font-semibold Typography_root__TxCor">
                              <span className="text-black text-[18px] leading-[28px]">
                                ₹{getCartTotal()}
                              </span>
                            </span>
                          </div>
                          <div className="pb-3 flex justify-between space-x-2">
                            <span className="font-medium Typography_root__TxCor">
                              <span className="text-black text-[16px] leading-[24px]">
                                Shipping Charges
                              </span>
                            </span>
                            <span className="Typography_whitespaceNowrap__nm0U6 Typography_heading7__gujRQ font-semibold Typography_root__TxCor">
                              <span className="text-green-500 text-[18px] leading-[28px]">
                                Free
                              </span>
                            </span>
                          </div>
                          <div className="pb-3 pt-2.5 flex justify-between border-t space-x-2">
                            <span className="Typography_heading7__gujRQ font-medium Typography_root__TxCor">
                              <span className="text-black mt-[2px] text-[18px] leading-[28px]">
                                Total Amount
                              </span>
                            </span>
                            <span className="Typography_whitespaceNowrap__nm0U6 Typography_heading6__f9EKE font-bold Typography_root__TxCor">
                              <span className="text-black text-[24px] leading-[32px]">
                                ₹{getCartTotal()}
                              </span>
                            </span>
                          </div>
                          <div className="w-full hidden lg:block">
                            <Link
                              href="/mybag/address"
                              className="w-full rounded inline-flex items-center justify-center py-1.5 bgEmerald text-white font-bold"
                            >
                              Next
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="fixed lg:hidden bg-white z-10 left-0 right-0 rounded-t-lg p-3 shadow-all-round-strong bottom-0">
                        <div className="space-x-2 flex ">
                          <div className="flex-1">
                            <span className="Typography_whitespaceNowrap__nm0U6 Typography_heading2__2HLSZ font-bold Typography_root__TxCor">
                              <span className="text-black">₹{getCartTotal()}</span>
                            </span>
                            <div>
                              <span className="text-sm underline text-blue font-semibold">
                                View Price Details
                              </span>
                            </div>
                          </div>
                          <div className="min-w-[160px]">
                            <Link href="/mybag/address" className="w-full inline-flex items-center justify-center py-1.5 bgEmerald text-white font-bold">
                              Next
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="w-full grid grid-cols-3 pt-3.5 pl-0 pb-8 mt-5 md:pl-2 md:pb-3.5 md:mt-8">
                      <div className="flex flex-col items-center gap-2.5 pr-3">
                        <img
                          src="https://static.pw.live/5eb393ee95fab7468a79d189/3be09d13-f274-4e8a-aea1-342d75d4a3f3.png"
                          loading="lazy"
                          alt="security"
                        />
                        <span className="text-[12px] font-semibold text-center text-greyish-black">
                          100% Safe &amp; Secure Payments
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-2.5 px-3">
                        <img
                          src="https://static.pw.live/5eb393ee95fab7468a79d189/29e47b20-c48e-480d-b1b1-98477ca15ef3.png"
                          loading="lazy"
                          alt="order"
                        />
                        <span className="text-[12px] font-semibold text-center text-greyish-black">
                          Easy Return And Replacements
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-2.5 pl-3">
                        <img
                          src="https://static.pw.live/5eb393ee95fab7468a79d189/4a693453-4d6c-4450-ad9b-0e9280288a3b.png"
                          loading="lazy"
                          alt="delivery"
                        />
                        <span className="text-[12px] font-semibold text-center text-greyish-black">
                          Trusted Shipping
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default bag;
