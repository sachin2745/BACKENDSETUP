"use client";
import React, {useEffect,useState} from "react";
import AdminLayout from "../Layout/adminLayout";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FaEdit, FaCheck, FaBan } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Formik, Form, input, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import useAppContext from "@/context/AppContext";

const User = () => {
  const { currentUser, setCurrentUser } = useAppContext();

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8001/users/getall"); // Making GET request to the API endpoint
      // console.log(response.data);
      const data = response.data; // Extracting the data from the response

      // Setting the state with the fetched data
      setUsers(data);
    } catch (err) {
      console.log(err.message); // Catching any error and setting the error state
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
 

  useEffect(() => {
    if (users.length > 0) {
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
  }, [users]);

  // Function to toggle the popular status of a user
  const toggleUserPopularStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0; // Toggle status between 0 and 1

    fetch(`http://localhost:8001/users/popular/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userPopular: newStatus }),
    })
      .then((res) => {
        if (res.ok) {
          setUsers((prevData) =>
            prevData.map((user) =>
              user.userId === userId
                ? { ...user, userPopular: newStatus }
                : user
            )
          );
          toast.success("User popular status updated!");
        } else {
          toast.error("Failed to update popular status.");
        }
      })
      .catch((err) => toast.error("Error updating popular status:", err));
  };

  // Toggle user status
  const handleToggle = (userId, currentStatus, userName) => {
    const newStatus = currentStatus == 0 ? 1 : 0; // Toggle between 0 (active) and 1 (inactive)

    // Update the status in the backend
    fetch(`http://localhost:8001/users/status/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userStatus: newStatus }),
    })
      .then((res) => {
        if (res.ok) {
          setUsers((prevData) =>
            prevData.map((user) =>
              user.userId == userId ? { ...user, userStatus: newStatus } : user
            )
          );
          const firstName = userName;
          toast.success("Successfully status updated for " + firstName + "!");
        } else {
          // console.error('Failed to update user status');
          toast.error("Failed to update blog status!");
        }
      })
      .catch((err) => toast.error("Error updating status:", err));
    //  console.error('Error updating status:', err));
  };

  // State to track the user being edited
  const [editSortBy, setEditSortBy] = useState(null); // To track the user being edited
  const [newSortBy, setNewSortBy] = useState(""); // To track the new Sort By value

  // Function to handle Sort By Edit
  const handleSortByEdit = (userId, currentSortBy) => {
    setEditSortBy(userId); // Enable editing mode for the specific user
    setNewSortBy(currentSortBy); // Pre-fill the input with the current value
  };

  //Function to handle Sort By Submit
  const handleSortBySubmit = (userId) => {
    // Update the Sort By value in the backend
    fetch(`http://localhost:8001/users/status/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userSortBy: newSortBy }),
    })
      .then((res) => {
        if (res.ok) {
          setUsers((prevData) =>
            prevData.map((user) =>
              user.userId === userId ? { ...user, userSortBy: newSortBy } : user
            )
          );
          setEditSortBy(null); // Exit editing mode
          toast.success("Sort By updated successfully!");
          //reload page
          // window.location.reload();
          // Instead of reloading the page, just refresh data
          fetchUsers();
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
      userName: "",
      userEmail: "",
      userPassword: "",
      userMobile: "",
      userPopular: 0,
      userSortBy: 0,
      userStatus: 0,
      userImage: null,
    },
    validationSchema: Yup.object({
      userName: Yup.string()
        .min(3, "Name must be at least 3 characters long")
        .required("Name is required"),
      userEmail: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      userPassword: Yup.string()
        .min(6, "Password must be at least 6 characters long")
        .required("Password is required"),
      userMobile: Yup.string()
        .matches(/^\d{10}$/, "Mobile must be 10 digits")
        .required("Mobile is required"),
      userImage: Yup.mixed().required("Image is required"),
      userPopular: Yup.string().required("Please select a Popular"),
      userStatus: Yup.string().required("Please select a Status "),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("userName", values.userName);
      formData.append("userEmail", values.userEmail);
      formData.append("userPassword", values.userPassword);
      formData.append("userMobile", values.userMobile);
      formData.append("userPopular", values.userPopular);
      formData.append("userSortBy", values.userSortBy);
      formData.append("userStatus", values.userStatus);
      formData.append("userImage", values.userImage); // Append image
      formData.append("userCreatedAt", Math.floor(Date.now() / 1000)); // Add current UNIX timestamp

      try {
        const res = await axios.post(
          "http://localhost:8001/users/add-user",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status === 200 || res.status === 201) {
          toast.success("User added successfully!");
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
      userForm.setFieldValue("userImage", file); // Set image in Formik
    }
  };

  // FOR EDIT USER
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(false);
  const [previewEditImage, setPreviewEditImage] = useState("");

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userMobile: "",
    userPopular: 0,
    userStatus: 0,
  });

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/users/get-user/${id}`
      );
      setUser(response.data);
      setFormData({
        userName: response.data.userName,
        userEmail: response.data.userEmail,
        userMobile: response.data.userMobile,
        userPassword: response.data.userPassword,
        userPopular: response.data.userPopular,
        userStatus: response.data.userStatus,
        userImage: null,
      });

      // Set the initial image for preview
      if (response.data.userImage) {
        setPreviewEditImage(`http://localhost:8001${response.data.userImage}`);
      }

      setActiveTab(true);

      // Show the edit tab by triggering the click event
      // document.getElementById("editUser-styled-tab").click();
    } catch (error) {
      toast.error("Error fetching user data:", error);
    }
  };

  const [errors, setErrors] = useState({}); // State for validation errors

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    // Check if the input is the image file input
    if (name === "userImage" && files && files[0]) {
      // Update the preview with the selected image
      const file = files[0];
      const fileURL = URL.createObjectURL(file);
      setPreviewEditImage(fileURL); // Set preview to the selected image
      setFormData({ ...formData, userImage: file }); // Update form data with the file
    } else {
      setFormData({ ...formData, [name]: value }); // For other inputs
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) {
      newErrors.userName = "Name is required.";
    }
    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      newErrors.userEmail = "Invalid email format.";
    }
    if (!formData.userMobile || !formData.userMobile.toString().trim()) {
      newErrors.userMobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.userMobile)) {
      newErrors.userMobile = "Mobile number must be 10 digits.";
    }
    if (!formData.userPassword.trim()) {
      newErrors.userPassword = "Password is required.";
    } else if (formData.userPassword.length < 6) {
      newErrors.userPassword = "Password must be at least 6 characters long.";
    }

    if (!formData.userPopular.toString().trim()) {
      newErrors.userPopular = "Please select Popularity.";
    }
    if (!formData.userStatus.toString().trim()) {
      newErrors.userStatus = "Please select Status.";
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
        `http://localhost:8001/users/update-user/${user?.userId}`,
        updatedData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // setEditMode(false);
      toast.success("User updated successfully!");

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2-second delay to let the notification show
    } catch (error) {
      toast.error("Error updating user:", error);
    }
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Send request to update the user's status to 3
        fetch(`http://localhost:8001/users/status/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userStatus: 3 }),
        })
          .then((response) => {
            if (response.ok) {
              toast.success("The user has been deleted Successfully!.");
              // Instead of reloading the page, just refresh data

              fetchUsers();
            } else {
              toast.error("Failed to delete the user.");
            }
          })
          .catch(() => {
            toast.error("An error occurred while deleting the user.");
          });
      }
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchUser = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/users/get-user/${id}`
      );
      setUser(response.data);
      setFormData({
        userImage: response.data.userImage,
        userName: response.data.userName,
        userEmail: response.data.userEmail,
        userMobile: response.data.userMobile,
        userPassword: response.data.userPassword,
        userPopular: response.data.userPopular,
        userStatus: response.data.userStatus,
      });
      setIsModalOpen(true); // Open modal
    } catch (error) {
      toast.error("Error fetching user data:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveTab(false);
    setUser(null);
  };

  return (
    <AdminLayout>
      <div className="">
        <nav
          className="flex gap-x-1"
          aria-label="Tabs"
          role="tablist"
          aria-orientation="horizontal"
        >
          <button
            type="button"
            className={`hs-tab-active:font-semibold hs-tab-active:border-emerald-500 hs-tab-active:text-emerald-500 py-2 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-emerald-500 focus:outline-none focus:text-emerald-500 disabled:opacity-50 disabled:pointer-events-none 
          ${activeTab ? "" : "active"}`}
            id="tabs-with-underline-item-1"
            aria-selected={`${activeTab ? "false" : "true"}`}
            data-hs-tab="#tabs-with-underline-1"
            aria-controls="tabs-with-underline-1"
            role="tab"
          >
            User List
          </button>
          <button
            type="button"
            className="hs-tab-active:font-semibold hs-tab-active:border-emerald-500 hs-tab-active:text-emerald-500 py-2 px-1 inline-flex items-center gap-x-2 ml-5 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-emerald-500 focus:outline-none focus:text-emerald-500 disabled:opacity-50 disabled:pointer-events-none"
            id="tabs-with-underline-item-2"
            aria-selected="false"
            data-hs-tab="#tabs-with-underline-2"
            aria-controls="tabs-with-underline-2"
            role="tab"
          >
            Add User
          </button>
          <button
            type="button"
            className={`hs-tab-active:font-semibold hs-tab-active:border-emerald-500 hs-tab-active:text-emerald-500 py-2 px-1 inline-flex items-center gap-x-2 ml-5 border-b-2 text-sm whitespace-nowrap  hover:text-emerald-500 focus:outline-none focus:text-emerald-500  ${
              activeTab ? "active" : "hidden"
            }`}
            id="tabs-with-underline-item-3"
            aria-selected={activeTab}
            data-hs-tab="#tabs-with-underline-3"
            aria-controls="tabs-with-underline-3"
            role="tab"
          >
            Edit User
          </button>
        </nav>
      </div>

      <div className="mt-3">
        <div
          id="tabs-with-underline-1"
          role="tabpanel"
          className={`${activeTab ? "hidden" : ""}`}
          aria-labelledby="tabs-with-underline-item-1"
        >
          <div className="bg-white border shadow-md rounded p-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
              Manage Users
            </h3>
            <div className="overflow-x-auto">
              <table
                id="example1"
                className="display  nowwrap w-full table-auto"
              >
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>

                    <th>Mobile</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Popular</th>
                    <th>Sort By</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center p-3 font-semibold"
                      >
                        No available data
                      </td>
                    </tr>
                  ) : (
                    users.map((item, index) => (
                      <tr key={item.userId}>
                        <td>{users.indexOf(item) + 1}</td>
                        <td>
                          <Zoom>
                            {item.userImage ? (
                              <img
                                src={`http://localhost:8001${item.userImage}`}
                                alt={item.userName} // Fallback to blog title if alt text is not provided
                                className="h-10 w-10 object-cover" // Added object-cover for better image fitting
                              />
                            ) : (
                              <p>No image available</p> // Fallback message if no image is present
                            )}
                          </Zoom>
                        </td>

                        <td
                          className="cursor-pointer hover:text-blue-500"
                          onClick={() => fetchUser(item.userId)}
                        >
                          {item.userName}
                        </td>

                        <td>{item.userEmail}</td>

                        <td>{item.userMobile}</td>
                        <td>
                          {item.userCreatedAt
                            ? format(
                                new Date(item.userCreatedAt * 1000),
                                "dd MMM yyyy hh:mm (EEE)",
                                { timeZone: "Asia/Kolkata" }
                              )
                            : "N/A"}
                        </td>
                        <td>
                          {item.userUpdatedAt
                            ? format(
                                new Date(item.userUpdatedAt * 1000),
                                "dd MMM yyyy hh:mm (EEE)",
                                { timeZone: "Asia/Kolkata" }
                              )
                            : "N/A"}
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              toggleUserPopularStatus(
                                item.userId,
                                item.userPopular
                              )
                            }
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {item.userPopular === 0 ? (
                              <IoMdCheckmarkCircleOutline
                                style={{
                                  color: "green",
                                  backgroundColor: "white",
                                }}
                              />
                            ) : (
                              <FaBan style={{ color: "red" }} />
                            )}
                          </button>
                        </td>
                        <td>
                          {editSortBy == item.userId ? (
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
                                onClick={() => handleSortBySubmit(item.userId)}
                                className="ml-2 bg-emerald-300 text-black px-3 py-2 rounded"
                              >
                                <FaCheck />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                handleSortByEdit(item.userId, item.userSortBy)
                              }
                              className="text-black font-bold bg-emerald-300 px-3 py-1 rounded"
                            >
                              {item.userSortBy}
                            </button>
                          )}
                        </td>
                        <td>
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={item.userStatus == 0}
                              onChange={() =>
                                handleToggle(
                                  item.userId,
                                  item.userStatus,
                                  item.userName
                                )
                              }
                            />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-emerald-300"></div>
                          </label>
                        </td>
                        <td>
                          <div className="m-1 hs-dropdown [--trigger:hover] relative inline-flex cursor-pointer">
                            <button
                              id="hs-dropdown-hover-event"
                              type="button"
                              className="hs-dropdown-toggle py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded border-2 border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                              aria-haspopup="menu"
                              aria-expanded="false"
                              aria-label="Dropdown"
                            >
                              Actions
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
                            </button>

                            <div
                              className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 z-50 hidden min-w-24 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="hs-dropdown-hover-event"
                            >
                              <div className="p-1 space-y-0.5">
                                <div
                                  onClick={() => fetchUserData(item.userId)}
                                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-green-100 focus:outline-none focus:bg-green-100"
                                  href="#"
                                >
                                  Edit
                                </div>
                                <div
                                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-red-100 focus:outline-none focus:bg-red-100"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(item.userId);
                                  }}
                                >
                                  Delete
                                </div>
                              </div>
                            </div>
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

        {/* ADD FORM */}
        <div
          id="tabs-with-underline-2"
          className="hidden"
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-2"
        >
          <div className=" mx-auto p-3 sm:p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">Add User</h1>

            <form
              onSubmit={userForm.handleSubmit}
              autoComplete="off"
              className="flex flex-wrap gap-4 sm:gap-6 text-sm"
            >
              {/* Name */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="userName"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Name:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    placeholder="Enter Name"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.userName}
                    className="w-full border-2 border-gray-300 p-2 rounded "
                  />
                  {userForm.touched.userName && userForm.errors.userName && (
                    <p className="text-red-500 text-sm">
                      {userForm.errors.userName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="userEmail"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Email:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    placeholder="Enter Email"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.userEmail}
                    autoComplete="current-email"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.userEmail && userForm.errors.userEmail && (
                    <p className="text-red-500 text-sm">
                      {userForm.errors.userEmail}
                    </p>
                  )}
                </div>
              </div>

              {/*  Image */}
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="userImage"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Image:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="userImage"
                    name="userImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.userImage && userForm.errors.userImage && (
                    <p className="text-red-500 text-sm">
                      {userForm.errors.userImage}
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

              {/* Password */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="userPassword"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Password:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="userPassword"
                    name="userPassword"
                    type="password"
                    placeholder="Enter Password"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.userPassword}
                    autoComplete="current-password"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.userPassword &&
                    userForm.errors.userPassword && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.userPassword}
                      </p>
                    )}
                </div>
              </div>

              {/* Mobile */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="userMobile"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Mobile:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="userMobile"
                    name="userMobile"
                    type="tel"
                    placeholder="Enter Mobile"
                    maxLength={10}
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.userMobile}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.userMobile &&
                    userForm.errors.userMobile && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.userMobile}
                      </p>
                    )}
                </div>
              </div>

              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="userPopular"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Popular:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <select
                    id="userPopular"
                    name="userPopular"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.userPopular}
                    className="w-full border-2 border-gray-300 p-2 rounded "
                  >
                    <option value="" disabled>
                      Select Popular
                    </option>
                    <option value="1">No</option>
                    <option value="0">Yes</option>
                  </select>
                  {userForm.touched.userPopular &&
                    userForm.errors.userPopular && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.userPopular}
                      </p>
                    )}
                </div>
              </div>

              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="userStatus"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Status:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <select
                    id="userStatus"
                    name="userStatus"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    // value={userForm.values.userStatus}
                    className="w-full border-2 border-gray-300 p-2 rounded "
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="0">Active</option>
                    <option value="1">Inactive</option>
                  </select>
                  {userForm.touched.userStatus &&
                    userForm.errors.userStatus && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.userStatus}
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
          className={`${activeTab ? "" : "hidden"}`}
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-3"
        >
          {" "}
          <div className=" mx-auto p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">Edit Blog</h1>
            {activeTab && (
              <form className="flex flex-wrap gap-4 sm:gap-6 text-sm">
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="userName"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Name:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="userName"
                      name="userName"
                      type="text"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.userName && (
                      <p className="text-red-500 text-sm">{errors.userName}</p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="userEmail"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Email:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      type="email"
                      id="userEmail"
                      name="userEmail"
                      placeholder="Enter Blog Description"
                      value={formData.userEmail}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.userEmail && (
                      <p className="text-red-500 text-sm">{errors.userEmail}</p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="userImage"
                    className="w-full sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Upload Image:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="userImage"
                      name="userImage"
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
                    htmlFor="userPassword"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Password:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="userPassword"
                      name="userPassword"
                      type="text"
                      required
                      value={formData.userPassword}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.userPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.userPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="userMobile"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Mobile:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="userMobile"
                      name="userMobile"
                      type="text"
                      maxLength={10}
                      value={formData.userMobile}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.userMobile && (
                      <p className="text-red-500 text-sm">
                        {errors.userMobile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="userPopular"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Popular:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <select
                      id="userPopular"
                      name="userPopular"
                      value={formData.userPopular}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded "
                    >
                      <option value="" disabled>
                        Select Popular
                      </option>
                      <option value="1">No</option>
                      <option value="0">Yes</option>
                    </select>
                    {errors.userPopular && (
                      <p className="text-red-500 text-sm">
                        {errors.userPopular}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="userStatus"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Status:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <select
                      id="userStatus"
                      name="userStatus"
                      value={formData.userStatus}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded "
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="0">Active</option>
                      <option value="1">Inactive</option>
                    </select>
                    {errors.userStatus && (
                      <p className="text-red-500 text-sm">
                        {errors.userStatus}
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

        {/* Modal For View User */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-button" onClick={closeModal}>
                &times;
              </button>
              <h2 className="text-2xl font-semibold text-quaternary mb-4 border-b pb-2">
                User Details
              </h2>
              <form className="grid grid-cols-1 gap-4">
                {/* Image */}
                <div className="flex flex-col items-center">
                  <img
                    src={`http://localhost:8001${formData.userImage}`}
                    alt={formData.userName}
                    className="h-auto w-20 object-cover rounded-lg "
                  />
                </div>

                {/* Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Name:
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    readOnly
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={formData.userEmail}
                    readOnly
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Mobile */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Mobile:
                  </label>
                  <input
                    type="tel"
                    value={formData.userMobile}
                    readOnly
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Password:
                  </label>
                  <input
                    type="text"
                    value={formData.userPassword}
                    readOnly
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Popular */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Popular:
                  </label>
                  <input
                    type="text"
                    value={formData.userPopular == 0 ? "Yes" : "No"}
                    readOnly
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Status:
                  </label>
                  <input
                    type="text"
                    value={formData.userStatus == 0 ? "Active" : "Inactive"}
                    readOnly
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default User;
