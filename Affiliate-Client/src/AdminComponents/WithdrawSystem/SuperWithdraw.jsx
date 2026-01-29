// src/AdminComponents/WithdrawSystem/SuperWithdraw.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  X,
  Save,
  Loader2,
  Smartphone,
  Building2,
  User,
  Store,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";

const SuperWithdraw = () => {
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState({
    methodName: "",
    paymentTypes: "",
    minAmount: "",
    maxAmount: "",
    methodIcon: null,
  });
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const adminId = localStorage.getItem("userId");

  useEffect(() => {
    if (adminId) fetchMethods();
  }, [adminId]);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/withdraw/methods/${adminId}`
      );
      setMethods(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load methods.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, methodIcon: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("adminId", adminId);
    formData.append("methodName", form.methodName.trim());
    formData.append("paymentTypes", form.paymentTypes);
    formData.append("minAmount", form.minAmount);
    formData.append("maxAmount", form.maxAmount);
    if (form.methodIcon) formData.append("methodIcon", form.methodIcon);

    try {
      if (editId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/withdraw/method/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Method Updated!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/withdraw/method`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("New Method Added!");
      }

      fetchMethods();
      closeModal();
    } catch (err) {
      toast.error("There was a problem saving.");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (method) => {
    setForm({
      methodName: method.methodName,
      paymentTypes: method.paymentTypes.join(", "),
      minAmount: method.minAmount,
      maxAmount: method.maxAmount,
      methodIcon: null,
    });
    setPreview(method.methodIcon ? `${import.meta.env.VITE_API_URL}${method.methodIcon}` : null);
    setEditId(method._id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
    setForm({ methodName: "", paymentTypes: "", minAmount: "", maxAmount: "", methodIcon: null });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Delete Functions
  const openDelete = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const closeDelete = () => {
    setDeleteModal(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/withdraw/method/${deleteId}`
      );
      fetchMethods();
      toast.success("Method Deleted Successfully.");
      closeDelete();
    } catch (err) {
      toast.error("Failed to delete method.");
    } finally {
      setDeleting(false);
    }
  };

  const getMethodIcon = (method) => {
    if (method.methodIcon) {
      return (
        <img
          src={`${import.meta.env.VITE_API_URL}${method.methodIcon}`}
          alt={method.methodName}
          className="w-16 h-16 object-contain rounded-lg"
        />
      );
    }

    const lower = method.methodName.toLowerCase();
    if (lower.includes("bkash")) return <Smartphone className="w-6 h-6" />;
    if (lower.includes("nagad")) return <Smartphone className="w-6 h-6" />;
    if (lower.includes("rocket")) return <Smartphone className="w-6 h-6" />;
    if (lower.includes("bank")) return <Building2 className="w-6 h-6" />;
    return <Smartphone className="w-6 h-6" />;
  };

  const getTypeChip = (type) => {
    const lower = type.toLowerCase();
    if (lower === "personal")
      return { icon: <User size={14} />, color: "bg-blue-100 text-blue-700" };
    if (lower === "agent")
      return { icon: <Store size={14} />, color: "bg-green-100 text-green-700" };
    if (lower === "merchant")
      return { icon: <Building2 size={14} />, color: "bg-purple-100 text-purple-700" };
    return { icon: <User size={14} />, color: "bg-gray-100 text-gray-700" };
  };

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
              Add Withdraw System
            </h1>
            <p className="text-white/80 text-lg">Manage Payment Methods</p>
          </motion.div>

          {/* Add Button */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-8 text-center"
          >
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex cursor-pointer items-center gap-3 bg-white text-purple-600 font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Plus size={24} />
              Add New Method
            </button>
          </motion.div>

          {/* Loading */}
          {loading && (
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
                  className="group"
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-white p-2 rounded-xl flex items-center justify-center">
                        {getMethodIcon(method)}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(method)}
                          className="bg-white/20 backdrop-blur p-2 rounded-lg hover:bg-white/30 cursor-pointer"
                        >
                          <Edit2 size={18} className="text-white" />
                        </button>
                        <button
                          onClick={() => openDelete(method._id)}
                          className="bg-red-500/20 backdrop-blur p-2 rounded-lg hover:bg-red-500/30 cursor-pointer"
                        >
                          <Trash2 size={18} className="text-red-300" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">
                      {method.methodName}
                    </h3>

                    <div className="space-y-3 text-white/90">
                      <p className="flex justify-between">
                        <span>Minimum:</span>
                        <span className="font-semibold">৳{method.minAmount}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Maximum:</span>
                        <span className="font-semibold">৳{method.maxAmount}</span>
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
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {!loading && methods.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="bg-white/10 backdrop-blur rounded-3xl p-12 max-w-md mx-auto">
                <div className="bg-white/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Plus size={48} className="text-white/60" />
                </div>
                <p className="text-white/80 text-lg">
                  No Payment Methods Added.
                </p>
                <p className="text-white/60 text-sm mt-2">
                  Click the Button Above To Add a New Method.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
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
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {editId ? "Edit Method" : "Add New Method"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Method Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Method Name
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name="methodName"
                    type="text"
                    required
                    value={form.methodName}
                    onChange={handleChange}
                    placeholder="Example: bKash, Nagad, Rocket"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-800"
                  />
                </div>

                {/* Payment Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type (Separate By Comma)
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name="paymentTypes"
                    type="text"
                    required
                    value={form.paymentTypes}
                    onChange={handleChange}
                    placeholder="personal, agent, merchant"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-800"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: personal, agent, merchant
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Method Icon (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-16 h-16 object-contain rounded-lg border"
                      />
                    )}
                    <label className="cursor-pointer">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                        <Upload size={18} />
                        Upload Image
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WebP (Max 5MB)
                  </p>
                </div>

                {/* Min Max */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Amount
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      name="minAmount"
                      type="number"
                      required
                      value={form.minAmount}
                      onChange={handleChange}
                      placeholder="100"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Amount
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      name="maxAmount"
                      type="number"
                      required
                      value={form.maxAmount}
                      onChange={handleChange}
                      placeholder="50000"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-800"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={saving}
                  className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {editId ? "Update" : "Save"}
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
            }}
            onClick={closeDelete}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Delete Method?
                </h3>
                <p className="text-gray-600">
                  This action cannot be undone. The method will be permanently removed.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeDelete}
                  className="flex-1 py-3 cursor-pointer rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 cursor-pointer py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SuperWithdraw;