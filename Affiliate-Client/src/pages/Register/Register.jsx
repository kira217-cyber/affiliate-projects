// src/pages/Register.jsx
import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSearchParams, useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const backgroundImage =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [pageLoading, setPageLoading] = useState(true); // নতুন state

  const refCode = searchParams.get("ref");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const password = watch("password");

  // Simulate initial page load delay (optional — real-এ API dependent করতে পারো)
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (refCode) setValue("referral", refCode);
  }, [refCode, setValue]);

  const registerMutation = useMutation({
    mutationFn: (data) =>
      axios.post(`${import.meta.env.VITE_API_URL}/api/register`, data),
    onSuccess: (res) => {
      toast.success("Registration successful!");
      const userData = res.data.user;
      queryClient.setQueryData(["user"], userData);

      if (userData.isActive) {
        navigate("/affiliate/dashboard");
      } else {
        toast.info("Your account is pending approval by your referrer.");
        navigate("/login");
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Registration failed");
    },
  });

  const { refetch: refetchUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No user");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin?id=${userId}`);
      return res.data.user;
    },
    enabled: false,
    onSuccess: (data) => setUser(data),
  });

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      refetchUser();
    }
  }, [refetchUser]);

  const onSubmit = (data) => {
    const { confirmPassword, terms, ...sendData } = data;
    registerMutation.mutate(sendData);
  };

  // Page loading skeleton
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-800">
          {/* Left side background skeleton */}
          <div className="hidden md:block md:w-1/2 relative overflow-hidden">
            <Skeleton height="100%" className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent flex items-center justify-center">
              <div className="text-white p-8 text-center w-full">
                <Skeleton height={60} width="70%" className="mx-auto mb-4" />
                <Skeleton height={24} width="60%" className="mx-auto" />
              </div>
            </div>
          </div>

          {/* Right side form skeleton */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-gray-900">
            <div className="max-w-md mx-auto w-full space-y-6">
              <Skeleton height={40} width="60%" className="mx-auto mb-8" />

              {/* Username */}
              <div>
                <Skeleton height={20} width={100} className="mb-1" />
                <Skeleton height={48} className="rounded-xl" />
              </div>

              {/* Email */}
              <div>
                <Skeleton height={20} width={80} className="mb-1" />
                <Skeleton height={48} className="rounded-xl" />
              </div>

              {/* WhatsApp */}
              <div>
                <Skeleton height={20} width={140} className="mb-1" />
                <Skeleton height={48} className="rounded-xl" />
              </div>

              {/* Password */}
              <div>
                <Skeleton height={20} width={100} className="mb-1" />
                <Skeleton height={48} className="rounded-xl" />
              </div>

              {/* Confirm Password */}
              <div>
                <Skeleton height={20} width={140} className="mb-1" />
                <Skeleton height={48} className="rounded-xl" />
              </div>

              {/* Referral Code */}
              <div>
                <Skeleton height={20} width={140} className="mb-1" />
                <Skeleton height={48} className="rounded-xl" />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2">
                <Skeleton circle width={16} height={16} />
                <Skeleton height={20} width={300} />
              </div>

              {/* Submit Button */}
              <Skeleton height={52} className="rounded-xl" />

              {/* Login link */}
              <Skeleton height={20} width={220} className="mx-auto mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-800">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden md:block md:w-1/2 relative overflow-hidden"
          >
            <img src={backgroundImage} alt="bg" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent flex items-center justify-center">
              <div className="text-white p-8 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome Back</h1>
                <p className="text-lg opacity-90">Join thousands who trust us daily</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-gray-900"
          >
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl font-bold text-center mb-8 text-white">Create Account</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                  <input
                    type="text"
                    {...register("username", { required: "Username is required" })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    placeholder="yourusername"
                  />
                  {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                    })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    {...register("whatsapp", { required: "WhatsApp number is required" })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    placeholder="+1234567890"
                  />
                  {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp.message}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                      })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Please confirm password",
                        validate: (v) => v === password || "Passwords do not match",
                      })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                {/* Referral Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Referral Code (Optional)</label>
                  <input
                    type="text"
                    {...register("referral")}
                    readOnly={!!refCode}
                    className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition ${refCode ? "bg-gray-700" : ""}`}
                    placeholder="ABC123"
                  />
                  {refCode && <p className="text-xs text-green-400 mt-1">Auto-filled from link</p>}
                </div>

                {/* Terms */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("terms", { required: "You must accept terms" })}
                    className="h-4 w-4 text-primary bg-gray-800 border-gray-600 rounded focus:ring-primary cursor-pointer"
                  />
                  <label className="ml-2 text-sm text-gray-300">
                    I accept the <a href="#" className="text-primary underline">Terms & Conditions</a>
                  </label>
                </div>
                {errors.terms && <p className="text-red-400 text-xs mt-1">{errors.terms.message}</p>}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/80 cursor-pointer text-black font-semibold py-3 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  {registerMutation.isPending ? "Registering..." : "Register Now"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{" "}
                <a href="/login" className="text-primary font-medium hover:underline">Login here</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Register;