"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const missionVision = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [previewImages, setPreviewImages] = useState({});

  const [initialValues, setInitialValues] = useState({
    ourMissionHeading: "",
    ourMissionImg1: null,
    ourMissionImgAlt1: "",
    ourMissionContent1: "",
    ourMissionImg2: null,
    ourMissionImgAlt2: "",
    ourMissionContent2: "",
    ourMissionImg3: null,
    ourMissionImgAlt3: "",
    ourMissionContent3: "",
    ourVisionHeading: "",
    ourVisionImg: null,
    ourVisionImgAlt: "",
    ourVisionContent1: "",
    ourVisionContent2: "",
    ourVisionContent3: "",
  });

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      ourMissionHeading: Yup.string().required("Required"),
      ourMissionImgAlt1: Yup.string().required("Required"),
      ourMissionContent1: Yup.string().required("Required").max(47, "Must be 47 characters or less"),
      ourMissionImgAlt2: Yup.string().required("Required"),
      ourMissionContent2: Yup.string().required("Required").max(47, "Must be 47 characters or less"),
      ourMissionImgAlt3: Yup.string().required("Required"),
      ourMissionContent3: Yup.string().required("Required").max(47, "Must be 47 characters or less"),
      ourVisionHeading: Yup.string().required("Required"),
      ourVisionImgAlt: Yup.string().required("Required"),
      ourVisionContent1: Yup.string().required("Required"),
      ourVisionContent2: Yup.string().required("Required"),
      ourVisionContent3: Yup.string().required("Required"),
      // Add other validations as necessary
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
          `${process.env.NEXT_PUBLIC_API_URL}/admin/update/mission-vision`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/admin/mission-vision`
        );
        const data = await response.json();

        // Construct the full image URLs
        const images = {
          ourMissionImg1: `${process.env.NEXT_PUBLIC_API_URL}${data.ourMissionImg1}`,
          ourMissionImg2: `${process.env.NEXT_PUBLIC_API_URL}${data.ourMissionImg2}`,
          ourMissionImg3: `${process.env.NEXT_PUBLIC_API_URL}${data.ourMissionImg3}`,
          ourVisionImg: `${process.env.NEXT_PUBLIC_API_URL}${data.ourVisionImg}`,
          ourMissionBgImg: `${process.env.NEXT_PUBLIC_API_URL}${data.ourMissionBgImg}`,
          ourVisionBgImg: `${process.env.NEXT_PUBLIC_API_URL}${data.ourVisionBgImg}`,
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
            Mission & Vision
          </button>
        </nav>
      </div>

      <div className="mt-3">
        <div className={`${activeTab === 0 ? "" : ""}`}>
          <div className=" mx-auto p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">
              Update Mission & Vision
            </h1>

            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-wrap gap-4 sm:gap-6 text-sm"
              autoComplete="off"
            >
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="ourMissionHeading"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Mission Heading:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="ourMissionHeading"
                    name="ourMissionHeading"
                    type="text"
                    placeholder="Enter Mission Heading"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.ourMissionHeading}
                  />
                  {formik.errors.ourMissionHeading && (
                    <div className="text-red-500">
                      {formik.errors.ourMissionHeading}
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourMissionBgImg"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Mission Background:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourMissionBgImg"
                      name="ourMissionBgImg"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "ourMissionBgImg")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {previewImages.ourMissionBgImg && (
                      <img
                        src={previewImages.ourMissionBgImg}
                        alt="Preview"
                        width="100"
                      />
                    )}
                  </div>
                </div>

              <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
                <legend className="text-xl font-semibold p-2">
                  Mission Content 1 :
                </legend>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourMissionImg1"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Icon 1:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourMissionImg1"
                      name="ourMissionImg1"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "ourMissionImg1")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {previewImages.ourMissionImg1 && (
                      <img
                        src={previewImages.ourMissionImg1}
                        alt="Preview"
                        width="100"
                      />
                    )}
                  </div>
                </div>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourMissionImgAlt1"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Icon 1 Alt Text:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourMissionImgAlt1"
                      name="ourMissionImgAlt1"
                      type="text"
                      placeholder="Enter Image Alt text"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.ourMissionImgAlt1}
                    />
                    {formik.errors.ourMissionImgAlt1 && (
                      <div className="text-red-500">
                        {formik.errors.ourMissionImgAlt1}
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourMissionContent1"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Mission Content 1 :
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourMissionContent1"
                      name="ourMissionContent1"
                      type="text"
                      placeholder="Enter Mission Content 1"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.ourMissionContent1}
                    />
                    {formik.errors.ourMissionContent1 && (
                      <div className="text-red-500">
                        {formik.errors.ourMissionContent1}
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>

              <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
                <legend className="text-xl font-semibold p-2">
                  Mission Content 2 :
                </legend>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourMissionImg2"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Icon 2:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourMissionImg2"
                      name="ourMissionImg2"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "ourMissionImg2")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {previewImages.ourMissionImg2 && (
                      <img
                        src={previewImages.ourMissionImg2}
                        alt="Preview"
                        width="100"
                      />
                    )}
                  </div>
                </div>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourMissionImgAlt2"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Icon 2 Alt Text:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourMissionImgAlt2"
                      name="ourMissionImgAlt2"
                      type="text"
                      placeholder="Enter Image Alt text"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.ourMissionImgAlt2}
                    />
                    {formik.errors.ourMissionImgAlt2 && (
                      <div className="text-red-500">
                        {formik.errors.ourMissionImgAlt2}
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourMissionContent2"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Mission Content 2 :
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourMissionContent2"
                      name="ourMissionContent2"
                      type="text"
                      placeholder="Enter Mission Content 2"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.ourMissionContent2}
                    />
                    {formik.errors.ourMissionContent2 && (
                      <div className="text-red-500">
                        {formik.errors.ourMissionContent2}
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>

              <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
                <legend className="text-xl font-semibold p-2">
                  Mission Content 3 :
                </legend>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourMissionImg3"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Icon 3:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourMissionImg3"
                      name="ourMissionImg3"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "ourMissionImg3")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {previewImages.ourMissionImg3 && (
                      <img
                        src={previewImages.ourMissionImg3}
                        alt="Preview"
                        width="100"
                      />
                    )}
                  </div>
                </div>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourMissionImgAlt3"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Icon 3 Alt Text:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourMissionImgAlt3"
                      name="ourMissionImgAlt3"
                      type="text"
                      placeholder="Enter Image Alt text"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.ourMissionImgAlt3}
                    />
                    {formik.errors.ourMissionImgAlt3 && (
                      <div className="text-red-500">
                        {formik.errors.ourMissionImgAlt3}
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourMissionContent3"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Mission Content 3 :
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourMissionContent3"
                      name="ourMissionContent3"
                      type="text"
                      placeholder="Enter Mission Content 3"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.ourMissionContent3}
                    />
                    {formik.errors.ourMissionContent3 && (
                      <div className="text-red-500">
                        {formik.errors.ourMissionContent3}
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>

              <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
                <legend className="text-xl font-semibold p-2">
                  Vision Section :
                </legend>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourVisionHeading"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Vision Heading:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourVisionHeading"
                      name="ourVisionHeading"
                      type="text"
                      placeholder="Enter Vision Heading"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.ourVisionHeading}
                    />
                    {formik.errors.ourVisionHeading && (
                      <div className="text-red-500">
                        {formik.errors.ourVisionHeading}
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourVisionBgImg"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Vision Background:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourVisionBgImg"
                      name="ourVisionBgImg"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "ourVisionBgImg")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {previewImages.ourVisionBgImg && (
                      <img
                        src={previewImages.ourVisionBgImg}
                        alt="Preview"
                        width="100"
                      />
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourVisionImg"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Our Vision Image:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourVisionImg"
                      name="ourVisionImg"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "ourVisionImg")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {previewImages.ourVisionImg && (
                      <img
                        src={previewImages.ourVisionImg}
                        alt="Preview"
                        width="100"
                      />
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourVisionImgAlt"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Image Alt text:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      type="text"
                      id="ourVisionImgAlt"
                      name="ourVisionImgAlt"
                      placeholder="Enter Image Alt text"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.ourVisionImgAlt}
                    />
                    {formik.errors.ourVisionImgAlt && (
                      <div className="text-red-500">
                        {formik.errors.ourVisionImgAlt}
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourVisionContent1"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Vision Content 1:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourVisionContent1"
                      name="ourVisionContent1"
                      type="text"
                      placeholder="Enter Vision Content 1"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.ourVisionContent1}
                    />
                    {formik.errors.ourVisionContent1 && (
                      <div className="text-red-500">
                        {formik.errors.ourVisionContent1}
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourVisionContent2"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Vision Content 2:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourVisionContent2"
                      name="ourVisionContent2"
                      type="text"
                      placeholder="Enter Vision Content 2"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.ourVisionContent2}
                    />
                    {formik.errors.ourVisionContent2 && (
                      <div className="text-red-500">
                        {formik.errors.ourVisionContent2}
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ourVisionContent3"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Vision Content 3:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="ourVisionContent3"
                      name="ourVisionContent3"
                      type="text"
                      placeholder="Enter Vision Content 3"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.ourVisionContent3}
                    />
                    {formik.errors.ourVisionContent3 && (
                      <div className="text-red-500">
                        {formik.errors.ourVisionContent3}
                      </div>
                    )}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default missionVision;
