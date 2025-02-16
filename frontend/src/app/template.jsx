"use client";

import { AppProvider } from "@/context/AppContext";
import { ConsumerProvider } from "@/context/ConsumerContext";
import PrelineScript from "@/Prelinescript";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

const Template = ({ children }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("preline/dist/preline.js");
    }
  }, []);

  return (
    <div>
      <Toaster position="top-center" />
      <ToastContainer />
      <AppProvider>
        <ConsumerProvider>{children}</ConsumerProvider>
      </AppProvider>
      <PrelineScript />
    </div>
  );
};

export default Template;
