import React, { useState, useEffect, useContext } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/Context/AuthContext";

const PromotionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Fetch :id from URL
  const { language = "en" } = useContext(AuthContext); // Language from AuthContext

  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch promo data by ID
  useEffect(() => {
    const fetchPromo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/promotions/${id}`);
        setPromo(res.data);
      } catch (err) {
        setError("Failed to load promotion details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen text-white px-4 py-6 flex justify-center items-center">
        <p className="text-xl text-[#FFB800]">Loading...</p>
      </div>
    );
  }

  if (error || !promo) {
    return (
      <div className="min-h-screen text-white px-4 py-6 flex justify-center items-center">
        <p className="text-xl text-red-500">{error || "Promotion not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-4 py-6 flex justify-center">
      <div className="w-full max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lg font-semibold text-[#25FFD2] mb-4 transition"
        >
          <IoArrowBackCircleOutline className="text-3xl" />
          {language === "bn" ? "ফিরে যান" : "BACK"}
        </button>

        {/* Banner Image */}
        <div className="w-full bg-[#005045] p-6 rounded-2xl shadow-lg border border-green-900">
          <img
            src={promo.image} // Dynamic image from API
            alt={language === "bn" ? promo.title_bn : promo.title_en}
            className="rounded-xl w-full h-[400px] object-cover"
          />
          {/* Title Section */}
          <div className="mt-6">
            <h1 className="text-xl md:text-2xl font-bold text-[#FFB800]">
              {language === "bn" ? promo.title_bn : promo.title_en}
            </h1>
            <p className="mt-2">
              {language === "bn" ? promo.description_bn : promo.description_en}
            </p>
          </div>
          <div className="mt-6">
            <strong className="text-[#FFB800]">
              {language === "bn" ? promo.footer_bn : promo.footer_en}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetails;