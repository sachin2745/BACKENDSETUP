"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaSortDown } from "react-icons/fa";
import "./blog.css";
import Swal from "sweetalert2";
import useAppContext from "@/context/AppContext";
// import $ from "jquery"; // Import jQuery
// import "datatables.net"; // DataTables JS
// import "datatables.net-responsive"; // Responsive extension
// import "datatables.net-buttons";
// import "datatables.net-buttons/js/buttons.html5";
// import "datatables.net-buttons/js/buttons.print";
import dynamic from "next/dynamic";
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
      console.log(response.data);
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

  //Add blog
  const [previewImage, setPreviewImage] = useState(null);
  const [previewMobileImage, setPreviewMobileImage] = useState(null);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];

    if (file && file.size > 2 * 1024 * 1024) {
      alert("File size should not exceed 2MB");
      return;
    }

    // Set the preview image based on the type (desktop or mobile)
    const imageUrl = URL.createObjectURL(file);
    if (type === "desktop") {
      setPreviewImage(imageUrl);
      formik.setFieldValue("blogImage", file);
    } else if (type === "mobile") {
      setPreviewMobileImage(imageUrl);
      formik.setFieldValue("blogImageMobile", file);
    }
  };

  const formik = useFormik({
    initialValues: {
      blogTitle: "",
      blogContent: "",
      blogDescription: "",
      blogImage: null,
      blogImageMobile: null,
      blogImgAlt: "",
      blogCategory: "",
      blogKeywords: "",
      blogMetaTitle: "",
      blogMetaDescription: "",
      blogMetaKeywords: "",
      blogForceKeywords: "",
      blogSKU: "",
      blogSchema: "",
      blogStatus: 1,
    },
    validationSchema: Yup.object({
      blogTitle: Yup.string()
        .min(5, "Title must be at least 5 characters")
        .required("Title is required"),
      blogDescription: Yup.string()
        .min(20, "Description must be at least 20 characters")
        .required("Description is required"),
      blogContent: Yup.string().required("Content is required"),
      blogImage: Yup.mixed().required("Blog image is required"),
      blogImageMobile: Yup.mixed().required("Blog image is required"),
      blogImgAlt: Yup.string().required("Please enter a image alt text"),
      blogCategory: Yup.string().required("Please select a category"),
      blogKeywords: Yup.string().required("Keywords is required"),
      blogMetaTitle: Yup.string().required("Meta title is required"),
      blogMetaDescription: Yup.string().required(
        "Meta description is required"
      ),
      blogMetaKeywords: Yup.string().required("Meta Keywords is required"),
      blogForceKeywords: Yup.string().required("Force Keywords is required"),
      blogSKU: Yup.string().required("Sku is required"),
      blogSchema: Yup.string().required("Schema is required"),
    }),
    onSubmit: async (values) => {
      const sanitizeSlug = (sku) => {
        return sku
          .toLowerCase()
          .replace(/ /g, "-") // Replace spaces with dashes
          .replace(/[\/|?%$,;:'"]/g, "") // Remove specific characters
          .replace(/ \\<.*?\\>/g, ""); // Remove any tags
      };

      const sanitizedSKU = sanitizeSlug(values.blogSKU);

      const formData = new FormData();
      formData.append("blogTitle", values.blogTitle);
      formData.append("blogDescription", values.blogDescription);
      formData.append("blogContent", values.blogContent);
      formData.append("blogImage", values.blogImage);
      formData.append("blogImageMobile", values.blogImageMobile);
      formData.append("blogImgAlt", values.blogImgAlt);
      formData.append("blogCategory", values.blogCategory);
      formData.append("blogKeywords", values.blogKeywords);
      formData.append("blogMetaTitle", values.blogMetaTitle);
      formData.append("blogMetaDescription", values.blogMetaDescription);
      formData.append("blogMetaKeywords", values.blogMetaKeywords);
      formData.append("blogForceKeywords", values.blogForceKeywords);
      formData.append("blogSKU", sanitizedSKU);
      formData.append("blogSchema", values.blogSchema);
      formData.append("blogStatus", values.blogStatus);

      try {
        const response = await axios.post(
          "http://localhost:8001/admin/addblog",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-auth-token": currentUser.token,
            },
          }
        );
        toast.success("Blog submitted successfully!");
        // userForm.resetForm();

        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000); // 2-second delay to let the notification show
      } catch (error) {
        console.error("Error submitting blog:", error);
        alert("Error submitting blog.");
      }
    },
  });

  // const editorDescription = useRef(null);
  const editorContent = useRef(null);

  /* The most important point*/
  const config = useMemo(
    () => ({
      uploader: {
        insertImageAsBase64URI: true,
      },
      readonly: false,
    }),
    []
  );

  // Edit Blog
  const [formData, setFormData] = useState({
    blogId: "",
    blogTitle: "",
    blogDescription: "",
    blogContent: "",
    blogImage: null,
    blogImageMobile: null,
    blogImgAlt: "",
    blogCategory: "",
    blogKeywords: "",
    blogMetaTitle: "",
    blogMetaDescription: "",
    blogMetaKeywords: "",
    blogForceKeywords: "",
    blogSKU: "",
    blogSchema: "",
  });
  const [previewEditImage, setPreviewEditImage] = useState(null);
  const [previewMobileEditImage, setPreviewMobileEditImage] = useState(null);
  const [activeTab, setActiveTab] = useState(false);

  const fetchBlogData = async (blogId) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/admin/get-blog/${blogId}`
      );
      const {
        blogTitle,
        blogDescription,
        blogContent,
        blogImage,
        blogImageMobile,
        blogImgAlt,
        blogCategory,
        blogKeywords,
        blogMetaTitle,
        blogMetaDescription,
        blogMetaKeywords,
        blogForceKeywords,
        blogSKU,
        blogSchema,
      } = response.data;

      // console.log("response", response.data);
      // Find the corresponding category ID
      const category = blogCategories.find(
        (cat) => cat.blog_category_name === blogCategory
      );
      const categoryId = category ? category.blog_category_id : "";

      setFormData({
        blogId,
        blogTitle,
        blogDescription,
        blogContent,
        blogImage: blogImage ? `http://localhost:8001${blogImage}` : null,
        blogImageMobile: blogImageMobile ? `http://localhost:8001${blogImageMobile}` : null,
        blogImgAlt,
        blogCategory: categoryId,
        blogKeywords,
        blogMetaTitle,
        blogMetaDescription,
        blogMetaKeywords,
        blogForceKeywords,
        blogSKU,
        blogSchema,
      });

      

      // Ensure full URL for both images
      setPreviewEditImage(blogImage ? `http://localhost:8001${blogImage}` : null);
    setPreviewMobileEditImage(blogImageMobile ? `http://localhost:8001${blogImageMobile}` : null);
    setActiveTab(true);
    } catch (error) {
      console.error("Error fetching blog data:", error);
    }
  };

  const handleEditImageChange = (e, type) => {
    const file = e.target.files[0];

    if (type === "blogImage") {
      setFormData({ ...formData, blogImage: file });
      setPreviewEditImage(URL.createObjectURL(file));
    } else if (type === "blogImageMobile") {
      setFormData({ ...formData, blogImageMobile: file });
      setPreviewMobileEditImage(URL.createObjectURL(file));
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      // console.log("formData", formData);
      const blogId = formData.blogId;

      const sanitizeSlug = (sku) => {
        return sku
          .toLowerCase()
          .replace(/ /g, "-") // Replace spaces with dashes
          .replace(/[\/|?%$,;:'"]/g, "") // Remove specific characters
          .replace(/ \\<.*?\\>/g, ""); // Remove any tags
      };

      const sanitizedSKU = sanitizeSlug(formData.blogSKU);

      data.append("blogTitle", formData.blogTitle);
      data.append("blogDescription", formData.blogDescription);
      data.append("blogContent", formData.blogContent);
      if (formData.blogImage) {
        data.append("blogImage", formData.blogImage);
      } else {
        data.append("blogImageURL", previewEditImage); // Send existing URL
      }
  
      if (formData.blogImageMobile) {
        data.append("blogImageMobile", formData.blogImageMobile);
      } else {
        data.append("blogImageMobileURL", previewMobileEditImage); // Send existing URL
      }
      data.append("blogImgAlt", formData.blogImgAlt);
      data.append("blogCategory", formData.blogCategory);
      data.append("blogKeywords", formData.blogKeywords);
      data.append("blogMetaTitle", formData.blogMetaTitle);
      data.append("blogMetaDescription", formData.blogMetaDescription);
      data.append("blogMetaKeywords", formData.blogMetaKeywords);
      data.append("blogForceKeywords", formData.blogForceKeywords);
      data.append("blogSKU", sanitizedSKU);
      data.append("blogSchema", formData.blogSchema);

      await axios.post(
        `http://localhost:8001/admin/update-blog/${blogId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Blog updated successfully!");

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Error updating blog:", error);
    }
  };

  const handleDelete = (blogId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Send request to update the user's status to 3
        fetch(`http://localhost:8001/admin/status/${blogId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blogStatus: 3 }),
        })
          .then((response) => {
            if (response.ok) {
              toast.success("The blog has been deleted Successfully!.");
              // Instead of reloading the page, just refresh data
              fetchBlogs();
            } else {
              toast.error("Failed to delete the blog.");
            }
          })
          .catch(() => {
            toast.error("An error occurred while deleting the blog.");
          });
      }
    });
  };

  //Data comes from editor
  const extractTextFromHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || doc.body.innerText || "";
  };

  const truncatedDescription = (html) => {
    const plainText = extractTextFromHTML(html);
    return (
      plainText
        .split(" ") // Split the text into words
        .slice(0, 10) // Slice the first 20 words
        .join(" ") + (plainText.split(" ").length > 10 ? "..." : "")
    );
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
            className={`hs-tab-active:font-semibold hs-tab-active:border-emerald-500 hs-tab-active:text-emerald-500 py-2 px-1 inline-flex items-center gap-x-2 ml-5 border-b-2 text-sm whitespace-nowrap  hover:text-emerald-500 focus:outline-none focus:text-emerald-500  ${
              activeTab ? "active" : "hidden"
            }`}
            id="tabs-with-underline-item-3"
            aria-selected={activeTab}
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
          className={`${activeTab ? "hidden" : ""}`}
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
                  <th>Image</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Category</th>
                  {/* <th>Keywords</th> */}
                  <th>Created At</th>
                  {/* <th>Updated At</th> */}
                  <th>Sort By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center p-3 font-semibold">
                      No available data
                    </td>
                  </tr>
                ) : (
                  blogs.map((item, index) => (
                    <tr key={item.blogId}>
                      <td>{blogs.indexOf(item) + 1}</td>
                      {/* <td>{user.userId}</td> */}
                      <td>
                        <Zoom>
                          {item.blogImage ? (
                            <img
                              src={`http://localhost:8001${item.blogImage}`}
                              alt={item.blogImgAlt || item.blogTitle} // Fallback to blog title if alt text is not provided
                              className="h-10 w-10 object-cover" // Added object-cover for better image fitting
                            />
                          ) : (
                            <p>No image available</p> // Fallback message if no image is present
                          )}
                        </Zoom>
                      </td>
                      <td>
                        <Zoom>
                          {item.blogImageMobile ? (
                            <img
                              src={`http://localhost:8001${item.blogImageMobile}`}
                              alt={item.blogImgAlt || item.blogTitle} // Fallback to blog title if alt text is not provided
                              className="h-10 w-10 object-cover" // Added object-cover for better image fitting
                            />
                          ) : (
                            <p>No image available</p> // Fallback message if no image is present
                          )}
                        </Zoom>
                      </td>
                      <td
                        className="cursor-pointer hover:text-blue-500"
                        onClick={() => fetchUser(item.blogTitle)}
                      >
                        {item.blogTitle}
                      </td>
                      <td>
                        {/* <div dangerouslySetInnerHTML={{ __html: item.blogDescription }} /> */}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: truncatedDescription(item.blogContent),
                          }}
                        />
                      </td>
                      <td>{item.blogCategory}</td>
                      {/* <td>{user.userPassword}</td> */}
                      {/* <td>{item.blogKeywords}</td> */}
                      <td>
                        {item.blogCreatedTime
                          ? format(
                              new Date(item.blogCreatedTime * 1000),
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
                                  onClick={() => fetchBlogData(item.blogId)}
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
                  ))
                )}
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
          <div className=" mx-auto p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">Create Blog</h1>

            <form
              onSubmit={formik.handleSubmit}
              autoComplete="off"
              className="flex flex-wrap gap-6 text-sm"
            >
              {/* Blog Title */}
              <div className="flex w-full  items-center">
                <label
                  htmlFor="blogTitle"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Title:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogTitle"
                    name="blogTitle"
                    type="text"
                    placeholder="Enter Blog Title"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogTitle}
                    className="w-full border-2 border-gray-300 p-2 rounded "
                  />
                  {formik.touched.blogTitle && formik.errors.blogTitle && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.blogTitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Blog Description */}
              <div className="flex w-full  items-center">
                <label
                  htmlFor="blogDescription"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Description:
                </label>
                <div className="w-[80%]">
                  <textarea
                    id="blogDescription"
                    name="blogDescription"
                    placeholder="Enter Blog Description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogDescription}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formik.touched.blogDescription &&
                    formik.errors.blogDescription && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.blogDescription}
                      </p>
                    )}
                </div>
              </div>

              {/* Blog Content */}
              <div className="flex w-full  items-center">
                <label
                  htmlFor="blogContent"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Description:
                </label>
                <div className="w-[80%]">
                  <JoditEditor
                    ref={editorContent}
                    config={config}
                    id="blogContent"
                    name="blogContent"
                    placeholder="Enter blog description"
                    onChange={(newContent) => {
                      formik.setFieldValue("blogContent", newContent);
                    }}
                    onBlur={() => {
                      formik.setFieldTouched("blogContent", true);
                    }}
                    value={formik.values.blogContent}
                  />
                  {formik.touched.blogContent && formik.errors.blogContent && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.blogContent}
                    </p>
                  )}
                </div>
              </div>

              {/* Blog Image */}
              <div className="flex w-full items-center">
                <label
                  htmlFor="blogImage"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Image:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogImage"
                    name="blogImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "desktop")}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formik.touched.blogImage && formik.errors.blogImage && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.blogImage}
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

              {/* Blog Image Mobile */}
              <div className="flex w-full items-center">
                <label
                  htmlFor="blogImageMobile"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Image Mobile:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogImageMobile"
                    name="blogImageMobile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "mobile")}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formik.touched.blogImageMobile &&
                    formik.errors.blogImageMobile && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.blogImageMobile}
                      </p>
                    )}
                  {previewMobileImage && (
                    <div className="flex justify-center my-3">
                      <img
                        src={previewMobileImage}
                        alt="Preview"
                        className="rounded shadow"
                        width="100"
                        height="100"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Blog Image Alt */}
              <div className="flex w-full  items-center">
                <label
                  htmlFor="blogImgAlt"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Image Alt:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogImgAlt"
                    name="blogImgAlt"
                    type="text"
                    placeholder="Enter Blog Image Alt"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogImgAlt}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formik.touched.blogImgAlt && formik.errors.blogImgAlt && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.blogImgAlt}
                    </p>
                  )}
                </div>
              </div>

              {/* Blog Category */}
              <div className="flex w-full  items-center">
                <label
                  htmlFor="blogCategory"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Category:
                </label>
                <div className="w-[80%]">
                  <select 
                    id="blogCategory"
                    name="blogCategory"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogCategory}
                    className="w-full border-2 border-gray-300 p-2 rounded "
                  >
                    <option value="" label="Select a category" />
                    {blogCategories.map((category) => (
                      <option
                        key={category.blog_category_id}
                        value={category.blog_category_id}
                      >
                        {category.blog_category_name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.blogCategory &&
                    formik.errors.blogCategory && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.blogCategory}
                      </p>
                    )}
                </div>
              </div>

              {/* Blog Keywords */}
              <div className="flex w-full  items-center">
                <label
                  htmlFor="blogKeywords"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Keywords:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogKeywords"
                    name="blogKeywords"
                    type="text"
                    placeholder="Enter Blog Keywords"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogKeywords}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formik.touched.blogKeywords &&
                    formik.errors.blogKeywords && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.blogKeywords}
                      </p>
                    )}
                </div>
              </div>

              {/* Blog Meta Title */}
              <div className="flex w-full  items-center">
                <label
                  htmlFor="blogMetaTitle"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Meta Title:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogMetaTitle"
                    name="blogMetaTitle"
                    type="text"
                    placeholder="Enter Meta Title"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogMetaTitle}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formik.touched.blogMetaTitle &&
                    formik.errors.blogMetaTitle && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.blogMetaTitle}
                      </p>
                    )}
                </div>
              </div>

              {/* Blog Meta Description */}
              <div className="flex w-full  items-center">
                <label
                  htmlFor="blogMetaDescription"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Meta Description:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogMetaDescription"
                    name="blogMetaDescription"
                    type="text"
                    placeholder="Enter Meta Description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogMetaDescription}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formik.touched.blogMetaDescription &&
                    formik.errors.blogMetaDescription && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.blogMetaDescription}
                      </p>
                    )}
                </div>
              </div>

              {/* Blog Meta Keywords */}
              <div className="flex w-full  items-center">
                <label
                  htmlFor="blogMetaKeywords"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Meta Keywords:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogMetaKeywords"
                    name="blogMetaKeywords"
                    type="text"
                    placeholder="Enter Meta Keywords"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogMetaKeywords}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formik.touched.blogMetaKeywords &&
                    formik.errors.blogMetaKeywords && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.blogMetaKeywords}
                      </p>
                    )}
                </div>
              </div>

              {/* Blog Force Keywords */}
              <div className="flex w-full  items-center">
                <label
                  htmlFor="blogForceKeywords"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Force Keywords:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogForceKeywords"
                    name="blogForceKeywords"
                    type="text"
                    placeholder="Enter Force Keywords"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogForceKeywords}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formik.touched.blogForceKeywords &&
                    formik.errors.blogForceKeywords && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.blogForceKeywords}
                      </p>
                    )}
                </div>
              </div>

              {/* Blog SKU */}
              <div className="flex w-full  items-center">
                <label
                  htmlFor="blogSKU"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog SKU:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogSKU"
                    name="blogSKU"
                    type="text"
                    placeholder="Enter SKU"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogSKU}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formik.touched.blogSKU && formik.errors.blogSKU && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.blogSKU}
                    </p>
                  )}
                </div>
              </div>

              {/* Blog Schema */}
              <div className="flex w-full  items-center">
                <label
                  htmlFor="blogSchema"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Schema:
                </label>
                <div className="w-[80%]">
                  <textarea
                    id="blogSchema"
                    name="blogSchema"
                    placeholder="Enter Schema"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogSchema}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formik.touched.blogSchema && formik.errors.blogSchema && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.blogSchema}
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
        <div
          id="tabs-with-underline-3"
          className={`${activeTab ? "" : "hidden"}`}
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-3"
        > <div className=" mx-auto p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">Edit Blog</h1>
          {activeTab && (
            <form
              onSubmit={handleEditFormSubmit}
              className="flex flex-wrap gap-6 text-sm"
            >
              <div className="flex w-full items-center">
                <label
                  htmlFor="blogTitle"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Title:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogTitle"
                    name="blogTitle"
                    type="text"
                    value={formData.blogTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, blogTitle: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                </div>
              </div>

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogDescription"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Description:
                </label>
                <div className="w-[80%]">
                  <textarea
                    id="blogDescription"
                    name="blogDescription"
                    placeholder="Enter Blog Description"
                    value={formData.blogDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        blogDescription: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                </div>
              </div>

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogContent"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Content:
                </label>
                <div className="w-[80%]">
                  <JoditEditor
                    value={formData.blogContent}
                    onChange={(content) =>
                      setFormData({ ...formData, blogContent: content })
                    }
                  />
                </div>
              </div>

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogImage"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Image:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogImage"
                    name="blogImage"
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => handleEditImageChange(e, "blogImage")}
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

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogImageMobile"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Image Mobile:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogImageMobile"
                    name="blogImageMobile"
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) =>
                      handleEditImageChange(e, "blogImageMobile")
                    }
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {previewMobileEditImage && (
                    <img
                      src={previewMobileEditImage}
                      alt="Mobile Preview"
                      width="100"
                      className="mt-3 rounded shadow"
                    />
                  )}
                </div>
              </div>

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogImgAlt"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Image Alt:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogImgAlt"
                    name="blogImgAlt"
                    type="text"
                    value={formData.blogImgAlt}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, blogImgAlt: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                </div>
              </div>

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogKeywords"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog keywords:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogKeywords"
                    name="blogKeywords"
                    type="text"
                    value={formData.blogKeywords}
                    onChange={(e) =>
                      setFormData({ ...formData, blogKeywords: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                </div>
              </div>

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogCategory"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Category:
                </label>
                <div className="w-[80%]">
                  <select
                    id="blogCategory"
                    name="blogCategory"
                    value={formData.blogCategory || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, blogCategory: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {blogCategories.map((category) => (
                      <option
                        key={category.blog_category_id}
                        value={category.blog_category_id}
                      >
                        {category.blog_category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogMetaTitle"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Meta Title:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogMetaTitle"
                    name="blogMetaTitle"
                    type="text"
                    value={formData.blogMetaTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        blogMetaTitle: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                </div>
              </div>

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogMetaDescription"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Meta Description:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogMetaDescription"
                    name="blogMetaDescription"
                    type="text"
                    value={formData.blogMetaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        blogMetaDescription: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                </div>
              </div>

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogMetaKeywords"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Meta Keywords:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogMetaKeywords"
                    name="blogMetaKeywords"
                    type="text"
                    value={formData.blogMetaKeywords}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        blogMetaKeywords: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                </div>
              </div>

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogForceKeywords"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Force Keywords:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogForceKeywords"
                    name="blogForceKeywords"
                    type="text"
                    value={formData.blogForceKeywords}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        blogForceKeywords: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                </div>
              </div>

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogSKU"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog SKU:
                </label>
                <div className="w-[80%]">
                  <input
                    id="blogSKU"
                    name="blogSKU"
                    type="text"
                    value={formData.blogSKU}
                    onChange={(e) =>
                      setFormData({ ...formData, blogSKU: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                </div>
              </div>

              <div className="flex w-full items-center">
                <label
                  htmlFor="blogSchema"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Blog Schema:
                </label>
                <div className="w-[80%]">
                  <textarea
                    id="blogSchema"
                    name="blogSchema"
                    value={formData.blogSchema}
                    onChange={(e) =>
                      setFormData({ ...formData, blogSchema: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
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
                  Submit
                </button>
              </div>
            </form>
          )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Blog;
