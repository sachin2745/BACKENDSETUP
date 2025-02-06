"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const general = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [previewImages, setPreviewImages] = useState({});

  const [initialValues, setInitialValues] = useState({
    companyName: "",
    companyLogo: null,
    fav180: null,
    fav32: null,
    fav16: null,
    settingShortDescription: "",
    setttingLongDescription: "",
    facebookUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
    telegramUrl: "",
    whatsappNumber: "",
    callingNumber: "",
    googleUrl: "",
    intelUrl: "",
    appleUrl: "",
    windowsUrl: "",
    officialAddress: "",
    officialEmail: "",
    embedMapUrl: "",
    colorCouse: "",
    colorCouseDetail: "",
  });

  const formik = useFormik({
    initialValues,

    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }
      console.log("FormData:", Array.from(formData.entries()));

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/update/general-setting`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("General Details updated successfully");
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
          `${process.env.NEXT_PUBLIC_API_URL}/admin/general-setting/getall`
        );
        const data = await response.json();

        // Construct the full image URLs
        const images = {
          companyLogo: `${process.env.NEXT_PUBLIC_API_URL}${data.companyLogo}`,
          fav180: `${process.env.NEXT_PUBLIC_API_URL}${data.fav180}`,
          fav32: `${process.env.NEXT_PUBLIC_API_URL}${data.fav32}`,
          fav16: `${process.env.NEXT_PUBLIC_API_URL}${data.fav16}`,
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
            General Setting
          </button>
        </nav>
      </div>

      <div className="mt-3">
        <div className={`${activeTab === 0 ? "" : ""}`}>
          <div className=" mx-auto p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">
              Update Setting
            </h1>

            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-wrap gap-4 sm:gap-6 text-sm"
              autoComplete="off"
            >
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="companyName"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Company Name:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Enter Company Name"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.companyName}
                  />
                </div>
              </div>
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="officialEmail"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Company Email:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="officialEmail"
                    name="officialEmail"
                    type="text"
                    placeholder="Enter Company Email"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.officialEmail}
                  />
                </div>
              </div>
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="officialAddress"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Company Address:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="officialAddress"
                    name="officialAddress"
                    type="text"
                    placeholder="Enter Company Address"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.officialAddress}
                  />
                </div>
              </div>
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="companyLogo"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Company Logo:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="companyLogo"
                    name="companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "companyLogo")}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {previewImages.companyLogo && (
                    <img
                      src={previewImages.companyLogo}
                      alt="Preview"
                      width="100"
                    />
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="companyLogo"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Favicon:
                </label>
                <div className="w-full sm:w-[80%]  mt-1 sm:mt-0 grid grid-cols-3 gap-4">
                  <div className="w-full  mt-1 sm:mt-0">
                    <label htmlFor="fav180" className="font-medium">
                      Fav 180 :
                    </label>
                    <input
                      id="fav180"
                      name="fav180"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "fav180")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {previewImages.fav180 && (
                      <img
                        src={previewImages.fav180}
                        alt="Preview"
                        width="100"
                      />
                    )}
                  </div>
                  <div className="w-full  mt-1 sm:mt-0">
                    <label htmlFor="fav32" className="font-medium">
                      Fav 32 :
                    </label>
                    <input
                      id="fav32"
                      name="fav32"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "fav32")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {previewImages.fav32 && (
                      <img
                        src={previewImages.fav32}
                        alt="Preview"
                        width="100"
                      />
                    )}
                  </div>
                  <div className="w-full  mt-1 sm:mt-0">
                    <label htmlFor="fav16" className="font-medium">
                      Fav 16 :
                    </label>
                    <input
                      id="fav16"
                      name="fav16"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "fav16")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {previewImages.fav16 && (
                      <img
                        src={previewImages.fav16}
                        alt="Preview"
                        width="100"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="settingShortDescription"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Short Description:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="settingShortDescription"
                    name="settingShortDescription"
                    type="text"
                    placeholder="Enter Company Short Description"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.settingShortDescription}
                  />
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="setttingLongDescription"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Long Description:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">                 
                  <JoditEditor
                    ref={editorContent}
                    config={config}
                    id="setttingLongDescription"
                    name="setttingLongDescription"
                    placeholder="Enter Long Description"
                    onChange={(newContent) => {
                      formik.setFieldValue("setttingLongDescription", newContent);
                    }}
                    onBlur={() => {
                      formik.setFieldTouched("setttingLongDescription", true);
                    }}
                    value={formik.values.setttingLongDescription}
                  />
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="embedMapUrl"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                 Embedded Map Url :
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <textarea
                    id="embedMapUrl"
                    name="embedMapUrl"
                    placeholder="Enter Company Address Embedded Map Url "
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.embedMapUrl}
                  />
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="callingNumber"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Calling Number:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="callingNumber"
                    name="callingNumber"
                    type="text"
                    placeholder="Enter Company Calling Number"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.callingNumber}
                  />
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="whatsappNumber"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Whatsapp Number:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    type="text"
                    placeholder="Enter Company Whatsapp Number"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.whatsappNumber}
                  />
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="colorCouse"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Course Color:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    type="color"
                    id="colorCouse"
                    name="colorCouse"
                    placeholder="Enter Company Course Color"
                    className="w-full border-2 border-gray-300 p-0 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.colorCouse}
                  />
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="colorCouseDetail"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Course Detail Color:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    type="color"
                    id="colorCouseDetail"
                    name="colorCouseDetail"
                    placeholder="Enter Company Course Color"
                    className="w-full border-2 border-gray-300 p-0 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.colorCouseDetail}
                  />
                </div>
              </div>


              <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
                <legend className="text-xl font-semibold p-2">
                  Social Media :
                </legend>
               
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="googleUrl"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Google Url :
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="googleUrl"
                      name="googleUrl"
                      type="text"
                      placeholder="Enter Google Url"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.googleUrl}
                    />                    
                  </div>
                </div>
               
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="appleUrl"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Apple  Url :
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="appleUrl"
                      name="appleUrl"
                      type="text"
                      placeholder="Enter Apple Url"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.appleUrl}
                    />                    
                  </div>
                </div>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="intelUrl"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Intel Url :
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="intelUrl"
                      name="intelUrl"
                      type="text"
                      placeholder="Enter Intel Url"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.intelUrl}
                    />                    
                  </div>
                </div>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="windowsUrl"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Windows Url :
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="windowsUrl"
                      name="windowsUrl"
                      type="text"
                      placeholder="Enter Windows Url"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.windowsUrl}
                    />                    
                  </div>
                </div>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="facebookUrl"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Facebook  Url :
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="facebookUrl"
                      name="facebookUrl"
                      type="text"
                      placeholder="Enter Facebook  Url"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.facebookUrl}
                    />                    
                  </div>
                </div>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="youtubeUrl"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Youtube  Url :
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="youtubeUrl"
                      name="youtubeUrl"
                      type="text"
                      placeholder="Enter Youtube  Url"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.youtubeUrl}
                    />                    
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="twitterUrl"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    X  Url :
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="twitterUrl"
                      name="twitterUrl"
                      type="text"
                      placeholder="Enter X (Twitter)  Url"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.twitterUrl}
                    />                    
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="instagramUrl"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Instagram Url :
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="instagramUrl"
                      name="instagramUrl"
                      type="text"
                      placeholder="Enter Instagram Url"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.instagramUrl}
                    />                    
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="telegramUrl"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Telegram Url :
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="telegramUrl"
                      name="telegramUrl"
                      type="text"
                      placeholder="Enter Telegram Url"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.telegramUrl}
                    />                    
                  </div>
                </div>

              
              </fieldset>

              {/* <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
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
              </fieldset> */}
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

export default general;
