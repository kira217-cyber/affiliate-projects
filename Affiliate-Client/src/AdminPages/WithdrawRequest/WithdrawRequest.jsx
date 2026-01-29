// src/AdminComponents/WithdrawSystem/WithdrawRequest.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Building2,
  User,
  Store,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API Functions
const fetchRequests = async (adminId) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/withdraw/requests/${adminId}`
  );
  return data;
};

const approveRequest = async ({ requestId, adminId }) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/withdraw/approve/${requestId}`,
    { adminId }
  );
  return data;
};

const rejectRequest = async ({ requestId, adminId }) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/withdraw/reject/${requestId}`,
    { adminId }
  );
  return data;
};

const WithdrawRequest = () => {
  const queryClient = useQueryClient();
  const adminId = localStorage.getItem("userId");

  // 1. Processed Requests (localStorage + auto cleanup)
  const [processedRequests, setProcessedRequests] = useState(() => {
    try {
      const saved = localStorage.getItem("processedWithdrawRequests");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      "processedWithdrawRequests",
      JSON.stringify(processedRequests)
    );
  }, [processedRequests]);

  // Auto cleanup every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setProcessedRequests((prev) => {
        const updated = { ...prev };
        let changed = false;
        Object.keys(updated).forEach((id) => {
          if (now - updated[id].timestamp > 60000) {
            delete updated[id];
            changed = true;
          }
        });
        return changed ? updated : prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. Fetch Requests
  const {
    data: requests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["withdrawRequests", adminId],
    queryFn: () => fetchRequests(adminId),
    enabled: !!adminId,
    staleTime: 10000,
    refetchInterval: 10000,
  });

  // 3. APPROVE MUTATION
  const approveMutation = useMutation({
    mutationFn: approveRequest,
    onMutate: async ({ requestId }) => {
      await queryClient.cancelQueries({
        queryKey: ["withdrawRequests", adminId],
      });
      const previous = queryClient.getQueryData(["withdrawRequests", adminId]);

      queryClient.setQueryData(["withdrawRequests", adminId], (old = []) =>
        old.map((r) => (r._id === requestId ? { ...r, status: "approved" } : r))
      );
      toast.success("Approve Successfully!", { autoClose: 1500 });

      return { previous };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["withdrawRequests", adminId], context.previous);
      toast.error(err.response?.data?.msg || "Approve Failed!", {
        autoClose: 3000,
      });
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["withdrawRequests", adminId],
      }),
    onSuccess: (_, { requestId }) => {
      setProcessedRequests((prev) => ({
        ...prev,
        [requestId]: { status: "approved", timestamp: Date.now() },
      }));
    },
  });

  // 4. REJECT MUTATION
  const rejectMutation = useMutation({
    mutationFn: rejectRequest,
    onMutate: async ({ requestId }) => {
      await queryClient.cancelQueries({
        queryKey: ["withdrawRequests", adminId],
      });
      const previous = queryClient.getQueryData(["withdrawRequests", adminId]);

      queryClient.setQueryData(["withdrawRequests", adminId], (old = []) =>
        old.map((r) => (r._id === requestId ? { ...r, status: "rejected" } : r))
      );
      toast.error("Rejected. Money Refunded.", {
        autoClose: 1500,
      });

      return { previous };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["withdrawRequests", adminId], context.previous);
      toast.error(err.response?.data?.msg || "Reject Failed", {
        autoClose: 3000,
      });
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["withdrawRequests", adminId],
      }),
    onSuccess: (_, { requestId }) => {
      setProcessedRequests((prev) => ({
        ...prev,
        [requestId]: { status: "rejected", timestamp: Date.now() },
      }));
    },
  });

  const handleAction = (requestId, action) => {
    if (action === "approve") approveMutation.mutate({ requestId, adminId });
    else if (action === "reject") rejectMutation.mutate({ requestId, adminId });
  };

  // 5. Filter: pending + recently processed
  const filteredRequests = requests.filter((req) => {
    if (req.status === "pending") return true;
    const processed = processedRequests[req._id];
    return processed && Date.now() - processed.timestamp <= 60000;
  });

  // Icon + Image Logic (নতুন)
  const getMethodIcon = (method) => {
    if (!method) return <Smartphone className="w-5 h-5" />;

    if (method.methodIcon) {
      const imageUrl = `${import.meta.env.VITE_API_URL}${method.methodIcon}`;
      console.log("Method Icon URL:", imageUrl);      
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
          <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
        </div>
      );
    }

    const lower = (method.methodName || "").toLowerCase();
    if (
      lower.includes("bkash") ||
      lower.includes("nagad") ||
      lower.includes("rocket")
    )
      return <Smartphone className="w-5 h-5" />;
    if (lower.includes("bank")) return <Building2 className="w-5 h-5" />;
    return <Smartphone className="w-5 h-5" />;
  };

  const getTypeChip = (type) => {
    const lower = (type || "").toLowerCase();
    if (lower === "personal")
      return { icon: <User size={14} />, color: "bg-blue-100 text-blue-700" };
    if (lower === "agent")
      return {
        icon: <Store size={14} />,
        color: "bg-green-100 text-green-700",
      };
    if (lower === "merchant")
      return {
        icon: <Building2 size={14} />,
        color: "bg-purple-100 text-purple-700",
      };
    return { icon: <User size={14} />, color: "bg-gray-100 text-gray-700" };
  };

  const getStatusBadge = (status, reqId) => {
    const processed = processedRequests[reqId];
    const displayStatus = processed?.status || status;

    switch (displayStatus) {
      case "pending":
        return {
          icon: <Clock size={16} />,
          color: "bg-yellow-100 text-yellow-700",
          text: "Pending",
        };
      case "approved":
        return {
          icon: <CheckCircle size={16} />,
          color: "bg-green-100 text-green-700",
          text: "Approved",
        };
      case "rejected":
        return {
          icon: <XCircle size={16} />,
          color: "bg-red-100 text-red-700",
          text: "Rejected",
        };
      default:
        return {
          icon: <Clock size={16} />,
          color: "bg-gray-100 text-gray-700",
          text: displayStatus,
        };
    }
  };

  if (!adminId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Login First
      </div>
    );
  }

  return (
    <>
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
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
              Withdraw Request
            </h1>
            <p className="text-white/80 text-lg">Approve or Reject</p>
          </motion.div>

          {isError && (
            <div className="text-center py-10 text-red-300">
              Error: {error?.message}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          )}

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredRequests.map((req, index) => {
                const status = getStatusBadge(req.status, req._id);
                const isProcessed = !!processedRequests[req._id];
                const isApproving =
                  approveMutation.isPending &&
                  approveMutation.variables?.requestId === req._id;
                const isRejecting =
                  rejectMutation.isPending &&
                  rejectMutation.variables?.requestId === req._id;

                return (
                  <motion.div
                    key={req._id}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.3 },
                    }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <div
                      className={`bg-white/10 backdrop-blur-lg rounded-3xl p-6 border transition-all duration-500 ${
                        isProcessed ? "ring-4 ring-white/50" : "border-white/20"
                      } shadow-xl hover:shadow-2xl`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-white p-2 rounded-xl text-white flex items-center justify-center">
                            {getMethodIcon(req.methodId)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {req.methodId?.methodName || "Unknown"}
                            </h3>
                            <p className="text-xs text-white/70">
                              {req.requesterId?.username || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color} animate-pulse`}
                        >
                          {status.icon}
                          {status.text}
                        </span>
                      </div>

                      <div className="space-y-3 text-white/90">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-bold">৳{req.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Account:</span>
                          <span className="font-medium text-sm">
                            {req.accountNumber}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Type:</span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              getTypeChip(req.paymentType).color
                            }`}
                          >
                            {getTypeChip(req.paymentType).icon}
                            {req.paymentType}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {req.status === "pending" && (
                        <div className="mt-5 pt-4 border-t border-white/20 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAction(req._id, "approve")}
                            disabled={isApproving || isRejecting}
                            className="flex-1 cursor-pointer bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
                          >
                            {isApproving ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <CheckCircle size={16} />
                            )}
                            Approve
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAction(req._id, "reject")}
                            disabled={isApproving || isRejecting}
                            className="flex-1 cursor-pointer bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
                          >
                            {isRejecting ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <XCircle size={16} />
                            )}
                            Reject
                          </motion.button>
                        </div>
                      )}

                      {/* Auto-hide message */}
                      {isProcessed && (
                        <p className="mt-3 text-xs text-white/70 text-center animate-pulse">
                          This Card will Disappear After 1 Minute.
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {!isLoading && filteredRequests.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="bg-white/10 backdrop-blur rounded-3xl p-12 max-w-md mx-auto">
                <div className="bg-white/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <AlertCircle size={48} className="text-white/60" />
                </div>
                <p className="text-white/80 text-lg">No Requests.</p>
                <p className="text-white/60 text-sm mt-2">
                  New Requests will Actually Show up Here.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default WithdrawRequest;
