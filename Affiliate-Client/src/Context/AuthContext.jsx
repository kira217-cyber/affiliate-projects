// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [balance, setBalance] = useState(0); // নতুন: ব্যালেন্স
  const [loading, setLoading] = useState(true);
  const [commissionBalance, setCommissionBalance] = useState(0);
  const [referCommissionBalance, setReferCommissionBalance] = useState(0);
  const [gameLossCommissionBalance, setGameLossCommissionBalance] = useState(0);
  const [depositCommissionBalance, setDepositCommissionBalance] = useState(0);

  const { data, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No user");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin?id=${userId}`
      );
      console.log("Fetched user:", res.data.user);
      setUserId(res.data.user._id);

      return res.data.user;
    },
    enabled: false,
    retry: false,
  });

  // পেজ লোডে অটো ফেচ
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      refetch();
    } else {
      setLoading(false);
    }
  }, [refetch]);

  // ডেটা এলে ইউজার + ব্যালেন্স সেট
  useEffect(() => {
    if (data) {
      setUser(data);
      setLoading(false);
    }
  }, [data]);

  // নতুন: শুধু ব্যালেন্স রিফ্রেশ
  const refreshBalance = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin?id=${userId}`
      );
      const fetchedUser = res.data.user;
      if (fetchedUser) {
        setBalance(fetchedUser.balance || 0);
        setCommissionBalance(fetchedUser.commissionBalance || 0); // কমিশন ব্যালেন্স সেট
        setReferCommissionBalance(fetchedUser.referCommissionBalance || 0); // রেফার কমিশন ব্যালেন্স সেট
        setGameLossCommissionBalance(
          fetchedUser.gameLossCommissionBalance || 0
        );
        setDepositCommissionBalance(fetchedUser.depositCommissionBalance || 0);
      }
    } catch (err) {
      console.error("Balance refresh failed:", err);
    }
  };

  const logout = () => {
    setUser(null);
    setBalance(0);
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  };

  if (loading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        setUser,
        loading,
        logout,
        balance, // নতুন
        refreshBalance, // নতুন
        commissionBalance,
        referCommissionBalance,
        gameLossCommissionBalance,
        depositCommissionBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
