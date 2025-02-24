"use client";
import { AppProvider } from "@/context/AppContext";
import { ConsumerProvider } from "@/context/ConsumerContext";
import { ProductProvider } from "@/context/ProductContext";
import PrelineScript from "@/Prelinescript";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { Bounce } from "react-toastify";

const Template = ({ children }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("preline/dist/preline.js");
    }
  }, []);

  return (
    <div>
      <Toaster position="top-center" />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <ConsumerProvider>
        <ProductProvider>
          <AppProvider>{children}</AppProvider>
        </ProductProvider>
      </ConsumerProvider>
      <PrelineScript />
    </div>
  );
};

export default Template;
