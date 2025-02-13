"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

const EnquiryForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const formSubmitted = localStorage.getItem("enquirySubmitted");

    if (!formSubmitted) {
      setTimeout(() => {
        setShowForm(true);
      }, 10000); // Show after 10 seconds
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      number: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      number: Yup.string()
        .matches(/^\d{10}$/, "Invalid phone number")
        .required("Phone number is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/web/enquiry-form/submit`,
          values
        );
        localStorage.setItem("enquirySubmitted", "true");
        setShowForm(false); // Close modal immediately
        toast.success("Enquiry submitted successfully");
      } catch (error) {
        console.error("Error submitting enquiry", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-RedditSans">
          <div className="modal-box relative w-full max-w-xl p-6 bg-white rounded-lg shadow-lg">
            <button
              className="absolute top-5 right-5 text-3xl"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-0 text-start text-primary">
              Have Questions? Let Us Help!
            </h2>
            <h3 className="text-lg font-normal mb-3 text-start text-spaceblack">
              Fill in the details, and we'll get back to you soon!
            </h3>
            <form onSubmit={formik.handleSubmit} autoComplete="off">
              <div className="mb-5">
                <span className="label-text font-bold text-spaceblack">
                  Name
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Your Name"
                  className="input input-bordered w-full "
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.name}
                  </div>
                )}
              </div>
              <div className="mb-5">
                <span className="label-text font-bold text-spaceblack">
                  Phone Number
                </span>
                <input
                  type="tel"
                  name="number"
                  maxLength="10"
                  placeholder="Enter Your Phone Number"
                  className="input input-bordered w-full"
                  {...formik.getFieldProps("number")}
                />
                {formik.touched.number && formik.errors.number && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.number}
                  </div>
                )}
              </div>
              <div className="mb-5">
                <span className="label-text font-bold text-spaceblack">
                  Message
                </span>
                <textarea
                  name="message"
                  placeholder="Enter Your Message"
                  className="textarea textarea-bordered w-full text-lg"
                  {...formik.getFieldProps("message")}
                ></textarea>
                {formik.touched.message && formik.errors.message && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.message}
                  </div>
                )}
              </div>
              <p className="mb-5 text-sm text-spaceblack">
                We respect your privacy and won't share your details with
                anyone.
              </p>
              <button
                type="submit"
                className="bg-primary text-white rounded font-bold py-2 w-full flex justify-center items-center"
                disabled={loading} // Disable while loading
              >
                {loading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                ) : (
                  "Submit Enquiry"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EnquiryForm;
