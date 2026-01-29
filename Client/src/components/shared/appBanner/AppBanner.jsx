import { useState, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import logo from "../../../assets/logoAPP.png";
import { AuthContext } from "@/Context/AuthContext"; // Adjust path if needed

const PromoBanner = () => {
  const [showBanner, setShowBanner] = useState(true);
  const { language, user } = useContext(AuthContext); // Get language and user from AuthContext

  // Translation
  const t = {
    en: {
      appBonus: "APP Download",
      download: "Download",
    },
    bn: {
      appBonus: "অ্যাপ ডাউনলোড",
      download: "ডাউনলোড",
    },
  };

  const translate = (key) => t[language]?.[key] || t.en[key];

  if (!showBanner || user) return null;

  return (
    <div className="md:hidden bg-[#003a3a] text-white flex items-center justify-between p-2 rounded shadow-md relative overflow-hidden">
      {/* Left: Logo + Text */}
      <div className="flex items-center gap-4">
        <img
          className="w-[50px] h-auto md:max-w-[10%] md:h-auto"
          src={logo}
          alt="App Logo"
        />
        <div>
          <h2 className="text-orange-400 font-bold text-[12px]">
            {translate("appBonus")} 
          </h2>
          <div className="flex gap-1 mt-1">
            {[...Array(4)].map((_, i) => (
              <span key={i}>⭐</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Download Button + Close */}
      <div className="flex items-center gap-2">
        <a
          href="/CP66.apk"
          download
          className="bg-yellow-400 hover:bg-yellow-500 text-red-700 font-bold px-2 py-1 rounded-lg shadow-md transition-colors"
        >
          {translate("download")}
        </a>
        <button
          className="text-white hover:text-red-400 text-sm transition-colors"
          onClick={() => setShowBanner(false)}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
