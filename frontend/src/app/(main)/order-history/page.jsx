"use client";
import useProductContext from "@/context/ProductContext";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
const OrderHistory = () => {
  const [currentConsumer, setCurrentConsumer] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentConsumer(JSON.parse(localStorage.getItem("consumer")) || null);
    }
  }, []);

  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/web/order/getbyid/${currentConsumer.consumerId}`,
      {
        headers: {
          "x-auth-token": currentConsumer.token,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    setPaymentData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (currentConsumer) {
      fetchPaymentHistory();
    }
  }, [currentConsumer]); // Run only when currentConsumer is set

  const {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    isInCart,
    getCartTotal,
    getCartItemsCount,
    getSingleItemCartTotal,
  } = useProductContext();

  const params = useSearchParams();
  // console.log(params);
  const orderId = `ORD-${uuidv4().split("-")[0]}`;
  const shippingPrice = 40;
  return (
    <>
      <div className="container mx-auto my-5 max-w-4xl p-4">
        <h2 className="text-center text-2xl font-bold mb-4">Order History</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : paymentData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentData.map((order) => (
              <div
                key={order.orderHistoryId}
                className="border p-4 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Order ID: #{orderId}
                  </h3>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center text-sm">
                  <p>
                    <i className="fas fa-calendar-days"></i>{" "}
                    {order.orderTime
                      ? new Date(order.orderTime * 1000).toLocaleString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : ""}
                  </p>
                  <p className="font-semibold">
                    Rs. {order.orderDiscountTotalAmount}
                  </p>
                </div>
                <hr className="my-2" />
                <button
                  className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700"
                  data-order-id={order.orderId}
                >
                  View Invoice
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No orders found.</p>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
