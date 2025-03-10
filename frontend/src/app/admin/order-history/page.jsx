"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCheck } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/order-history/getall`
      ); // Making GET request to the API endpoint
      // console.log(response.data);
      const data = response.data; // Extracting the data from the response

      // Setting the state with the fetched data
      setOrderHistory(data);
    } catch (err) {
      console.log(err.message); // Catching any error and setting the error state
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (orderHistory.length > 0) {
      const table = $("#example1").DataTable({
        responsive: true,
        destroy: true,
        dom: "Bfrtip",
        buttons: ["copy", "csv", "excel", "pdf", "print"],
        pageLength: 10,
        language: {
          searchPlaceholder: "...",
          paginate: {
            previous: "<",
            next: ">",
          },
        },
        pagingType: "simple_numbers",
      });
    }
  }, [orderHistory]);

  const [invoiceData, setInvoiceData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchInvoice = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/invoice/getById`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId
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
      <div className="">
        <nav className="flex gap-x-1">
          <button
            className={`py-2 px-1 inline-flex items-center gap-x-2 border-b-2  text-sm whitespace-nowrap  hover:text-emerald-500 focus:outline-none focus:text-emerald-500 ${
              activeTab === 0
                ? "font-semibold border-emerald-500 text-emerald-500"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(0)}
            aria-selected={activeTab === 0}
          >
            Order History List
          </button>
        </nav>
      </div>

      <div className="mt-3">
        <div
          id="tabs-with-underline-1"
          role="tabpanel"
          className={`${activeTab === 0 ? "" : "hidden"}`}
          aria-labelledby="tabs-with-underline-item-1"
        >
          <div className="bg-white border shadow-md rounded p-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
              Manage Order History's
            </h3>

            <table id="example1" className="display  nowwrap w-full table-auto">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Order Id</th>
                  <th>Name</th>
                  <th>Mobile No.</th>
                  <th>Order Time</th>
                  <th>Delivery Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center p-3 font-semibold">
                      No available data
                    </td>
                  </tr>
                ) : (
                  orderHistory.map((item, index) => (
                    <tr key={item.orderId}>
                      <td>{orderHistory.indexOf(item) + 1}</td>

                      <td>#{item.orderId}</td>
                      <td
                        className="textEmerald font-medium hover:font-bold transition duration-300 ease-linear cursor-pointer"
                        onClick={() => fetchInvoice(item.orderId)}
                      >
                        {item.orderName}
                      </td>
                      <td>{item.orderMobile}</td>
                      <td>
                        {new Date(item.orderTime * 1000)
                          .toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace(",", "")}
                      </td>
                      <td>
                        {item.orderDeliveryTime
                          ? new Date(item.orderDeliveryTime * 1000)
                              .toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                              .replace(",", "")
                          : "N/A"}
                      </td>

                      <td>Rs.{item.orderDiscountTotalAmount}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded text-white text-sm font-medium ${
                            item.orderHistoryStatus === 1
                              ? "bg-blue-500" // New
                              : item.orderHistoryStatus === 2
                              ? "bg-yellow-500" // Confirm
                              : item.orderHistoryStatus === 3
                              ? "bg-orange-500" // On the Way
                              : item.orderHistoryStatus === 4
                              ? "bg-green-500" // Completed
                              : "bg-gray-500" // Default
                          }`}
                        >
                          {item.orderHistoryStatus === 1
                            ? "New"
                            : item.orderHistoryStatus === 2
                            ? "Confirm"
                            : item.orderHistoryStatus === 3
                            ? "On the Way"
                            : item.orderHistoryStatus === 4
                            ? "Completed"
                            : "Unknown"}
                        </span>
                      </td>

                      <td>
                        <div className="dropdown dropdown-hover font-RedditSans">
                          <div
                            tabIndex={0}
                            role="button"
                            className=" py-1.5 px-2 inline-flex mb-1 items-center gap-x-2 text-sm font-medium rounded border-2 border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                          >
                            Action
                            <svg
                              className="hs-dropdown-open:rotate-180 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-md  z-[1] min-w-24 p-2 shadow"
                          >
                            <li className=" rounded">
                              <button className="hover:bg-emerald-200 ">
                                Edit
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isOpen && invoiceData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-RedditSans cursor-pointer">
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
                <strong>Address:</strong> {invoiceData[0].orderBillingAddress}, {invoiceData[0].odPincode}
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
                <span
                  className="font-semibold"
                  style={{
                    color:
                      invoiceData[0].orderHistoryStatus === 1
                        ? "blue"
                        : invoiceData[0].orderHistoryStatus === 2
                        ? "orange"
                        : invoiceData[0].orderHistoryStatus === 3
                        ? "purple"
                        : invoiceData[0].orderHistoryStatus === 4
                        ? "green"
                        : "red",
                  }}
                >
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
                </span>
              </p>

              <p>
                <strong>Delivered by:</strong>{" "}
                <span
                  style={{
                    color:
                      invoiceData[0].orderDeliveryTime !== 0
                        ? "green"
                        : "inherit",
                  }}
                >
                  {invoiceData[0].orderDeliveryTime === 0
                    ? "Waiting for confirmation"
                    : new Date(
                        invoiceData[0].orderDeliveryTime * 1000
                      ).toLocaleDateString()}
                </span>
              </p>
            </div>

            {/* Table for products */}
            <table className="w-full mt-4 border ">
              <thead>
                <tr className="bg-gray-100 text-xs">
                  <th className="border px-2">S.No</th>
                  <th className="border px-2">Item</th>
                  <th className="border px-2">Price</th>
                  <th className="border px-2">Qty</th>
                  <th className="border px-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.map((item, index) => (
                  <tr key={index} className="text-start text-xs">
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
            <table className="  w-full mt-4  ">
              <tbody>
                <tr>
                  <td className="border px-4 py-1.5 font-semibold text-xs">
                    Sub Total
                  </td>
                  <td className="border px-4 py-1.5 text-left font-normal text-xs">
                    ₹
                    {invoiceData.reduce(
                      (total, item) =>
                        total + item.opDiscountPrice * item.opQuantity,
                      0
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-1.5 font-semibold text-xs">
                    Platform Fees
                  </td>
                  <td className="border px-4 py-1.5 text-left font-normal text-xs">
                    ₹10
                  </td>
                </tr>
                <tr className="bg-gray-100 font-bold text-xs">
                  <td className="border px-4 py-1.5 text-xs">Grand Total</td>
                  <td className="border px-4 py-1.5 text-left font-semibold text-xs">
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
