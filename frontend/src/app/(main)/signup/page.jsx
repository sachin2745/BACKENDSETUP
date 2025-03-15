"use client";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";

import * as Yup from "yup";

const Signup = () => {
  const [headerData, setHeaderData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/web/header-data`
        );

        if (response.status === 200) {
          setHeaderData(response.data.headerData);
        } else {
          console.error(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching header data:", err);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();
  const signupvalidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    cpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      cpassword: "",
    },

    onSubmit: (values) => {
      // console.log(values);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/add-consumer`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          const data = await response.json(); // Parse JSON response

          if (response.status === 200) {
            toast.success("User Registered successfully", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
            formik.resetForm();
            router.push("/login");
          } else {
            // Show appropriate error message
            toast.error(data.error || "Invalid Credentials", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong. Please try again.");
        });
    },

    validationSchema: signupvalidationSchema,
  });

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white font-RedditSans">
      <div className="border-2 border-b-4 border-e-4 border-gray-200 p-4 sm:mx-auto sm:w-full sm:max-w-xl rounded-lg bg-white">
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-xl">
          <img
            className="mx-auto h-20 w-auto"
            src={`${process.env.NEXT_PUBLIC_API_URL}${headerData?.companyLogo}`}
            alt={headerData?.companyName || "Company Logo"}
          />
          <h2 className="mt-3 text-center text-3xl font-bold leading-9 tracking-tight text-quaternary font-Jost">
            Create a free account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
          <form onSubmit={formik.handleSubmit} autoComplete="off">
            <div className="mb-2 sm:mb-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium  text-quaternary"
                >
                  Name
                </label>
                <div className="mt-0">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your full name"
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.name}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="sm:flex gap-2 mb-2 sm:mb-4">
              <div className="flex-1 mb-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-quaternary"
                >
                  Email address
                </label>
                <div className="mt-0">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex-1 mb-2">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium leading-6 text-quaternary"
                >
                  Phone Number
                </label>
                <div className="mt-0">
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    autoComplete="organization"
                    maxLength={10}
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your phone number"
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.phoneNumber}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="sm:flex gap-2 mb-8">
              <div className="flex-1 mb-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-quaternary"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-0">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Create a password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex-1 mb-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-quaternary"
                  >
                    Confirm Password
                  </label>
                </div>
                <div className="mt-0">
                  <input
                    name="cpassword"
                    type="password"
                    id="cpassword"
                    autoComplete="current-password"
                    placeholder="Confirm password"
                    value={formik.values.cpassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                  />
                  {formik.touched.cpassword && formik.errors.cpassword ? (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.cpassword}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bgEmerald px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:shadow-md  focus:outline-none"
              >
                Create Account
              </button>
            </div>
          </form>

          <p className="mt-10 mb-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold leading-6 text-spaceblack hover:text-quaternary"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
