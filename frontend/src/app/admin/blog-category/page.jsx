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

const blogCategory = () => {
  const { currentUser, setCurrentUser } = useAppContext();

  const [blogs, setBlogs] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/admin/blogs/getall"
      ); // Making GET request to the API endpoint
      //   console.log(response.data);
      const data = response.data; // Extracting the data from the response

      // Setting the state with the fetched data
      setBlogs(data.blogs);
      setBlogCategories(data.blogCategories);
    } catch (err) {
      console.log(err.message); // Catching any error and setting the error state
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Initialize DataTable
  useEffect(() => {
    if (blogCategories.length > 0) {
      $("#example1").DataTable({
        responsive: true,
        destroy: true, // Prevent reinitialization issues
        dom: "Bfrtip", // Add buttons layout
        buttons: ["copy", "csv", "excel", "pdf", "print"], // Export options
        pageLength: 10,
        language: {
          searchPlaceholder: "...",
          paginate: {
            previous: "<", // Replaces "Previous" with "<"
            next: ">", // Replaces "Next" with ">"
          },
        },
        pagingType: "simple_numbers", // Options: 'simple', 'simple_numbers', 'full', 'full_numbers'
      });
    }
  }, [blogCategories]);

  // Toggle user status
  const handleToggle = (
    blog_category_id,
    currentStatus,
    blog_category_name
  ) => {
    const newStatus = currentStatus == 0 ? 1 : 0; // Toggle between 0 (active) and 1 (inactive)

    // Update the status in the backend
    fetch(`http://localhost:8001/admin/blog-cat-status/${blog_category_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blog_category_status: newStatus }),
    })
      .then((res) => {
        if (res.ok) {
          setBlogCategories((prevData) =>
            prevData.map((blogcat) =>
              blogcat.blog_category_id == blog_category_id
                ? { ...blogcat, blog_category_status: newStatus }
                : blogcat
            )
          );
          const firstName = blog_category_name;
          toast.success("Successfully status updated for " + firstName + "!");
        } else {
          // console.error('Failed to update user status');
          toast.error("Failed to update blog category status!");
        }
      })
      .catch((err) => toast.error("Error updating status:", err));
    //  console.error('Error updating status:', err));
  };

  //Add blog categrory
  const formik = useFormik({
    initialValues: {
      blog_category_name: "",
      blog_category_sku: "",
      blog_category_meta_title: "",
      blog_category_meta_desc: "",
      blog_category_meta_keywords: "",
      blog_category_status: 1,
    },
    validationSchema: Yup.object({
      blog_category_name: Yup.string()
        .min(5, "Name must be at least 5 characters")
        .required("Name is required"),
      blog_category_sku: Yup.string().required("Sku is required"),

      blog_category_meta_title: Yup.string()
        .max(60, "Meta Title must be at most 60 characters")
        .required("Meta Title is required"),

      blog_category_meta_desc: Yup.string()
        .max(160, "Meta Description must be at most 160 characters")
        .required("Meta Description is required"),

      blog_category_meta_keywords: Yup.string()
        .max(255, "Meta Keywords must be at most 255 characters")
        .required("Meta Keywords is required"),
    }),
    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
      const sanitizeSlug = (sku) => {
        return sku
          .toLowerCase()
          .replace(/ /g, "-") // Replace spaces with dashes
          .replace(/[\/|?%$,;:'"]/g, "") // Remove specific characters
          .replace(/ \\<.*?\\>/g, ""); // Remove any tags
      };

      const sanitizedSKU = sanitizeSlug(values.blog_category_sku);

      const formData = new FormData();
      formData.append("blog_category_name", values.blog_category_name);
      formData.append("blog_category_sku", sanitizedSKU);
      formData.append("blog_category_status", values.blog_category_status);
      formData.append(
        "blog_category_meta_title",
        values.blog_category_meta_title
      );
      formData.append(
        "blog_category_meta_desc",
        values.blog_category_meta_desc
      );
      formData.append(
        "blog_category_meta_keywords",
        values.blog_category_meta_keywords
      );

      try {
        const response = await axios.post(
          "http://localhost:8001/admin/add-blog-category",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-auth-token": currentUser.token,
            },
          }
        );
        toast.success("Blog Category submitted successfully!");
        // userForm.resetForm();
        formik.resetForm();
        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000); // 2-second delay to let the notification show
      } catch (error) {
        console.error("Error submitting blog:", error);
        const errorMessage =
          error.response?.data?.message || "Error submitting blog.";
        toast.error(errorMessage);
      }
    },
  });

  // Edit Blog
  const [formData, setFormData] = useState({
    blog_category_name: "",
    blog_category_sku: "",
    blog_category_meta_title: "",
    blog_category_meta_desc: "",
    blog_category_meta_keywords: "",
  });
  const [activeTab, setActiveTab] = useState(0);

  const fetchBlogCatData = async (blog_category_id) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/admin/get-blog-category/${blog_category_id}`
      );
      const {
        blog_category_name,
        blog_category_sku,
        blog_category_meta_title,
        blog_category_meta_desc,
        blog_category_meta_keywords,
      } = response.data;

      // console.log("response", response.data);

      setFormData({
        blog_category_id,
        blog_category_name,
        blog_category_sku,
        blog_category_meta_title,
        blog_category_meta_desc,
        blog_category_meta_keywords,
      });

      setActiveTab(2);
    } catch (error) {
      console.error("Error fetching blog category data:", error);
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      // console.log("formData", formData);
      const blog_category_id = formData.blog_category_id;

      const sanitizeSlug = (sku) => {
        return sku
          .toLowerCase()
          .replace(/ /g, "-") // Replace spaces with dashes
          .replace(/[\/|?%$,;:'"]/g, "") // Remove specific characters
          .replace(/ \\<.*?\\>/g, ""); // Remove any tags
      };

      const sanitizedSKU = sanitizeSlug(formData.blog_category_sku);

      data.append("blog_category_name", formData.blog_category_name);
      data.append("blog_category_sku", sanitizedSKU);
      data.append(
        "blog_category_meta_title",
        formData.blog_category_meta_title
      );
      data.append("blog_category_meta_desc", formData.blog_category_meta_desc);
      data.append(
        "blog_category_meta_keywords",
        formData.blog_category_meta_keywords
      );

      await axios.post(
        `http://localhost:8001/admin/update-blog-category/${blog_category_id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Blog category updated successfully!");

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Error updating blog:", error);
    }
  };

  const handleCatDelete = (blog_category_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this blog category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Send request to update the user's status to 3
        fetch(
          `http://localhost:8001/admin/blog-cat-status/${blog_category_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ blog_category_status: 3 }),
          }
        )
          .then((response) => {
            if (response.ok) {
              toast.success(
                "The blog category has been deleted Successfully!."
              );
              // Instead of reloading the page, just refresh data
              fetchBlogs();
            } else {
              toast.error("Failed to delete the blog category.");
            }
          })
          .catch(() => {
            toast.error("An error occurred while deleting the blog category.");
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
            Blog Category List
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
            Add Blog Category
          </button>
          <button
            className={`py-2 px-1 inline-flex items-center gap-x-2 ml-5 border-b-2  text-sm whitespace-nowrap  hover:text-emerald-500 focus:outline-none focus:text-emerald-500 ${
              activeTab === 2
                ? "font-semibold border-emerald-500 text-emerald-500"
                : "hidden"
            }`}
            onClick={() => setActiveTab(2)}
            aria-selected={activeTab === 2}
          >
            Edit Blog Category
          </button>
        </nav>
      </div>

      <div className="mt-3">
        <div className={`${activeTab === 0 ? "" : "hidden"}`}>
          <div className="bg-white border shadow-md rounded p-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
              Manage Blog Categories
            </h3>
            <table id="example1" className="display nowwrap w-full table-auto">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name</th>
                  <th>Sku</th>
                  <th>Meta Title</th>
                  <th>Meta Description</th>
                  <th>Meta Keywords</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogCategories.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center p-3 font-semibold">
                      No available data
                    </td>
                  </tr>
                ) : (
                  blogCategories.map((item, index) => (
                    <tr key={item.blog_category_id}>
                      <td>{blogCategories.indexOf(item) + 1}</td>
                      <td>{item.blog_category_name}</td>
                      <td>{item.blog_category_sku}</td>
                      <td>{item.blog_category_meta_title}</td>
                      <td>{item.blog_category_meta_desc}</td>
                      <td>{item.blog_category_meta_keywords}</td>
                      <td>
                        {item.blog_category_time
                          ? format(
                              new Date(item.blog_category_time * 1000),
                              "dd MMM yyyy hh:mm (EEE)",
                              { timeZone: "Asia/Kolkata" }
                            )
                          : "N/A"}
                      </td>
                      {/* <td>
                        {item.blogUpdatedTime
                          ? format(
                              new Date(item.blogUpdatedTime * 1000),
                              "dd MMM yyyy hh:mm (EEE)",
                              { timeZone: "Asia/Kolkata" }
                            )
                          : "N/A"}
                      </td> */}

                      <td>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.blog_category_status == 0}
                            onChange={() =>
                              handleToggle(
                                item.blog_category_id,
                                item.blog_category_status,
                                item.blog_category_name
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
                                onClick={() =>
                                  fetchBlogCatData(item.blog_category_id)
                                }
                                className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-green-100 focus:outline-none focus:bg-green-100"
                                href="#"
                              >
                                Edit
                              </div>
                              <div
                                className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-red-100 focus:outline-none focus:bg-red-100"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCatDelete(item.blog_category_id);
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

        {/* ADD FORM */}
        <div className={`${activeTab === 1 ? "" : "hidden"}`}>
          <div className=" mx-auto p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">
              Create Blog Category
            </h1>
            <form
              onSubmit={formik.handleSubmit}
              autoComplete="off"
              className="flex flex-wrap gap-4 sm:gap-6 text-sm"
            >
              {/* Blog Title */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="blog_category_name"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Name:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="blog_category_name"
                    name="blog_category_name"
                    type="text"
                    placeholder="Enter Blog Category Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blog_category_name}
                    className="w-full border-2 border-gray-300 p-2 rounded "
                  />
                  {formik.touched.blog_category_name &&
                    formik.errors.blog_category_name && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.blog_category_name}
                      </p>
                    )}
                </div>
              </div>
              {/* Blog SKU */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="blog_category_sku"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  SKU:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="blog_category_sku"
                    name="blog_category_sku"
                    type="text"
                    placeholder="Enter Blog Category SKU"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blog_category_sku}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formik.touched.blog_category_sku &&
                    formik.errors.blog_category_sku && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.blog_category_sku}
                      </p>
                    )}
                </div>
              </div>
              <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
                <legend className="text-xl font-semibold">
                  Meta Details :
                </legend>
                {/* Blog Meta Title */}
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="blog_category_meta_title"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Title:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="blog_category_meta_title"
                      name="blog_category_meta_title"
                      type="text"
                      placeholder="Enter Blog Category Meta Title"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.blog_category_meta_title}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formik.touched.blog_category_meta_title &&
                      formik.errors.blog_category_meta_title && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.blog_category_meta_title}
                        </p>
                      )}
                  </div>
                </div>

                {/* Blog Meta Description */}
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="blog_category_meta_desc"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Description:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <textarea
                      id="blog_category_meta_desc"
                      name="blog_category_meta_desc"
                      placeholder="Enter Blog Category Meta Description"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.blog_category_meta_desc}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formik.touched.blog_category_meta_desc &&
                      formik.errors.blog_category_meta_desc && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.blog_category_meta_desc}
                        </p>
                      )}
                  </div>
                </div>

                {/* Blog Meta Keywords */}
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="blog_category_meta_keywords"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Keywords:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="blog_category_meta_keywords"
                      name="blog_category_meta_keywords"
                      type="text"
                      placeholder="Enter Blog Category Meta Keywords"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.blog_category_meta_keywords}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formik.touched.blog_category_meta_keywords &&
                      formik.errors.blog_category_meta_keywords && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.blog_category_meta_keywords}
                        </p>
                      )}
                  </div>
                </div>
              </fieldset>
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
        <div className={`${activeTab === 2 ? "" : "hidden"}`}>
          <div className=" mx-auto p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">Edit Blog</h1>
            {activeTab && (
              <form
                onSubmit={handleEditFormSubmit}
                className="flex flex-wrap gap-4 sm:gap-6 text-sm"
              >
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="blog_category_name"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Name:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="blog_category_name"
                      name="blog_category_name"
                      type="text"
                      value={formData.blog_category_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          blog_category_name: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="blog_category_sku"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    SKU:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      type="text"
                      id="blog_category_sku"
                      name="blog_category_sku"
                      placeholder="Enter Blog Category Sku"
                      value={formData.blog_category_sku}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          blog_category_sku: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>
                <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
                  <legend className="text-xl font-semibold">
                    Meta Details :
                  </legend>
                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="blog_category_meta_title"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Title:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="blog_category_meta_title"
                        name="blog_category_meta_title"
                        type="text"
                        value={formData.blog_category_meta_title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            blog_category_meta_title: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="blog_category_meta_desc"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Description:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <textarea
                        id="blog_category_meta_desc"
                        name="blog_category_meta_desc"
                        value={formData.blog_category_meta_desc}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            blog_category_meta_desc: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="blog_category_meta_keywords"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Keywords:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="blog_category_meta_keywords"
                        name="blog_category_meta_keywords"
                        type="text"
                        value={formData.blog_category_meta_keywords}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            blog_category_meta_keywords: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>
                </fieldset>
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

export default blogCategory;
