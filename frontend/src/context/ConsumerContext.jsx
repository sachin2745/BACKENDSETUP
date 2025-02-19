import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext } from "react";
const ISSERVER = typeof window === "undefined";

const ConsumerContext = createContext();

export const ConsumerProvider = ({ children }) => {
  const router = useRouter();

  const [currentConsumer, setCurrentConsumer] = useState(
    JSON.parse(!ISSERVER ? localStorage.getItem("consumer") : null)
  );

  const [consumerLoggedIn, setConsumerLoggedIn] = useState(
    currentConsumer !== null
  );

  const consumerLogout = () => {
    setConsumerLoggedIn(false);
    if (!ISSERVER) localStorage.removeItem("consumer");
    setCurrentConsumer(null);
    // Clear token with the correct path and domain
    document.cookie = "CToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirect to login page
    router.push("/login");
  };
  // console.log("ConsumerProvider Value:", {
  //   currentConsumer,
  //   consumerLogout,
  //   consumerLoggedIn,
  // });
  return (
    <ConsumerContext.Provider
      value={{
        currentConsumer,
        setCurrentConsumer,
        consumerLoggedIn,
        setConsumerLoggedIn,
        consumerLogout,
      }}
    >
      {children}
    </ConsumerContext.Provider>
  );
};

const useConsumerContext = () => useContext(ConsumerContext);
export default useConsumerContext;
