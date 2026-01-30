// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [commissionBalance, setCommissionBalance] = useState(0);
  const [referCommissionBalance, setReferCommissionBalance] = useState(0);
  const [gameLossCommissionBalance, setGameLossCommissionBalance] = useState(0);
  const [depositCommissionBalance, setDepositCommissionBalance] = useState(0);
  const [gameWinCommissionBalance, setGameWinCommissionBalance] = useState(0);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) throw new Error("No user ID found");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin?id=${storedUserId}`
      );

      const fetchedUser = res.data.user;
      console.log("Fetched user:", fetchedUser);

      if (fetchedUser) {
        setUserId(fetchedUser._id);
        setBalance(fetchedUser.balance || 0);
        setCommissionBalance(fetchedUser.commissionBalance || 0);
        setReferCommissionBalance(fetchedUser.referCommissionBalance || 0);
        setGameLossCommissionBalance(fetchedUser.gameLossCommissionBalance || 0);
        setDepositCommissionBalance(fetchedUser.depositCommissionBalance || 0);
        setGameWinCommissionBalance(fetchedUser.gameWinCommissionBalance || 0);
      }

      return fetchedUser;
    },
    enabled: false, // অটো ফেচ না করার জন্য
    retry: false,
  });

  // পেজ লোডে অটো ফেচ
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      refetch();
    } else {
      setLoading(false);
    }
  }, [refetch]);

  // ডেটা এলে ইউজার সেট + লোডিং শেষ
  useEffect(() => {
    if (data) {
      setUser(data);
      setLoading(false);
    }
  }, [data]);

  // নতুন: Reload User ফাংশন (যেকোনো জায়গা থেকে কল করা যাবে)
  const reloadUser = async () => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      toast.error("No user logged in");
      return;
    }

    toast.loading("Reloading user data...");
    try {
      await refetch(); // TanStack Query-এর refetch ব্যবহার করা হচ্ছে
      toast.dismiss();
      toast.success("User data reloaded successfully");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to reload user data");
      console.error("Reload user failed:", err);
    }
  };

  const logout = () => {
    setUser(null);
    setBalance(0);
    setCommissionBalance(0);
    setReferCommissionBalance(0);
    setGameLossCommissionBalance(0);
    setDepositCommissionBalance(0);
    setGameWinCommissionBalance(0);
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
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
        balance,
        commissionBalance,
        referCommissionBalance,
        gameLossCommissionBalance,
        depositCommissionBalance,
        gameWinCommissionBalance,
        reloadUser,          // ← নতুন ফাংশন যোগ করা হলো
        isFetching,          // optional: লোডিং চেক করতে চাইলে
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};