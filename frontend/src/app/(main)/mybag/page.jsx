"use client";
import useProductContext from "@/context/ProductContext";
import React, { useEffect, useState } from "react";
import { ImHome3 } from "react-icons/im";

const bag = () => {
  const {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    isInCart,
    getCartTotal,
    getCartItemsCount,
    removeoneitem,
    getSingleItemCartTotal,
  } = useProductContext();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchCartProducts();
    }
  }, [cartItems]);

  const fetchCartProducts = async () => {
    try {
      const productIds = cartItems.map((item) => item.productId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/web/cart-products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch cart products");

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching cart products:", error);
    }
  };

  const getQuantity = (productId) => {
    const item = cartItems.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
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
                  <div className="text-center p-6">
                    <h2 className="text-lg font-semibold">Your bag is empty</h2>
                    <p className="text-gray-500">
                      Let's fill it with some fantastic products!
                    </p>
                    <a
                      href="/shop"
                      className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Continue Shopping
                    </a>
                  </div>
                ) : (
                  products.map((item) => {
                    const quantity = getQuantity(item.productId);
                    return (
                      <div key={item.productId} className="mb-4 cursor-pointer">
                        <div className="shadow-all-round rounded-[12px]">
                          <div className="flex flex-row w-full h-full overflow-hidden p-[15px] gap-[24px]">
                            <div className="flex items-center">
                              <a
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
                              </a>
                            </div>
                            <div className="flex flex-col justify-between lg:h-[145px] h-full w-full rounded-[12px]">
                              <div className="flex justify-between w-full flex-col md:flex-row">
                                <a href="/products/lakshya-neet-class-12-pcb-combo-2025">
                                  <div className="line-clamp-2">
                                    <span className="Typography_heading6__f9EKE font-semibold Typography_root__TxCor">
                                      <span className="text-black">
                                        {item.productName}
                                      </span>
                                    </span>
                                  </div>
                                </a>
                                <span className="pl-0 md:pl-6">
                                  <span className="Typography_whitespaceNowrap__nm0U6 Typography_heading6__f9EKE font-bold Typography_root__TxCor">
                                    <span className="text-black">
                                      ₹
                                      {getSingleItemCartTotal(
                                        item.productId,
                                        item.productDiscountPrice
                                      )}
                                    </span>
                                  </span>
                                </span>
                              </div>
                              <div className="flex mt-0 font-medium body-2 leading-[16px] opacity-[0.9]">
                                <div className="flex-row flex body-1 block md:hidden ">
                                  <div className="flex flex-col items-start leading-[14px] font-medium caption-1">
                                    <span className="text-[12px] text-lightblack font-semibold">
                                      Quantity :
                                    </span>
                                    <span className="my-2 text">
                                      <button className="heading-5 py-1 rounded-md mr-2 shadow-[#00000029] text-lightblack bg-[#F8F8F8] px-2">
                                        -
                                      </button>
                                      <span className="Text_p3__qQysT Text_medium__uSYmH">
                                        {item.quantity}
                                      </span>
                                      <button className="heading-5 py-1 rounded-md ml-2 shadow-[#00000029] text-lightblack bg-[#F8F8F8] px-2">
                                        +
                                      </button>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="hidden md:block">
                                <div className="flex h-full space-x-0 md:space-x-5">
                                  <div className="flex-row flex body-1 hidden md:block ">
                                    <div className="flex flex-col items-start leading-[14px] font-medium caption-1">
                                      <span className="text-[12px] text-lightblack font-semibold">
                                        Quantity :
                                      </span>
                                      <span className="my-2 text">
                                        <button
                                          className="heading-5 py-1 rounded-md mr-2 shadow-[#00000029] text-lightblack bg-[#F8F8F8] px-2"
                                          onClick={() =>
                                            removeItemFromCart(item.productId)
                                          }
                                          disabled={quantity === 0}
                                        >
                                          -
                                        </button>
                                        <span className="Text_p3__qQysT Text_medium__uSYmH">
                                          {quantity}
                                        </span>
                                        <button
                                          className="heading-5 py-1 rounded-md ml-2 shadow-[#00000029] text-lightblack bg-[#F8F8F8] px-2"
                                          onClick={() => addItemToCart(item.productId)}
                                        >
                                          +
                                        </button>
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    active=""
                                    data-variant="naked"
                                    className="Button_root__G_l9X Button_naked__xwcQp self-end md:mb-2 flex "
                                  >
                                    <svg
                                      width={24}
                                      height={24}
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="scale-75 mr-2 text-primary text-darkGrey font-bold"
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
                                    <span className="text-darkGrey">
                                      Remove
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="block md:hidden px-4 pb-4">
                            <div className="flex h-full space-x-0 md:space-x-5">
                              <div className="flex-row flex body-1 hidden md:block ">
                                <div className="flex flex-col items-start leading-[14px] font-medium caption-1">
                                  <span className="text-[12px] text-lightblack font-semibold">
                                    Quantity :
                                  </span>
                                  <span className="my-2 text">
                                    <button className="heading-5 py-1 rounded-md mr-2 shadow-[#00000029] text-lightblack bg-[#F8F8F8] px-2">
                                      -
                                    </button>
                                    <span className="Text_p3__qQysT Text_medium__uSYmH">
                                      1
                                    </span>
                                    <button className="heading-5 py-1 rounded-md ml-2 shadow-[#00000029] text-lightblack bg-[#F8F8F8] px-2">
                                      +
                                    </button>
                                  </span>
                                </div>
                              </div>
                              <button
                                active=""
                                data-variant="naked"
                                className="Button_root__G_l9X Button_naked__xwcQp self-end md:mb-2 flex "
                              >
                                <svg
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="scale-75 mr-2 text-primary text-darkGrey font-bold"
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
                                <span className="text-darkGrey">Remove</span>
                              </button>
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
                              Products Total (1 Items)
                            </span>
                          </span>
                          <span className="Typography_whitespaceNowrap__nm0U6 Typography_heading7__gujRQ font-semibold Typography_root__TxCor">
                            <span className="text-black text-[18px] leading-[28px]">
                              ₹2,749
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
                              ₹2,749
                            </span>
                          </span>
                        </div>
                        <div className="w-full hidden lg:block">
                          <button className="w-full rounded inline-flex items-center justify-center py-1.5 bgEmerald text-white font-bold">
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="fixed lg:hidden bg-white z-10 left-0 right-0 rounded-t-lg p-3 shadow-all-round-strong bottom-0">
                      <div className="space-x-2 flex ">
                        <div className="flex-1">
                          <span className="Typography_whitespaceNowrap__nm0U6 Typography_heading2__2HLSZ font-bold Typography_root__TxCor">
                            <span className="text-black">₹2,749</span>
                          </span>
                          <div>
                            <span className="text-sm underline text-blue font-semibold">
                              View Price Details
                            </span>
                          </div>
                        </div>
                        <div className="min-w-[160px]">
                          <button className="w-full inline-flex items-center justify-center py-1.5 bgEmerald text-white font-bold">
                            Next
                          </button>
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
        </div>
      </div>
    </div>
  );
};

export default bag;
