"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import useProductContext from "@/context/ProductContext";
import Link from "next/link";
import { MdOutlineSmsFailed } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { useCoupon } from "@/context/CouponContext";

const thankYou = () => {
  const hasRun = useRef(false);
  const [currentConsumer, setCurrentConsumer] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("consumer"))
      : null
  );
    const { coupon, applyCoupon, removeCoupon } = useCoupon();
  
  const {
    cartItems,
    getCartTotal,
    getCartItemsCount,
    getSingleItemCartTotal,
    getCartDelTotal,
    clearCart,
  } = useProductContext();

  // console.log(currentConsumer);

  const params = useSearchParams();
  // console.log(params);
  const platformfees = 10;

  const savePayment = async () => {
    try {
      const paymentDetails = await retrievePaymentIntent();
      const orderId = localStorage.getItem("orderId");
      const cartTotal = getCartTotal() + platformfees - (coupon?.discount || 0); // Assuming platformFees is defined
      const cartDelTotal = getCartDelTotal();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/web/order/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            consumer: currentConsumer.consumerId,
            items: cartItems,
            details: paymentDetails,
            intentId: params.get("payment_intent"),
            shipping: JSON.parse(sessionStorage.getItem("shipping")),
            orderId,
            cartTotal,
            cartDelTotal,
          }),
        }
      );

      const responseData = await response.json(); // Parse JSON response

      // console.log("Response Status:", response.status);
      // console.log("Response Data:", responseData);
      // console.log("Request Payload:", JSON.stringify({
      //   consumer: currentConsumer.consumerId,
      //   items: cartItems,
      //   details: paymentDetails,
      //   intentId: params.get("payment_intent"),
      //   shipping: JSON.parse(sessionStorage.getItem("shipping")),
      // }));
      if (response.status === 200) {
        localStorage.removeItem("cartItems");
        sessionStorage.removeItem("shipping");

        localStorage.removeItem("orderId"); // Clear after use

        clearCart();
        removeCoupon();
      }
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  const retrievePaymentIntent = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/retrieve-payment-intent`,
      {
        method: "POST",
        body: JSON.stringify({ paymentIntentId: params.get("payment_intent") }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(response.status);
    const data = await response.json();
    // console.log(data);
    return data;
  };

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      if (
        params.get("redirect_status") === "succeeded" &&
        sessionStorage.getItem("shipping")
      ) {
        savePayment();
      }
    }
  }, []);

  return (
    <>
      <section className="py-40 relative bg-white h-screen font-RedditSans">
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto ">
          <div>
            {params.get("redirect_status") === "succeeded" ? (
              <>
                <div className="flex justify-center items-center">
                  <GiConfirmed className="text-emerald-500 text-7xl mb-4" />
                </div>
                <h2 className=" font-bold text-5xl textEmerald text-center">
                  Payment Successful
                </h2>
                <p className="mt-4  text-xl font-semibold text-black text-center">
                  Your order has been placed successfully.
                </p>
                <p className="mt-1  text-md font-medium text-gray-500 text-center">
                  A confirmation email has been sent to your registered email.
                </p>
                <div className="flex justify-center mt-8">
                  <Link
                    href="/mybag/order-history"
                    className="bg-white font-bold textEmerald border-2 border-b-4 border-emerald-500   text-lg px-6 py-2 rounded uppercase "
                  >
                    View Order History
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center   font-bold text-6xl leading-10 text-secondary items-center content-center">
                  <MdOutlineSmsFailed className="text-red-500 mb-5 " />
                </div>
                <h2 className=" font-bold text-4xl leading-10 text-secondary text-center">
                  Payment Failed
                </h2>
                <p className="mt-4 font-semibold text-lg leading-8 text-black mb-1 text-center">
                  Your payment was not successful. Please try again.
                </p>
                <p className=" font-medium text-lg leading-8 text-gray-500 mb-11 text-center">
                  If the problem persists, please contact us.
                </p>
                <Link
                  href="/"
                  className="flex justify-center  font-bold text-2xl leading-10 text-secondary items-center content-center"
                >
                  Go to Home
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default thankYou;
