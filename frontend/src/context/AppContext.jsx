import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext } from "react";
const ISSERVER = typeof window === "undefined";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(!ISSERVER ? localStorage.getItem("user") : null)
  );

  const [loggedIn, setLoggedIn] = useState(currentUser !== null);

  const logout = () => {
    setLoggedIn(false);
    if (!ISSERVER) localStorage.removeItem("user");
    setCurrentUser(null);
  
    // Clear token with the correct path and domain
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin; domain=" + window.location.hostname + ";";
  
    // Redirect to login page
    router.push("/admin/login");
  };

  return (
    <AppContext.Provider
      value={{ currentUser, setCurrentUser, loggedIn, setLoggedIn, logout }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);
export default useAppContext;
