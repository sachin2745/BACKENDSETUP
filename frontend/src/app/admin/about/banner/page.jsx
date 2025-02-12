"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const banner = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [previewImages, setPreviewImages] = useState({});

  const [initialValues, setInitialValues] = useState({
    bannerHeading: "",
    bannerContent1: "",
    bannerContent2: "",
    bannerContent3: "",
    bannerGoogle: "",
    bannerApple: "",
    bannerImg: null,
    bannerBgColor: "",
    bannerTickIcon: null,
  });

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      bannerHeading: Yup.string().required("Required"),
      bannerContent1: Yup.string().required("Required"),
      bannerContent2: Yup.string().required("Required"),
      bannerContent3: Yup.string().required("Required"),
      bannerApple: Yup.string().required("Required"),
      bannerGoogle: Yup.string().required("Required"),
      bannerBgColor: Yup.string().required("Required"),
    }),

    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }
      console.log("FormData:", Array.from(formData.entries()));

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/update/about-banner`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("Details updated successfully");
          //refresh page
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast.error("An error occurred");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error: " + error.message);
      }
    },
  });

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
      formik.setFieldValue(fieldName, file);
    }
  };

  useEffect(() => {
    // Fetch initial data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/about-banner`
        );
        const data = await response.json();

        // Construct the full image URLs
        const images = {
          bannerImg: `${process.env.NEXT_PUBLIC_API_URL}${data.bannerImg}`,
          bannerTickIcon: `${process.env.NEXT_PUBLIC_API_URL}${data.bannerTickIcon}`,
        };

        setInitialValues(data);
        formik.setValues(data);

        // Set the image URLs to the preview state
        setPreviewImages(images);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
            About Page Banner
          </button>
        </nav>
      </div>

      <div className="mt-3">
        <div className={`${activeTab === 0 ? "" : ""}`}>
          <div className=" mx-auto p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">
              Update Banner
            </h1>

            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-wrap gap-4 sm:gap-6 text-sm"
              autoComplete="off"
            >
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="bannerHeading"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Banner Heading:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="bannerHeading"
                    name="bannerHeading"
                    type="text"
                    placeholder="Enter Banner Heading"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.bannerHeading}
                  />
                  {formik.errors.bannerHeading && (
                    <div className="text-red-500">
                      {formik.errors.bannerHeading}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="bannerImg"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Banner Image:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="bannerImg"
                    name="bannerImg"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "bannerImg")}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {previewImages.bannerImg && (
                    <img
                      src={previewImages.bannerImg}
                      alt="Preview"
                      width="100"
                    />
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="bannerTickIcon"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Tick Icon:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="bannerTickIcon"
                    name="bannerTickIcon"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "bannerTickIcon")}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {previewImages.bannerTickIcon && (
                    <img
                      src={previewImages.bannerTickIcon}
                      alt="Preview"
                      width="100"
                    />
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="bannerContent1"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Banner Content 1:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    type="text"
                    id="bannerContent1"
                    name="bannerContent1"
                    placeholder="Enter Banner Content 1"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.bannerContent1}
                  />
                  {formik.errors.bannerContent1 && (
                    <div className="text-red-500">
                      {formik.errors.bannerContent1}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="bannerContent2"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Banner Content 2:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="bannerContent2"
                    name="bannerContent2"
                    type="text"
                    placeholder="Enter Banner Content 2"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.bannerContent2}
                  />
                  {formik.errors.bannerContent2 && (
                    <div className="text-red-500">
                      {formik.errors.bannerContent2}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="bannerContent3"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Banner Content 3:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="bannerContent3"
                    name="bannerContent3"
                    type="text"
                    placeholder="Enter Banner Content 3"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.bannerContent3}
                  />
                  {formik.errors.bannerContent3 && (
                    <div className="text-red-500">
                      {formik.errors.bannerContent3}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="bannerGoogle"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Google Link:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="bannerGoogle"
                    name="bannerGoogle"
                    type="url"
                    placeholder="Enter Google Link"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.bannerGoogle}
                  />
                  {formik.errors.bannerGoogle && (
                    <div className="text-red-500">
                      {formik.errors.bannerGoogle}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="bannerApple"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Apple Link:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="bannerApple"
                    name="bannerApple"
                    type="url"
                    placeholder="Enter Apple Link"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.bannerApple}
                  />
                  {formik.errors.bannerApple && (
                    <div className="text-red-500">
                      {formik.errors.bannerApple}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="bannerBgColor"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Background Color:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="bannerBgColor"
                    name="bannerBgColor"
                    type="color"
                    placeholder="Enter Apple Link"
                    className="w-full border-2 border-gray-300 p-0 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.bannerBgColor}
                  />
                  {formik.errors.bannerBgColor && (
                    <div className="text-red-500">
                      {formik.errors.bannerBgColor}
                    </div>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default banner;
