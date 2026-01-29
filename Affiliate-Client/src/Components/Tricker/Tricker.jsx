// components/Tricker.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Tricker = () => {
  const [images, setImages] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL 

  useEffect(() => {
    axios.get(`${API_URL}/api/tricker`).then((res) => {
      setImages(res.data.images || []);
    });
  }, []);

  if (images.length === 0) return null;

  const duplicated = [...images, ...images];

  return (
    <div className="bg-[#0b0f10] py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="flex gap-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          style={{ width: `${images.length * 220}px` }}
        >
          {duplicated.map((img, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-52 rounded-xl overflow-hidden shadow-xl hover:shadow-blue-500/50 transition-shadow duration-300"
            >
              <img
                src={`${API_URL}${img.url}`}
                alt={img.alt}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Tricker;