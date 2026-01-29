// src/components/PromotionModal.jsx (Final Updated Version)
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { X } from "lucide-react";
import { AuthContext } from "@/Context/AuthContext";
import "swiper/css";
import "swiper/css/navigation";

const PromotionModal = () => {
  const { language = "en" } = useContext(AuthContext);
  const [promotions, setPromotions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  const texts = {
    en: { announcement: "Announcement", go: "Go" },
    bn: { announcement: "ঘোষণা", go: "যান" },
  };
  const t = texts[language];

  // Check mobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show modal only once
  useEffect(() => {
    const hasSeen = localStorage.getItem("promotionModalSeen");
    if (!hasSeen) {
      fetchPromotions();
    }
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/promotions`,
      );
      const latest = res.data.slice(0, 5); // latest 5 promotions
      if (latest.length > 0) {
        setPromotions(latest);
        setShowModal(true);
        localStorage.setItem("promotionModalSeen", "true");
      }
    } catch (err) {
      console.error("Failed to load promotions:", err);
    }
  };

  if (!showModal || promotions.length === 0) return null;

  const currentPromo = promotions[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? promotions.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === promotions.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = () => {
    setShowModal(false);
    navigate("/promotions");
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 md:p-6"
        >
          {/* Modal Wrapper – relative positioning for header & close */}
          <div className="relative w-full max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
            {/* ── Header Image (outside modal container) ── */}
            {isMobile && (
              <img
                className="absolute -top-0 z-10"
                src="https://i.ibb.co.com/p65CFhp8/popup-header.webp"
                alt="Popup Header"
              />
            )}


            {/* ── Close Button (outside modal container) ── */}
            <button
              onClick={() => setShowModal(false)}
              className={`
                absolute top-[-3rem] right-4 md:top-[-3.5rem] md:right-6
                text-yellow-400 text-3xl md:text-4xl z-50
                hover:scale-125 hover:text-yellow-300 transition-transform
              `}
            >
              <X />
            </button>

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.85, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`
                relative 
                w-full 
                bg-gradient-to-b from-teal-500 to-emerald-600
                rounded-md md:rounded-md shadow-2xl overflow-hidden
                border-2 border-teal-700/70 max-h-[85vh] md:max-h-[90vh] overflow-y-auto
                ${isMobile ? "mt-16" : ""} /* Extra top margin on mobile for header image */
              `}
            >
              {isMobile ? (
                /* ── Mobile Design ── */
                <div className="p-4 md:p-6 relative">
                
                  {/* Swiper Slider */}
                  <Swiper
                    modules={[Navigation]}
                    loop={promotions.length > 1}
                    navigation={{
                      prevEl: ".custom-prev",
                      nextEl: ".custom-next",
                    }}
                    className="rounded-md overflow-hidden mt-8"
                  >
                    {promotions.map((promo) => (
                      <SwiperSlide key={promo._id}>
                        <div
                          className="cursor-pointer"
                          onClick={handleImageClick}
                        >
                          <img
                            src={`${promo.image}`}
                            alt={promo.title_en || "Promotion"}
                            className="w-full h-[160px] object-cover rounded-sm"
                            onError={(e) => {
                              e.target.src = "/fallback-promo.jpg";
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Prev/Next Buttons */}
                  {promotions.length > 1 && (
                    <div className="flex justify-between items-center gap-3 mt-5">
                      <button className="custom-prev flex-1 py-3 px-6 text-lg font-bold bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl transition">
                        Previous
                      </button>
                      <button className="custom-next flex-1 py-3 px-6 text-lg font-bold bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl transition">
                        Next
                      </button>
                    </div>
                  )}

               
                </div>
              ) : (
                /* ── Desktop Design (unchanged from your original) ── */
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 p-4 md:p-8 lg:p-10">
                  {/* Left: Titles List */}
                  <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                    <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-6 drop-shadow-lg text-center lg:text-left">
                      {t.announcement}
                    </h3>
                    <div className="space-y-3 max-h-80 lg:max-h-none overflow-y-auto pr-2">
                      {promotions.map((promo, index) => (
                        <motion.div
                          key={promo._id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setCurrentIndex(index)}
                          className={`
                            flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all text-sm md:text-base
                            ${
                              index === currentIndex
                                ? "bg-yellow-500/90 text-[#1a0f00] shadow-lg border border-yellow-400"
                                : "bg-teal-950/70 text-white hover:bg-teal-800/60"
                            }
                          `}
                        >
                          <span className="text-2xl flex-shrink-0">🎉</span>
                          <span className="font-semibold truncate">
                            {language === "bn"
                              ? promo.title_bn
                              : promo.title_en}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Promotion Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="bg-teal-950/70 rounded-md p-6 lg:p-8 flex-1 border border-teal-700/50 shadow-inner">
                      {/* Title */}
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-teal-300 mb-6 text-center lg:text-left drop-shadow-md">
                        {language === "bn"
                          ? currentPromo.title_bn
                          : currentPromo.title_en}
                      </h1>

                      {/* Big Image – Clickable */}
                      <div
                        className="relative rounded-md overflow-hidden border-4 border-yellow-600/70 shadow-2xl cursor-pointer mb-6"
                        onClick={handleImageClick}
                        role="button"
                        tabIndex={0}
                      >
                        <img
                          src={`${currentPromo.image}`}
                          alt={currentPromo.title_en || "Promotion"}
                          className="
                            w-full h-52
                            object-cover transition-transform duration-700
                            hover:scale-105
                          "
                          onError={(e) => {
                            e.target.src = "/fallback-promo.jpg";
                          }}
                        />
                      </div>

                      {/* Go Button */}
                      <div className="mt-8 text-center">
                        <Link to="/promotions">
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowModal(false)}
                            className="
                              py-4 px-10 md:px-18 text-xl md:text-2xl font-bold
                              bg-gradient-to-r from-yellow-500 to-orange-600
                              text-black rounded-full shadow-2xl
                              hover:from-yellow-400 hover:to-orange-500
                              transition-all duration-300
                            "
                          >
                            {t.go}
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromotionModal;
