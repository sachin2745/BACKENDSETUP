"use client";
import React, { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import useAppContext from "@/context/AppContext";
import { FaCheck } from "react-icons/fa";

const Founder = () => {
  const [founder, setFounders] = useState([]);

  const fetchFounders = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/founder/getall`
      ); // Making GET request to the API endpoint
      // console.log(response.data);
      const data = response.data; // Extracting the data from the response

      // Setting the state with the fetched data
      setFounders(data);
    } catch (err) {
      console.log(err.message); // Catching any error and setting the error state
    }
  };

  useEffect(() => {
    fetchFounders();
  }, []);

  useEffect(() => {
    if (founder.length > 0) {
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
  }, [founder]);

  // Toggle user status
  const handleToggle = (founderId, currentStatus, founderName) => {
    const newStatus = currentStatus == 0 ? 1 : 0; // Toggle between 0 (active) and 1 (inactive)

    // Update the status in the backend
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/founder-status/${founderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ founderStatus: newStatus }),
      }
    )
      .then((res) => {
        if (res.ok) {
          setFounders((prevData) =>
            prevData.map((founder) =>
              founder.founderId == founderId
                ? { ...founder, founderStatus: newStatus }
                : founder
            )
          );
          const firstName = founderName.split(" ")[0];
          toast.success("Successfully status updated for " + firstName + "!");
        } else {
          // console.error('Failed to update user status');
          toast.error("Failed to update founder status!");
        }
      })
      .catch((err) => toast.error("Error updating status:", err));
    //  console.error('Error updating status:', err));
  };

  // State to track the user being edited
  const [editSortBy, setEditSortBy] = useState(null); // To track the user being edited
  const [newSortBy, setNewSortBy] = useState(""); // To track the new Sort By value

  // Function to handle Sort By Edit
  const handleSortByEdit = (founderId, currentSortBy) => {
    setEditSortBy(founderId); // Enable editing mode for the specific user
    setNewSortBy(currentSortBy); // Pre-fill the input with the current value
  };

  //Function to handle Sort By Submit
  const handleSortBySubmit = (founderId) => {
    // Update the Sort By value in the backend
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/founder-status/${founderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ founderSortBy: newSortBy }),
      }
    )
      .then((res) => {
        if (res.ok) {
          setFounders((prevData) =>
            prevData.map((user) =>
              user.founderId === founderId
                ? { ...user, founderSortBy: newSortBy }
                : user
            )
          );
          setEditSortBy(null); // Exit editing mode
          toast.success("Sort By updated successfully!");
          //reload page
          // window.location.reload();
          // Instead of reloading the page, just refresh data
          fetchFounders();
        } else {
          toast.error("Failed to update Sort By!");
        }
      })
      .catch((err) => toast.error("Error updating Sort By:", err));
  };

  //Add blog
  const [previewImage, setPreviewImage] = useState(null);
  const userForm = useFormik({
    initialValues: {
      founderName: "",
      founderImgAlt: "",
      founderDsg: "",
      founderMsg: "",
      founderDetail: "",
      founderStatus: 0,
      founderImg: null,
    },
    validationSchema: Yup.object({
      founderName: Yup.string()
        .min(3, "Name must be at least 3 characters long")
        .required("Name is required"),
      founderImgAlt: Yup.string().required("Alt text is required"),
      founderDsg: Yup.string().required("Designation is required"),
      founderMsg: Yup.string().required("Message is required"),
      founderImg: Yup.mixed().required("Image is required"),
      founderDetail: Yup.string().required("Detail is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("founderName", values.founderName);
      formData.append("founderImgAlt", values.founderImgAlt);
      formData.append("founderDsg", values.founderDsg);
      formData.append("founderMsg", values.founderMsg);
      formData.append("founderDetail", values.founderDetail);
      formData.append("founderImg", values.founderImg); // Append image
      formData.append("createdAt", Math.floor(Date.now() / 1000)); // Add current UNIX timestamp

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/add-founder`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status === 200 || res.status === 201) {
          toast.success("Founder added successfully!");
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
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      userForm.setFieldValue("founderImg", file); // Set image in Formik
    }
  };

  // FOR EDIT USER
  const [found, setfound] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [previewEditImage, setPreviewEditImage] = useState("");

  const [formData, setFormData] = useState({
    founderName: "",
    founderImgAlt: "",
    founderDsg: "",
    founderMsg: "",
    founderDetail: "",
  });

  const fetchFounderData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/get-founder/${id}`
      );
      setfound(response.data);
      setFormData({
        founderName: response.data.founderName,
        founderImgAlt: response.data.founderImgAlt,
        founderDsg: response.data.founderDsg,
        founderMsg: response.data.founderMsg,
        founderDetail: response.data.founderDetail,
        founderImg: null,
      });

      // Set the initial image for preview
      if (response.data.founderImg) {
        setPreviewEditImage(
          `${process.env.NEXT_PUBLIC_API_URL}${response.data.founderImg}`
        );
      }

      setActiveTab(2);
    } catch (error) {
      toast.error("Error fetching user data:", error);
    }
  };

  const [errors, setErrors] = useState({}); // State for validation errors

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    // Check if the input is the image file input
    if (name === "founderImg" && files && files[0]) {
      // Update the preview with the selected image
      const file = files[0];
      const fileURL = URL.createObjectURL(file);
      setPreviewEditImage(fileURL); // Set preview to the selected image
      setFormData({ ...formData, founderImg: file }); // Update form data with the file
    } else {
      setFormData({ ...formData, [name]: value }); // For other inputs
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.founderName.trim()) {
      newErrors.founderName = "Name is required.";
    }
    if (!formData.founderImgAlt.trim()) {
      newErrors.founderImgAlt = "Image Alt is required.";
    }
    if (!formData.founderDsg.trim()) {
      newErrors.founderDsg = "Designation is required.";
    }
    if (!formData.founderMsg.trim()) {
      newErrors.founderMsg = "Message is required.";
    }
    if (!formData.founderDetail.trim()) {
      newErrors.founderDetail = "Detail is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    if (!validateForm()) {
      return;
    }
    try {
      const updatedData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        updatedData.append(key, value);
      });

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/update-founder/${found?.founderId}`,
        updatedData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // setEditMode(false);
      toast.success("Founder updated successfully!");

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2-second delay to let the notification show
    } catch (error) {
      toast.error("Error updating founder:", error);
    }
  };

  const handleDelete = (founderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this founder?",
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
          `${process.env.NEXT_PUBLIC_API_URL}/admin/founder-delete/${founderId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            if (response.ok) {
              toast.success("The founder has been deleted successfully!");
              fetchFounders(); // Refresh the data without reloading the page
            } else {
              toast.error("Failed to delete the founder.");
            }
          })
          .catch(() => {
            toast.error("An error occurred while deleting the founder.");
          });
      }
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchFound = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/get-founder/${id}`
      );
      setfound(response.data);
      setFormData({
        founderImg: response.data.founderImg,
        founderName: response.data.founderName,
        founderImgAlt: response.data.founderImgAlt,
        founderDsg: response.data.founderDsg,
        founderMsg: response.data.founderMsg,
        founderDetail: response.data.founderDetail,
      });
      document.getElementById("my_modal").showModal(); // Open the modal
    } catch (error) {
      toast.error("Error fetching user data:", error);
    }
  };

  const closeModal = () => {
    document.getElementById("my_modal").close(); // Close the modal
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
            Founder List
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
            Add Founder
          </button>
          <button
            className={`py-2 px-1 inline-flex items-center gap-x-2 ml-5 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-emerald-500 focus:outline-none focus:text-emerald-500 ${
              activeTab === 2
                ? "font-semibold border-emerald-500 text-emerald-500"
                : "hidden"
            }`}
            onClick={() => setActiveTab(2)}
            aria-selected={activeTab === 2}
          >
            Edit Founder
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
              Manage Founder
            </h3>

            <table id="example1" className="display  nowwrap w-full table-auto">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Message</th>
                  <th>Detail</th>
                  <th>Updated At</th>
                  <th>Sort By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {founder.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center p-3 font-semibold">
                      No available data
                    </td>
                  </tr>
                ) : (
                  founder.map((item, index) => (
                    <tr key={item.founderId}>
                      <td>{founder.indexOf(item) + 1}</td>
                      <td>
                        <Zoom>
                          {item.founderImg ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}${item.founderImg}`}
                              alt={item.founderImgAlt} // Fallback to blog title if alt text is not provided
                              className="h-10 w-10 object-cover" // Added object-cover for better image fitting
                            />
                          ) : (
                            <p>No image available</p> // Fallback message if no image is present
                          )}
                        </Zoom>
                      </td>

                      <td
                        className="cursor-pointer hover:text-emerald-500 hover:font-bold"
                        onClick={() => fetchFound(item.founderId)}
                      >
                        {item.founderName}
                      </td>

                      <td>{item.founderDsg}</td>
                      <td>{item.founderMsg}</td>
                      <td>
                        {item.founderDetail.slice(0, 120)}
                        {item.founderDetail.length > 120 ? "..." : ""}
                      </td>

                      <td>
                        {item.createdAt
                          ? format(
                              new Date(item.createdAt * 1000),
                              "dd MMM yyyy hh:mm (EEE)",
                              { timeZone: "Asia/Kolkata" }
                            )
                          : "N/A"}
                      </td>

                      <td>
                        {editSortBy == item.founderId ? (
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
                              onClick={() => handleSortBySubmit(item.founderId)}
                              className="ml-2 bg-emerald-300 text-black px-3 py-2 rounded"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleSortByEdit(
                                item.founderId,
                                item.founderSortBy
                              )
                            }
                            className="text-black font-bold bg-emerald-300 px-3 py-1 rounded"
                          >
                            {item.founderSortBy}
                          </button>
                        )}
                      </td>
                      <td>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.founderStatus == 0}
                            onChange={() =>
                              handleToggle(
                                item.founderId,
                                item.founderStatus,
                                item.founderName
                              )
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
                                onClick={() => fetchFounderData(item.founderId)}
                              >
                                Edit
                              </button>
                            </li>
                            <li className=" rounded">
                              <button
                                className="hover:bg-red-200"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(item.founderId);
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
            <h1 className="text-lg font-bold mb-6 border-b pb-2">
              Add Founder
            </h1>

            <form
              onSubmit={userForm.handleSubmit}
              autoComplete="off"
              className="flex flex-wrap gap-4 sm:gap-6 text-sm"
            >
              {/* Name */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="founderName"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Name:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="founderName"
                    name="founderName"
                    type="text"
                    placeholder="Enter Name"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.founderName}
                    className="w-full border-2 border-gray-300 p-2 rounded "
                  />
                  {userForm.touched.founderName &&
                    userForm.errors.founderName && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.founderName}
                      </p>
                    )}
                </div>
              </div>

              {/* Password */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="founderDsg"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Designation:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="founderDsg"
                    name="founderDsg"
                    type="text"
                    placeholder="Enter Designation"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.founderDsg}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.founderDsg &&
                    userForm.errors.founderDsg && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.founderDsg}
                      </p>
                    )}
                </div>
              </div>

              {/* Message */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="founderMsg"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Message:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="founderMsg"
                    name="founderMsg"
                    type="text"
                    placeholder="Enter Message"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.founderMsg}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.founderMsg &&
                    userForm.errors.founderMsg && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.founderMsg}
                      </p>
                    )}
                </div>
              </div>

              {/* DETAIL */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="founderDetail"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Detail:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <textarea
                    rows={5}
                    id="founderDetail"
                    name="founderDetail"
                    placeholder="Enter Detail"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.founderDetail}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.founderDetail &&
                    userForm.errors.founderDetail && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.founderDetail}
                      </p>
                    )}
                </div>
              </div>

              {/*  Image */}
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="founderImg"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Image:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="founderImg"
                    name="founderImg"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.founderImg &&
                    userForm.errors.founderImg && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.founderImg}
                      </p>
                    )}
                  {previewImage && (
                    <div className="flex justify-center my-3">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="rounded shadow"
                        width="100"
                        height="100"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ALT TEXT */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="founderImgAlt"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Image Alt Text:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    type="text"
                    id="founderImgAlt"
                    name="founderImgAlt"
                    placeholder="Enter Image Alt Text"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.founderImgAlt}
                    autoComplete="current-email"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.founderImgAlt &&
                    userForm.errors.founderImgAlt && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.founderImgAlt}
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
            <h1 className="text-lg font-bold mb-6 border-b pb-2">
              Edit Founder
            </h1>
            {activeTab && (
              <form className="flex flex-wrap gap-4 sm:gap-6 text-sm">
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="founderName"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Name:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="founderName"
                      name="founderName"
                      type="text"
                      value={formData.founderName}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.founderName && (
                      <p className="text-red-500 text-sm">
                        {errors.founderName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="founderDsg"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Designation:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="founderDsg"
                      name="founderDsg"
                      type="text"
                      required
                      value={formData.founderDsg}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.founderDsg && (
                      <p className="text-red-500 text-sm">
                        {errors.founderDsg}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="founderMsg"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Message:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="founderMsg"
                      name="founderMsg"
                      type="text"
                      value={formData.founderMsg}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.founderMsg && (
                      <p className="text-red-500 text-sm">
                        {errors.founderMsg}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="founderDetail"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Detail:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <textarea
                      rows={5}
                      id="founderDetail"
                      name="founderDetail"
                      value={formData.founderDetail}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.founderDetail && (
                      <p className="text-red-500 text-sm">
                        {errors.founderDetail}
                      </p>
                    )}
                  </div>
                </div>

                {/* IMAGE */}
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="founderImg"
                    className="w-full sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Image:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="founderImg"
                      name="founderImg"
                      type="file"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />

                    {previewEditImage && (
                      <img
                        src={previewEditImage}
                        alt="Preview"
                        width="100"
                        className="mt-3 rounded shadow"
                      />
                    )}
                  </div>
                </div>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="founderImgAlt"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Image Alt Text:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      type="text"
                      id="founderImgAlt"
                      name="founderImgAlt"
                      placeholder="Enter Image Alt Text"
                      value={formData.founderImgAlt}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.founderImgAlt && (
                      <p className="text-red-500 text-sm">
                        {errors.founderImgAlt}
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
                    onClick={handleUpdateUser}
                    className="bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
                  >
                    Update
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Modal For View Founder */}
        <dialog id="my_modal" className="modal">
          <div className="modal-box rounded-none w-11/12 max-w-5xl h-[60%]">
            <form method="dialog">
              {/* Close Button */}
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 focus:outline-none"
                onClick={closeModal}
              >
                ✕
              </button>
            </form>
            <h2 className="text-2xl font-semibold text-quaternary mb-4 border-b pb-2">
              Founder Details
            </h2>
            <form className="grid grid-cols-2 gap-4">
              
              <div>
                <div className="flex flex-row justify-between">
                   {/* Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-quaternary mb-1">
                    Name:
                  </label>
                  <input
                    type="text"
                    value={formData.founderName}
                    readOnly
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-dashGray text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {/* Image */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${formData.founderImg}`}
                    alt={formData.founderImgAlt}
                    className="h-48 w-48 object-cover rounded-lg "
                  />
                </div>                

                {/* Designation */}
                <div className="flex flex-col mb-2">
                  <label className="text-sm font-semibold text-quaternary mb-1">
                    Designation:
                  </label>
                  <input
                    type="email"
                    value={formData.founderDsg}
                    readOnly
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-dashGray text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-quaternary mb-1">
                    Message:
                  </label>
                  <input
                    type="text"
                    value={formData.founderMsg}
                    readOnly
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-dashGray text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              {/* Detail */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-quaternary mb-1">
                  Detail:
                </label>
                <textarea
                  rows={12}
                  value={formData.founderDetail}
                  readOnly
                  className="border border-gray-300 scrollbarWidthNone rounded-lg px-3 py-2 bg-dashGray text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default Founder;
