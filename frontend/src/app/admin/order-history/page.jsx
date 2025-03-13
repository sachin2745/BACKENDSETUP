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
            orderId,
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

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const openModal = (orderId) => {
    setSelectedOrderId(orderId); // Store the order ID
    document.getElementById("my_modal_3").showModal(); // Open modal
  };
  const handleSave = async (orderId) => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    // Convert date to Unix timestamp
    const unixTimestamp = Math.floor(new Date(selectedDate).getTime() / 1000);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/setDeliveryTime`,
        {
          orderId: selectedOrderId,
          orderDeliveryTime: unixTimestamp,
        }
      );

      if (response.data.success) {
        toast.success("Delivery time set successfully!");
        document.getElementById("my_modal_3").close();
        fetchData();
      } else {
        toast.error("Error setting delivery time");
      }
    } catch (error) {
      console.error("Error updating delivery time:", error);
      toast.error("Failed to update delivery time");
    }
  };

  const [selectedStatus, setSelectedStatus] = useState(1);

  const statuses = [
    { id: 1, label: "New", color: "bg-blue-500" },
    { id: 2, label: "Confirm", color: "bg-green-500" },
    { id: 3, label: "On the Way", color: "bg-yellow-500" },
    { id: 4, label: "Completed", color: "bg-gray-500" },
  ];

  const openModalTwo = (orderId) => {
    setSelectedOrderId(orderId);
    document.getElementById("order_status_modal").showModal();
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/update-order-status`,
        {
          orderId: selectedOrderId,
          orderHistoryStatus: selectedStatus,
        }
      );

      // console.log(response.data);
      toast.success("Order status updated successfully!");
      document.getElementById("order_status_modal").close();
      fetchData();
    } catch (error) {
      console.error("Error updating order status:", error);
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
                  <th>Delivery Date</th>
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
                        <div className="dropdown dropdown-hover dropdown-end font-RedditSans">
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
                            className="dropdown-content menu bg-base-100 rounded-md text-xs font-semibold  z-[1] min-w-40 p-1 shadow"
                          >
                            <li className=" rounded">
                              <button
                                onClick={() => openModalTwo(item.orderId)}
                                className="hover:bg-emerald-200 "
                              >
                                Update Order Status
                              </button>
                            </li>
                            <li className=" rounded">
                              <button
                                onClick={() => openModal(item.orderId)}
                                className="hover:bg-emerald-200"
                              >
                                Set Delivery Time
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

      {/* FOR VIEW INVOICE */}
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
                <strong>Address:</strong> {invoiceData[0].orderBillingAddress},{" "}
                {invoiceData[0].odPincode}
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
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
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
                <tr>
                  <td className="border px-4 py-1.5 font-semibold text-xs">
                    {invoiceData[0].orderCoupenDiscountAmt
                      ? "Coupon Discount"
                      : ""}
                  </td>
                  <td className="border px-4 py-1.5 text-left text-emerald-500 font-normal text-xs">
                    {invoiceData?.[0]?.orderCoupenDiscountAmt
                      ? `- ₹${invoiceData[0].orderCoupenDiscountAmt}`
                      : ""}
                  </td>
                </tr>
                <tr className="bg-gray-100 font-bold text-xs">
                  <td className="border px-4 py-1.5 text-xs">Grand Total</td>
                  <td className="border px-4 py-1.5 text-left font-semibold">
                    ₹{invoiceData[0].orderDiscountTotalAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal FOR SET DELIVERY DATE */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box rounded font-RedditSans">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Set Delivery Time</h3>
          <input
            type="date"
            className="border p-2 w-full mt-2 rounded"
            min={new Date().toISOString().split("T")[0]} // Prevent past dates
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button
            className="bgEmerald py-1.5 rounded font-bold uppercase text-white mt-4 w-full"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </dialog>

      {/* MODAL FOR UPDATE ORDER STATUS */}
      <dialog id="order_status_modal" className="modal">
        <div className="modal-box font-RedditSans rounded">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Update Order Status</h3>
          <div className="flex justify-center gap-4 my-4">
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`w-32 h-10 flex items-center font-semibold justify-center rounded text-white ${
                  selectedStatus === status.id
                    ? `${status.color} ring-2 ring-offset-2 ring-offset-white`
                    : "bg-gray-400 "
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={handleSubmit}
              className="bgEmerald text-white font-bold uppercase px-4 py-1.5 rounded "
            >
              Submit
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default OrderHistory;
