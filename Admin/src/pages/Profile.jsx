// src/pages/Profile/Profile.jsx  (or Profile.jsx)
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaLock,
  FaSave,
  FaUserCircle,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { baseURL } from "../utils/baseURL";
import { loginFailure, loginStart, loginSuccess } from "../redux/auth/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const { token, user, isLoading, isError, errorMessage } = useSelector(
    (state) => state.auth,
  );

  const [loadingMe, setLoadingMe] = useState(false);

  // form states
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // show/hide password
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // ✅ Load logged-in user (email show)
  useEffect(() => {
    const loadMe = async () => {
      if (!token) return;

      try {
        setLoadingMe(true);
        const res = await fetch(`${baseURL}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load profile");
        }

        const me = data?.data?.user;
        if (me?.email) setEmail(me.email);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingMe(false);
      }
    };

    loadMe();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("আপনি লগইন করেননি");
      return;
    }

    if (!currentPassword) {
      toast.error("Current password দিতে হবে");
      return;
    }

    if (!email && !newPassword) {
      toast.error("কিছুই পরিবর্তন করা হয়নি");
      return;
    }

    dispatch(loginStart());
    try {
      const res = await fetch(`${baseURL}/me/credentials`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email?.trim(),
          currentPassword,
          newPassword: newPassword ? newPassword : undefined, // blank হলে পাঠাবো না
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Update failed");
      }

      const updatedUser = data?.data?.user;
      const newToken = data?.data?.token;

      // ✅ token update
      if (newToken) localStorage.setItem("token", newToken);

      // ✅ redux update (authSlice এর loginSuccess এ {token, user} handle করতে হবে)
      dispatch(
        loginSuccess({
          token: newToken || token,
          user: updatedUser || user,
        }),
      );

      // ✅ reset password fields
      setCurrentPassword("");
      setNewPassword("");

      toast.success("সফলভাবে আপডেট হয়েছে!");
    } catch (err) {
      dispatch(loginFailure(err.message));
      toast.error(err.message);
    }
  };

  const cardCls =
    "bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-800/30 overflow-hidden";

  const inputCls =
    "w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-emerald-800/50 rounded-xl text-white placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300";

  const labelCls = "block text-sm font-medium text-emerald-200 mb-2";
  const iconWrap = "absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/30 to-black flex items-center justify-center p-4">
      {/* decorative bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md relative z-10"
      >
        <div className={cardCls}>
          {/* header */}
          <div className="p-8 text-center border-b border-emerald-800/30">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 mb-6 shadow-lg shadow-emerald-900/50"
            >
              <FaUserCircle className="text-4xl text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
            <p className="text-emerald-200/70">
              Email দেখুন এবং password পরিবর্তন করুন
            </p>
          </div>

          {/* body */}
          <form onSubmit={handleUpdate} className="p-8">
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className={labelCls}>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-emerald-400" />
                    Email Address
                  </div>
                </label>

                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={inputCls}
                    disabled={isLoading || loadingMe}
                    required
                  />
                  <div className={iconWrap}>
                    <FaEnvelope />
                  </div>
                </div>

                {loadingMe && (
                  <p className="mt-2 text-xs text-emerald-200/50">
                    Loading profile...
                  </p>
                )}
              </div>

              {/* Current Password */}
              <div>
                <label className={labelCls}>
                  <div className="flex items-center gap-2">
                    <FaLock className="text-emerald-400" />
                    Current Password <span className="text-red-400">*</span>
                  </div>
                </label>

                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="বর্তমান পাসওয়ার্ড"
                    className={`${inputCls} pr-12`}
                    disabled={isLoading}
                    required
                  />
                  <div className={iconWrap}>
                    <FaLock />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCurrent((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 transition"
                    aria-label="Toggle current password"
                  >
                    {showCurrent ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* New Password (blank) */}
              <div>
                <label className={labelCls}>
                  <div className="flex items-center gap-2">
                    <FaLock className="text-emerald-400" />
                    New Password (optional)
                  </div>
                </label>

                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="নতুন পাসওয়ার্ড (ফাঁকা রাখতে পারেন)"
                    className={`${inputCls} pr-12`}
                    disabled={isLoading}
                  />
                  <div className={iconWrap}>
                    <FaLock />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 transition"
                    aria-label="Toggle new password"
                  >
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-emerald-200/50">
                  password পরিবর্তন না করতে চাইলে ফিল্ড ফাঁকা রাখুন।
                </p>
              </div>

              {/* Error box */}
              <AnimatePresence>
                {isError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-900/20 border border-red-800/50 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 text-red-400">
                      <FaShieldAlt />
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Save button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || loadingMe}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:from-gray-700 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-900/30 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Save Changes</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* footer */}
          <div className="p-6 border-t border-emerald-800/30 bg-gradient-to-t from-black/20 to-transparent">
            <div className="text-center">
              <p className="text-sm text-emerald-200/60">
                Secure profile update • Token protected • Encrypted password
              </p>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-300" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
