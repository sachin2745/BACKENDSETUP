"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCheck } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format as dateFormat } from "date-fns";

const Coupen = () => {
  const [coupons, setCoupons] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/coupon/getall`
      ); // Making GET request to the API endpoint
      // console.log(response.data);
      const data = response.data; // Extracting the data from the response

      setCoupons(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.log(err.message); // Catching any error and setting the error state
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (coupons.length > 0) {
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
  }, [coupons]);

  // Toggle user status
  const handleToggle = (coupenId, currentStatus) => {
    const newStatus = currentStatus == 0 ? 1 : 0; // Toggle between 0 (active) and 1 (inactive)

    // Update the status in the backend
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/coupon-status/${coupenId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coupenStatus: newStatus }),
      }
    )
      .then((res) => {
        if (res.ok) {
          setCoupons((prevData) =>
            prevData.map((coup) =>
              coup.coupenId == coupenId
                ? { ...coup, coupenStatus: newStatus }
                : coup
            )
          );
          toast.success("Successfully status updated!");
        } else {
          toast.error("Failed to update coupon status!");
        }
      })
      .catch((err) => toast.error("Error updating status:", err));
  };

  // State to track the user being edited
  const [editSortBy, setEditSortBy] = useState(null); // To track the user being edited
  const [newSortBy, setNewSortBy] = useState(""); // To track the new Sort By value

  // Function to handle Sort By Edit
  const handleSortByEdit = (coupenId, currentSortBy) => {
    setEditSortBy(coupenId); // Enable editing mode for the specific user
    setNewSortBy(currentSortBy); // Pre-fill the input with the current value
  };

  //Function to handle Sort By Submit
  const handleSortBySubmit = (coupenId) => {
    // Update the Sort By value in the backend
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/coupon-status/${coupenId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ couponSortBy: newSortBy }),
      }
    )
      .then((res) => {
        if (res.ok) {
          setCoupons((prevData) =>
            prevData.map((coup) =>
              coup.coupenId === coupenId
                ? { ...coup, couponSortBy: newSortBy }
                : coup
            )
          );
          setEditSortBy(null); // Exit editing mode
          toast.success("Sort By updated successfully!");
          //reload page
          // window.location.reload();
          // Instead of reloading the page, just refresh data
          fetchData();
        } else {
          toast.error("Failed to update Sort By!");
        }
      })
      .catch((err) => toast.error("Error updating Sort By:", err));
  };

  //Add blog
  const userForm = useFormik({
    initialValues: {
      coupenCode: "",
      coupenDesc: "",
      coupenMinAmount: "",
      coupenMaximumAmt: "",
      coupenDiscountAmt: "",
      coupenType: "",
      coupenValidTill: "",
    },
    validationSchema: Yup.object({
      coupenCode: Yup.string().required("Coupon Code is required"),
      coupenDesc: Yup.string().required("Coupon Description is required"),
      coupenMinAmount: Yup.number()
        .positive("Minimum amount must be positive")
        .required("Minimum amount is required"),
      coupenMaximumAmt: Yup.number()
        .positive("Maximum discount must be positive")
        .nullable(),
      coupenDiscountAmt: Yup.number()
        .positive("Discount must be positive")
        .required("Discount amount is required"),
      coupenType: Yup.string()
        .oneOf(["1", "2"], "Invalid discount type")
        .required("Discount type is required"),
      coupenValidTill: Yup.date().required("Valid Till date is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("coupenCode", values.coupenCode);
      formData.append("coupenDesc", values.coupenDesc);
      formData.append("coupenMinAmount", values.coupenMinAmount);
      if (values.coupenMaximumAmt) {
        formData.append("coupenMaximumAmt", values.coupenMaximumAmt);
      }
      formData.append("coupenDiscountAmt", values.coupenDiscountAmt);
      formData.append("coupenType", values.coupenType);
      formData.append(
        "coupenValidTill",
        Math.floor(new Date(values.coupenValidTill).getTime() / 1000) // Convert date to Unix timestamp (seconds)
      );

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/add-coupon`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status === 200 || res.status === 201) {
          toast.success("Coupon added successfully!");
          // userForm.resetForm();

          // Reload the page after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 3000); // 3-second delay to let the notification show
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  // FOR EDIT USER
  const [found, setfound] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState({
    coupenCode: "",
    coupenDesc: "",
    coupenMinAmount: "",
    coupenMaximumAmt: "",
    coupenDiscountAmt: "",
    coupenType: "",
    coupenValidTill: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchCouponData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/get-coupon/${id}`
      );

      const data = response.data;

      // Validate and convert UNIX timestamp (seconds) to milliseconds
      const validTillTimestamp = data.coupenValidTill;
      const validTillDate = validTillTimestamp
        ? new Date(validTillTimestamp * 1000)
        : null;

      setfound(data);
      setFormData({
        coupenCode: data.coupenCode,
        coupenDesc: data.coupenDesc,
        coupenMinAmount: data.coupenMinAmount,
        coupenMaximumAmt: data.coupenMaximumAmt,
        coupenDiscountAmt: data.coupenDiscountAmt,
        coupenType: data.coupenType?.toString() || "",
        coupenValidTill: validTillDate,
      });

      setActiveTab(2);
    } catch (error) {
      toast.error("Error fetching coupon data");
      console.error("Error fetching coupon data:", error);
    }
  };

  const [errors, setErrors] = useState({}); // State for validation errors

  const validateForm = () => {
    const newErrors = {};

    if (!formData.coupenCode.trim()) {
      newErrors.coupenCode = "Coupon Code is required.";
    }
    if (!formData.coupenDesc.trim()) {
      newErrors.coupenDesc = "Coupon Description is required.";
    }
    if (
      !formData.coupenMinAmount ||
      String(formData.coupenMinAmount).trim() === ""
    ) {
      newErrors.coupenMinAmount = "Coupon Minimum Amount is required.";
    }
    // if (
    //   !formData.coupenMaximumAmt ||
    //   String(formData.coupenMaximumAmt).trim() === ""
    // ) {
    //   newErrors.coupenMaximumAmt = "Coupon Maximum Amount is required.";
    // }
    if (
      !formData.coupenDiscountAmt ||
      String(formData.coupenDiscountAmt).trim() === ""
    ) {
      newErrors.coupenDiscountAmt = "Coupon Discount Amount is required.";
    }
    if (!formData.coupenType.trim()) {
      newErrors.coupenType = "Coupon Type is required.";
    }
    if (
      !formData.coupenValidTill ||
      isNaN(new Date(formData.coupenValidTill).getTime())
    ) {
      newErrors.coupenValidTill = "Coupon Valid Till is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    if (!validateForm()) {
      return;
    }
    try {
      const updatedData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "coupenValidTill" && value) {
          // Convert the Date object to a UNIX timestamp (in seconds)
          updatedData.append(key, Math.floor(value.getTime() / 1000));
        } else {
          updatedData.append(key, value);
        }       
      });

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/update-coupon/${found?.coupenId}`,
        updatedData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Coupon updated successfully!");

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2-second delay to let the notification show
    } catch (error) {
      toast.error("Error updating Coupon:", error);
    }
  };

  const handleDelete = (coupenId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Coupon?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Send DELETE request to remove founder from the database
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/coupon-status/${coupenId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ coupenStatus: 3 }),
          }
        )
          .then((response) => {
            if (response.ok) {
              toast.success("The Coupon has been deleted successfully!");
              fetchData(); // Refresh the data without reloading the page
            } else {
              toast.error("Failed to delete the founder.");
            }
          })
          .catch(() => {
            toast.error("An error occurred while deleting the Coupon.");
          });
      }
    });
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
            Coupon List
          </button>
          <button
            className={`py-2 px-1 inline-flex items-center gap-x-2 ml-5 border-b-2  text-sm whitespace-nowrap  hover:text-emerald-500 focus:outline-none focus:text-emerald-500 ${
              activeTab === 1
                ? "font-semibold border-emerald-500 text-emerald-500"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(1)}
            aria-selected={activeTab === 1}
          >
            Add Coupon
          </button>
          <button
            className={`py-2 px-1 inline-flex items-center gap-x-2 ml-5 border-b-2  text-sm whitespace-nowrap hover:text-emerald-500 focus:outline-none focus:text-emerald-500 ${
              activeTab === 2
                ? "font-semibold border-emerald-500 text-emerald-500"
                : "hidden border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(2)}
            aria-selected={activeTab === 2}
          >
            Edit Coupon
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
              Manage Coupon's
            </h3>

            <table id="example1" className="display  nowwrap w-full table-auto">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Minimum Amt</th>
                  <th>Maximum Amt</th>
                  <th>Dicount Amt</th>
                  <th>Valid Till</th>
                  <th>Sort By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center p-3 font-semibold">
                      No available data
                    </td>
                  </tr>
                ) : (
                  coupons.map((item, index) => (
                    <tr key={item.coupenId}>
                      <td>{coupons.indexOf(item) + 1}</td>

                      <td>{item.coupenCode}</td>

                      <td>{item.coupenDesc}</td>
                      <td>
                        {item.coupenType === 1
                          ? "Rupees"
                          : item.coupenType === 2
                          ? "Percentage"
                          : "Unknown"}
                      </td>

                      <td>{item.coupenMinAmount}</td>
                      <td>
                        {item.coupenMaximumAmt ? item.coupenMaximumAmt : 0}
                      </td>

                      <td>
                        {item.coupenType === 1
                          ? `Rs. ${item.coupenDiscountAmt}`
                          : item.coupenType === 2
                          ? `${item.coupenDiscountAmt}%`
                          : item.coupenDiscountAmt}
                      </td>

                      <td>
                        {item.coupenValidTill
                          ? format(
                              new Date(item.coupenValidTill * 1000),
                              "dd MMM yyyy hh:mm (EEE)",
                              { timeZone: "Asia/Kolkata" }
                            )
                          : "N/A"}
                      </td>

                      <td>
                        {editSortBy == item.coupenId ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <input
                              type="text"
                              value={newSortBy}
                              onChange={(e) => setNewSortBy(e.target.value)}
                              maxLength="4"
                              className="border rounded px-2 py-1 w-20"
                            />
                            <button
                              onClick={() => handleSortBySubmit(item.coupenId)}
                              className="ml-2 bg-emerald-300 text-black px-3 py-2 rounded"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleSortByEdit(item.coupenId, item.couponSortBy)
                            }
                            className="text-black font-bold bg-emerald-300 px-3 py-1 rounded"
                          >
                            {item.couponSortBy}
                          </button>
                        )}
                      </td>
                      <td>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.coupenStatus == 0}
                            onChange={() =>
                              handleToggle(item.coupenId, item.coupenStatus)
                            }
                          />
                          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-emerald-300"></div>
                        </label>
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
                              <button
                                className="hover:bg-emerald-200 "
                                onClick={() => fetchCouponData(item.coupenId)}
                              >
                                Edit
                              </button>
                            </li>
                            <li className=" rounded">
                              <button
                                className="hover:bg-red-200"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(item.coupenId);
                                }}
                              >
                                Delete
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

        {/* ADD FORM */}
        <div
          id="tabs-with-underline-2"
          className={`${activeTab === 1 ? "" : "hidden"}`}
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-2"
        >
          <div className=" mx-auto p-3 sm:p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">Add Coupon</h1>

            <form
              onSubmit={userForm.handleSubmit}
              autoComplete="off"
              className="flex flex-wrap gap-4 sm:gap-6 text-sm"
            >
              {/* Coupon Code */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="coupenCode"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Coupon Code:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="coupenCode"
                    name="coupenCode"
                    type="text"
                    placeholder="Enter Coupon Code"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.coupenCode}
                    className="w-full border-2 border-gray-300 p-2 rounded "
                  />
                  {userForm.touched.coupenCode &&
                    userForm.errors.coupenCode && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.coupenCode}
                      </p>
                    )}
                </div>
              </div>

              {/* Coupon Description */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="coupenDesc"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Coupon Description:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <textarea
                    rows={5}
                    id="coupenDesc"
                    name="coupenDesc"
                    placeholder="Enter Coupon Description"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.coupenDesc}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.coupenDesc &&
                    userForm.errors.coupenDesc && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.coupenDesc}
                      </p>
                    )}
                </div>
              </div>

              {/* Coupon Minimum Amount */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="coupenMinAmount"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Coupon Minimum Amount:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    type="number"
                    id="coupenMinAmount"
                    name="coupenMinAmount"
                    placeholder="Enter Coupon Minimum Amount"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.coupenMinAmount}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.coupenMinAmount &&
                    userForm.errors.coupenMinAmount && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.coupenMinAmount}
                      </p>
                    )}
                </div>
              </div>

              {/* Coupon Valid Till */}
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="coupenValidTill"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Coupon Valid Till:
                </label>
                <div className="w-full sm:w-[80%]  mt-1 sm:mt-0">
                  <DatePicker
                    selected={userForm.values.coupenValidTill}
                    onChange={(date) =>
                      userForm.setFieldValue("coupenValidTill", date)
                    }
                    onBlur={() =>
                      userForm.setFieldTouched("coupenValidTill", true)
                    }
                    showTimeSelect
                    dateFormat="Pp"
                    placeholderText="Enter Coupon Valid Till"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.coupenValidTill &&
                    userForm.errors.coupenValidTill && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.coupenValidTill}
                      </p>
                    )}
                </div>
              </div>

              {/* Coupon Type  */}
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="coupenType"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Coupon Type:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <select
                    id="coupenType"
                    name="coupenType"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.coupenType}
                    className="w-full border-2 border-gray-300 p-2 rounded bg-white"
                  >
                    <option value="" disabled>
                      Select Coupon Type
                    </option>
                    <option value="1">Rupees</option>
                    <option value="2">Percentage</option>
                  </select>
                  {userForm.touched.coupenType &&
                    userForm.errors.coupenType && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.coupenType}
                      </p>
                    )}
                </div>
              </div>

              {/* Coupon Maximum Amount */}
              {userForm.values.coupenType === "2" && (
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="coupenMaximumAmt"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Coupon Maximum Amount:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      type="number"
                      id="coupenMaximumAmt"
                      name="coupenMaximumAmt"
                      placeholder="Enter Coupon Maximum Amount"
                      onChange={userForm.handleChange}
                      onBlur={userForm.handleBlur}
                      value={userForm.values.coupenMaximumAmt}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {userForm.touched.coupenMaximumAmt &&
                      userForm.errors.coupenMaximumAmt && (
                        <p className="text-red-500 text-sm">
                          {userForm.errors.coupenMaximumAmt}
                        </p>
                      )}
                  </div>
                </div>
              )}

              {/* Coupon Discount Amount */}
              <div className="sm:flex w-full items-center ">
                <label
                  htmlFor="coupenDiscountAmt"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Coupon Discount Amount:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    type="number"
                    id="coupenDiscountAmt"
                    name="coupenDiscountAmt"
                    placeholder="Enter Coupon Discount Amount"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.coupenDiscountAmt}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.coupenDiscountAmt &&
                    userForm.errors.coupenDiscountAmt && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.coupenDiscountAmt}
                      </p>
                    )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="w-full flex justify-start gap-4">
                <a
                  href=""
                  className="bg-black text-white py-2 px-4 rounded transition"
                >
                  Cancel
                </a>
                <button
                  type="submit"
                  className="bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* EDIT FORM */}
        <div
          id="tabs-with-underline-3"
          className={`${activeTab === 2 ? "" : "hidden"}`}
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-3"
        >
          {" "}
          <div className=" mx-auto p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">Edit Faq</h1>
            {activeTab && (
              <form
                onSubmit={handleUpdateCoupon}
                className="flex flex-wrap gap-4 sm:gap-6 text-sm"
              >
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="coupenCode"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Coupon Code:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="coupenCode"
                      name="coupenCode"
                      type="text"
                      placeholder="Enter Question"
                      value={formData.coupenCode}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.coupenCode && (
                      <p className="text-red-500 text-sm">
                        {errors.coupenCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="coupenDesc"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Coupon Description:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <textarea
                      rows={5}
                      id="coupenDesc"
                      name="coupenDesc"
                      placeholder="Enter Answer"
                      value={formData.coupenDesc}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.coupenDesc && (
                      <p className="text-red-500 text-sm">
                        {errors.coupenDesc}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="coupenMinAmount"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Coupon Minimum Amount:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="coupenMinAmount"
                      name="coupenMinAmount"
                      type="text"
                      placeholder="Enter Coupon Minimum Amount"
                      value={formData.coupenMinAmount}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.coupenMinAmount && (
                      <p className="text-red-500 text-sm">
                        {errors.coupenMinAmount}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="coupenValidTill"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Coupon Valid Till:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <DatePicker
                      selected={formData.coupenValidTill} // Expects a Date object
                      onChange={(date) => {
                        setFormData({
                          ...formData,
                          coupenValidTill: date, // Store the Date object directly
                        });
                      }}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy hh:mm aa" // Format for display
                      placeholderText="Enter Coupon Valid Till"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.coupenValidTill && (
                      <p className="text-red-500 text-sm">
                        {errors.coupenValidTill}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="coupenType"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Coupon Type:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <select
                      id="coupenType"
                      name="coupenType"
                      value={formData.coupenType}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded bg-white"
                    >
                      <option value="" disabled>
                        Select Coupon Type
                      </option>
                      <option value="1">Rupees</option>
                      <option value="2">Percentage</option>
                    </select>
                    {errors.coupenType && (
                      <p className="text-red-500 text-sm">
                        {errors.coupenType}
                      </p>
                    )}
                  </div>
                </div>

                {/* Coupon Maximum Amount */}
                {formData.coupenType === "2" && (
                  <div className="sm:flex w-full  items-center">
                    <label
                      htmlFor="coupenMaximumAmt"
                      className="w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Coupon Maximum Amount:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        type="number"
                        id="coupenMaximumAmt"
                        name="coupenMaximumAmt"
                        placeholder="Enter Coupon Maximum Amount"
                        value={formData.coupenMaximumAmt}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                      {errors.coupenMaximumAmt && (
                        <p className="text-red-500 text-sm">
                          {errors.coupenMaximumAmt}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="coupenDiscountAmt"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Coupon Discount Amount:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="coupenDiscountAmt"
                      name="coupenDiscountAmt"
                      type="text"
                      placeholder="Enter Coupon Minimum Amount"
                      value={formData.coupenDiscountAmt}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.coupenDiscountAmt && (
                      <p className="text-red-500 text-sm">
                        {errors.coupenDiscountAmt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full flex justify-start gap-4">
                  <a
                    href=""
                    className="bg-black text-white py-2 px-4 rounded hover:bg-black"
                  >
                    Cancel
                  </a>
                  <button
                    type="submit"
                    className="bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
                  >
                    Update
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Coupen;
