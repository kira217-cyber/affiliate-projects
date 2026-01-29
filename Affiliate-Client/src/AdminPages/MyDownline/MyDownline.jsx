// src/pages/MasterAffiliate.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { FaToggleOn, FaToggleOff, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const MyDownline = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // নতুন: পাসওয়ার্ড দেখানো/লুকানো

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No user ID found");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin?id=${userId}`
      );
      return res.data.user;
    },
    onError: (err) => {
      toast.error(err.message || "Failed to load data");
    },
  });

  // কমিশন আপডেট মিউটেশন
  const approveMutation = useMutation({
    mutationFn: ({ id, commissions }) =>
      axios.patch(
        `${import.meta.env.VITE_API_URL}/api/approve-user/${id}`,
        commissions
      ),
    onSuccess: () => {
      toast.success("User activated & commissions updated!");
      queryClient.invalidateQueries(["user"]);
      setModalOpen(false);
      setSelectedUser(null);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Update failed"),
  });

  // ডিঅ্যাক্টিভেট মিউটেশন
  const deactivateMutation = useMutation({
    mutationFn: (id) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/api/deactivate-user/${id}`),
    onSuccess: () => {
      toast.success("User deactivated!");
      queryClient.invalidateQueries(["user"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  // পাসওয়ার্ড ও ইউজারনেম চেঞ্জ মিউটেশন
  const updateUserMutation = useMutation({
    mutationFn: ({ id, username, password }) =>
      axios.patch(
        `${
          import.meta.env.VITE_API_URL
        }/api/update-master-affiliate-credentials/${id}`,
        {
          username,
          password,
        }
      ),
    onSuccess: () => {
      toast.success("User credentials updated successfully!");
      queryClient.invalidateQueries(["user"]);
      setViewModalOpen(false);
      setViewUser(null);
      setPasswordForm({ username: "", password: "" });
      setShowPassword(false);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Update failed"),
  });

  const handleActivate = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDeactivate = (userId) => {
    if (window.confirm("Deactivate this user?")) {
      deactivateMutation.mutate(userId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    approveMutation.mutate({
      id: selectedUser._id,
      commissions: {
        gameLossCommission: formData.get("gameLossCommission") || 0,
        depositCommission: formData.get("depositCommission") || 0,
        referCommission: formData.get("referCommission") || 0,
      },
    });
  };

  // View User Data
  const handleViewUser = (user) => {
    setViewUser(user);
    setPasswordForm({ username: user.username, password: "" });
    setShowPassword(false);
    setViewModalOpen(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.password) {
      toast.warn("Password is required!");
      return;
    }
    updateUserMutation.mutate({
      id: viewUser._id,
      username: passwordForm.username,
      password: passwordForm.password,
    });
  };

  if (isLoading)
    return (
      <div className="text-white text-center py-20 text-xl">Loading...</div>
    );
  if (error)
    return (
      <div className="text-red-400 text-center py-20">
        Error: {error.message}
      </div>
    );

  const allReferredUsers = [...(data?.createdUsers || [])].filter(Boolean);
  console.log("Referred Users:", allReferredUsers);

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: "#0f172a",
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          My Referral Users
        </h1>

        {allReferredUsers.length === 0 ? (
          <p className="text-center text-gray-300 text-lg">No Referral Users</p>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-200">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Whatsapp</th>
                    <th className="py-3 px-4">Balance</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Active/Deactive</th>
                    <th className="py-3 px-4 text-center">View User Data</th>
                  </tr>
                </thead>
                <tbody>
                  {allReferredUsers.map((user) => {
                    const isActive = user.isActive || false;
                    return (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-white/10 hover:bg-white/5 transition"
                      >
                        <td className="py-4 px-4">{user.username}</td>
                        <td className="py-4 px-4">{user.email}</td>
                        <td className="py-4 px-4">{user.whatsapp}</td>
                        {/* ব্যালেন্স দেখানো হচ্ছে */}
                        <td className="py-4 px-4 font-semibold text-green-400">
                          ৳{user.balance || 0}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              isActive
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {isActive ? "Active" : "Deactive"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {isActive ? (
                            <button
                              onClick={() => handleDeactivate(user._id)}
                              className="text-red-400 cursor-pointer hover:text-red-300 transition transform hover:scale-110"
                              title="Deactivate"
                            >
                              <FaToggleOn size={28} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(user)}
                              className="text-gray-500 cursor-pointer hover:text-green-400 transition transform hover:scale-110"
                              title="Activate"
                            >
                              <FaToggleOff size={28} />
                            </button>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-blue-400 cursor-pointer hover:text-blue-300 transition transform hover:scale-110"
                            title="View & Edit User"
                          >
                            <FaEye size={24} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* কমিশন মডাল */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 p-8 rounded-2xl max-w-md w-full border border-gray-700"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Set Commissions: {selectedUser.username}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Game Loss Commission (%)
                </label>
                <input
                  type="number"
                  name="gameLossCommission"
                  defaultValue={selectedUser.gameLossCommission || 0}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Deposit Commission (%)
                </label>
                <input
                  type="number"
                  name="depositCommission"
                  defaultValue={selectedUser.depositCommission || 0}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Refer Commission (%)
                </label>
                <input
                  type="number"
                  name="referCommission"
                  defaultValue={selectedUser.referCommission || 0}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={approveMutation.isPending}
                  className="flex-1 cursor-pointer bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  {approveMutation.isPending
                    ? "Updating..."
                    : "Update and Active"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View & Edit User Modal (পাসওয়ার্ড শো/হাইড সহ) */}
      {viewModalOpen && viewUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 p-8 rounded-2xl max-w-md w-full border border-gray-700"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Edit User: {viewUser.username}
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={passwordForm.username}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordForm.password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      password: e.target.value,
                    })
                  }
                  placeholder="*******"
                  className="w-full px-4 py-2 pr-12 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-3 top-9 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  If you don't enter the password, It will be Outdated.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="flex-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewModalOpen(false);
                    setViewUser(null);
                    setPasswordForm({ username: "", password: "" });
                    setShowPassword(false);
                  }}
                  className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyDownline;
