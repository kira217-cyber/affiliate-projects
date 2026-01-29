// components/Slider.jsx
import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true); // নতুন state loading track করার জন্য

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5004";

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/sliders`)
      .then((res) => {
        setSlides(res.data);
        setLoading(false);
      })
      .catch(() => {
        console.log("Failed to load slider");
        setLoading(false); // error হলেও loading শেষ করা
      });

    // auto-slide interval (যদি slides লোড না হয় তাহলে interval চালু হবে না)
    const auto = setInterval(() => {
      if (slides.length > 0) {
        setFade(false);
        setTimeout(() => {
          setCurrent((prev) => (prev + 1) % slides.length);
          setFade(true);
        }, 500);
      }
    }, 5000);

    return () => clearInterval(auto);
  }, [slides.length]);

  const next = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setFade(true);
    }, 500);
  };

  const prev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setFade(true);
    }, 500);
  };

  // Loading state → Skeleton দেখাবে (একটা sample slide-এর shape অনুসরণ করে)
  if (loading) {
    return (
      <div className="relative w-full bg-black text-white overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-20">
          {/* Image skeleton */}
          <div className="flex-1 flex justify-center">
            <Skeleton
              width="100%"
              height={384} // h-96 = 384px
              className="max-w-md rounded-lg"
            />
          </div>

          {/* Text + buttons skeleton */}
          <div className="flex-1 text-center md:text-left mt-6 md:mt-0 space-y-6">
            <Skeleton height={48} width="70%" className="mx-auto md:mx-0" /> {/* title */}
            <Skeleton height={24} width="90%" className="mx-auto md:mx-0" /> {/* subtitle */}
            <Skeleton height={24} width="60%" className="mx-auto md:mx-0" /> {/* extra line if needed */}
            <div className="flex justify-center md:justify-start gap-4 mt-6">
              <Skeleton height={40} width={140} borderRadius={999} />
              <Skeleton height={40} width={140} borderRadius={999} />
            </div>
          </div>
        </div>

        {/* Navigation buttons skeleton (optional – দেখতে ভালো লাগে) */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2">
          <Skeleton circle width={44} height={44} />
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2">
          <Skeleton circle width={44} height={44} />
        </div>

        {/* Dots skeleton */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} circle width={12} height={12} />
          ))}
        </div>
      </div>
    );
  }

  // No slides after loading (fallback)
  if (slides.length === 0) {
    return <div className="text-white text-center py-20">No slides available</div>;
  }

  const s = slides[current];

  return (
    <div className="relative w-full bg-black text-white overflow-hidden">
      <div
        className={`flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-20 transition-opacity duration-700 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex-1 flex justify-center">
          <img
            src={`${API_URL}${s.image}`}
            alt={s.title}
            className="w-full max-w-md h-96 object-contain drop-shadow-[0_0_25px_#99FF47]"
          />
        </div>
        <div className="flex-1 text-center md:text-left mt-6 md:mt-0 space-y-4">
          <h1
            className={`text-3xl md:${s.titleSize} font-bold`}
            style={{ color: s.titleColor }}
          >
            {s.title}
          </h1>
          <p
            className={`text-lg md:${s.subtitleSize}`}
            style={{ color: s.subtitleColor }}
          >
            {s.subtitle}
          </p>
          <div className="flex justify-center md:justify-start gap-4 mt-6">
            <a
              href={s.button1Link}
              className="px-2 md:px-6 py-2 rounded-full font-semibold transition"
              style={{
                backgroundColor: s.button1Color,
                color: s.button1TextColor,
              }}
            >
              {s.button1Text}
            </a>
            <a
              href={s.button2Link}
              className="px-2 md:px-6 py-2 rounded-full font-semibold transition"
              style={{
                backgroundColor: s.button2Color,
                color: s.button2TextColor,
              }}
            >
              {s.button2Text}
            </a>
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute cursor-pointer left-5 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full"
      >
        <FiChevronLeft size={28} />
      </button>
      <button
        onClick={next}
        className="absolute cursor-pointer right-5 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full"
      >
        <FiChevronRight size={28} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              current === i ? "bg-primary" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;