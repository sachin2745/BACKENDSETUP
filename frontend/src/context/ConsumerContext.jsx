import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext } from "react";
const ISSERVER = typeof window === "undefined";

const ConsumerContext = createContext();

export const ConsumerProvider = ({ children }) => {
  const router = useRouter();

  const [currentConsumer, setCurrentConsumer] = useState(
    JSON.parse(!ISSERVER ? localStorage.getItem("consumer") : null)
  );

  const [loggedIn, setLoggedIn] = useState(currentConsumer !== null);

  const logout = () => {
    setLoggedIn(false);
    if (!ISSERVER) localStorage.removeItem("consumer");
    setCurrentConsumer(null);
  
    // Clear token with the correct path and domain
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
  
    // Redirect to login page
    router.push("/login");
  };

  return (
    <ConsumerContext.Provider
      value={{ currentConsumer, setCurrentConsumer, loggedIn, setLoggedIn, logout }}
    >
      {children}
    </ConsumerContext.Provider>
  );
};

const useConsumerContext = () => useContext(ConsumerContext);
export default useConsumerContext;
