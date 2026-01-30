import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSpinner, FaLink, FaSearch, FaSyncAlt, FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";
import { API_URL } from "../utils/baseURL";

const MasterAffiliateBridge = () => {
  const [masterAffiliates, setMasterAffiliates] = useState([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bridgingId, setBridgingId] = useState(null);
  const [bulkBridging, setBulkBridging] = useState(false);

  const fetchMasterAffiliates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/master-affiliates`);
      if (!res.ok) throw new Error("Failed to load master affiliates");
      const data = await res.json();
      setMasterAffiliates(data.users || []);
      setFilteredAffiliates(data.users || []);
      toast.success("Master Affiliates loaded");
    } catch (err) {
      toast.error(err.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterAffiliates();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAffiliates(masterAffiliates);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = masterAffiliates.filter(aff =>
      aff.username?.toLowerCase().includes(term)
    );
    setFilteredAffiliates(filtered);
  }, [searchTerm, masterAffiliates]);

  const handleBridge = async (id, username) => {
    if (!window.confirm(`Bridge commissions for ${username}?`)) return;

    setBridgingId(id);
    try {
      const res = await fetch(`${API_URL}/api/master-affiliate/bridge/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Bridge failed");

      toast.success(`Bridge successful for ${username}`);
      fetchMasterAffiliates();
    } catch (err) {
      toast.error(err.message || "Bridge failed");
    } finally {
      setBridgingId(null);
    }
  };

  const handleBulkBridge = async () => {
    if (!window.confirm("Bridge ALL master affiliates? This cannot be undone.")) return;

    setBulkBridging(true);
    try {
      const res = await fetch(`${API_URL}/api/master-affiliate/bridge-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Bulk bridge failed");

      toast.success(`Bulk bridge completed! ${data.results?.filter(r => r.status === "success").length || 0} users processed`);
      fetchMasterAffiliates();
    } catch (err) {
      toast.error(err.message || "Bulk bridge failed");
    } finally {
      setBulkBridging(false);
    }
  };

  const handleReload = () => {
    toast.loading("Reloading master affiliates...");
    fetchMasterAffiliates().then(() => toast.dismiss());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <FaSpinner className="animate-spin text-6xl text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-950/30 to-black p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Master Affiliate Bridge
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-amber-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Reload Button */}
            <button
              onClick={handleReload}
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                loading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Reload
            </button>

            {/* All Bridge Button */}
            <button
              onClick={handleBulkBridge}
              disabled={bulkBridging || filteredAffiliates.length === 0}
              className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                bulkBridging || filteredAffiliates.length === 0
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {bulkBridging ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing All...
                </>
              ) : (
                <>
                  <FaLink />
                  Bridge All
                </>
              )}
            </button>
          </div>
        </div>

        {filteredAffiliates.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xl">
            {searchTerm ? "No matching master affiliates found" : "No master affiliates available"}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto rounded-2xl border border-amber-800/40 bg-gray-900/40 backdrop-blur-md shadow-2xl mb-10">
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-950/80 to-gray-900/80 border-b border-amber-800/50">
                    <th className="px-6 py-5 text-amber-300 font-semibold">Username</th>
                    <th className="px-6 py-5 text-amber-300 font-semibold">Game Win Bal.</th>
                    <th className="px-6 py-5 text-amber-300 font-semibold">Game Loss Bal.</th>
                    <th className="px-6 py-5 text-amber-300 font-semibold">Deposit Bal.</th>
                    <th className="px-6 py-5 text-amber-300 font-semibold">Refer Bal.</th>
                    <th className="px-6 py-5 text-amber-300 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAffiliates.map((aff) => (
                    <tr
                      key={aff._id}
                      className="border-b border-amber-900/40 hover:bg-amber-950/40 transition-colors"
                    >
                      <td className="px-6 py-5 text-gray-200 font-medium">{aff.username}</td>
                      <td className="px-6 py-5 text-rose-400 font-bold">
                        ৳{(aff.gameWinCommissionBalance || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-5 text-emerald-400 font-bold">
                        ৳{(aff.gameLossCommissionBalance || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-5 text-cyan-400 font-bold">
                        ৳{(aff.depositCommissionBalance || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-5 text-violet-400 font-bold">
                        ৳{(aff.referCommissionBalance || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => handleBridge(aff._id, aff.username)}
                          disabled={bridgingId === aff._id}
                          className={`px-5 py-2 rounded-xl font-medium transition-all flex items-center gap-2 mx-auto ${
                            bridgingId === aff._id
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl"
                          }`}
                        >
                          {bridgingId === aff._id ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Bridging...
                            </>
                          ) : (
                            <>
                              <FaLink size={16} />
                              Bridge
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-6">
              {filteredAffiliates.map((aff) => (
                <motion.div
                  key={aff._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-amber-800/50 rounded-2xl p-6 shadow-xl"
                >
                  <h3 className="text-xl font-bold text-white mb-4">{aff.username}</h3>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <p className="text-gray-400">Game Win</p>
                      <p className="text-rose-400 font-bold">
                        ৳{(aff.gameWinCommissionBalance || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Game Loss</p>
                      <p className="text-emerald-400 font-bold">
                        ৳{(aff.gameLossCommissionBalance || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Deposit</p>
                      <p className="text-cyan-400 font-bold">
                        ৳{(aff.depositCommissionBalance || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Refer</p>
                      <p className="text-violet-400 font-bold">
                        ৳{(aff.referCommissionBalance || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBridge(aff._id, aff.username)}
                    disabled={bridgingId === aff._id}
                    className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                      bridgingId === aff._id
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg"
                    }`}
                  >
                    {bridgingId === aff._id ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaLink />
                        Bridge Now
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MasterAffiliateBridge;