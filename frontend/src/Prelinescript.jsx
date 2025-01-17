"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    const loadPreline = async () => {
      try {
        // Dynamically import Preline
        const preline = await import("preline/preline");

        // Ensure HSStaticMethods is initialized
        if (window.HSStaticMethods) {
          window.HSStaticMethods.autoInit();
        } else {
          console.warn("HSStaticMethods is not available.");
        }
      } catch (error) {
        console.error("Error loading Preline:", error);
      }
    };

    // Invoke the loader after ensuring the DOM is fully loaded
    if (document.readyState === "complete") {
      loadPreline();
    } else {
      window.addEventListener("load", loadPreline);
      return () => window.removeEventListener("load", loadPreline);
    }
  }, [path]);

  return null;
}
