// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState("tab1");
  const [language, setLanguage] = useState(
    localStorage.getItem("sidebarLang") || "bn",
  );

  // ── New state for admin home control data ──
  const [adminHomeControl, setAdminHomeControl] = useState(null);

  console.log("UserID in AuthContext:", userId);

  // Fetch single user data
  const fetchUser = async (userId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin?id=${userId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUserId(data.user._id);
      return data.user;
    } catch (err) {
      console.error("Fetch user error:", err);
      return null;
    }
  };

  // Refresh only balance
  const refreshBalance = async () => {
    const storedUserId = localStorage.getItem("userId");
    console.log("Refreshing balance for userId:", storedUserId);
    if (!storedUserId) return;

    setIsBalanceLoading(true);
    try {
      const fetchedUser = await fetchUser(storedUserId);
      if (fetchedUser) {
        setBalance(fetchedUser.balance || 0);
      }
    } catch (err) {
      console.error("Balance refresh failed:", err);
    } finally {
      setIsBalanceLoading(false);
    }
  };

  // ── New: Fetch admin home control data ──
  const fetchAdminHomeControl = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}api/v1/admin/admin-home-control`,
      );
      if (res.data) {
        console.log("Admin Home Control Data:", res.data);
        setAdminHomeControl(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin home control:", err);
      setAdminHomeControl(null);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    const initialize = async () => {
      setLoading(true);

      // Fetch admin home control data (independent of user login)
      await fetchAdminHomeControl();

      if (storedUserId) {
        const fetchedUser = await fetchUser(storedUserId);
        if (fetchedUser) {
          setUser(fetchedUser);
          setBalance(fetchedUser.balance || 0);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
        } else {
          localStorage.removeItem("userId");
          localStorage.removeItem("user");
        }
      }

      setLoading(false);
    };

    initialize();
  }, []);

  const logout = () => {
    setUser(null);
    setBalance(0);
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        balance,
        refreshBalance,
        isBalanceLoading,
        language,
        setLanguage,
        userId,
        setBalance,
        setIsInformationModalOpen,
        isInformationModalOpen,
        initialTab,
        setInitialTab,
        // ── New value added to context ──
        adminHomeControl, // Now available in any component via useContext
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
