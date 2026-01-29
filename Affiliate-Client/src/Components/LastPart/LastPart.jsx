// components/LastPart.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LastPart = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5004";

  useEffect(() => {
    axios
      .get(`${API_URL}/api/lastpart`)
      .then((res) => {
        setData(res.data);
        console.log("Data loaded successfully:", res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  // ডাটা চেঞ্জ হলে লগ (অপরিবর্তিত রাখা হয়েছে)
  useEffect(() => {
    console.log("Current data state:", data);
  }, [data]);

  if (loading) {
    return (
      <div
        id="contact"
        className="relative bg-gradient-to-r from-[#0d2d0d] to-black overflow-hidden py-16 md:py-24"
      >
        {/* Background Animation placeholders */}
        <div className="absolute inset-0 flex justify-between opacity-40 pointer-events-none">
          <div className="w-1/2 flex justify-start items-center">
            <div className="bg-primary/30 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse" />
          </div>
          <div className="w-1/2 flex justify-end items-center">
            <div className="bg-primary/30 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto flex flex-col md:flex-row items-center justify-center px-6 gap-10">
          {/* Left: Images skeleton */}
          <div className="flex justify-center md:justify-end w-full md:w-1/2">
            <div className="relative flex justify-center items-end">
              {/* Tablet image skeleton */}
              <Skeleton
                width="100%"
                height={384} // approx md:w-96
                className="w-56 sm:w-72 md:w-96 rounded-xl drop-shadow-2xl"
              />
              {/* Mobile image overlay skeleton */}
              <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-10">
                <Skeleton
                  width={192}
                  height={320} // approx md:w-48, taller for phone shape
                  className="rounded-xl drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Right: Content skeleton */}
          <div className="text-center md:text-left text-white w-full md:w-1/2 space-y-6">
            <Skeleton height={28} width="60%" className="mx-auto md:mx-0" />
            <Skeleton height={60} width="80%" className="mx-auto md:mx-0" />
            <Skeleton height={20} count={4} className="max-w-lg mx-auto md:mx-0" />
            <Skeleton
              height={56}
              width={220}
              borderRadius={999}
              className="mx-auto md:mx-0 mt-4"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="contact" className="relative bg-gradient-to-r from-[#0d2d0d] to-black overflow-hidden py-16 md:py-24">
      {/* Background Animation */}
      <div className="absolute inset-0 flex justify-between opacity-40 pointer-events-none">
        <div className="w-1/2 flex justify-start items-center">
          <motion.div
            className="bg-primary/30 w-[600px] h-[600px] rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>
        <div className="w-1/2 flex justify-end items-center">
          <motion.div
            className="bg-primary/30 w-[600px] h-[600px] rounded-full blur-3xl"
            animate={{ scale: [1.1, 1, 1.1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto flex flex-col md:flex-row items-center justify-center px-6 gap-10">
        {/* Left: Images */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center md:justify-end w-full md:w-1/2"
        >
          <div className="relative flex justify-center items-end">
            <img
              src={
                data.tabletImage
                  ? `${API_URL}${data.tabletImage}`
                  : "https://i.ibb.co.com/Sw9GXxg9/6810b5078bf0cd001d0e57ca.jpg"
              }
              alt="Tablet"
              className="w-56 sm:w-72 md:w-96 drop-shadow-2xl"
            />
            <img
              src={
                data.mobileImage
                  ? `${API_URL}${data.mobileImage}`
                  : "https://i.ibb.co.com/xth9Kzqy/phone-casino-chips-dice.jpg"
              }
              alt="Mobile"
              className="absolute left-1/2 transform -translate-x-1/2 translate-y-10 w-28 sm:w-40 md:w-48 drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left text-white w-full md:w-1/2 space-y-4"
        >
          <h3 className="text-lg sm:text-xl font-medium">{data.subtitle || "আমাদের অংশ হতে আবেদন করুন"}</h3>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary leading-tight">
            {data.titleBn || "RAJABAJI অ্যাফিলিয়েট প্রোগ্রাম"}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-lg mx-auto md:mx-0">
            {data.description || "আমরা ক্রমাগত আমাদের গ্রাহকদের কাছ থেকে ১০০% বিশ্বস্ততার সাথে বৃদ্ধি পাচ্ছি..."}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="pt-4">
            <a href={data.buttonLink || "/contact"}>
              <button className="bg-primary cursor-pointer text-black font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:bg-primary/90 transition-all duration-300">
                {data.buttonText || "যোগাযোগ করুন"}
              </button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LastPart;