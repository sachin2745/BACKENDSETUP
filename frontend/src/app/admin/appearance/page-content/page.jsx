"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import axios from "axios";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
import { RiEdit2Line } from "react-icons/ri";

const pageContent = () => {

  const [page, setPages] = useState([]);

  const fetchPages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/page-content/getall`
      ); // Making GET request to the API endpoint
      // console.log(response.data);
      const data = response.data; // Extracting the data from the response

      setPages(data);
    } catch (err) {
      console.log(err.message); // Catching any error and setting the error state
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Initialize DataTable
  useEffect(() => {
    if (page.length > 0) {
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
  }, [page]);

  // Toggle user status
  const handleToggle = (pageId, currentStatus, pageTitle) => {
    const newStatus = currentStatus == 0 ? 1 : 0; // Toggle between 0 (active) and 1 (inactive)

    // Update the status in the backend
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/page-content-status/${pageId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageStatus: newStatus }),
      }
    )
      .then((res) => {
        if (res.ok) {
          setPages((prevData) =>
            prevData.map((page) =>
              page.pageId == pageId ? { ...page, pageStatus: newStatus } : page
            )
          );
          const firstName = pageTitle;
          toast.success("Successfully status updated for " + firstName + "!");
        } else {
          // console.error('Failed to update user status');
          toast.error("Failed to update page content status!");
        }
      })
      .catch((err) => toast.error("Error updating status:", err));
    //  console.error('Error updating status:', err));
  };

  // Edit Blog
  const [formData, setFormData] = useState({
    pageTitle: "",
    pageDescription: "",
    metaTitle: "",
    metaDescriptioin: "",
    metaKeywords: "",
    metaSchema: "",
  });
  const [activeTab, setActiveTab] = useState(0);

  const fetchPageContentData = async (pageId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/get-page-content/${pageId}`
      );
      const {
        pageType,
        pageTitle,
        pageDescription,
        metaTitle,
        metaDescriptioin,
        metaKeywords,
        metaSchema,
      } = response.data;

      // console.log("response", response.data);

      setFormData({
        pageType,
        pageId,
        pageTitle,
        pageDescription,
        metaTitle,
        metaDescriptioin,
        metaKeywords,
        metaSchema,
      });

      setActiveTab(2);
    } catch (error) {
      console.error("Error fetching page content data:", error);
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      // console.log("formData", formData);
      const pageId = formData.pageId;

      data.append("pageTitle", formData.pageTitle);
      data.append("pageDescription", formData.pageDescription);
      data.append("metaTitle", formData.metaTitle);
      data.append("metaDescriptioin", formData.metaDescriptioin);
      data.append("metaKeywords", formData.metaKeywords);
      data.append("metaSchema", formData.metaSchema);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/update-page-content/${pageId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Page Content updated successfully!");

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Error updating blog:", error);
    }
  };

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
        .slice(0, 20) // Slice the first 20 words
        .join(" ") + (plainText.split(" ").length > 20 ? "..." : "")
    );
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
            Page Content List
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
            Edit Page Content
          </button>
        </nav>
      </div>

      <div className="mt-3">
        <div className={`${activeTab === 0 ? "" : "hidden"}`}>
          <div className="bg-white border shadow-md rounded p-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
              Manage Page Content
            </h3>
            <table id="example1" className="display nowwrap w-full table-auto">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {page.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center p-3 font-semibold">
                      No available data
                    </td>
                  </tr>
                ) : (
                  page.map((item, index) => (
                    <tr key={item.pageId}>
                      <td>{page.indexOf(item) + 1}</td>
                      <td>{item.pageType}</td>
                      <td>{item.pageTitle}</td>
                      <td>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: truncatedDescription(item.pageDescription),
                          }}
                        />
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
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.pageStatus == 0}
                            onChange={() =>
                              handleToggle(
                                item.pageId,
                                item.pageStatus,
                                item.pageTitle
                              )
                            }
                          />
                          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-emerald-300"></div>
                        </label>
                      </td>
                      <td>
                        <div
                          className="flex w-full justify-center items-center hover:scale-110 ease-in-out duration-300"
                          onClick={() => fetchPageContentData(item.pageId)}
                        >
                          <button className="bg-emerald-200 hover:bg-emerald-300 p-1 rounded flex items-center justify-center">
                            <RiEdit2Line className="text-black text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
                    htmlFor="pageType"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Page Name:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="pageType"
                      name="pageType"
                      type="text"
                      value={formData.pageType}
                      readOnly
                      className="w-full border-2 bg-gray-300 border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="pageTitle"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Page Title:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="pageTitle"
                      name="pageTitle"
                      type="text"
                      value={formData.pageTitle}
                      placeholder="Enter Page Title"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pageTitle: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="pageDescription"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Page Description:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <JoditEditor
                      ref={editorContent}
                      config={config}
                      id="pageDescription"
                      name="pageDescription"
                      placeholder="Enter Page Description"
                      value={formData.pageDescription || ""}
                      onBlur={(newContent) =>
                        setFormData({
                          ...formData,
                          pageDescription: newContent,
                        })
                      }
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
                        id="metaTitle"
                        name="metaTitle"
                        type="text"
                        placeholder="Enter Meta Title"
                        value={formData.metaTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metaTitle: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="metaDescriptioin"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Description:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <textarea
                        id="metaDescriptioin"
                        name="metaDescriptioin"
                        placeholder="Enter Meta Description"
                        value={formData.metaDescriptioin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metaDescriptioin: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="metaKeywords"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Keywords:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="metaKeywords"
                        name="metaKeywords"
                        type="text"
                        placeholder="Enter Meta Keywords"
                        value={formData.metaKeywords}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metaKeywords: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="metaSchema"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Schema:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <textarea
                        id="metaSchema"
                        name="metaSchema"
                        placeholder="Enter Meta Schema"
                        value={formData.metaSchema}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metaSchema: e.target.value,
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

export default pageContent;
