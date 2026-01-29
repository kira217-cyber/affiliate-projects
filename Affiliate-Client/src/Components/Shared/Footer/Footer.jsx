// components/Footer.jsx
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Footer = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5004";

  const defaultData = {
    logo: "https://i.ibb.co.com/Q7Cms1cc/Footer-Logo.png",
    tagline: "Rajabaji Trusted Casino – Best Online Cricket Betting App",
    paymentMethods: [
      { name: "bKash", image: "https://i.ibb.co.com/x8S78ZCf/300px-BKash.png" },
      { name: "Nagad", image: "https://i.ibb.co.com/M5SfXszD/image-42525-1643965434.png" },
      { name: "Rocket", image: "https://i.ibb.co.com/TMww2j2s/5932889762496fc0e8aacd507f50aba0.png" },
    ],
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com" },
      { platform: "instagram", url: "https://instagram.com" },
      { platform: "youtube", url: "https://youtube.com" },
      { platform: "twitter", url: "https://twitter.com" },
    ],
    copyright: "Copyright © 2025 Rajabaji. All Rights Reserved.",
  };

  const getIcon = useCallback((platform) => {
    const icons = {
      facebook: <FaFacebookF size={20} />,
      instagram: <FaInstagram size={20} />,
      youtube: <FaYoutube size={20} />,
      twitter: <FaTwitter size={20} />,
    };
    return icons[platform] || null;
  }, []);

  const fetchFooter = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/footer`, {
        timeout: 10000,
      });
      console.log("Footer API Success:", res.data);
      setData(res.data);
      setError(false);
    } catch (err) {
      console.error("Footer API Failed:", err.message);
      setError(true);
      setData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  // Loading state with Skeleton
  if (loading) {
    return (
      <footer className="bg-black text-white py-10 px-5 md:px-10 border-t border-gray-800">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-16">
          {/* Logo & Tagline skeleton */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <Skeleton width={192} height={64} className="rounded" /> {/* approx w-48 */}
            <Skeleton height={20} width="80%" className="mx-auto md:mx-0" />
            <Skeleton height={20} width="70%" className="mx-auto md:mx-0" />
          </div>

          {/* Payment Methods skeleton */}
          <div className="text-center md:text-left">
            <Skeleton height={28} width={180} className="mb-4 mx-auto md:mx-0" />
            <div className="flex justify-center md:justify-start items-center gap-4 sm:gap-6 flex-wrap">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} width={80} height={80} className="rounded" />
              ))}
            </div>
          </div>

          {/* Social Links skeleton */}
          <div className="text-center md:text-left">
            <Skeleton height={28} width={140} className="mb-4 mx-auto md:mx-0" />
            <div className="flex justify-center md:justify-start items-center gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} circle width={52} height={52} />
              ))}
            </div>
          </div>
        </div>

        {/* Copyright skeleton */}
        <div className="border-t border-gray-700 mt-10 pt-6">
          <Skeleton height={20} width={400} className="mx-auto" />
        </div>
      </footer>
    );
  }

  const footerData = { ...defaultData, ...data };

  return (
    <footer className="bg-black text-white py-10 px-5 md:px-10 border-t border-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-16">
        {/* Logo & Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center md:items-start text-center md:text-left space-y-4"
        >
          <img
            src={`${API_URL}${footerData.logo}`}
            alt="Rajabaji Logo"
            className="w-36 sm:w-44 md:w-48 drop-shadow-2xl"
            onError={(e) => {
              e.target.src = defaultData.logo;
            }}
          />
          <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed">
            {footerData.tagline}
          </p>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center md:text-left"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">Payment method</h3>
          <div className="flex justify-center md:justify-start items-center gap-4 sm:gap-6 flex-wrap">
            {footerData.paymentMethods.map((method, i) => (
              <motion.img
                key={i}
                whileHover={{ scale: 1.1 }}
                src={`${API_URL}${method.image}`}
                alt={method.name}
                className="w-12 sm:w-16 md:w-20 drop-shadow-lg"
                onError={(e) => {
                  e.target.src = defaultData.paymentMethods[i]?.image || "";
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-center md:text-left"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">Follow us</h3>
          <div className="flex justify-center md:justify-start items-center gap-4 sm:gap-6">
            {footerData.socialLinks.map((link, i) => (
              <motion.a
                key={i}
                whileHover={{ scale: 1.25, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                href={link.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                aria-label={link.platform}
              >
                {getIcon(link.platform)}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="border-t border-gray-700 mt-10 pt-6"
      >
        <p className="text-center text-gray-400 text-sm md:text-base font-medium">
          {footerData.copyright}
          {error && (
            <span className="block text-yellow-400 text-xs mt-2">
              Warning: Footer loaded from backup (API failed)
            </span>
          )}
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;