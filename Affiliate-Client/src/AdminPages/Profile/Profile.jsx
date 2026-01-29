import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiSave, FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    whatsapp: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        whatsapp: user.whatsapp || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Profile.jsx - handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    // user._id আছে কিনা চেক করো
    if (!user?._id) {
      setMessage("User not logged in!");
      setLoading(false);
      return;
    }

    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/profile`,
      {
        userId: user._id,           // এখানে userId পাঠাচ্ছি
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        whatsapp: formData.whatsapp,
        password: formData.password,
      }
    );

    setUser(res.data);
    setMessage("Profile updated successfully!");
    toast.success("Profile updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  } catch (err) {
    setMessage(err.response?.data?.message || "Update failed!");
    toast.error(err.response?.data?.message || "Update failed!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto mt-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-95">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            My Profile
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* First Name */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline mr-2 text-purple-600" /> First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-700 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                  placeholder="First Name"
                />
              </motion.div>

              {/* Last Name */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline mr-2 text-pink-600" /> Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-700  rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all"
                  placeholder="Last Name"
                />
              </motion.div>
            </div>

            {/* Username */}
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="inline mr-2 text-blue-600" /> User Name
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-700 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="User Name"
              />
            </motion.div>

            {/* Email */}
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMail className="inline mr-2 text-green-600" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-700 rounded-xl border border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                placeholder="you@example.com"
              />
            </motion.div>

            {/* WhatsApp */}
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="inline mr-2 text-orange-600" /> Whatsapp
                Number
              </label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-700 rounded-xl border border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                placeholder="+8801XXXXXXXXX"
              />
            </motion.div>

            {/* Password */}
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiLock className="inline mr-2 text-red-600" />
                Set New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-700  rounded-xl border border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                placeholder="••••••••"
              />
            </motion.div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-8 cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <FiSave className="mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </motion.button>
          </form>

          {/* Success Message */}
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 text-center font-medium ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </motion.p>
          )}

          {/* Referral Code Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white text-center"
          >
            <p className="text-sm">Your Referral Code</p>
            <p className="text-2xl font-bold mt-2">{user?.referralCode}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_API_URL_REFERRAL}/register?ref=${
                    user?.referralCode
                  }`
                );
                toast.success("Copied!");
              }}
              className="mt-3 cursor-pointer px-6 py-2 bg-white text-purple-600 rounded-full font-medium hover:bg-gray-100 transition"
            >
              Copy
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
