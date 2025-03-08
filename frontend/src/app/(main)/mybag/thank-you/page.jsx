"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import useProductContext from "@/context/ProductContext";
import Link from "next/link";
import { MdOutlineSmsFailed } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";

const thankYou = () => {
  const hasRun = useRef(false);
  const [currentConsumer, setCurrentConsumer] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("consumer"))
      : null
  );
  const {
    cartItems,
    getCartTotal,
    getCartItemsCount,
    getSingleItemCartTotal,
    getCartDelTotal,
    clearCart,
  } = useProductContext();

  console.log(currentConsumer);

  const params = useSearchParams();
  console.log(params);
  const platformfees = 10;

  const savePayment = async () => {
    try {
      const paymentDetails = await retrievePaymentIntent();
      const orderId = localStorage.getItem("orderId");
      const cartTotal = getCartTotal() + platformfees; // Assuming platformFees is defined
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

      console.log("Response Status:", response.status);
      console.log("Response Data:", responseData);
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
    console.log(response.status);
    const data = await response.json();
    console.log(data);
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
      <section className="py-40 relative bg-mate_black h-screen ">
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto ">
          <div>
            {params.get("redirect_status") === "succeeded" ? (
              <>
                <div className="flex justify-center  font-manrope font-bold text-6xl leading-10 font-Quicksand text-secondary items-center content-center">
                  <GiConfirmed className="text-green-500 mb-5 " />
                </div>
                <h2 className="font-manrope font-bold text-4xl leading-10 font-Quicksand text-secondary text-center">
                  Payment Successful
                </h2>
                <p className="mt-4 font-normal text-lg leading-8 text-secondary font-Quicksand mb-1 text-center">
                  Your order has been placed successfully.
                </p>
                <p className=" font-normal text-lg leading-8 text-secondary font-Quicksand mb-11 text-center">
                  We've sent a confirmation email to your email address.
                </p>
                <Link
                  href="/order-history"
                  className="flex justify-center font-manrope font-bold text-2xl leading-10 font-Quicksand text-secondary items-center content-center"
                >
                  Check Order History
                </Link>
              </>
            ) : (
              <>
                <div className="flex justify-center  font-manrope font-bold text-6xl leading-10 font-Quicksand text-secondary items-center content-center">
                  <MdOutlineSmsFailed className="text-red-500 mb-5 " />
                </div>
                <h2 className="font-manrope font-bold text-4xl leading-10 font-Quicksand text-secondary text-center">
                  Payment Failed
                </h2>
                <p className="mt-4 font-normal text-lg leading-8 text-secondary font-Quicksand mb-1 text-center">
                  Your payment was not successful. Please try again.
                </p>
                <p className=" font-normal text-lg leading-8 text-secondary font-Quicksand mb-11 text-center">
                  If the problem persists, please contact us.
                </p>
                <Link
                  href="/"
                  className="flex justify-center font-manrope font-bold text-2xl leading-10 font-Quicksand text-secondary items-center content-center"
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
