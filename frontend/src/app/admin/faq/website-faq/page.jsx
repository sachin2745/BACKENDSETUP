"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCheck } from "react-icons/fa";

const WebsiteFaq = () => {
  const [faqs, setFaqs] = useState([]);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/website-faq/getall`
      ); // Making GET request to the API endpoint
      // console.log(response.data);
      const data = response.data; // Extracting the data from the response

      // Setting the state with the fetched data
      setFaqs(data);
    } catch (err) {
      console.log(err.message); // Catching any error and setting the error state
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    if (faqs.length > 0) {
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
  }, [faqs]);

  // Toggle user status
  const handleToggle = (faqId, currentStatus) => {
    const newStatus = currentStatus == 0 ? 1 : 0; // Toggle between 0 (active) and 1 (inactive)

    // Update the status in the backend
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/website-faq-status/${faqId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ faqStatus: newStatus }),
      }
    )
      .then((res) => {
        if (res.ok) {
          setFaqs((prevData) =>
            prevData.map((faq) =>
              faq.faqId == faqId ? { ...faq, faqStatus: newStatus } : faq
            )
          );
          toast.success("Successfully status updated!");
        } else {
          toast.error("Failed to update faq status!");
        }
      })
      .catch((err) => toast.error("Error updating status:", err));
  };

  // State to track the user being edited
  const [editSortBy, setEditSortBy] = useState(null); // To track the user being edited
  const [newSortBy, setNewSortBy] = useState(""); // To track the new Sort By value

  // Function to handle Sort By Edit
  const handleSortByEdit = (faqId, currentSortBy) => {
    setEditSortBy(faqId); // Enable editing mode for the specific user
    setNewSortBy(currentSortBy); // Pre-fill the input with the current value
  };

  //Function to handle Sort By Submit
  const handleSortBySubmit = (faqId) => {
    // Update the Sort By value in the backend
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/website-faq-status/${faqId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ faqSortBy: newSortBy }),
      }
    )
      .then((res) => {
        if (res.ok) {
          setFaqs((prevData) =>
            prevData.map((faq) =>
              faq.faqId === faqId ? { ...faq, faqSortBy: newSortBy } : faq
            )
          );
          setEditSortBy(null); // Exit editing mode
          toast.success("Sort By updated successfully!");
          //reload page
          // window.location.reload();
          // Instead of reloading the page, just refresh data
          fetchFaqs();
        } else {
          toast.error("Failed to update Sort By!");
        }
      })
      .catch((err) => toast.error("Error updating Sort By:", err));
  };

  //Add blog
  const userForm = useFormik({
    initialValues: {
      faqQuestion: "",
      faqAnswer: "",
      faqStatus: 0,
    },
    validationSchema: Yup.object({
      faqQuestion: Yup.string().required("Question is required"),
      faqAnswer: Yup.string().required("Answer is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("faqQuestion", values.faqQuestion);
      formData.append("faqAnswer", values.faqAnswer);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/add-website-faq`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status === 200 || res.status === 201) {
          toast.success("Website Faq added successfully!");
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
    faqQuestion: "",
    faqAnswer: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchFaqData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/get-website-faq/${id}`
      );
      setfound(response.data);
      setFormData({
        faqQuestion: response.data.faqQuestion,
        faqAnswer: response.data.faqAnswer,
      });

      setActiveTab(2);
    } catch (error) {
      toast.error("Error fetching user data:", error);
    }
  };

  const [errors, setErrors] = useState({}); // State for validation errors

  const validateForm = () => {
    const newErrors = {};
    if (!formData.faqQuestion.trim()) {
      newErrors.faqQuestion = "Question is required.";
    }
    if (!formData.faqAnswer.trim()) {
      newErrors.faqAnswer = "Answer is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleUpdateFaq = async (e) => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/admin/update-website-faq/${found?.faqId}`,
        updatedData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // setEditMode(false);
      toast.success("Website faq updated successfully!");

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2-second delay to let the notification show
    } catch (error) {
      toast.error("Error updating Website faq:", error);
    }
  };

  const handleDelete = (faqId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Website faq?",
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
          `${process.env.NEXT_PUBLIC_API_URL}/admin/website-faq-status/${faqId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ faqStatus: 3 }),
          }
        )
          .then((response) => {
            if (response.ok) {
              toast.success("The Website faq has been deleted successfully!");
              fetchFaqs(); // Refresh the data without reloading the page
            } else {
              toast.error("Failed to delete the founder.");
            }
          })
          .catch(() => {
            toast.error("An error occurred while deleting the website faq.");
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
            Website Faq List
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
            Add Website Faq
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
            Edit Website Faq
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
              Manage Website Faq's
            </h3>

            <table id="example1" className="display  nowwrap w-full table-auto">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Sort By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center p-3 font-semibold">
                      No available data
                    </td>
                  </tr>
                ) : (
                  faqs.map((item, index) => (
                    <tr key={item.faqId}>
                      <td>{faqs.indexOf(item) + 1}</td>

                      <td>{item.faqQuestion}</td>

                      <td>{item.faqAnswer}</td>

                      <td>
                        {editSortBy == item.faqId ? (
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
                              onClick={() => handleSortBySubmit(item.faqId)}
                              className="ml-2 bg-emerald-300 text-black px-3 py-2 rounded"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleSortByEdit(item.faqId, item.faqSortBy)
                            }
                            className="text-black font-bold bg-emerald-300 px-3 py-1 rounded"
                          >
                            {item.faqSortBy}
                          </button>
                        )}
                      </td>
                      <td>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.faqStatus == 0}
                            onChange={() =>
                              handleToggle(item.faqId, item.faqStatus)
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
                                onClick={() => fetchFaqData(item.faqId)}
                              >
                                Edit
                              </button>
                            </li>
                            <li className=" rounded">
                              <button
                                className="hover:bg-red-200"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(item.faqId);
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
            <h1 className="text-lg font-bold mb-6 border-b pb-2">Add Faq</h1>

            <form
              onSubmit={userForm.handleSubmit}
              autoComplete="off"
              className="flex flex-wrap gap-4 sm:gap-6 text-sm"
            >
              {/* Question */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="faqQuestion"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Question:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="faqQuestion"
                    name="faqQuestion"
                    type="text"
                    placeholder="Enter Question"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.faqQuestion}
                    className="w-full border-2 border-gray-300 p-2 rounded "
                  />
                  {userForm.touched.faqQuestion &&
                    userForm.errors.faqQuestion && (
                      <p className="text-red-500 text-sm">
                        {userForm.errors.faqQuestion}
                      </p>
                    )}
                </div>
              </div>

              {/* Answer */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="faqAnswer"
                  className="w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Answer:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <textarea
                    rows={5}
                    id="faqAnswer"
                    name="faqAnswer"
                    placeholder="Enter Answer"
                    onChange={userForm.handleChange}
                    onBlur={userForm.handleBlur}
                    value={userForm.values.faqAnswer}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {userForm.touched.faqAnswer && userForm.errors.faqAnswer && (
                    <p className="text-red-500 text-sm">
                      {userForm.errors.faqAnswer}
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
                onSubmit={handleUpdateFaq}
                className="flex flex-wrap gap-4 sm:gap-6 text-sm"
              >
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="faqQuestion"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Question:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="faqQuestion"
                      name="faqQuestion"
                      type="text"
                      placeholder="Enter Question"
                      value={formData.faqQuestion}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.faqQuestion && (
                      <p className="text-red-500 text-sm">
                        {errors.faqQuestion}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="faqAnswer"
                    className="w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Answer:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <textarea
                      rows={5}
                      id="faqAnswer"
                      name="faqAnswer"
                      placeholder="Enter Answer"
                      value={formData.faqAnswer}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {errors.faqAnswer && (
                      <p className="text-red-500 text-sm">{errors.faqAnswer}</p>
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

export default WebsiteFaq;
