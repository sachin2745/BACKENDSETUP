"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaBan, FaCheck } from "react-icons/fa";
import dynamic from "next/dynamic";
import useAppContext from "@/context/AppContext";
import Swal from "sweetalert2";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Store = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { currentUser, setCurrentUser } = useAppContext();

  // Fetch initial data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/store-details`
      );
      const data = await response.json();

      setInitialValues(data);
      formik.setValues(data);
      // console.log("Initial data fetched:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [productData, setProductData] = useState([]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/product/getall`
      ); // Making GET request to the API endpoint
      //   console.log(response.data);
      const data = response.data; // Extracting the data from the response

      setProductData(data.products);
    } catch (err) {
      console.log(err.message); // Catching any error and setting the error state
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  // Initialize DataTable
  useEffect(() => {
    if (productData.length > 0) {
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
  }, [productData]);

  // Function to toggle the popular status of a product
  const toggleProductPopularStatus = (productId, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0; // Toggle status between 0 and 1

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/popular/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productPopular: newStatus }),
    })
      .then((res) => {
        if (res.ok) {
          setProductData((prevData) =>
            prevData.map((prod) =>
              prod.productId === productId
                ? { ...prod, productPopular: newStatus }
                : prod
            )
          );
          toast.success("Product popular status updated!");
        } else {
          toast.error("Failed to update popular status.");
        }
      })
      .catch((err) => toast.error("Error updating popular status:", err));
  };

  // Toggle product status
  const handleToggle = (productId, currentStatus, productName) => {
    const newStatus = currentStatus == 0 ? 1 : 0; // Toggle between 0 (active) and 1 (inactive)

    // Update the status in the backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/prod-status/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productStatus: newStatus }),
    })
      .then((res) => {
        if (res.ok) {
          setProductData((prevData) =>
            prevData.map((prod) =>
              prod.productId == productId
                ? { ...prod, productStatus: newStatus }
                : prod
            )
          );
          const firstName = productName;
          toast.success("Successfully status updated for " + firstName + "!");
        } else {
          toast.error("Failed to update blog status!");
        }
      })
      .catch((err) => toast.error("Error updating status:", err));
    //  console.error('Error updating status:', err));
  };

  //Toggle for Stock
  const handleStockToggle = (productId, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0; // Toggle between 0 (active) and 1 (inactive)

    // Update the status in the backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/prod-status/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productStock: newStatus }),
    })
      .then((res) => {
        if (res.ok) {
          setProductData((prevData) =>
            prevData.map((prod) =>
              prod.productId === productId
                ? { ...prod, productStock: newStatus }
                : prod
            )
          );

          // Show different toast messages based on the new status
          if (newStatus === 0) {
            toast.success("Stock In!");
          } else {
            toast.error("Stock Out!");
          }
        } else {
          toast.error("Failed to update stock!");
        }
      })
      .catch((err) => toast.error("Error updating status:", err));
  };

  // State to track the product being edited
  const [editSortBy, setEditSortBy] = useState(null);
  const [newSortBy, setNewSortBy] = useState(""); // To track the new Sort By value

  // Function to handle Sort By Edit
  const handleSortByEdit = (productId, currentSortBy) => {
    setEditSortBy(productId);
    setNewSortBy(currentSortBy); // Pre-fill the input with the current value
  };

  //Function to handle Sort By Submit
  const handleSortBySubmit = (productId) => {
    // Update the Sort By value in the backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/prod-status/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productSortBy: newSortBy }),
    })
      .then((res) => {
        if (res.ok) {
          setProductData((prevData) =>
            prevData.map((prod) =>
              prod.productId === productId
                ? { ...prod, productSortBy: newSortBy }
                : prod
            )
          );
          setEditSortBy(null); // Exit editing mode
          toast.success("Sort By updated successfully!");
          //reload page
          // window.location.reload();
          // Instead of reloading the page, just refresh data
          fetchProduct();
        } else {
          toast.error("Failed to update Sort By!");
        }
      })
      .catch((err) => toast.error("Error updating Sort By:", err));
  };
  // STORE DETAILS UPDATE
  const [initialValues, setInitialValues] = useState({
    storeMetaTitle: "",
    storeMetaDescription: "",
    storeMetaKeyword: "",
    storeSchema: "",
    storeTitle: "",
    storeDescription: "",
    storeLongDescription: "",
    storeExpressAmt: "",
    storeStandardAmt: "",
    storeExpressDays: "",
    storeStandardDays: "",
  });

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      storeMetaTitle: Yup.string()
        .required("Required")
        .max(60, "Must be 60 characters or less"),
      storeMetaDescription: Yup.string()
        .required("Required")
        .max(160, "Must be 160 characters or less"),
      storeMetaKeyword: Yup.string().required("Required"),
      storeSchema: Yup.string().required("Required"),
      storeTitle: Yup.string().required("Required"),
      storeDescription: Yup.string().required("Required"),
      storeLongDescription: Yup.string().required("Required"),
      storeExpressAmt: Yup.string().required("Required"),
      storeStandardAmt: Yup.string().required("Required"),
      storeExpressDays: Yup.string().required("Required"),
      storeStandardDays: Yup.string().required("Required"),
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
          `${process.env.NEXT_PUBLIC_API_URL}/admin/update/store-details`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("Details updated successfully");
          //refresh page
          //   setTimeout(() => {
          //     window.location.reload();
          //   }, 2000);
          fetchData();
        } else {
          toast.error("An error occurred");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error: " + error.message);
      }
    },
  });
  //END

  //ADD PRODUCT
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [previewImg2, setPreviewImg2] = useState(null);
  const [previewImg3, setPreviewImg3] = useState(null);
  const [previewImg4, setPreviewImg4] = useState(null);
  const [previewImg5, setPreviewImg5] = useState(null);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];

    if (file && file.size > 2 * 1024 * 1024) {
      alert("File size should not exceed 2MB");
      return;
    }

    // Set the preview image based on the type (desktop or mobile)
    const imageUrl = URL.createObjectURL(file);
    if (type === "productThumbnail") {
      setPreviewThumbnail(imageUrl);
      formikAdd.setFieldValue("productThumbnail", file);
    } else if (type === "productImg2") {
      setPreviewImg2(imageUrl);
      formikAdd.setFieldValue("productImg2", file);
    } else if (type === "productImg3") {
      setPreviewImg3(imageUrl);
      formikAdd.setFieldValue("productImg3", file);
    } else if (type === "productImg4") {
      setPreviewImg4(imageUrl);
      formikAdd.setFieldValue("productImg4", file);
    } else if (type === "productImg5") {
      setPreviewImg5(imageUrl);
      formikAdd.setFieldValue("productImg5", file);
    }
  };

  const formikAdd = useFormik({
    initialValues: {
      productName: "",
      productTagLine: "",
      productDescription: "",
      productThumbnail: null,
      productImg2: null,
      productImg3: null,
      productImg4: null,
      productImg5: null,
      productThumbnailAlt: "",
      productAlt2: "",
      productAlt3: "",
      productAlt4: "",
      productAlt5: "",
      prodStructure: "",
      prodHelp: "",
      ProductDetail: "",
      productOriginalPrice: "",
      productDiscountPrice: "",
      productSet: "",
      ProductEdition: "",
      productSlug: "",
      productRating: "",
      productStar: "",
      productMetaTitle: "",
      productMetaDescription: "",
      productKeywords: "",
      productSchema: "",
    },
    validationSchema: Yup.object({
      productName: Yup.string().required("Name is required"),
      productTagLine: Yup.string().required("Description is required"),
      productDescription: Yup.string().required("This field is required"),
      prodStructure: Yup.string().required("This field is required"),
      prodHelp: Yup.string().required("This field is required"),
      ProductDetail: Yup.string().required("This field is required"),
      productThumbnail: Yup.mixed().required("Product Thumbnail is required"),
      productImg2: Yup.mixed().required("Product image is required"),
      productImg3: Yup.mixed().required("Product image is required"),
      productImg4: Yup.mixed().required("Product image is required"),
      productImg5: Yup.mixed().required("Product image is required"),
      productThumbnailAlt: Yup.string().required(
        "Please enter a image alt text"
      ),
      productAlt2: Yup.string().required("Please enter a image alt text"),
      productAlt3: Yup.string().required("Please enter a image alt text"),
      productAlt4: Yup.string().required("Please enter a image alt text"),
      productAlt5: Yup.string().required("Please enter a image alt text"),
      productSet: Yup.string().required("Please select a set"),
      ProductEdition: Yup.string().required("Please select a edition"),
      productOriginalPrice: Yup.string().required("This field is required"),
      productDiscountPrice: Yup.string().required("This field is required"),
      productSlug: Yup.string().required("This field is required"),
      productRating: Yup.string().required("This field is required"),
      productStar: Yup.string().required("Product Star is required"),
      productMetaTitle: Yup.string()
        .required("Meta title is required")
        .max(60, "Meta title should not exceed 60 characters"),

      productMetaDescription: Yup.string()
        .required("Meta description is required")
        .max(160, "Meta description should not exceed 160 characters"),

      productKeywords: Yup.string()
        .required("Keywords are required")
        .max(255, "Keywords should not exceed 255 characters"),

      productSchema: Yup.string().required("Schema is required"),
    }),
    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
      const sanitizeSlug = (sku) => {
        return sku
          .toLowerCase()
          .replace(/ /g, "-") // Replace spaces with dashes
          .replace(/[\/|?%$,;:'"]/g, "") // Remove specific characters
          .replace(/ \\<.*?\\>/g, ""); // Remove any tags
      };

      const sanitizedSKU = sanitizeSlug(values.productSlug);

      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("productTagLine", values.productTagLine);
      formData.append("productDescription", values.productDescription);
      formData.append("productThumbnail", values.productThumbnail);
      formData.append("productImg2", values.productImg2);
      formData.append("productImg3", values.productImg3);
      formData.append("productImg4", values.productImg4);
      formData.append("productImg5", values.productImg5);
      formData.append("productThumbnailAlt", values.productThumbnailAlt);
      formData.append("productAlt2", values.productAlt2);
      formData.append("productAlt3", values.productAlt3);
      formData.append("productAlt4", values.productAlt4);
      formData.append("productAlt5", values.productAlt5);
      formData.append("prodStructure", values.prodStructure);
      formData.append("prodHelp", values.prodHelp);
      formData.append("ProductDetail", values.ProductDetail);
      formData.append("productOriginalPrice", values.productOriginalPrice);
      formData.append("productDiscountPrice", values.productDiscountPrice);
      formData.append("productSet", values.productSet);
      formData.append("ProductEdition", values.ProductEdition);
      formData.append("productMetaTitle", values.productMetaTitle);
      formData.append("productMetaDescription", values.productMetaDescription);
      formData.append("productKeywords", values.productKeywords);
      formData.append("productSchema", values.productSchema);
      formData.append("productSlug", sanitizedSKU);
      formData.append("productRating", values.productRating);
      formData.append("productStar", values.productStar);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/addProduct`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-auth-token": currentUser.token,
            },
          }
        );
        toast.success("Product submitted successfully!");
        // userForm.resetForm();

        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000); // 2-second delay to let the notification show
      } catch (error) {
        console.error("Error submitting product:", error);
        alert("Error submitting product.");
      }
    },
  });

  const editorContent = useRef(null);
  const editorStructure = useRef(null);
  const editorHelp = useRef(null);
  const editorDetail = useRef(null);

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
  //END

  // Edit Product
  const [formData, setFormData] = useState({
    productName: "",
    productTagLine: "",
    productDescription: "",
    productThumbnail: null,
    productImg2: null,
    productImg3: null,
    productImg4: null,
    productImg5: null,
    productThumbnailAlt: "",
    productAlt2: "",
    productAlt3: "",
    productAlt4: "",
    productAlt5: "",
    prodStructure: "",
    prodHelp: "",
    ProductDetail: "",
    productOriginalPrice: "",
    productDiscountPrice: "",
    productSet: "",
    ProductEdition: "",
    productSlug: "",
    productRating: "",
    productStar: "",
    productMetaTitle: "",
    productMetaDescription: "",
    productKeywords: "",
    productSchema: "",
  });

  const [previewEditThumbnail, setPreviewEditThumbnail] = useState(null);
  const [previewEditImg2, setPreviewEditImg2] = useState(null);
  const [previewEditImg3, setPreviewEditImg3] = useState(null);
  const [previewEditImg4, setPreviewEditImg4] = useState(null);
  const [previewEditImg5, setPreviewEditImg5] = useState(null);

  const fetchProductData = async (productId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/get-product/${productId}`
      );
      const {
        productName,
        productTagLine,
        productDescription,
        productThumbnail,
        productImg2,
        productImg3,
        productImg4,
        productImg5,
        productThumbnailAlt,
        productAlt2,
        productAlt3,
        productAlt4,
        productAlt5,
        prodStructure,
        prodHelp,
        ProductDetail,
        productOriginalPrice,
        productDiscountPrice,
        productSet,
        ProductEdition,
        productSlug,
        productRating,
        productStar,
        productMetaTitle,
        productMetaDescription,
        productKeywords,
        productSchema,
      } = response.data;

      // console.log("response", response.data);
      // Find the corresponding category ID
      const productSetLabels = {
        0: "New Arrivals",
        1: "Trending",
        2: "Best Selling",
        3: "Pre Order",
      };

      setFormData({
        ...response.data,
        productSet:
          productSetLabels[response.data.productSet] ||
          response.data.productSet,
      });

      setFormData({
        productId,
        productName,
        productTagLine,
        productDescription,
        productThumbnail,
        productImg2,
        productImg3,
        productImg4,
        productImg5,
        productThumbnailAlt,
        productAlt2,
        productAlt3,
        productAlt4,
        productAlt5,
        prodStructure,
        prodHelp,
        ProductDetail,
        productOriginalPrice,
        productDiscountPrice,
        productSet,
        ProductEdition,
        productSlug,
        productRating,
        productStar,
        productMetaTitle,
        productMetaDescription,
        productKeywords,
        productSchema,
      });

      // Ensure full URL for both images
      setPreviewEditThumbnail(
        productThumbnail
          ? `${process.env.NEXT_PUBLIC_API_URL}${productThumbnail}`
          : null
      );
      setPreviewEditImg2(
        productImg2 ? `${process.env.NEXT_PUBLIC_API_URL}${productImg2}` : null
      );
      setPreviewEditImg3(
        productImg3 ? `${process.env.NEXT_PUBLIC_API_URL}${productImg3}` : null
      );
      setPreviewEditImg4(
        productImg4 ? `${process.env.NEXT_PUBLIC_API_URL}${productImg4}` : null
      );
      setPreviewEditImg5(
        productImg5 ? `${process.env.NEXT_PUBLIC_API_URL}${productImg5}` : null
      );
      setActiveTab(3);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const handleEditImageChange = (e, type) => {
    const file = e.target.files[0];

    if (type === "productThumbnail") {
      setFormData({ ...formData, productThumbnail: file });
      setPreviewEditThumbnail(URL.createObjectURL(file));
    } else if (type === "productImg2") {
      setFormData({ ...formData, productImg2: file });
      setPreviewEditImg2(URL.createObjectURL(file));
    } else if (type === "productImg3") {
      setFormData({ ...formData, productImg3: file });
      setPreviewEditImg3(URL.createObjectURL(file));
    } else if (type === "productImg4") {
      setFormData({ ...formData, productImg4: file });
      setPreviewEditImg4(URL.createObjectURL(file));
    } else if (type === "productImg5") {
      setFormData({ ...formData, productImg5: file });
      setPreviewEditImg5(URL.createObjectURL(file));
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      console.log("formData", formData);
      // debugger
      const productId = formData.productId;

      const sanitizeSlug = (sku) => {
        return sku
          .toLowerCase()
          .replace(/ /g, "-") // Replace spaces with dashes
          .replace(/[\/|?%$,;:'"]/g, "") // Remove specific characters
          .replace(/ \\<.*?\\>/g, ""); // Remove any tags
      };

      const sanitizedSKU = sanitizeSlug(formData.productSlug);

      data.append("productName", formData.productName);
      data.append("productTagLine", formData.productTagLine);
      if (formData.productThumbnail) {
        data.append("productThumbnail", formData.productThumbnail);
      } else {
        data.append("productThumbnailURL", previewEditThumbnail); // Send existing URL
      }

      if (formData.productImg2) {
        data.append("productImg2", formData.productImg2);
      } else {
        data.append("productImg2URL", previewImg2); // Send existing URL
      }
      if (formData.productImg3) {
        data.append("productImg3", formData.productImg3);
      } else {
        data.append("productImg3URL", previewImg3); // Send existing URL
      }
      if (formData.productImg4) {
        data.append("productImg4", formData.productImg4);
      } else {
        data.append("productImg4URL", previewImg4); // Send existing URL
      }
      if (formData.productImg5) {
        data.append("productImg5", formData.productImg5);
      } else {
        data.append("productImg5URL", previewImg5); // Send existing URL
      }
      data.append("productThumbnailAlt", formData.productThumbnailAlt);
      data.append("productAlt2", formData.productAlt2);
      data.append("productAlt3", formData.productAlt3);
      data.append("productAlt4", formData.productAlt4);
      data.append("productAlt5", formData.productAlt5);
      data.append("productDescription", formData.productDescription);
      data.append("prodStructure", formData.prodStructure);
      data.append("prodHelp", formData.prodHelp);
      data.append("ProductDetail", formData.ProductDetail);
      data.append("productOriginalPrice", formData.productOriginalPrice);
      data.append("productDiscountPrice", formData.productDiscountPrice);
      data.append("productSet", formData.productSet);
      data.append("productSlug", sanitizedSKU);
      data.append("ProductEdition", formData.ProductEdition);
      data.append("productRating", formData.productRating);
      data.append("productStar", formData.productStar);
      data.append("productMetaTitle", formData.productMetaTitle);
      data.append("productMetaDescription", formData.productMetaDescription);
      data.append("productKeywords", formData.productKeywords);
      data.append("productSchema", formData.productSchema);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/update-product/${productId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Product updated successfully!");

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Error updating product:", error);
    }
  };

  const handleDelete = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Send request to update the user's status to 3
        fetch(`http://localhost:8001/admin/prod-status/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productStatus: 3 }),
        })
          .then((response) => {
            if (response.ok) {
              toast.success("The product has been deleted Successfully!.");
              // Instead of reloading the page, just refresh data
              fetchProduct();
            } else {
              toast.error("Failed to delete the product.");
            }
          })
          .catch(() => {
            toast.error("An error occurred while deleting the product.");
          });
      }
    });
  };

  return (
    <>
      <div className="">
        <nav className="flex gap-x-3">
          <button
            className={`py-2 px-1 inline-flex items-center gap-x-2 border-b-2  text-sm whitespace-nowrap  hover:text-emerald-500 focus:outline-none focus:text-emerald-500 ${
              activeTab === 0
                ? "font-semibold border-emerald-500 text-emerald-500"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(0)}
            aria-selected={activeTab === 0}
          >
            Product List
          </button>
          <button
            className={`py-2 px-1 inline-flex items-center gap-x-2 border-b-2  text-sm whitespace-nowrap  hover:text-emerald-500 focus:outline-none focus:text-emerald-500 ${
              activeTab === 2
                ? "font-semibold border-emerald-500 text-emerald-500"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(2)}
            aria-selected={activeTab === 2}
          >
            Product Add
          </button>
          <button
            className={`py-2 px-1 inline-flex items-center gap-x-2 border-b-2  text-sm whitespace-nowrap  hover:text-emerald-500 focus:outline-none focus:text-emerald-500 ${
              activeTab === 3
                ? "font-semibold border-emerald-500 text-emerald-500"
                : "hidden border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(3)}
            aria-selected={activeTab === 3}
          >
            Product Edit
          </button>
          <button
            className={`py-2 px-1 inline-flex items-center gap-x-2 border-b-2  text-sm whitespace-nowrap  hover:text-emerald-500 focus:outline-none focus:text-emerald-500 ${
              activeTab === 1
                ? "font-semibold border-emerald-500 text-emerald-500"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(1)}
            aria-selected={activeTab === 1}
          >
            Store Details
          </button>
        </nav>
      </div>

      <div className="mt-3">
        <div className={`${activeTab === 0 ? "" : "hidden"}`}>
          <div className="bg-white border shadow-md rounded p-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
              Manage Product Lists
            </h3>
            <table id="example1" className="display nowwrap w-full table-auto">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Set</th>
                  <th>Stock</th>
                  <th>Time</th>
                  <th>Popular</th>
                  <th>Sort By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center p-3 font-semibold">
                      No available data
                    </td>
                  </tr>
                ) : (
                  productData.map((item, index) => (
                    <tr key={item.productId}>
                      <td>{productData.indexOf(item) + 1}</td>
                      <td>
                        <Zoom>
                          {item.productThumbnail ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}${item.productThumbnail}`}
                              alt={item.productThumbnailAlt} // Fallback to blog title if alt text is not provided
                              className="h-10 w-10 object-cover" // Added object-cover for better image fitting
                            />
                          ) : (
                            <p>No image available</p> // Fallback message if no image is present
                          )}
                        </Zoom>
                      </td>
                      <td>{item.productName}</td>
                      <td>Rs.{item.productDiscountPrice}</td>
                      <td>
                        {item.productSet === 0
                          ? "New Arrivals"
                          : item.productSet === 1
                          ? "Trending"
                          : item.productSet === 2
                          ? "Best Selling"
                          : item.productSet === 3
                          ? "Pre-order"
                          : "Unknown"}
                      </td>
                      <td>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.productStock == 0}
                            onChange={() =>
                              handleStockToggle(
                                item.productId,
                                item.productStock
                              )
                            }
                          />
                          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-emerald-300"></div>
                        </label>
                      </td>

                      <td>
                        {item.productCreatedAt
                          ? format(
                              new Date(item.productCreatedAt * 1000),
                              "dd MMM yyyy hh:mm (EEE)",
                              { timeZone: "Asia/Kolkata" }
                            )
                          : "N/A"}
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <button
                            onClick={() =>
                              toggleProductPopularStatus(
                                item.productId,
                                item.productPopular
                              )
                            }
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {item.productPopular === 0 ? (
                              <IoMdCheckmarkCircleOutline
                                style={{
                                  color: "green",
                                  backgroundColor: "white",
                                }}
                              />
                            ) : (
                              <FaBan style={{ color: "red" }} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td>
                        {editSortBy == item.productId ? (
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
                              onClick={() => handleSortBySubmit(item.productId)}
                              className="ml-2 bg-emerald-300 text-black px-3 py-2 rounded"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleSortByEdit(
                                item.productId,
                                item.productSortBy
                              )
                            }
                            className="text-black font-bold bg-emerald-300 px-3 py-1 rounded"
                          >
                            {item.productSortBy}
                          </button>
                        )}
                      </td>
                      <td>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.productStatus == 0}
                            onChange={() =>
                              handleToggle(
                                item.productId,
                                item.productStatus,
                                item.productName
                              )
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
                                onClick={() => fetchProductData(item.productId)}
                              >
                                Edit
                              </button>
                            </li>
                            <li className=" rounded">
                              <button
                                className="hover:bg-red-200"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(item.productId);
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
          className={`${activeTab === 2 ? "" : "hidden"}`}
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-2"
        >
          <div className=" mx-auto p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">
              Add Product
            </h1>

            <form
              onSubmit={formikAdd.handleSubmit}
              autoComplete="off"
              className="flex flex-wrap gap-4 sm:gap-6 text-sm"
            >
              {/* Product Name */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="productName"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product Name:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="productName"
                    name="productName"
                    type="text"
                    placeholder="Enter Product Name"
                    onChange={formikAdd.handleChange}
                    onBlur={formikAdd.handleBlur}
                    value={formikAdd.values.productName}
                    className="w-full border-2 border-gray-300 p-2 rounded "
                  />
                  {formikAdd.touched.productName &&
                    formikAdd.errors.productName && (
                      <p className="text-red-500 text-sm">
                        {formikAdd.errors.productName}
                      </p>
                    )}
                </div>
              </div>

              {/* Product Short Detail */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="productTagLine"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product Short Detail:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <textarea
                    id="productTagLine"
                    name="productTagLine"
                    placeholder="Enter Product Short Detail"
                    onChange={formikAdd.handleChange}
                    onBlur={formikAdd.handleBlur}
                    value={formikAdd.values.productTagLine}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formikAdd.touched.productTagLine &&
                    formikAdd.errors.productTagLine && (
                      <p className="text-red-500 text-sm">
                        {formikAdd.errors.productTagLine}
                      </p>
                    )}
                </div>
              </div>

              {/* Product Description */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="productDescription"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product Description:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <JoditEditor
                    ref={editorContent}
                    config={config}
                    id="productDescription"
                    name="productDescription"
                    placeholder="Enter Product Description"
                    onChange={(newContent) => {
                      formikAdd.setFieldValue("productDescription", newContent);
                    }}
                    onBlur={() => {
                      formikAdd.setFieldTouched("productDescription", true);
                    }}
                    value={formikAdd.values.productDescription}
                  />
                  {formikAdd.touched.productDescription &&
                    formikAdd.errors.productDescription && (
                      <p className="text-red-500 text-sm">
                        {formikAdd.errors.productDescription}
                      </p>
                    )}
                </div>
              </div>

              {/* Product Description */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="prodStructure"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product Structure:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <JoditEditor
                    ref={editorStructure}
                    config={config}
                    id="prodStructure"
                    name="prodStructure"
                    placeholder="Enter Product Structure"
                    onChange={(newContent) => {
                      formikAdd.setFieldValue("prodStructure", newContent);
                    }}
                    onBlur={() => {
                      formikAdd.setFieldTouched("prodStructure", true);
                    }}
                    value={formikAdd.values.prodStructure}
                  />
                  {formikAdd.touched.prodStructure &&
                    formikAdd.errors.prodStructure && (
                      <p className="text-red-500 text-sm">
                        {formikAdd.errors.prodStructure}
                      </p>
                    )}
                </div>
              </div>

              {/* Product Help */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="prodHelp"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product Help:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <JoditEditor
                    ref={editorHelp}
                    config={config}
                    id="prodHelp"
                    name="prodHelp"
                    placeholder="Enter Product Help"
                    onChange={(newContent) => {
                      formikAdd.setFieldValue("prodHelp", newContent);
                    }}
                    onBlur={() => {
                      formikAdd.setFieldTouched("prodHelp", true);
                    }}
                    value={formikAdd.values.prodHelp}
                  />
                  {formikAdd.touched.prodHelp && formikAdd.errors.prodHelp && (
                    <p className="text-red-500 text-sm">
                      {formikAdd.errors.prodHelp}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Detail */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="ProductDetail"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product Detail:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <JoditEditor
                    ref={editorDetail}
                    config={config}
                    id="ProductDetail"
                    name="ProductDetail"
                    placeholder="Enter Product Help"
                    onChange={(newContent) => {
                      formikAdd.setFieldValue("ProductDetail", newContent);
                    }}
                    onBlur={() => {
                      formikAdd.setFieldTouched("ProductDetail", true);
                    }}
                    value={formikAdd.values.ProductDetail}
                  />
                  {formikAdd.touched.ProductDetail &&
                    formikAdd.errors.ProductDetail && (
                      <p className="text-red-500 text-sm">
                        {formikAdd.errors.ProductDetail}
                      </p>
                    )}
                </div>
              </div>

              {/* Product Original Price */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="productOriginalPrice"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product Original Price:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="productOriginalPrice"
                    name="productOriginalPrice"
                    type="text"
                    placeholder="Enter Product Original Price"
                    onChange={formikAdd.handleChange}
                    onBlur={formikAdd.handleBlur}
                    value={formikAdd.values.productOriginalPrice}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formikAdd.touched.productOriginalPrice &&
                    formikAdd.errors.productOriginalPrice && (
                      <p className="text-red-500 text-sm">
                        {formikAdd.errors.productOriginalPrice}
                      </p>
                    )}
                </div>
              </div>

              {/* Product Discount Price */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="productDiscountPrice"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product Discount Price:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="productDiscountPrice"
                    name="productDiscountPrice"
                    type="text"
                    placeholder="Enter Product Discount Price"
                    onChange={formikAdd.handleChange}
                    onBlur={formikAdd.handleBlur}
                    value={formikAdd.values.productDiscountPrice}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formikAdd.touched.productDiscountPrice &&
                    formikAdd.errors.productDiscountPrice && (
                      <p className="text-red-500 text-sm">
                        {formikAdd.errors.productDiscountPrice}
                      </p>
                    )}
                </div>
              </div>

              {/* Product Set */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="productSet"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product Set:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <select
                    id="productSet"
                    name="productSet"
                    onChange={formikAdd.handleChange}
                    onBlur={formikAdd.handleBlur}
                    value={formikAdd.values.productSet}
                    className="w-full border-2 border-gray-300 p-2 rounded "
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    <option value="0">New Arrivals</option>
                    <option value="1">Trending</option>
                    <option value="2">Best Selling</option>
                    <option value="3">Pre Order</option>
                  </select>
                  {formikAdd.touched.productSet &&
                    formikAdd.errors.productSet && (
                      <p className="text-red-500 text-sm">
                        {formikAdd.errors.productSet}
                      </p>
                    )}
                </div>
              </div>

              {/* Product Edition */}
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="ProductEdition"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product Edition:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <select
                    id="ProductEdition"
                    name="ProductEdition"
                    onChange={formikAdd.handleChange}
                    onBlur={formikAdd.handleBlur}
                    value={formikAdd.values.ProductEdition}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  >
                    <option value="">Select Year</option>
                    {Array.from(
                      { length: new Date().getFullYear() - 1998 },
                      (_, i) => (
                        <option key={i} value={1999 + i}>
                          {1999 + i}
                        </option>
                      )
                    )}
                  </select>
                  {formikAdd.touched.ProductEdition &&
                    formikAdd.errors.ProductEdition && (
                      <p className="text-red-500 text-sm">
                        {formikAdd.errors.ProductEdition}
                      </p>
                    )}
                </div>
              </div>

              {/* Product Rating */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="productRating"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product Rating:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="productRating"
                    name="productRating"
                    type="text"
                    placeholder="Enter Product Rating"
                    onChange={formikAdd.handleChange}
                    onBlur={formikAdd.handleBlur}
                    value={formikAdd.values.productRating}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formikAdd.touched.productRating &&
                    formikAdd.errors.productRating && (
                      <p className="text-red-500 text-sm">
                        {formikAdd.errors.productRating}
                      </p>
                    )}
                </div>
              </div>

              {/* Product Star */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="productStar"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product Star:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="productStar"
                    name="productStar"
                    type="text"
                    placeholder="4.2"
                    onChange={formikAdd.handleChange}
                    onBlur={formikAdd.handleBlur}
                    value={formikAdd.values.productStar}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formikAdd.touched.productStar &&
                    formikAdd.errors.productStar && (
                      <p className="text-red-500 text-sm">
                        {formikAdd.errors.productStar}
                      </p>
                    )}
                </div>
              </div>

              {/* Product SKU */}
              <div className="sm:flex w-full  items-center">
                <label
                  htmlFor="productSlug"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Product SKU:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="productSlug"
                    name="productSlug"
                    type="text"
                    placeholder="Enter SKU"
                    onChange={formikAdd.handleChange}
                    onBlur={formikAdd.handleBlur}
                    value={formikAdd.values.productSlug}
                    className="w-full border-2 border-gray-300 p-2 rounded"
                  />
                  {formikAdd.touched.productSlug &&
                    formikAdd.errors.productSlug && (
                      <p className="text-red-500 text-sm">
                        {formikAdd.errors.productSlug}
                      </p>
                    )}
                </div>
              </div>

              <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
                <legend className="text-xl font-semibold">Images :</legend>
                {/* Product Thumbnail */}
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productThumbnail"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Thumbnail:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productThumbnail"
                      name="productThumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "productThumbnail")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productThumbnail &&
                      formikAdd.errors.productThumbnail && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productThumbnail}
                        </p>
                      )}
                    {previewThumbnail && (
                      <div className="flex justify-center my-3">
                        <img
                          src={previewThumbnail}
                          alt="Preview"
                          className="rounded shadow"
                          width="100"
                          height="100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Thumbnail Alt Text */}
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="productThumbnailAlt"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Thumbnail Alt:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productThumbnailAlt"
                      name="productThumbnailAlt"
                      type="text"
                      placeholder="Enter Product Thumbnail Alt Text"
                      onChange={formikAdd.handleChange}
                      onBlur={formikAdd.handleBlur}
                      value={formikAdd.values.productThumbnailAlt}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productThumbnailAlt &&
                      formikAdd.errors.productThumbnailAlt && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productThumbnailAlt}
                        </p>
                      )}
                  </div>
                </div>

                {/* Product Image 2 */}
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productImg2"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Image 2:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productImg2"
                      name="productImg2"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "productImg2")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productImg2 &&
                      formikAdd.errors.productImg2 && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productImg2}
                        </p>
                      )}
                    {previewImg2 && (
                      <div className="flex justify-center my-3">
                        <img
                          src={previewImg2}
                          alt="Preview"
                          className="rounded shadow"
                          width="100"
                          height="100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Image2 Alt Text */}
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="productAlt2"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Img 2 Alt:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productAlt2"
                      name="productAlt2"
                      type="text"
                      placeholder="Enter Product Alt Text"
                      onChange={formikAdd.handleChange}
                      onBlur={formikAdd.handleBlur}
                      value={formikAdd.values.productAlt2}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productAlt2 &&
                      formikAdd.errors.productAlt2 && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productAlt2}
                        </p>
                      )}
                  </div>
                </div>

                {/* Product Image 3 */}
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productImg3"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Image 3:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productImg3"
                      name="productImg3"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "productImg3")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productImg3 &&
                      formikAdd.errors.productImg3 && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productImg3}
                        </p>
                      )}
                    {previewImg3 && (
                      <div className="flex justify-center my-3">
                        <img
                          src={previewImg3}
                          alt="Preview"
                          className="rounded shadow"
                          width="100"
                          height="100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Image 3 Alt Text */}
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="productAlt3"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Img 3 Alt:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productAlt3"
                      name="productAlt3"
                      type="text"
                      placeholder="Enter Product Alt Text"
                      onChange={formikAdd.handleChange}
                      onBlur={formikAdd.handleBlur}
                      value={formikAdd.values.productAlt3}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productAlt3 &&
                      formikAdd.errors.productAlt3 && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productAlt3}
                        </p>
                      )}
                  </div>
                </div>

                {/* Product Image 4 */}
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productImg4"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Image 4:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productImg4"
                      name="productImg4"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "productImg4")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productImg4 &&
                      formikAdd.errors.productImg4 && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productImg4}
                        </p>
                      )}
                    {previewImg4 && (
                      <div className="flex justify-center my-3">
                        <img
                          src={previewImg4}
                          alt="Preview"
                          className="rounded shadow"
                          width="100"
                          height="100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Image 4 Alt Text */}
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="productAlt4"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Img 4 Alt:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productAlt4"
                      name="productAlt4"
                      type="text"
                      placeholder="Enter Product Alt Text"
                      onChange={formikAdd.handleChange}
                      onBlur={formikAdd.handleBlur}
                      value={formikAdd.values.productAlt4}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productAlt4 &&
                      formikAdd.errors.productAlt4 && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productAlt4}
                        </p>
                      )}
                  </div>
                </div>

                {/* Product Image 5 */}
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productImg5"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Image 5:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productImg5"
                      name="productImg5"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "productImg5")}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productImg5 &&
                      formikAdd.errors.productImg5 && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productImg5}
                        </p>
                      )}
                    {previewImg5 && (
                      <div className="flex justify-center my-3">
                        <img
                          src={previewImg5}
                          alt="Preview"
                          className="rounded shadow"
                          width="100"
                          height="100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Image 5 Alt Text */}
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="productAlt5"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Img 5 Alt:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productAlt5"
                      name="productAlt5"
                      type="text"
                      placeholder="Enter Product Alt Text"
                      onChange={formikAdd.handleChange}
                      onBlur={formikAdd.handleBlur}
                      value={formikAdd.values.productAlt5}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productAlt5 &&
                      formikAdd.errors.productAlt5 && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productAlt5}
                        </p>
                      )}
                  </div>
                </div>
              </fieldset>

              <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
                <legend className="text-xl font-semibold">
                  Meta Details :
                </legend>
                {/* Blog Meta Title */}
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="productMetaTitle"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Title:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productMetaTitle"
                      name="productMetaTitle"
                      type="text"
                      placeholder="Enter Meta Title"
                      onChange={formikAdd.handleChange}
                      onBlur={formikAdd.handleBlur}
                      value={formikAdd.values.productMetaTitle}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productMetaTitle &&
                      formikAdd.errors.productMetaTitle && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productMetaTitle}
                        </p>
                      )}
                  </div>
                </div>

                {/* Meta Description */}
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="productMetaDescription"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Description:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <textarea
                      id="productMetaDescription"
                      name="productMetaDescription"
                      placeholder="Enter Meta Description"
                      onChange={formikAdd.handleChange}
                      onBlur={formikAdd.handleBlur}
                      value={formikAdd.values.productMetaDescription}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productMetaDescription &&
                      formikAdd.errors.productMetaDescription && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productMetaDescription}
                        </p>
                      )}
                  </div>
                </div>

                {/* Meta Keywords */}
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="productKeywords"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Keywords:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productKeywords"
                      name="productKeywords"
                      type="text"
                      placeholder="Enter Meta Keywords"
                      onChange={formikAdd.handleChange}
                      onBlur={formikAdd.handleBlur}
                      value={formikAdd.values.productKeywords}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    {formikAdd.touched.productKeywords &&
                      formikAdd.errors.productKeywords && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productKeywords}
                        </p>
                      )}
                  </div>
                </div>

                {/*  Schema */}
                <div className="sm:flex w-full  items-center">
                  <label
                    htmlFor="productSchema"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Schema:
                    <a
                      href="https://validator.schema.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      Validate it!
                    </a>
                  </label>

                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <textarea
                      id="productSchema"
                      name="productSchema"
                      placeholder="Enter Schema"
                      onChange={formikAdd.handleChange}
                      onBlur={formikAdd.handleBlur}
                      value={formikAdd.values.productSchema}
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                    <small className="font-medium text-quaternary leading-relaxed">
                      Important Note: Do not include the{" "}
                      <code>&lt;script&gt;</code> tag when uploading the schema.
                      The <code>&lt;script&gt;</code> tag is already provided.
                      Please upload only the main schema body within{" "}
                      <code>{"{}"}</code>.
                    </small>
                    {formikAdd.touched.productSchema &&
                      formikAdd.errors.productSchema && (
                        <p className="text-red-500 text-sm">
                          {formikAdd.errors.productSchema}
                        </p>
                      )}
                  </div>
                </div>
              </fieldset>

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
          className={`${activeTab === 3 ? "" : "hidden"}`}
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-3"
        >
          {" "}
          <div className="mx-auto p-4 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">
              Edit Product
            </h1>
            {activeTab && (
              <form
                onSubmit={handleEditFormSubmit}
                className="flex flex-wrap gap-4 sm:gap-6 text-sm"
              >
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productName"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Name:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productName"
                      name="productName"
                      type="text"
                      placeholder="Enter Product Name"
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productName: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productTagLine"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Tag Line:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      type="text"
                      id="productTagLine"
                      name="productTagLine"
                      placeholder="Enter Product Tag Line"
                      value={formData.productTagLine}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productTagLine: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productDescription"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Description:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <JoditEditor
                      value={formData.productDescription}
                      onChange={(content) =>
                        setFormData({
                          ...formData,
                          productDescription: content,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="prodStructure"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Structure:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <JoditEditor
                      value={formData.prodStructure}
                      onChange={(content) =>
                        setFormData({ ...formData, prodStructure: content })
                      }
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="prodHelp"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Help:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <JoditEditor
                      value={formData.prodHelp}
                      onChange={(content) =>
                        setFormData({ ...formData, prodHelp: content })
                      }
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ProductDetail"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Detail:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <JoditEditor
                      value={formData.ProductDetail}
                      onChange={(content) =>
                        setFormData({ ...formData, ProductDetail: content })
                      }
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productOriginalPrice"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Original Price:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      type="text"
                      id="productOriginalPrice"
                      name="productOriginalPrice"
                      placeholder="Enter Product Tag Line"
                      value={formData.productOriginalPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productOriginalPrice: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productDiscountPrice"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Discount Price:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      type="text"
                      id="productDiscountPrice"
                      name="productDiscountPrice"
                      placeholder="Enter Product Tag Line"
                      value={formData.productDiscountPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productDiscountPrice: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productSet"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Set:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <select
                      id="productSet"
                      name="productSet"
                      value={String(formData.productSet) || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productSet: Number(e.target.value),
                        })
                      }
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    >
                      <option value="" disabled>
                        Select a Product Set
                      </option>
                      <option value="0">New Arrivals</option>
                      <option value="1">Trending</option>
                      <option value="2">Best Selling</option>
                      <option value="3">Pre Order</option>
                    </select>
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="ProductEdition"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Edition:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <select
                      id="ProductEdition"
                      name="ProductEdition"
                      value={formData.ProductEdition || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ProductEdition: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    >
                      <option value="" disabled>
                        Select Product Edition
                      </option>
                      {Array.from(
                        { length: new Date().getFullYear() - 1998 },
                        (_, i) => (
                          <option key={i} value={1999 + i}>
                            {1999 + i}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productRating"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Rating:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productRating"
                      name="productRating"
                      type="text"
                      value={formData.productRating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productRating: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productStar"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Star:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productStar"
                      name="productStar"
                      type="text"
                      value={formData.productStar}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productStar: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="productSlug"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Product Slug:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="productSlug"
                      name="productSlug"
                      type="text"
                      value={formData.productSlug}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productSlug: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
                  <legend className="text-xl font-semibold">Images :</legend>
                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productThumbnail"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Product Thumbnail:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="productThumbnail"
                        name="productThumbnail"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleEditImageChange(e, "productThumbnail")
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                      {previewEditThumbnail && (
                        <img
                          src={previewEditThumbnail}
                          alt="Preview"
                          width="100"
                          className="mt-3 rounded shadow"
                        />
                      )}
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productThumbnailAlt"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Product Thumnail Alt:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="productThumbnailAlt"
                        name="productThumbnailAlt"
                        type="text"
                        value={formData.productThumbnailAlt}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productThumbnailAlt: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productImg2"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Product Image 2:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="productImg2"
                        name="productImg2"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleEditImageChange(e, "productImg2")
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                      {previewEditImg2 && (
                        <img
                          src={previewEditImg2}
                          alt="Mobile Preview"
                          width="100"
                          className="mt-3 rounded shadow"
                        />
                      )}
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productAlt2"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Product Image Alt 2:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="productAlt2"
                        name="productAlt2"
                        type="text"
                        value={formData.productAlt2}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productAlt2: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productImg3"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Product Image 3:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="productImg3"
                        name="productImg3"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleEditImageChange(e, "productImg3")
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                      {previewEditImg3 && (
                        <img
                          src={previewEditImg3}
                          alt="Mobile Preview"
                          width="100"
                          className="mt-3 rounded shadow"
                        />
                      )}
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productAlt3"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Product Image Alt 3:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="productAlt3"
                        name="productAlt3"
                        type="text"
                        value={formData.productAlt3}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productAlt3: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productImg4"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Product Image 4:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="productImg4"
                        name="productImg4"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleEditImageChange(e, "productImg4")
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                      {previewEditImg4 && (
                        <img
                          src={previewEditImg4}
                          alt="Mobile Preview"
                          width="100"
                          className="mt-3 rounded shadow"
                        />
                      )}
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productAlt4"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Product Image Alt 4:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="productAlt4"
                        name="productAlt4"
                        type="text"
                        value={formData.productAlt4}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productAlt4: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productImg5"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Product Image 5:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="productImg5"
                        name="productImg5"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleEditImageChange(e, "productImg5")
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                      {previewEditImg5 && (
                        <img
                          src={previewEditImg5}
                          alt="Mobile Preview"
                          width="100"
                          className="mt-3 rounded shadow"
                        />
                      )}
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productAlt5"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Product Image Alt 5:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="productAlt5"
                        name="productAlt5"
                        type="text"
                        value={formData.productAlt5}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productAlt5: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
                  <legend className="text-xl font-semibold">
                    Meta Details :
                  </legend>
                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productMetaTitle"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Title:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="productMetaTitle"
                        name="productMetaTitle"
                        type="text"
                        value={formData.productMetaTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productMetaTitle: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productMetaDescription"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Description:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <textarea
                        id="productMetaDescription"
                        name="productMetaDescription"
                        value={formData.productMetaDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productMetaDescription: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productKeywords"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Keywords:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <input
                        id="productKeywords"
                        name="productKeywords"
                        type="text"
                        value={formData.productKeywords}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productKeywords: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="sm:flex w-full items-center">
                    <label
                      htmlFor="productSchema"
                      className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                    >
                      Schema:
                    </label>
                    <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                      <textarea
                        id="productSchema"
                        name="productSchema"
                        value={formData.productSchema}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productSchema: e.target.value,
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

        {/* UPDATE STORE DETAILS */}
        <div className={`${activeTab === 1 ? "" : "hidden"}`}>
          <div className=" mx-auto p-5 bg-white shadow-md border rounded-md">
            <h1 className="text-lg font-bold mb-6 border-b pb-2">
              Update Store Details
            </h1>

            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-wrap gap-4 sm:gap-6 text-sm"
              autoComplete="off"
              encType="multipart/form-data"
            >
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="storeTitle"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Store Title:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="storeTitle"
                    name="storeTitle"
                    type="text"
                    placeholder="Enter Store Title"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.storeTitle}
                  />
                  {formik.errors.storeTitle && (
                    <div className="text-red-500">
                      {formik.errors.storeTitle}
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="storeDescription"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Store Description:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <textarea
                    rows={3}
                    id="storeDescription"
                    name="storeDescription"
                    placeholder="Enter Store Description"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.storeDescription}
                  />
                  {formik.errors.storeDescription && (
                    <div className="text-red-500">
                      {formik.errors.storeDescription}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="storeLongDescription"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Store Long Description:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <textarea
                    rows={3}
                    id="storeLongDescription"
                    name="storeLongDescription"
                    placeholder="Enter Store Long Description"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.storeLongDescription}
                  />
                  {formik.errors.storeLongDescription && (
                    <div className="text-red-500">
                      {formik.errors.storeLongDescription}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="storeExpressAmt"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Store Express Amount:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="storeExpressAmt"
                    name="storeExpressAmt"
                    type="number"
                    placeholder="Enter Store Express Amount"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.storeExpressAmt}
                  />
                  {formik.errors.storeExpressAmt && (
                    <div className="text-red-500">
                      {formik.errors.storeExpressAmt}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="storeStandardAmt"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Store Standard Amount:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="storeStandardAmt"
                    name="storeStandardAmt"
                    type="number"
                    placeholder="Enter Store Express Amount"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.storeStandardAmt}
                  />
                  {formik.errors.storeStandardAmt && (
                    <div className="text-red-500">
                      {formik.errors.storeStandardAmt}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="storeExpressDays"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Store Express Days:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="storeExpressDays"
                    name="storeExpressDays"
                    type="text"
                    placeholder="Enter Store Express Days"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.storeExpressDays}
                  />
                  {formik.errors.storeExpressDays && (
                    <div className="text-red-500">
                      {formik.errors.storeExpressDays}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:flex w-full items-center">
                <label
                  htmlFor="storeStandardDays"
                  className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                >
                  Store Standard Days:
                </label>
                <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                  <input
                    id="storeStandardDays"
                    name="storeStandardDays"
                    type="text"
                    placeholder="Enter Store Standard Days"
                    className="w-full border-2 border-gray-300 p-2 rounded"
                    onChange={formik.handleChange}
                    value={formik.values.storeStandardDays}
                  />
                  {formik.errors.storeStandardDays && (
                    <div className="text-red-500">
                      {formik.errors.storeStandardDays}
                    </div>
                  )}
                </div>
              </div>

              <fieldset className="w-full border-2 border-gray-200 rounded bg-dashGray flex flex-wrap gap-4 p-2">
                <legend className="text-xl font-semibold p-2">
                  Meta Details :
                </legend>
                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="storeMetaTitle"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Title:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="storeMetaTitle"
                      name="storeMetaTitle"
                      type="text"
                      placeholder="Enter Meta Title"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.storeMetaTitle}
                    />
                    {formik.errors.storeMetaTitle && (
                      <div className="text-red-500">
                        {formik.errors.storeMetaTitle}
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="storeMetaDescription"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Description:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <textarea
                      rows={3}
                      id="storeMetaDescription"
                      name="storeMetaDescription"
                      placeholder="Enter Meta Description"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.storeMetaDescription}
                    />
                    {formik.errors.storeMetaDescription && (
                      <div className="text-red-500">
                        {formik.errors.storeMetaDescription}
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="storeMetaKeyword"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Keywords:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <input
                      id="storeMetaKeyword"
                      name="storeMetaKeyword"
                      type="text"
                      placeholder="Enter Meta Keywords"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.storeMetaKeyword}
                    />
                    {formik.errors.storeMetaKeyword && (
                      <div className="text-red-500">
                        {formik.errors.storeMetaKeyword}
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:flex w-full items-center">
                  <label
                    htmlFor="storeSchema"
                    className="sm:w-[15%] text-gray-700 flex items-center font-medium"
                  >
                    Schema:
                  </label>
                  <div className="w-full sm:w-[80%] mt-1 sm:mt-0">
                    <textarea
                      rows={3}
                      id="storeSchema"
                      name="storeSchema"
                      placeholder="Enter Meta Schema"
                      className="w-full border-2 border-gray-300 p-2 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.storeSchema}
                    />
                    {formik.errors.storeSchema && (
                      <div className="text-red-500">
                        {formik.errors.storeSchema}
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

export default Store;
