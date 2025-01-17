"use client";

import { AppProvider } from "@/context/AppContext";
import PrelineScript from "@/Prelinescript";
import { HydrationOverlay } from "@builder.io/react-hydration-overlay";
import React from "react";
import { Toaster } from "react-hot-toast";

const Template = ({ children }) => {
  return (
    <div>
      <Toaster position="top-center" />
      <AppProvider>
        <HydrationOverlay>{children}</HydrationOverlay>
      </AppProvider>
      <PrelineScript />
    </div>
  );
};

export default Template;
