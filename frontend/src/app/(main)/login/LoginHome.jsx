"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import Link from "next/link";
import axios from "axios";
import useConsumerContext from "@/context/ConsumerContext";
const ISSERVER = typeof window === "undefined";

const LoginHome = () => {
  // const {setLoggedIn} = useAppContext();

  const router = useRouter();
  const { setLoggedIn, setCurrentConsumer } = useConsumerContext();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: (values) => {
      console.log(values);
      // fetch('http://localhost:5000/signup/authenticate', {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/consumer/authenticate`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(response.status);
          if (response.status === 200) {
            toast.success("User login successfully", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
            response.json().then((data) => {
              if (!ISSERVER) {
                localStorage.setItem("consumer", JSON.stringify(data));
              }
              setCurrentConsumer(data);
              setLoggedIn(true);
              document.cookie = `CToken=${data.token}`;
              formik.resetForm();
              setTimeout(() => {
                router.push("/");
              }, 2000); // 2000 milliseconds = 2 seconds
            });
          } else {
            toast.error("Invalid Credentials", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong. Please try again.");
        });
    },
  });

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

  return (
    <div className="flex h-screen flex-1 flex-col justify-center px-6 py-24 lg:px-8 bg-white font-RedditSans">
      <div className="p-5 sm:mx-auto sm:w-full sm:max-w-md rounded-lg bg-white shadow-2xl">
        <div className="group">
          <div className="">
            <img
              className="mx-auto h-20 w-auto rounded-full"
              src={`${process.env.NEXT_PUBLIC_API_URL}${headerData?.companyLogo}`}
              alt={headerData?.companyName || "Company Logo"}
            />
            <h2 className="mt-2 text-center text-3xl font-bold  leading-9 tracking-tight text-quaternary ">
              Login to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md ">
            <form
              className="space-y-6"
              action="#"
              method="POST"
              autoComplete="off"
              onSubmit={formik.handleSubmit}
            >
              <div>
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
                    required
                    placeholder="Enter your email address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
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
                    className="block text-sm font-medium leading-6 text-quaternary"
                  >
                    Password
                  </label>
                  <div className="text-xs">
                    <Link
                      href="/reset-password"
                      className="font-medium  text-spaceblack hover:text-quaternary"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <input
                    id="hs-toggle-password"
                    name="password"
                    placeholder="Enter your Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    autoComplete="current-password"
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.password}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    data-hs-toggle-password='{
      "target": "#hs-toggle-password"
    }'
                    className="absolute top-0 end-0 p-3.5 rounded-e-md"
                  >
                    <svg
                      className="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        className="hs-password-active:hidden"
                        d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                      ></path>
                      <path
                        className="hs-password-active:hidden"
                        d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                      ></path>
                      <path
                        className="hs-password-active:hidden"
                        d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                      ></path>
                      <line
                        className="hs-password-active:hidden"
                        x1="2"
                        x2="22"
                        y1="2"
                        y2="22"
                      ></line>
                      <path
                        className="hidden hs-password-active:block"
                        d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                      ></path>
                      <circle
                        className="hidden hs-password-active:block"
                        cx="12"
                        cy="12"
                        r="3"
                      ></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bgEmerald px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-quaternary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quaternary"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 mb-5 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link
                href="/signup"
                className="font-semibold leading-6 text-spaceblack hover:text-quaternary"
              >
                Register for an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginHome;
