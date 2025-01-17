"use client";

import { AppProvider } from "@/context/AppContext";
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
    </div>
  );
};

export default Template;
