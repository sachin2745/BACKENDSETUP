"use client";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { FiEye, FiEyeOff } from "react-icons/fi";
import * as Yup from "yup";

const ResetPassword = () => {
  const emailRef = useRef(null);
  const otpRefs = Array(6)
    .fill(null)
    .map(() => useRef(null)); // 6-digit OTP input
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const checkMailExists = async () => {
    try {
      const email = emailRef.current?.value?.trim();
      if (!email) return false;

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/web/consumer/getbyemail/${encodeURIComponent(email)}`
      );
      if (!res.ok) return false;

      const data = await res.json();
      setVerifiedUser(data);
      return true;
    } catch {
      return false;
    }
  };

  const sendOTP = async () => {
    setLoading(true);
    if (!(await checkMailExists())) {
      toast.error("Email not registered");
      setLoading(false);
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/util/sendotp`, {
      method: "POST",
      body: JSON.stringify({ email: emailRef.current.value }),
      headers: { "Content-Type": "application/json" },
    });
    res.status === 201
      ? toast.success("OTP sent successfully")
      : toast.error("Something went wrong");
    setLoading(false);
  };

  const verifyOTP = async () => {
    const otp = otpRefs.map((ref) => ref.current.value).join("");
    if (otp.length !== 6) {
      toast.error("Enter a 6-digit OTP");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/util/verifyotp/${emailRef.current.value}/${otp}`
    );
    res.status === 200 ? setShowForm(true) : toast.error("Invalid OTP");
  };

  const passwordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });
  
  const updatePassword = async (values, { setSubmitting }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/web/consumer/update/${verifiedUser.consumerId}`,
        {
          method: "PUT",
          body: JSON.stringify(values),
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (res.ok) {
        toast.success("Password updated successfully");
        router.push("/login");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Error updating password");
    } finally {
      setSubmitting(false);
    }
  };
  
  const resetForm = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    onSubmit: updatePassword,
    validationSchema: passwordSchema,
  });

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-center">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Reset Your Password
        </h1>

        {!showForm ? (
          <>
            <input
              ref={emailRef}
              className="w-full border border-gray-300 rounded-md py-2 px-3 mb-3 focus:outline-none"
              type="email"
              placeholder="Enter Registered Email"
            />
            <button
              onClick={sendOTP}
              className="w-full bg-blue-500 text-white rounded-md py-2 mb-3 hover:bg-blue-600"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="flex justify-between mb-3">
              {otpRefs.map((ref, index) => (
                <input
                  key={index}
                  ref={ref}
                  className="w-12 h-12 border border-gray-300 text-center text-lg rounded-md focus:outline-none"
                  type="text"
                  maxLength="1"
                  onInput={(e) => {
                    if (e.target.value.length === 1 && index < 5)
                      otpRefs[index + 1].current.focus();
                  }}
                />
              ))}
            </div>

            <button
              onClick={verifyOTP}
              className="w-full bg-blue-500 text-white rounded-md py-2 mb-6 hover:bg-blue-600"
            >
              Verify OTP
            </button>
          </>
        ) : (
          <form onSubmit={resetForm.handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-6">Enter New Password</h2>
        
          {/* Password Input */}
          <div className="relative mb-3">
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              id="password"
              value={resetForm.values.password}
              onChange={resetForm.handleChange}
              onBlur={resetForm.handleBlur}
            />
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {resetForm.touched.password && resetForm.errors.password && (
              <p className="text-red-500 text-sm mt-1">{resetForm.errors.password}</p>
            )}
          </div>
        
          {/* Confirm Password Input */}
          <div className="relative mb-6">
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none pr-10"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              id="confirmPassword"
              value={resetForm.values.confirmPassword}
              onChange={resetForm.handleChange}
              onBlur={resetForm.handleBlur}
            />
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {resetForm.touched.confirmPassword && resetForm.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{resetForm.errors.confirmPassword}</p>
            )}
          </div>
        
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600"
            disabled={resetForm.isSubmitting}
          >
            {resetForm.isSubmitting ? "Processing..." : "Reset Password"}
          </button>
        </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
