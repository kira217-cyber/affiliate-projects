// components/WhyChooseUs.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WhyChooseUs = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // নতুন state

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5004";

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/why-choose-us`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        console.log("লোড হয়নি");
        setLoading(false); // error হলেও loading শেষ
      });
  }, [API_URL]);

  // Loading state → Skeleton UI
  if (loading) {
    return (
      <div
        id="why-us"
        className="relative bg-fixed bg-center bg-cover py-16"
        style={{
          backgroundImage: `url(/placeholder-bg.jpg)`, // optional: কোনো placeholder bg দিতে পারো, নাহলে খালি রাখো
        }}
      >
        <div className="absolute inset-0 bg-black/80"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          {/* Heading skeleton */}
          <Skeleton
            height={56}
            width="60%"
            className="mx-auto mb-4 rounded"
          />

          {/* Subheading skeleton */}
          <Skeleton
            height={28}
            width="80%"
            className="mx-auto mb-12 rounded"
          />

          {/* Cards grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-black/60 border border-[#99FF47]/30 backdrop-blur-lg rounded-2xl p-6 text-white"
              >
                <div className="flex justify-center mb-4">
                  <Skeleton circle width={56} height={56} />
                </div>
                <Skeleton height={28} width="70%" className="mx-auto mb-2" />
                <Skeleton height={20} width="90%" className="mx-auto" />
                <Skeleton height={20} width="85%" className="mx-auto mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Original fallback যদি data null থাকে (যদিও loading false হলে data থাকা উচিত)
  if (!data) {
    return (
      <div className="py-16 text-center text-white">কোনো ডেটা পাওয়া যায়নি</div>
    );
  }

  return (
    <div
      id="why-us"
      className="relative bg-fixed bg-center bg-cover py-16"
      style={{ backgroundImage: `url(${API_URL}${data.backgroundImage})` }}
    >
      {/* Overlay for dark effect */}
      <div className="absolute inset-0 bg-black/80"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-primary mb-4"
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {data.heading}
        </motion.h2>
        <motion.p
          className="text-white text-lg mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {data.subheading}
        </motion.p>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.features.map((item, index) => (
            <motion.div
              key={index}
              className="bg-black/60 border border-[#99FF47]/30 backdrop-blur-lg rounded-2xl p-6 text-white hover:border-primary hover:shadow-[0_0_20px_rgba(153,255,71,0.5)] transition-all duration-500"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-4">
                <img
                  src={`${API_URL}${item.icon}`}
                  alt={item.title}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <h3 className="text-primary text-xl font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;