// src/components/WithdrawHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Smartphone,
  Building2,
  User,
  Store,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5004";

const WithdrawHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const userId = localStorage.getItem("userId");

  const fetchHistory = async (silent = false) => {
    if (!userId) return;

    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError("");

      const res = await axios.get(
        `${API_URL}/api/admin-withdraw/super-history/${userId}`
      );

      const sorted = (res.data || []).sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      );

      setHistory(sorted);
    } catch (err) {
      setError("Failed to load withdraw history");
      console.error("Withdraw History Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchHistory();
      const interval = setInterval(() => fetchHistory(true), 20000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return {
          color: "text-green-400",
          bg: "bg-green-500/20",
          border: "border-green-500/50",
          icon: <CheckCircle2 size={16} />,
          text: "Approved",
        };
      case "rejected":
        return {
          color: "text-red-400",
          bg: "bg-red-500/20",
          border: "border-red-500/50",
          icon: <XCircle size={16} />,
          text: "Rejected",
        };
      case "pending":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/50",
          icon: <Clock size={16} />,
          text: "Pending",
        };
      default:
        return {
          color: "text-gray-400",
          bg: "bg-gray-500/20",
          border: "border-gray-500/50",
          icon: <AlertCircle size={16} />,
          text: "Unknown",
        };
    }
  };

  const getMethodIcon = (name = "") => {
    const lower = name.toLowerCase();
    if (
      lower.includes("bkash") ||
      lower.includes("nagad") ||
      lower.includes("rocket")
    )
      return <Smartphone className="w-5 h-5 text-pink-400" />;
    if (lower.includes("bank"))
      return <Building2 className="w-5 h-5 text-blue-400" />;
    return <Smartphone className="w-5 h-5 text-gray-400" />;
  };

  const getPaymentTypeChip = (type) => {
    const lower = (type || "").toLowerCase();
    if (lower === "personal")
      return {
        icon: <User size={14} />,
        color: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50",
      };
    if (lower === "agent")
      return {
        icon: <Store size={14} />,
        color: "bg-teal-500/20 text-teal-300 border border-teal-500/50",
      };
    return {
      icon: <User size={14} />,
      color: "bg-gray-500/20 text-gray-300 border border-gray-500/50",
    };
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-pink-700 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle size={64} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Login Required</h2>
          <p className="mt-2">Please login to view your withdraw history</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-8"
      style={{ background: "#0f172a", fontFamily: '"Poppins", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Withdraw History
          </h1>
          <p className="text-white/70 text-lg">
            Track all your withdrawal requests & status
          </p>
        </motion.div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => fetchHistory()}
            disabled={refreshing}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl text-white/80 transition-all duration-200 disabled:opacity-60"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && !refreshing && (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 backdrop-blur-xl rounded-2xl p-8 text-center max-w-md mx-auto"
          >
            <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
            <p className="text-red-300 text-lg mb-4">{error}</p>
            <button
              onClick={() => fetchHistory()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Table */}
        {!loading && !error && (
          <motion.div
            layout
            className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-white/10 text-white/90 text-left text-sm font-semibold">
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Amount</th>
                    <th className="px-6 py-5">Method</th>
                    <th className="px-6 py-5">Account</th>
                    <th className="px-6 py-5">Type</th>
                    <th className="px-6 py-5">Requested</th>
                    <th className="px-6 py-5">Processed</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {history.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-20 text-white/60"
                        >
                          <Clock
                            size={56}
                            className="mx-auto mb-4 text-white/30"
                          />
                          <p className="text-xl font-medium">
                            No withdraw requests yet
                          </p>
                          <p className="text-sm mt-2">
                            Your requests will appear here once submitted
                          </p>
                        </td>
                      </tr>
                    ) : (
                      history.map((item, index) => {
                        const statusStyle = getStatusStyle(item.status);
                        return (
                          <motion.tr
                            key={item._id}
                            layout
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-t border-white/5 hover:bg-white/5 transition-all duration-200"
                          >
                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.color} border ${statusStyle.border}`}
                              >
                                {statusStyle.icon}
                                {statusStyle.text}
                              </span>
                            </td>
                            <td className="px-6 py-5 font-bold text-white text-lg">
                              ৳{item.amount?.toLocaleString() || "0"}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                {getMethodIcon(item.method?.methodName || "")}
                                <span className="text-white/90 font-medium">
                                  {item.method?.methodName || "Unknown Method"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 font-mono text-white/80">
                              {item.accountNumber || "—"}
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                                  getPaymentTypeChip(item.paymentType).color
                                }`}
                              >
                                {getPaymentTypeChip(item.paymentType).icon}
                                {item.paymentType || "—"}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-white/70 text-sm">
                              {format(new Date(item.createdAt), "dd MMM yyyy")}
                              <br />
                              <span className="text-white/50">
                                {format(new Date(item.createdAt), "hh:mm a")}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-white/70 text-sm">
                              {item.updatedAt && item.status !== "pending" ? (
                                <>
                                  {format(
                                    new Date(item.updatedAt),
                                    "dd MMM yyyy"
                                  )}
                                  <br />
                                  <span className="text-white/50">
                                    {format(
                                      new Date(item.updatedAt),
                                      "hh:mm a"
                                    )}
                                  </span>
                                </>
                              ) : (
                                <span className="text-white/40">—</span>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WithdrawHistory;
