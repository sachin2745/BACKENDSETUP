"use client";
import { useEffect, useState } from "react";
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
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import $ from 'jquery';



const Blog = () => {
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
