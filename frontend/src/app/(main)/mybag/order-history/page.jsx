"use client";
import useProductContext from "@/context/ProductContext";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
const OrderHistory = () => {
  const [currentConsumer, setCurrentConsumer] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentConsumer(JSON.parse(localStorage.getItem("consumer")) || null);
    }
  }, []);

  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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
  const shippingPrice = 40;

  const fetchInvoice = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/web/invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            consumerId: currentConsumer.consumerId,
          }),
        }
      );

      const result = await response.json();

      console.log(result);

      if (result.status === "success") {
        setInvoiceData(result.data);
        setIsOpen(true);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      alert("Failed to load invoice. Try again.");
    }
  };

  return (
    <>
      <div className="container mx-auto my-5 max-w-7xl p-4 font-RedditSans">
        <h2 className="text-center text-3xl font-bold mb-4">Order History</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : paymentData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentData.map((order) => (
              <div
                key={order.orderHistoryId}
                className="border-2 border-b-4 border-gray-300 p-4 rounded hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Order ID: #{order.orderHistoryId}
                  </h3>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center text-sm my-4">
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
                  className="w-full bg-spaceblack hover:bg-white text-white py-2 rounded-md hover:text-black hover:border-2 hover:border-black transition duration-300 ease-in-out font-bold uppercase text-sm"
                  onClick={() => fetchInvoice(order.orderId)}
                >
                  View Invoice
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 space-y-4 text-gray-600">
            <img src="/empty.webp" alt="Empty Image" className="h-40 w-4h-40" />
            <p className="text-xl font-semibold">No orders found.</p>
            <Link
              href="/store"
              className="px-4 py-2 textEmerald bg-white border-2 border-b-4 border-emerald-400  rounded font-bold"
            >
              ADD ITEMS FROM STORE
            </Link>
          </div>
        )}
      </div>

      {/* Modal */}
      {isOpen && invoiceData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-RedditSans">
          <div className="relative bg-white p-6 rounded-lg max-w-xl shadow-lg text-quaternary">
            <button
              className="absolute  top-6 right-6 text-gray-900 transform hover:scale-110 transition duration-300 ease-in-out"
              onClick={() => setIsOpen(false)}
            >
              <IoMdCloseCircle className="text-xl" />
            </button>
            <h3 className="text-lg font-bold mb-4 border-b-2">
              Invoice Details
            </h3>
            <div className="flex justify-between text-xs mb-2 leading-relaxed">
              <p>
                <strong>Order ID:</strong> #{invoiceData[0].orderHistoryId}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(invoiceData[0].orderTime * 1000)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/ /g, "-")}{" "}
                {new Date(invoiceData[0].orderTime * 1000).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
              </p>
            </div>
            <div className="flex justify-between text-xs mb-2 leading-relaxed">
              <p>
                <strong>Name:</strong> {invoiceData[0].orderName}
              </p>
              <p>
                <strong>Address:</strong> {invoiceData[0].orderBillingAddress}
              </p>
            </div>
            <div className="flex justify-between text-xs mb-2 leading-relaxed">
              <p>
                <strong>Mobile:</strong> {invoiceData[0].orderMobile}
              </p>
              <p>
                <strong>Location :</strong> {invoiceData[0].odCity},{" "}
                {invoiceData[0].odState}
              </p>
            </div>
            <div className="flex justify-between text-xs mb-2 leading-relaxed">
              <p>
                <strong>Status:</strong>{" "}
                {(() => {
                  const statusMap = {
                    1: "New Order",
                    2: "Confirm",
                    3: "On the Way",
                    4: "Completed",
                  };
                  return (
                    statusMap[invoiceData[0].orderHistoryStatus] || "Unknown"
                  );
                })()}
              </p>

              <p>
                <strong>Delivered by:</strong>{" "}
                {invoiceData[0].orderDeliveryTime === 0
                  ? "Waiting for confirmation"
                  : new Date(
                      invoiceData[0].orderDeliveryTime * 1000
                    ).toLocaleDateString()}
              </p>
            </div>

            {/* Table for products */}
            <table className="w-full mt-4 border text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2">S.No</th>
                  <th className="border px-2">Item</th>
                  <th className="border px-2">Price</th>
                  <th className="border px-2">Qty</th>
                  <th className="border px-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.map((item, index) => (
                  <tr key={index} className="text-start">
                    <td className="border px-2 font-bold">{index + 1}</td>
                    <td className="border px-2 font-medium">
                      {item.productName}
                    </td>
                    <td className="border px-2">
                      ₹{item.productDiscountPrice}
                    </td>
                    <td className="border px-2">{item.opQuantity}</td>
                    <td className="border px-2">
                      ₹{item.opDiscountPrice * item.opQuantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Table */}
            <table className="w-full flex justify-end mt-4  text-xs">
              <tbody>
                <tr>
                  <td className="border px-4 py-1.5 font-semibold">
                    Sub Total
                  </td>
                  <td className="border px-4 py-1.5 text-left font-normal">
                    ₹
                    {invoiceData.reduce(
                      (total, item) =>
                        total + item.opDiscountPrice * item.opQuantity,
                      0
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-1.5 font-semibold">
                    Platform Fees
                  </td>
                  <td className="border px-4 py-1.5 text-left font-normal">
                    ₹10
                  </td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="border px-4 py-1.5">Grand Total</td>
                  <td className="border px-4 py-1.5 text-left font-semibold">
                    ₹
                    {invoiceData.reduce(
                      (total, item) =>
                        total + item.opDiscountPrice * item.opQuantity,
                      0
                    ) + 10}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderHistory;
