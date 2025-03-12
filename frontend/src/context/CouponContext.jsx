"use client";
import { createContext, useState, useContext, useEffect } from "react";

// Check if running on the server
const ISSERVER = typeof window === "undefined";

// Create Context
const CouponContext = createContext();

// Provider Component
export const CouponProvider = ({ children }) => {
  // Load coupon from localStorage if available
  const [coupon, setCoupon] = useState(() => {
    if (!ISSERVER) {
      const savedCoupon = localStorage.getItem("coupon");
      return savedCoupon ? JSON.parse(savedCoupon) : null;
    }
    return null;
  });

  // Function to apply a coupon
  const applyCoupon = (code, discount) => {
    const newCoupon = { code, discount };
    setCoupon(newCoupon);
    if (!ISSERVER) {
      localStorage.setItem("coupon", JSON.stringify(newCoupon));
    }
  };

  // Function to remove the coupon
  const removeCoupon = () => {
    setCoupon(null);
    if (!ISSERVER) {
      localStorage.removeItem("coupon");
    }
  };

  // Ensure coupon state is synced with localStorage on first render
  useEffect(() => {
    if (!ISSERVER) {
      const savedCoupon = localStorage.getItem("coupon");
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
    }
  }, []);

  return (
    <CouponContext.Provider value={{ coupon, applyCoupon, removeCoupon }}>
      {children}
    </CouponContext.Provider>
  );
};

// Custom Hook
export const useCoupon = () => {
  return useContext(CouponContext);
};
