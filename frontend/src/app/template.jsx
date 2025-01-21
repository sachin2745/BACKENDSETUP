"use client";

import { AppProvider } from "@/context/AppContext";
import PrelineScript from "@/Prelinescript";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const Template = ({ children }) => {

  useEffect(() => {
    require("preline/dist/preline.js");
  }, []);

  return (
    <div>
      <Toaster position="top-center" />
      <AppProvider>
        {children}
      </AppProvider>
      <PrelineScript />
    </div>
  );
};

export default Template;
