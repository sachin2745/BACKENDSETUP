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
import { MdKeyboardArrowDown } from "react-icons/md";
import Swal from "sweetalert2";
import useAppContext from "@/context/AppContext";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const blogCategory = () => {
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
  const handleToggle = (blog_category_id , currentStatus, blog_category_name) => {
    const newStatus = currentStatus == 0 ? 1 : 0; // Toggle between 0 (active) and 1 (inactive)

    // Update the status in the backend
    fetch(`http://localhost:8001/admin/blog-cat-status/${blog_category_id }`, {
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
                blogcat.blog_category_id  == blog_category_id  ? { ...blogcat, blog_category_status: newStatus } : blogcat
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
        blogImageMobile: blogImageMobile
          ? `http://localhost:8001${blogImageMobile}`
          : null,
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
      setPreviewEditImage(
        blogImage ? `http://localhost:8001${blogImage}` : null
      );
      setPreviewMobileEditImage(
        blogImageMobile ? `http://localhost:8001${blogImageMobile}` : null
      );
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
            Blog Category List
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
            Add Blog Category
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
            Edit Blog Category
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
              Manage Blog Categories
            </h3>
            <table
              id="example1"
              className="display  nowwrap w-100 table-auto  "
            >
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
                    <tr key={item.blog_category_id }>
                      <td>{blogCategories.indexOf(item) + 1}</td>
                      <td>{item.blog_category_name}</td>                     
                      <td>
                        {item.blog_category_sku}
                      </td>                     
                      <td>{item.blog_category_sku}</td>
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
                                item.blog_category_id ,
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
                                onClick={() => fetchBlogCatData(item.blog_category_id )}
                                className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-green-100 focus:outline-none focus:bg-green-100"
                                href="#"
                              >
                                Edit
                              </div>
                              <div
                                className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-red-100 focus:outline-none focus:bg-red-100"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCatDelete(item.blog_category_id );
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
        <div
          id="tabs-with-underline-2"
          className="hidden"
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-2"
        >
          <div className=" mx-auto p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">
              Create Blog
            </h1>

            
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
            
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default blogCategory;
