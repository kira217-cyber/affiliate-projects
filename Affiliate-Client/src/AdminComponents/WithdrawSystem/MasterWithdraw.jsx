// src/AdminComponents/WithdrawSystem/MasterWithdraw.jsx
import React, { useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Building2,
  User,
  Store,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API Functions
const fetchMethods = async (adminId) => {
  if (!adminId) throw new Error("adminId is required");
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/withdraw/methods/${adminId}`
  );
  return data;
};

const submitWithdrawRequest = async (payload) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/withdraw/request`,
    payload
  );
  return data;
};

const MasterWithdraw = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const adminId = localStorage.getItem("userId");

  // Debug: Check adminId and API URL
  useEffect(() => {
    console.log("adminId:", adminId);
    console.log("API URL:", import.meta.env.VITE_API_URL);
    if (!adminId) {
      toast.error("Please login first");
    }
  }, [adminId]);

  // Modal State
  const [selectedMethod, setSelectedMethod] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    paymentType: "",
    accountNumber: "",
    amount: "",
  });
  const [error, setError] = React.useState("");

  // Fetch Methods
  const {
    data: methods = [],
    isLoading,
    isError: fetchError,
    error: fetchErrorDetails,
  } = useQuery({
    queryKey: ["withdrawMethods", adminId],
    queryFn: () => fetchMethods(adminId),
    enabled: !!adminId,
    staleTime: 1000 * 60,
    retry: 1,
  });

  // Submit Mutation
  const mutation = useMutation({
    mutationFn: submitWithdrawRequest,
    onSuccess: () => {
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle size={20} />
          <span>Withdrawal Request Sent Successfully!</span>
        </div>,
        { icon: false }
      );

      queryClient.invalidateQueries({ queryKey: ["withdrawMethods", adminId] });
      setModalOpen(false);
      setForm({ paymentType: "", accountNumber: "", amount: "" });
      setError("");

      setTimeout(() => {
        navigate("/affiliate/transaction-history");
      }, 500);
    },
    onError: (err) => {
      const msg =
        err.response?.data?.msg || "There was a Problem Sending the Request.";
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
    if (
      amount < selectedMethod.minAmount ||
      amount > selectedMethod.maxAmount
    ) {
      const msg = `Amount must be between ${selectedMethod.minAmount} - ${selectedMethod.maxAmount}`;
      setError(msg);
      toast.warn(msg);
      return;
    }

    const payload = {
      requesterId: adminId,
      methodId: selectedMethod._id,
      paymentType: form.paymentType,
      accountNumber: form.accountNumber,
      amount,
    };

    mutation.mutate(payload); // Fixed: payload directly
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

  // Icon + Image Logic
  const getMethodIcon = (method) => {
    if (method.methodIcon) {
      const imageUrl = `${import.meta.env.VITE_API_URL}${method.methodIcon}`;
      return (
        <div className="relative w-16 h-16">
          <img
            src={imageUrl}
            alt={method.methodName}
            className="w-full h-full object-contain rounded-lg"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />
          <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
        </div>
      );
    }

    const lower = method.methodName?.toLowerCase() || "";
    if (lower.includes("bkash") || lower.includes("nagad") || lower.includes("rocket"))
      return <Smartphone className="w-6 h-6" />;
    if (lower.includes("bank")) return <Building2 className="w-6 h-6" />;
    return <Smartphone className="w-6 h-6" />;
  };

  const getTypeChip = (type) => {
    const lower = type?.toLowerCase() || "";
    if (lower === "personal")
      return { icon: <User size={14} />, color: "bg-blue-100 text-blue-700" };
    if (lower === "agent")
      return { icon: <Store size={14} />, color: "bg-green-100 text-green-700" };
    if (lower === "merchant")
      return { icon: <Building2 size={14} />, color: "bg-purple-100 text-purple-700" };
    return { icon: <User size={14} />, color: "bg-gray-100 text-gray-700" };
  };

  // If not logged in
  if (!adminId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
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
        className="min-h-screen p-6"
        style={{
          background: "#0f172a",
          fontFamily: '"Poppins", sans-serif',
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
              Master Withdrawal System
            </h1>
            <p className="text-white/80 text-lg">
              Send Your Withdrawal Request
            </p>
          </motion.div>

          {/* API Error */}
          {fetchError && (
            <div className="text-center py-10 text-red-300">
              <p>Error: {fetchErrorDetails?.message || "Failed to load methods"}</p>
              <p className="text-sm mt-2">Check console for details</p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          )}

          {/* Methods Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => openModal(method)}
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-white p-2 rounded-xl flex items-center justify-center">
                        {getMethodIcon(method)}
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">
                      {method.methodName}
                    </h3>

                    <div className="space-y-2 text-white/90">
                      <p className="flex justify-between">
                        <span>Minimum:</span>
                        <span className="font-semibold">
                          ৳{method.minAmount}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Maximum:</span>
                        <span className="font-semibold">
                          ৳{method.maxAmount}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {method.paymentTypes.map((type, i) => {
                          const chip = getTypeChip(type);
                          return (
                            <span
                              key={i}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${chip.color}`}
                            >
                              {chip.icon}
                              {type}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-sm text-white/70 text-center">
                        Click to Request
                      </p>
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
              className="text-center py-20"
            >
              <div className="bg-white/10 backdrop-blur rounded-3xl p-12 max-w-md mx-auto">
                <div className="bg-white/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <AlertCircle size={48} className="text-white/60" />
                </div>
                <p className="text-white/80 text-lg">
                  No Withdrawal Method Found
                </p>
                <p className="text-white/60 text-sm mt-2">
                  Super Affiliate hasn't added any method yet
                </p>
                {adminId && (
                  <p className="text-xs text-white/50 mt-4">
                    adminId: {adminId}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && selectedMethod && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white p-2 rounded-xl text-white flex items-center justify-center">
                  {getMethodIcon(selectedMethod)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedMethod.methodName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Withdrawal Request Form
                  </p>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type
                  </label>
                  <select
                    name="paymentType"
                    value={form.paymentType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-800"
                  >
                    <option value="">Select Type</option>
                    {selectedMethod.paymentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    name="accountNumber"
                    type="text"
                    required
                    value={form.accountNumber}
                    onChange={handleChange}
                    placeholder="01xxx-xxxxxx"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (৳{selectedMethod.minAmount} - ৳{selectedMethod.maxAmount})
                  </label>
                  <input
                    name="amount"
                    type="number"
                    required
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="500"
                    min={selectedMethod.minAmount}
                    max={selectedMethod.maxAmount}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-800"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 cursor-pointer"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={20} />
                      Send Request
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

export default MasterWithdraw;