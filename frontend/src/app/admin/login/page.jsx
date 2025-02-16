"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAppContext from "@/context/AppContext";
const ISSERVER = typeof window === "undefined";

const adminLogin = () => {
  const router = useRouter();
  const { setLoggedIn, setCurrentUser } = useAppContext();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // console.log(values);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/authenticate`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(response.status);
          if (response.status === 200) {
            toast.success("User login successfully");
            response.json().then((data) => {
              if (!ISSERVER) {
                localStorage.setItem("user", JSON.stringify(data));
              }
              setCurrentUser(data);
              setLoggedIn(true);
              document.cookie = `token=${data.token}`;
              formik.resetForm();
              router.push("/admin/dashboard");
            });
          } else {
            toast.error("User not found!");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Some Error Occured");
        });
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex  flex-1 flex-col justify-center px-6  py-24   lg:px-8 bg-white">
        <div className=" sm:mx-auto sm:w-full sm:max-w-3xl  rounded-lg ">
          <div className="group">
            <div className="mt-3">
              <img
                className="mx-auto h-20 w-auto rounded-full "
                src="/logo.png"
                alt="dashboard"
              />
              <h2 className="mt-2 text-center text-3xl  leading-9 tracking-wide text-quaternary font-Montserrat font-extrabold ">
                Login To Your Dashboard
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl font-Syne ">
              <form
                className="space-y-6"
                action="#"
                method="POST"
                onSubmit={formik.handleSubmit}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-md font-medium leading-6 text-quaternary"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="current-email"
                      required
                      placeholder="Enter your email address"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-800 placeholder:text-gray-400 focus:ring-2  focus:ring-inset focus:ring-quaternary sm:text-sm sm:leading-6"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-md font-medium leading-6 text-quaternary"
                    >
                      Password
                    </label>
                    <div className="text-sm">
                      <Link
                        href="/resetPassword"
                        className="font-semibold text-spaceblack/70 hover:text-black"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      placeholder="Enter your Password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="block w-full mb-2 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-quaternary sm:text-sm sm:leading-6"
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.password}
                      </div>
                    ) : null}

                    <label className="flex items-center text-sm text-spaceblack/70 hover:text-black font-medium">
                      <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={handleCheckboxChange}
                        className="mr-1  text-spaceblack  "
                      />
                      Show Password
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full outline font-Jost justify-center rounded-md hover:bg-quaternary px-3 py-1.5 text-sm font-semibold leading-6 text-quaternary hover:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Log in
                </button>
              </form>

              <div className="mt-10 mb-5 text-center text-sm text-gray-700">
                Not a member?{" "}
                <Link
                  href=""
                  className="font-semibold  leading-6 text-spaceblack/90 hover:text-black"
                >
                  Register for an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default adminLogin;
