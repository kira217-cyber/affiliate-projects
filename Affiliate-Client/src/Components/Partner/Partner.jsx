// components/Partner.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Tricker from "../Tricker/Tricker";

const Partner = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // নতুন state

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5004";

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/partner`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Partner ডাটা লোড হয়নি:", err);
        setLoading(false);
      });
  }, []);

  // Loading state → Skeleton UI
  if (loading) {
    return (
      <div className="bg-black text-white py-12 px-4 flex flex-col items-center justify-center overflow-hidden relative min-h-96">
        {/* Background placeholder (optional opacity layer) */}
        <div className="absolute inset-0 bg-gray-900 opacity-15" />

        {/* Title skeleton */}
        <div className="text-center mb-8 z-10">
          <Skeleton height={40} width={300} className="mx-auto rounded" />
        </div>

        {/* CTA Section skeleton */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-center z-10 w-full max-w-5xl">
          {/* Left image skeleton */}
          <div className="flex-1 flex justify-center">
            <Skeleton width={384} height={384} className="rounded-xl" /> {/* approx w-96 */}
          </div>

          {/* Right text + button skeleton */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <Skeleton height={24} count={4} className="w-full max-w-lg mx-auto md:mx-0" />
            <Skeleton height={48} width={200} borderRadius={999} className="mt-4" />
          </div>
        </div>

        {/* Tricker placeholder (যদি Tricker visible area নেয়) */}
        <div className="mt-5 w-full">
          <Skeleton height={100} className="rounded" /> {/* Tricker-এর approximate height অনুমান করে */}
        </div>
      </div>
    );
  }

  // Original fallback যদি data null থাকে (যদিও loading false হলে data থাকা উচিত)
  if (!data) {
    return (
      <div className="bg-black text-white py-12 px-4 flex flex-col items-center justify-center overflow-hidden relative min-h-96">
        <div className="text-center text-red-400">কোনো ডেটা পাওয়া যায়নি</div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white py-12 px-4 flex flex-col items-center justify-center overflow-hidden relative">
      {/* ব্যাকগ্রাউন্ড */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${API_URL}${data.bgImage})`,
        }}
      />

      {/* শিরোনাম */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-bold text-center mb-8 z-10"
      >
        <span className="text-primary">{data.titleEn}</span>{" "}
        <span className="text-white">{data.titleBn}</span>
      </motion.h2>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-center z-10"
      >
        {/* বাম দিকের ইমেজ */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex-1 flex justify-center"
        >
          <img
            src={`${API_URL}${data.leftImage}`}
            alt="Partner Promo"
            className="w-64 md:w-80 lg:w-96"
          />
        </motion.div>

        {/* ডান দিকের টেক্সট ও বাটন */}
        <motion.div
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-lg"
            dangerouslySetInnerHTML={{
              __html: data.description.replace(
                data.highlightText,
                `<span class="text-primary font-semibold">${data.highlightText}</span>`
              ),
            }}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-primary hover:bg-primary cursor-pointer text-black font-semibold px-6 py-3 rounded-full shadow-lg"
          >
            {data.buttonText}
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="mt-5">
        <Tricker />
      </div>
    </div>
  );
};

export default Partner;