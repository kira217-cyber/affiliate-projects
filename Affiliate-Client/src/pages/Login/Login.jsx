// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const generateCaptchaCode = () =>
  Math.floor(1000 + Math.random() * 9000).toString();

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(generateCaptchaCode());
  const [pageLoading, setPageLoading] = useState(true); // নতুন state — page initial load track করার জন্য
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm();

  // Simulate a tiny delay for page load skeleton (optional — real API load-এর জন্য remove করতে পারো)
  useState(() => {
    setTimeout(() => setPageLoading(false), 800); // 800ms demo — real-এ API dependent করতে পারো
  }, []);

  const refreshCaptcha = () => {
    const newCode = generateCaptchaCode();
    setCaptchaCode(newCode);
    resetField("captcha");
  };

  const mutation = useMutation({
    mutationFn: (data) =>
      axios.post(`${import.meta.env.VITE_API_URL}/api/login`, data),
    onSuccess: (res) => {
      toast.success("Login Successfully");
      const userData = res.data.user;

      localStorage.setItem("userId", userData.id);
      setUser(userData);

      navigate("/affiliate/dashboard");
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Login Failed";
      if (msg.includes("pending")) {
        toast.warn("Your account is not approval by your referrer.");
      } else {
        toast.error(msg);
      }
      refreshCaptcha();
    },
  });

  const onSubmit = (data) => {
    if (data.captcha !== captchaCode) {
      toast.error("Captcha Not Match");
      refreshCaptcha();
      return;
    }

    const { captcha, ...loginData } = data;
    mutation.mutate(loginData);
  };

  // Page initial loading skeleton
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-800">
          {/* Left side skeleton (image + overlay text) */}
          <div className="hidden md:block md:w-1/2 relative overflow-hidden">
            <Skeleton height="100%" className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent flex items-center justify-center">
              <div className="text-white p-8 text-center w-full">
                <Skeleton height={60} width="70%" className="mx-auto mb-4" />
                <Skeleton height={24} width="50%" className="mx-auto" />
              </div>
            </div>
          </div>

          {/* Right side form skeleton */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-gray-900">
            <div className="max-w-md mx-auto w-full space-y-6">
              <Skeleton height={40} width="60%" className="mx-auto mb-8" />

              {/* Username field */}
              <div>
                <Skeleton height={20} width={100} className="mb-1" />
                <Skeleton height={48} className="rounded-xl" />
              </div>

              {/* Password field */}
              <div>
                <Skeleton height={20} width={100} className="mb-1" />
                <Skeleton height={48} className="rounded-xl" />
              </div>

              {/* Captcha field */}
              <div>
                <Skeleton height={20} width={80} className="mb-1" />
                <div className="flex items-center gap-3">
                  <Skeleton width={140} height={48} className="rounded-xl" />
                  <Skeleton circle width={48} height={48} />
                </div>
                <Skeleton height={48} className="mt-2 rounded-xl" />
              </div>

              {/* Submit button */}
              <Skeleton height={52} className="rounded-xl" />

              {/* Register link */}
              <Skeleton height={20} width={200} className="mx-auto mt-6" />
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
            <img
              src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
              alt="Login Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent flex items-center justify-center">
              <div className="text-white p-8 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome Back</h1>
                <p className="text-lg opacity-90">Log in to continue your journey</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-gray-900"
          >
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl font-bold text-center mb-8 text-white">Login</h2>

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

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", { required: "Password is required" })}
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

                {/* Captcha */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Captcha</label>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 font-mono text-xl text-white tracking-wider select-none">
                      {captchaCode}
                    </div>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="p-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700 transition transform hover:rotate-180 duration-300"
                      title="Refresh Captcha"
                    >
                      <FaSync size={18} />
                    </button>
                  </div>

                  <input
                    type="text"
                    {...register("captcha", {
                      required: "Captcha is required",
                      validate: (value) => value === captchaCode || "Captcha does not match",
                    })}
                    className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    placeholder="Enter captcha"
                    maxLength={4}
                    autoComplete="off"
                  />
                  {errors.captcha && <p className="text-red-400 text-xs mt-1">{errors.captcha.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-primary hover:bg-primary/80 text-black cursor-pointer font-semibold py-3 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  {mutation.isPending ? "Logging in..." : "Login Now"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{" "}
                <a href="/register" className="text-primary font-medium hover:underline">Register here</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;