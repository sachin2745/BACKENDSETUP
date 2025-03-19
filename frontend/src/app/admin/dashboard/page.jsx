"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    blogs: 0,
    categories: 0,
    users: 0,
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/getCounts`
        );
        const data = await response.json();
        setCounts({
          blogs: data.blogsCount,
          orders: data.orderCount,
          consumers: data.consumersCount,
        });
        //   console.log("Fetched Data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [orderHistory, setOrderHistory] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/order-history-data/getall`
      ); // Making GET request to the API endpoint
      const data = response.data; // Extracting the data from the response
      // console.log(data);

      // Setting the state with the fetched data
      setOrderHistory(data);
    } catch (err) {
      console.log(err.message); // Catching any error and setting the error state
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="py-2  min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[url('/green.webp')] shadow-md border  rounded-lg p-3 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="ml-4">
              <h2 className="font-semibold text-4xl text-white mb-2">
                {counts.consumers}
              </h2>
              <p className="text-white font-bold text-lg">Total Consumers</p>
            </div>
            <div className="bg-white p-3 rounded-full">
              <img src="/users.png" alt="Users Icon" className="w-16 h-16" />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <Link
          href="/admin/order-history"
          className="bg-[url('/green.webp')] shadow-md border  rounded-lg p-3 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="ml-4">
              <h2 className="font-semibold text-4xl text-white mb-2">
                {counts.orders}{" "}
              </h2>
              <p className="text-white font-bold text-lg">Total Orders</p>
            </div>
            <div className="bg-white p-3 rounded-full">
              <img src="/cat.png" alt="Users Icon" className="w-14 h-14" />
            </div>
          </div>
        </Link>

        {/* Blog Card */}
        <Link
          href="/admin/blog"
          className="bg-[url('/green.webp')] shadow-md border  rounded-lg p-3 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="ml-4">
              <h2 className="font-semibold text-4xl text-white mb-2">
                {counts.blogs}
              </h2>
              <p className="text-white font-bold text-lg">Total Blogs</p>
            </div>
            <div className="bg-white p-3 rounded-full">
              <img src="/blog.png" alt="Users Icon" className="w-16 h-16" />
            </div>
          </div>
        </Link>
      </div>

      <div className="overflow-hidden mt-10 rounded-lg border border-gray-200 bg-[url('/green.webp')] shadow-md px-6 pb-4 pt-5 sm:px-4">
        <div className="flex flex-col gap-2 mb-5 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-bold text-white">Recent Orders</h3>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg">
          <table className="min-w-full table rounded-lg border-collapse cursor-pointer">
            <thead className="bg-gray-100 border-b ">
              <tr>
                {[
                  "S.No.",
                  "Consumers",
                  "Products",
                  "Quantity",
                  "Price",
                  "Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="pl-4  text-left text-sm font-semibold text-gray-700"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orderHistory.length > 0 ? (
                orderHistory.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className=" text-sm text-gray-900 font-medium">{index + 1}.</td>
                    <td className="text-sm text-gray-900 font-semibold">
                      {order.orderName} ({order.orderMobile})
                    </td>

                    <td className=" pl-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-16 overflow-hidden  border border-gray-140">
                          <img
                            alt={order.productThumbnailAlt}
                            loading="lazy"
                            width={80}
                            height={60}
                            className="h-14 w-16 object-cover bg-gray-100"
                            src={`${process.env.NEXT_PUBLIC_API_URL}${order.productThumbnail}`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 ">
                            {order.productName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="text-sm text-gray-600 font-medium text-center">
                      {order.opQuantity}
                    </td>
                    <td className=" text-sm font-medium text-gray-800">
                      Rs.{order.orderDiscountTotalAmount}
                    </td>
                    <td className="">
                      <span
                        className={`px-3 py-1 rounded-lg-md text-xs font-bold rounded text-white inline-block ${
                          order.orderHistoryStatus === 1
                            ? "bg-blue-500"
                            : order.orderHistoryStatus === 2
                            ? "bg-yellow-500"
                            : order.orderHistoryStatus === 3
                            ? "bg-orange-500"
                            : order.orderHistoryStatus === 4
                            ? "bg-green-500"
                            : order.orderHistoryStatus === 5
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {order.orderHistoryStatus === 1
                          ? "New"
                          : order.orderHistoryStatus === 2
                          ? "Confirm"
                          : order.orderHistoryStatus === 3
                          ? "On the Way"
                          : order.orderHistoryStatus === 4
                          ? "Completed"
                           : order.orderHistoryStatus === 5
                          ? "Cancelled"
                          : "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
