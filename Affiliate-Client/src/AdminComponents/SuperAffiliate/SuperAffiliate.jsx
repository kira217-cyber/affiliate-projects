import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import SuperAffiliateVideo from "./SuperAffiliateVideo";
import axios from "axios";

const SuperAffiliate = () => {
  const {
    user,
    balance,
    referCommissionBalance,
    gameLossCommissionBalance,
    depositCommissionBalance,
  } = useContext(AuthContext);

  // Player stats from downline users (win/loss/balance)
  const [downlineStats, setDownlineStats] = useState({
    todayPlayerWin: 0,
    todayPlayerLoss: 0,
    activePlayerCount: 0,
    totalDownlineBalance: 0,
  });

  // Direct downline list (Master Affiliates for Super)
  const [downlineList, setDownlineList] = useState([]);
  const [downlineSummary, setDownlineSummary] = useState({
    totalDownline: 0,
    totalBalance: 0,
    totalCommission: 0,
  });

  const [playerLoading, setPlayerLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);

  // Fetch player stats (win/loss from all downline users)
  useEffect(() => {
    if (!user?.referralCode) {
      setPlayerLoading(false);
      return;
    }

    const fetchDownlineStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/affiliate/stats/${
            user.referralCode
          }`
        );
        setDownlineStats(response.data);
      } catch (err) {
        console.error("Error fetching player stats:", err);
        toast.error("Failed to load player stats");
      } finally {
        setPlayerLoading(false);
      }
    };

    fetchDownlineStats();
  }, [user?.referralCode]);

  // Fetch direct downline list (Master Affiliates)
  useEffect(() => {
    if (!user?.referralCode) {
      setListLoading(false);
      return;
    }

    const fetchDownlineList = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/affiliate/downline-list/${
            user.referralCode
          }`
        );
        setDownlineList(res.data.downline || []);
        setDownlineSummary(
          res.data.summary || {
            totalDownline: 0,
            totalBalance: 0,
            totalCommission: 0,
          }
        );
      } catch (err) {
        console.error("Error fetching downline list:", err);
        toast.error("Failed to load downline list");
      } finally {
        setListLoading(false);
      }
    };

    fetchDownlineList();
  }, [user?.referralCode]);

  const stats = [
    {
      title: "My All Commission",
      value: balance || 0,
      gradient: "from-pink-500 via-red-500 to-yellow-500",
    },
    {
      title: "Game Loss Commission",
      value: gameLossCommissionBalance || 0,
      gradient: "from-blue-500 via-cyan-400 to-green-400",
    },
    {
      title: "Deposit Bonus",
      value: depositCommissionBalance || 0,
      gradient: "from-indigo-500 via-purple-500 to-pink-400",
    },
    {
      title: "Reffer Bonus",
      value: referCommissionBalance || 0,
      gradient: "from-green-500 via-lime-400 to-yellow-400",
    },
    {
      title: "Today My Player Win",
      value: playerLoading
        ? "Loading..."
        : `${downlineStats.todayPlayerWin} BDT`,
      gradient: "from-orange-500 via-pink-500 to-red-500",
    },
    {
      title: "Today My Player Loss",
      value: playerLoading
        ? "Loading..."
        : `${downlineStats.todayPlayerLoss} BDT`,
      gradient: "from-teal-400 via-sky-400 to-blue-500",
    },
    {
      title: "My Active Player",
      value: playerLoading ? "Loading..." : downlineStats.activePlayerCount,
      gradient: "from-rose-500 via-pink-400 to-purple-400",
    },
    {
      title: "My All User Balance",
      value: playerLoading
        ? "Loading..."
        : `${downlineStats.totalDownlineBalance} BDT`,
      gradient: "from-yellow-500 via-orange-400 to-red-400",
    },
  ];

  const referralLink = `${import.meta.env.VITE_API_URL_MASTER_REFERRAL}/register?ref=${
    user?.referralCode || ""
  }`;

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  return (
    <>
      <div className="bg-black text-white flex flex-col items-center p-6 min-h-screen">
        <Toaster position="top-center" reverseOrder={false} />

        {/* Referral Link Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full bg-gradient-to-r from-green-400 via-lime-500 to-yellow-400 p-5 rounded-xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="font-bold text-lg text-black text-center sm:text-left">
            Your Referral Link:
            <span className="block sm:inline text-red-700 ml-0 sm:ml-2 mt-2 sm:mt-0 break-all">
              {referralLink}
            </span>
          </p>
          <button
            onClick={handleCopy}
            className="bg-black cursor-pointer text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition transform hover:scale-105"
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
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.08, rotate: 2 }}
              className={`relative rounded-2xl p-[3px] bg-gradient-to-r ${item.gradient} shadow-2xl overflow-hidden`}
            >
              <div className="bg-black rounded-2xl p-6 text-center h-full flex flex-col justify-between">
                <h3 className="text-gray-300 font-semibold text-lg mb-3">
                  {item.title}
                </h3>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">
                  {item.value}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* My Master Affiliates List */}
        <div className="mt-16 w-full">
          <h2 className="text-3xl font-bold text-lime-400 mb-8 text-center">
            My Master Affiliates ({downlineSummary.totalDownline})
          </h2>

          {listLoading ? (
            <p className="text-center text-gray-400 text-xl">
              Loading master affiliates...
            </p>
          ) : downlineList.length === 0 ? (
            <p className="text-center text-gray-400 text-xl">
              No master affiliates yet. Share your link!
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-800">
              <table className="w-full text-left text-gray-300">
                <thead className="text-sm uppercase bg-gradient-to-r from-purple-900 to-indigo-900">
                  <tr>
                    <th className="px-8 py-5">Username</th>
                    <th className="px-8 py-5">Referral Code</th>
                    <th className="px-8 py-5">Balance</th>
                    <th className="px-8 py-5">Total Commission</th>
                    <th className="px-8 py-5">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {downlineList.map((master) => (
                    <motion.tr
                      key={master._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-b border-gray-800 hover:bg-gray-900/60 transition"
                    >
                      <td className="px-8 py-6 font-medium">
                        {master.username}
                      </td>
                      <td className="px-8 py-6">{master.referralCode}</td>
                      <td className="px-8 py-6 text-green-400 font-bold">
                        {master.balance} BDT
                      </td>
                      <td className="px-8 py-6 text-cyan-400 font-bold">
                        {master.totalCommission} BDT
                      </td>
                      <td className="px-8 py-6">
                        {new Date(master.createdAt).toLocaleDateString("en-GB")}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot className="bg-gradient-to-r from-purple-950 to-indigo-950 font-bold">
                  <tr>
                    <td colSpan="2" className="px-8 py-5 text-right">
                      Total
                    </td>
                    <td className="px-8 py-5 text-green-400">
                      {downlineSummary.totalBalance} BDT
                    </td>
                    <td className="px-8 py-5 text-cyan-400">
                      {downlineSummary.totalCommission} BDT
                    </td>
                    <td className="px-8 py-5"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Video Tutorial */}
        <div className="mt-16 w-full">
          <SuperAffiliateVideo />
        </div>
      </div>
    </>
  );
};

export default SuperAffiliate;
