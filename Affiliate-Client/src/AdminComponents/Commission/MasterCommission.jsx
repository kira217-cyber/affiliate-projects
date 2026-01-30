// components/MasterCommission.jsx
import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const MasterCommission = () => {
  const {
    userId,
    commissionBalance,
    gameLossCommissionBalance,
    depositCommissionBalance,
    referCommissionBalance,
    gameWinCommissionBalance,
    refreshUser,
  } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferConfig, setTransferConfig] = useState({});
  const [configLoading, setConfigLoading] = useState(true);

  // Fetch global transfer config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/balance-transfer`,
        );
        setTransferConfig(res.data.data || {});
      } catch (err) {
        console.error("Failed to load transfer config", err);
        toast.error("Failed to load transfer rules");
      } finally {
        setConfigLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const sources = [
    {
      key: "commissionBalance",
      label: "Total Withdraw Balance",
      value: commissionBalance,
    },
    {
      key: "gameLossCommissionBalance",
      label: "Game Loss Commission",
      value: gameLossCommissionBalance,
    },
    {
      key: "depositCommissionBalance",
      label: "Deposit Commission",
      value: depositCommissionBalance,
    },
    {
      key: "referCommissionBalance",
      label: "Referral Commission",
      value: referCommissionBalance,
    },
  ];

  const availableSources = sources.filter((s) => {
    const cfg = transferConfig[s.key];
    return cfg && cfg.enabled !== false;
  });

  const selectedConfig = source ? transferConfig[source] : null;

  const handleTransfer = async () => {
    if (!source || !amount || amount <= 0)
      return toast.error("Please fill all fields");

    const amt = parseFloat(amount);
    if (isNaN(amt)) return toast.error("Invalid amount");

    if (selectedConfig) {
      if (amt < selectedConfig.minAmount)
        return toast.error(`Minimum: ৳${selectedConfig.minAmount}`);
      if (amt > selectedConfig.maxAmount)
        return toast.error(`Maximum: ৳${selectedConfig.maxAmount}`);
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/balance-transfer/main-balance`,
        { from: source, amount: amt, userId: userId },
      );

      if (res.data.success) {
        toast.success("Transfer successful!");
        refreshUser?.();
        setIsModalOpen(false);
        setAmount("");
        setSource("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  const stats = sources.map((s) => ({
    title: s.label,
    value: `৳${Number(s.value || 0).toFixed(2)}`,
    gradient:
      s.key === "commissionBalance"
        ? "from-pink-500 via-red-500 to-yellow-500"
        : s.key === "gameLossCommissionBalance"
          ? "from-blue-600 to-cyan-400"
          : s.key === "depositCommissionBalance"
            ? "from-purple-600 to-pink-500"
            : "from-green-500 to-lime-400",
  }));

  // Check if gameWinCommissionBalance > 0 → block transfer
  const canTransfer = gameWinCommissionBalance <= 0;

  return (
    <div className="bg-[#1e293b] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header + Button / Warning */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-4xl font-bold">Master Commission</h1>

          {/* Transfer Button or Warning */}
          {canTransfer ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r cursor-pointer from-cyan-500 to-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition w-full sm:w-auto"
            >
              Transfer to Main Balance
            </button>
          ) : (
            <div className="bg-gradient-to-r from-red-600/20 to-rose-600/20 border border-red-500/50 rounded-xl p-6 text-center w-full sm:w-auto">
              <p className="text-lg font-semibold text-red-300">
                Admin has not bridged your amount yet.
              </p>
              <p className="text-sm text-red-400 mt-2">
                Please ask admin to bridge your Game Win Commission first.
              </p>
              <p className="text-xl font-bold text-white mt-3">
                Game Win Balance: ৳{Number(gameWinCommissionBalance).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.06 }}
              className={`rounded-2xl p-1 bg-gradient-to-r ${stat.gradient}`}
            >
              <div className="bg-[#0f172a] rounded-2xl p-6 text-center h-full">
                <h3 className="text-gray-300 text-lg mb-3">{stat.title}</h3>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Transfer Modal - শুধু canTransfer true হলে খুলবে */}
      {isModalOpen && canTransfer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1e293b] rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-700 relative"
          >
            {/* Close Icon */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setAmount("");
                setSource("");
              }}
              className="absolute cursor-pointer top-4 right-6 text-gray-400 hover:text-white text-3xl font-light transition hover:scale-110"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400 pr-8">
              Transfer to Main Balance
            </h2>

            {configLoading ? (
              <p className="text-center text-gray-400">Loading rules...</p>
            ) : availableSources.length === 0 ? (
              <p className="text-center text-red-400 text-xl">
                All transfers are currently disabled by admin
              </p>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-lg mb-2 text-gray-300">
                    Select Commission Type
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full cursor-pointer p-4 rounded-xl bg-[#0f172a] border border-gray-600 focus:border-cyan-500 outline-none text-lg"
                  >
                    <option value="">Choose source</option>
                    {availableSources.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label} (৳{Number(s.value || 0).toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                {source && selectedConfig && (
                  <>
                    <div>
                      <label className="block text-lg mb-2 text-gray-300">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Min: ৳${selectedConfig.minAmount} | Max: ৳${selectedConfig.maxAmount}`}
                        className="w-full p-4 rounded-xl bg-[#0f172a] border border-gray-600 focus:border-cyan-500 outline-none text-lg placeholder-gray-500"
                      />
                      <p className="text-sm text-cyan-400 mt-2">
                        Limit: ৳{selectedConfig.minAmount} - ৳
                        {selectedConfig.maxAmount}
                      </p>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        onClick={handleTransfer}
                        disabled={loading || !amount}
                        className="flex-1 cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-xl font-bold text-xl disabled:opacity-50 hover:scale-105 transition"
                      >
                        {loading ? "Processing..." : "Transfer Now"}
                      </button>
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setAmount("");
                          setSource("");
                        }}
                        className="flex-1 cursor-pointer bg-gray-700 py-4 rounded-xl font-bold text-xl hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MasterCommission;
