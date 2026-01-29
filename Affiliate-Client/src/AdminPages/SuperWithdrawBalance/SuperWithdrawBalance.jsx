// src/SuperComponents/WithdrawSystem/SuperWithdrawBalance.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Building2,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API Functions
const fetchMethods = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin-withdraw/methods`);
  return data;
};

const submitWithdrawRequest = async (payload) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/admin-withdraw/request`,
    payload
  );
  return data;
};

const SuperWithdrawBalance = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  // Modal State
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    paymentType: "",
    accountNumber: "",
    amount: "",
  });
  const [error, setError] = useState("");

  // Fetch Global Methods (set by admin)
  const {
    data: methods = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["globalWithdrawMethods"],
    queryFn: fetchMethods,
    staleTime: 1000 * 60 * 5,
  });

  // Submit Mutation
  const mutation = useMutation({
    mutationFn: submitWithdrawRequest,
    onSuccess: () => {
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle size={20} />
          <span>Withdraw Request Sent Successfully!</span>
        </div>,
        { icon: false }
      );
      queryClient.invalidateQueries({ queryKey: ["globalWithdrawMethods"] });
      setModalOpen(false);
      setForm({ paymentType: "", accountNumber: "", amount: "" });
      setError("");
    },
    onError: (err) => {
      const msg = err.response?.data?.msg || "Failed to send request";
      setError(msg);
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle size={20} />
          <span>{msg}</span>
        </div>,
        { icon: false }
      );
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const amount = Number(form.amount);
    if (amount < selectedMethod.minAmount || amount > selectedMethod.maxAmount) {
      const msg = `Amount must be between ৳${selectedMethod.minAmount} - ৳${selectedMethod.maxAmount}`;
      setError(msg);
      toast.warn(msg);
      return;
    }

    const payload = {
      requesterId: userId,
      methodId: selectedMethod._id,
      paymentType: form.paymentType,
      accountNumber: form.accountNumber,
      amount,
    };

    mutation.mutate(payload);
  };

  const openModal = (method) => {
    setSelectedMethod(method);
    setForm({ paymentType: "", accountNumber: "", amount: "" });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMethod(null);
    setError("");
  };

  const getMethodIcon = (method) => {
    if (method.methodIcon) {
      return (
        <img
          src={`${import.meta.env.VITE_API_URL}${method.methodIcon}`}
          alt={method.methodName}
          className="w-16 h-16 object-contain rounded-lg"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextElementSibling.style.display = "flex";
          }}
        />
      );
    }
    const name = method.methodName?.toLowerCase() || "";
    if (name.includes("bkash") || name.includes("nagad") || name.includes("rocket"))
      return <Smartphone className="w-8 h-8 text-white" />;
    if (name.includes("bank")) return <Building2 className="w-8 h-8 text-white" />;
    return <Smartphone className="w-8 h-8 text-white" />;
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-pink-600 text-white text-2xl">
        Please Login First
      </div>
    );
  }

  return (
    <>
      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        style={{ fontFamily: '"Poppins", sans-serif' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
              Withdraw Balance
            </h1>
            <p className="text-white/80 text-lg">
              Send withdrawal request to Admin
            </p>
          </motion.div>

          {/* Error State */}
          {isError && (
            <div className="text-center py-12 text-red-400">
              <AlertCircle size={48} className="mx-auto mb-4" />
              <p>Failed to load payment methods</p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-16 h-16 text-white animate-spin" />
            </div>
          )}

          {/* Methods Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {methods.map((method, index) => (
                <motion.div
                  key={method._id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="group cursor-pointer"
                  onClick={() => openModal(method)}
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-white/20 backdrop-blur p-4 rounded-2xl">
                        {getMethodIcon(method)}
                      </div>
                      <ArrowRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all" />
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4">
                      {method.methodName}
                    </h3>

                    <div className="space-y-3 text-white/90">
                      <p className="flex justify-between text-lg">
                        <span>Minimum:</span>
                        <span className="font-bold">৳{method.minAmount}</span>
                      </p>
                      <p className="flex justify-between text-lg">
                        <span>Maximum:</span>
                        <span className="font-bold">৳{method.maxAmount}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-6">
                      {method.paymentTypes.map((type) => (
                        <span
                          key={type}
                          className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-medium ${
                            type.toLowerCase() === "personal"
                              ? "bg-blue-100 text-blue-700"
                              : type.toLowerCase() === "agent"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/20 text-center">
                      <p className="text-white/70 text-sm">Click to Request Withdraw</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {!isLoading && methods.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-16 max-w-md mx-auto">
                <div className="bg-white/20 rounded-full w-28 h-28 mx-auto mb-8 flex items-center justify-center">
                  <AlertCircle size={64} className="text-white/60" />
                </div>
                <p className="text-white/80 text-2xl font-semibold mb-2">
                  No Withdraw Method Available
                </p>
                <p className="text-white/60">
                  Admin has not added any payment method yet
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Request Modal */}
      <AnimatePresence>
        {modalOpen && selectedMethod && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                  {getMethodIcon(selectedMethod)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {selectedMethod.methodName}
                  </h2>
                  <p className="text-gray-600">Withdraw Request Form</p>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle size={20} />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Type
                  </label>
                  <select
                    name="paymentType"
                    value={form.paymentType}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-800 text-lg"
                  >
                    <option value="">Select Type</option>
                    {selectedMethod.paymentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    name="accountNumber"
                    type="text"
                    required
                    value={form.accountNumber}
                    onChange={handleChange}
                    placeholder="01xxx-xxxxxx"
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-800 text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount (৳{selectedMethod.minAmount} - ৳{selectedMethod.maxAmount})
                  </label>
                  <input
                    name="amount"
                    type="number"
                    required
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="1000"
                    min={selectedMethod.minAmount}
                    max={selectedMethod.maxAmount}
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-800 text-lg"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={24} />
                      Send Withdraw Request
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SuperWithdrawBalance;