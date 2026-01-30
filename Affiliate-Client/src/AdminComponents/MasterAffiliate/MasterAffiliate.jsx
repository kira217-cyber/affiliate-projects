import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import MasterAffiliateVideo from "./MasterAffiliateVideo";
import axios from "axios";

// Helper function to safely format money (2 decimal places)
const formatMoney = (value) => {
  if (value === "Loading...") return "Loading...";
  const num = Number(value);
  return isNaN(num) || num == null ? "0.00" : num.toFixed(2);
};

const MasterAffiliate = () => {
  const {
    user,
    balance,
    referCommissionBalance,
    gameLossCommissionBalance,
    depositCommissionBalance,
  } = useContext(AuthContext);

  const [downlineStats, setDownlineStats] = useState({
    todayPlayerWin: 0,
    todayPlayerLoss: 0,
    activePlayerCount: 0,
    totalDownlineBalance: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.referralCode) {
      setLoading(false);
      toast.error("Referral code not found!");
      return;
    }

    const fetchDownlineStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/affiliate/stats/${user.referralCode}`,
        );

        setDownlineStats(response.data || downlineStats); // fallback to initial if empty
      } catch (err) {
        console.error("Error fetching downline stats:", err);
        toast.error("Failed to load player stats");
      } finally {
        setLoading(false);
      }
    };

    fetchDownlineStats();
  }, [user?.referralCode]);

  const stats = [
    {
      title: "My All Commission",
      value: formatMoney(balance),
      gradient: "from-pink-500 via-red-500 to-yellow-500",
    },
    {
      title: "Game Loss Commission",
      value: formatMoney(gameLossCommissionBalance),
      gradient: "from-blue-500 via-cyan-400 to-green-400",
    },
    {
      title: "Deposit Bonus",
      value: formatMoney(depositCommissionBalance),
      gradient: "from-indigo-500 via-purple-500 to-pink-400",
    },
    {
      title: "Refer Bonus",
      value: formatMoney(referCommissionBalance),
      gradient: "from-green-500 via-lime-400 to-yellow-400",
    },
    {
      title: "Today My Player Win",
      value: loading
        ? "Loading..."
        : `${formatMoney(downlineStats.todayPlayerWin)} BDT`,
      gradient: "from-orange-500 via-pink-500 to-red-500",
    },
    {
      title: "Today My Player Loss",
      value: loading
        ? "Loading..."
        : `${formatMoney(downlineStats.todayPlayerLoss)} BDT`,
      gradient: "from-teal-400 via-sky-400 to-blue-500",
    },
    {
      title: "My Active Player",
      value: loading ? "Loading..." : downlineStats.activePlayerCount,
      gradient: "from-rose-500 via-pink-400 to-purple-400",
    },
    {
      title: "My All User Balance",
      value: loading
        ? "Loading..."
        : `${formatMoney(downlineStats.totalDownlineBalance)} BDT`,
      gradient: "from-yellow-500 via-orange-400 to-red-400",
    },
  ];

  const referralLink = `${import.meta.env.VITE_API_URL_REFERRAL}/?ref=${
    user?.referralCode || ""
  }`;

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  return (
    <div className="bg-black text-white flex flex-col items-center p-6 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Referral Link Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gradient-to-r from-green-400 via-lime-500 to-yellow-400 p-5 rounded-xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <p className="font-bold text-lg text-black text-center sm:text-left break-all">
          Your Referral Link:{" "}
          <span className="block sm:inline text-red-700 ml-0 sm:ml-2 mt-2 sm:mt-0">
            {referralLink || "Generating..."}
          </span>
        </p>
        <button
          onClick={handleCopy}
          disabled={!referralLink}
          className={`bg-black text-white px-6 py-3 rounded-lg font-bold transition transform hover:scale-105 ${
            !referralLink
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-800 cursor-pointer"
          }`}
        >
          Copy Link
        </button>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 w-full ">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            whileHover={{ scale: 1.06, rotate: 1.5 }}
            className={`relative rounded-2xl p-[3px] bg-gradient-to-r ${item.gradient} shadow-2xl overflow-hidden`}
          >
            <div className="bg-black rounded-2xl p-6 text-center h-full flex flex-col justify-center min-h-[180px]">
              <h3 className="text-gray-300 font-semibold text-lg mb-4">
                {item.title}
              </h3>
              <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-cyan-300">
                {item.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Tutorial */}
      <div className="mt-16 w-full ">
        <MasterAffiliateVideo />
      </div>
    </div>
  );
};

export default MasterAffiliate;
