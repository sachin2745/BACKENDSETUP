'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../Layout/adminLayout";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FaEdit, FaCheck, FaBan } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaSortDown } from "react-icons/fa";
import "./blog.css";
import useAppContext from "@/context/AppContext";
// import $ from 'jquery'; // Import jQuery
// import 'datatables.net'; // DataTables JS
// import 'datatables.net-responsive'; // Responsive extension
// import 'datatables.net-buttons';
// import 'datatables.net-buttons/js/buttons.html5';
// import 'datatables.net-buttons/js/buttons.print';
import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });


const Blog = () => {
  const { currentUser, setCurrentUser } = useAppContext();

  const [blogs, setBlogs] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/admin/blogs/getall"
      ); // Making GET request to the API endpoint
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
    if (blogs.length > 0) {
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
  }, [blogs]);

  // Toggle user status
  const handleToggle = (blogId, currentStatus, blogTitle) => {
    const newStatus = currentStatus == 0 ? 1 : 0; // Toggle between 0 (active) and 1 (inactive)

    // Update the status in the backend
    fetch(`http://localhost:8001/admin/status/${blogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blogStatus: newStatus }),
    })
      .then((res) => {
        if (res.ok) {
          setBlogs((prevData) =>
            prevData.map((blog) =>
              blog.blogId == blogId ? { ...blog, blogStatus: newStatus } : blog
            )
          );
          const firstName = blogTitle;
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
  const handleSortByEdit = (blogId, currentSortBy) => {
    setEditSortBy(blogId); // Enable editing mode for the specific user
    setNewSortBy(currentSortBy); // Pre-fill the input with the current value
  };

  //Function to handle Sort By Submit
  const handleSortBySubmit = (blogId) => {
    // Update the Sort By value in the backend
    fetch(`http://localhost:8001/admin/status/${blogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blogSortBy: newSortBy }),
    })
      .then((res) => {
        if (res.ok) {
          setBlogs((prevData) =>
            prevData.map((blog) =>
              blog.blogId === blogId ? { ...blog, blogSortBy: newSortBy } : blog
            )
          );
          setEditSortBy(null); // Exit editing mode
          toast.success("Sort By updated successfully!");
          //reload page
          window.location.reload();
          // Instead of reloading the page, just refresh data
          fetchBlogs();
        } else {
          toast.error("Failed to update Sort By!");
        }
      })
      .catch((err) => toast.error("Error updating Sort By:", err));
  };

  const [blogDescription, setBlogDescription] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [blogImageMobile, setBlogImageMobile] = useState(null);

  const initialValues = {
    blogTitle: "",
    blogImgAlt: "",
    blogImageName: "",
    blogImageTitle: "",
    blogCategory: "",
    blogKeywords: "",
    blogMetaTitle: "",
    blogForceKeywords: "",
    blogMetaDescription: "",
    blogMetaKeywords: "",
    blogPostDate: "",
    blogStatus: 1,
  };

  const validationSchema = Yup.object({
    blogTitle: Yup.string().required("Blog title is required"),
    blogImgAlt: Yup.string().required("Alt text is required"),
    blogImageName: Yup.string().required("Image name is required"),
    blogImageTitle: Yup.string().required("Image title is required"),
    blogCategory: Yup.string().required("Category is required"),
    blogPostDate: Yup.date().required("Post date is required"),
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("blogDescription", blogDescription);
    formData.append("blogContent", blogContent);
    formData.append("blogImage", blogImage);
    formData.append("blogImageMobile", blogImageMobile);
    Object.keys(values).forEach((key) => formData.append(key, values[key]));

    try {
      const response = await axios.post(
        "http://localhost:8001/admin/addBlog",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Specify content type
            'x-auth-token': currentUser.token, // Include the token in the headers
          },
        }
      );
      console.log("Blog added successfully:", response.data);
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  const editor = useRef(null); //declared a null value 
  const [content, setContent] = useState("Worlds best html page"); //declare using state

  /* The most important point*/
  const config = useMemo( //  Using of useMemo while make custom configuration is strictly recomended 
    () => ({              //  if you don't use it the editor will lose focus every time when you make any change to the editor, even an addition of one character
      /* Custom image uploader button configuretion to accept image and convert it to base64 format */
      uploader: {         
        insertImageAsBase64URI: true,
        imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'] // this line is not much important , use if you only strictly want to allow some specific image format
      },
    }),
    []
  );
  /* function to handle the changes in the editor */
  const handleChange = (value) => {
    setContent(value);
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
            className="hs-tab-active:font-semibold hs-tab-active:border-emerald-500 hs-tab-active:text-emerald-500 py-2 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-emerald-500 focus:outline-none focus:text-emerald-500 disabled:opacity-50 disabled:pointer-events-none active"
            id="tabs-with-underline-item-1"
            aria-selected="true"
            data-hs-tab="#tabs-with-underline-1"
            aria-controls="tabs-with-underline-1"
            role="tab"
          >
            Blog List
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
            Add Blog
          </button>
          <button
            type="button"
            className="hs-tab-active:font-semibold hs-tab-active:border-emerald-500 hs-tab-active:text-emerald-500 py-2 px-1 inline-flex items-center gap-x-2 ml-5 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-emerald-500 focus:outline-none focus:text-emerald-500 disabled:opacity-50 disabled:pointer-events-none"
            id="tabs-with-underline-item-3"
            aria-selected="false"
            data-hs-tab="#tabs-with-underline-3"
            aria-controls="tabs-with-underline-3"
            role="tab"
          >
            Edit Blog
          </button>
        </nav>
      </div>

      <div className="mt-3">
        <div
          id="tabs-with-underline-1"
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-1"
        >
          <div className="bg-white border shadow-md rounded p-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
              Manage Blog
            </h3>
            <table
              id="example1"
              className="display  nowwrap w-100 table-auto  "
            >
              <thead>
                <tr>
                  <th>S.No.</th>
                  {/* <th>Id</th> */}
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  {/* <th>Password</th> */}
                  <th>Keywords</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  {/* <th>Popular</th> */}
                  <th>Sort By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((item) => (
                  <tr key={item.blogId}>
                    <td>{blogs.indexOf(item) + 1}</td>
                    {/* <td>{user.userId}</td> */}
                    <td>
                      <Zoom>
                        <img
                          src={`http://localhost:8001${item.blogImage}`}
                          alt={item.blogImgAlt}
                          className="h-10 w-10"
                        />
                      </Zoom>
                    </td>

                    <td
                      className="cursor-pointer hover:text-blue-500"
                      onClick={() => fetchUser(item.blogTitle)}
                    >
                      {item.blogTitle}
                    </td>
                    <td>{item.blogCategory}</td>
                    {/* <td>{user.userPassword}</td> */}
                    <td>{item.blogKeywords}</td>
                    <td>
                      {item.blogCreatedTime
                        ? format(
                            new Date(item.blogCreatedTime * 1000),
                            "dd MMM yyyy hh:mm (EEE)",
                            { timeZone: "Asia/Kolkata" }
                          )
                        : "N/A"}
                    </td>
                    <td>
                      {item.blogUpdatedTime
                        ? format(
                            new Date(item.blogUpdatedTime * 1000),
                            "dd MMM yyyy hh:mm (EEE)",
                            { timeZone: "Asia/Kolkata" }
                          )
                        : "N/A"}
                    </td>

                    <td>
                      {editSortBy == item.blogId ? (
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
                            onClick={() => handleSortBySubmit(item.blogId)}
                            className="ml-2 bg-green-500 text-white px-3 py-2 rounded"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            handleSortByEdit(item.blogId, item.blogSortBy)
                          }
                          className="text-white  bg-blue-500 px-3 py-1 rounded"
                        >
                          {item.blogSortBy}
                        </button>
                      )}
                    </td>

                    <td>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={item.blogStatus == 0}
                          onChange={() =>
                            handleToggle(
                              item.blogId,
                              item.blogStatus,
                              item.blogTitle
                            )
                          }
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                      </label>
                    </td>
                    <td>
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            Action
                            <FaSortDown
                              aria-hidden="true"
                              className="-mr-1 -mt-1 size-5 text-gray-400"
                            />
                          </MenuButton>
                        </div>

                        <MenuItems
                          transition
                          className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <div className="py-1">
                            <MenuItem>
                              <button
                                onClick={() => fetchUserData(item.blogId)} // Replace 1 with the desired userId
                                className="block px-4 py-2 text-sm text-gray-700"
                              >
                                Edit
                              </button>
                            </MenuItem>
                            <MenuItem>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(item.blogId);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                              >
                                Delete
                              </button>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          id="tabs-with-underline-2"
          className="hidden"
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-2"
        >
          <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-6">Add Blog</h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, setFieldValue }) => (
                <Form className="space-y-6">
                  <div className="flex items-center">
                    <label className="w-1/4 text-right pr-4">Blog Title</label>
                    <Field
                      name="blogTitle"
                      className="w-3/4 p-2 border rounded-md"
                      placeholder="Enter blog title"
                    />
                    {errors.blogTitle && touched.blogTitle && (
                      <div className="text-red-500 text-sm">
                        {errors.blogTitle}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <label className="w-1/4 text-right pr-4">
                      Blog Description
                    </label>
                    <div className="w-3/4">
                      {/* <JoditEditor
                        value={blogDescription}
                        onChange={(value) => setBlogDescription(value)}
                      /> */}
                       <JoditEditor 
                          ref={editor}            //This is important
                          value={content}         //This is important
                          config={config}         //Only use when you declare some custom configs
                          onChange={handleChange} //handle the changes
                          className="w-full h-[70%] mt-10 bg-white"
                          />
                           <style>
              {`.jodit-wysiwyg{height:300px !important}`}
            </style>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label className="w-1/4 text-right pr-4">
                      Blog Content
                    </label>
                    <div className="w-3/4">
                      {/* <JoditEditor
                        value={blogContent}
                        onChange={(value) => setBlogContent(value)}
                      /> */}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label className="w-1/4 text-right pr-4">Blog Image</label>
                    <input
                      type="file"
                      className="w-3/4"
                      onChange={(e) => setBlogImage(e.target.files[0])}
                    />
                    {blogImage && (
                      <img
                        src={URL.createObjectURL(blogImage)}
                        alt="Preview"
                        className="w-20 h-20 object-cover mt-2"
                      />
                    )}
                  </div>

                  <div className="flex items-center">
                    <label className="w-1/4 text-right pr-4">
                      Blog Image Mobile
                    </label>
                    <input
                      type="file"
                      className="w-3/4"
                      onChange={(e) => setBlogImageMobile(e.target.files[0])}
                    />
                    {blogImageMobile && (
                      <img
                        src={URL.createObjectURL(blogImageMobile)}
                        alt="Preview"
                        className="w-20 h-20 object-cover mt-2"
                      />
                    )}
                  </div>

                  <div className="flex items-center">
                    <label className="w-1/4 text-right pr-4">Category</label>
                    <Field
                      as="select"
                      name="blogCategory"
                      className="w-3/4 p-2 border rounded-md"
                    >
                      <option value="">Select a category</option>
                      {blogCategories.map((category) => (
                        <option key={category.blog_category_id } value={category.blog_category_id }>
                          {category.blog_category_name}
                        </option>
                      ))}
                    </Field>
                    {errors.blogCategory && touched.blogCategory && (
                      <div className="text-red-500 text-sm">
                        {errors.blogCategory}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div
          id="tabs-with-underline-3"
          className="hidden"
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-3"
        >
          <p className="text-gray-500">
            This is the <em className="font-semibold text-gray-800">third</em>{" "}
            item's tab body.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Blog;
