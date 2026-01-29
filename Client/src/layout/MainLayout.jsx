import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/Context/AuthContext";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/shared/navbar/Navbar";
import Footer from "../components/shared/footer/Footer";
import { TbUsersGroup } from "react-icons/tb";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineLocalPlay } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import SidebarMenu from "@/components/home/menu/SidebarMenu";
import { useDispatch, useSelector } from "react-redux";
import { checkTokenThunk } from "@/features/auth/authSlice";
import bgIMG from "../assets/main_bg.png";
import b__2 from "../assets/22221.png";
import SocialLinks from "@/components/shared/SocialLinks/SocialLinks";
import PromotionModal from "@/components/home/Promotions/PromotionModal";

// Language translations
const translations = {
  en: {
    Home: "Home",
    Promotion: "Promotion",
    Invite: "Invite",
    Reward: "Reward",
    Member: "Member",
  },
  bn: {
    Home: "হোম",
    Promotion: "প্রমোশন",
    Invite: "আমন্ত্রণ",
    Reward: "পুরস্কার",
    Member: "সদস্য",
  },
};

const navItems = [
  {
    id: 1,
    to: "/",
    icon: <IoHomeOutline className="w-6 h-6" />,
    label: "Home",
  },
  {
    id: 2,
    to: "/promotions",
    icon: <MdOutlineLocalPlay className="w-6 h-6" />,
    label: "Promotion",
  },
  {
    id: 3,
    to: "/",
    icon: <TbUsersGroup className="w-6 h-6" />,
    label: "Invite",
  },
  {
    id: 4,
    to: "",
    icon: <TbUsersGroup className="w-6 h-6" />,
    label: "Reward",
  },
  { id: 5, to: "", icon: <CiUser className="w-6 h-6" />, label: "Member" },
];

const MainLayout = () => {
  const { language, adminHomeControl } = useContext(AuthContext); // Now using adminHomeControl
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [showLogo, setShowLogo] = useState(false);

  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.auth);

  // Helper for translation
  const t = (key) => translations[language]?.[key] || key;

  // Check token on mount
  useEffect(() => {
    if (!isAuth) {
      dispatch(checkTokenThunk());
    }
  }, [dispatch, isAuth]);

  // Logo display logic
  useEffect(() => {
    const lastDisplay = localStorage.getItem("lastLogoDisplay");
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;
    if (!lastDisplay || now - parseInt(lastDisplay) >= fifteenMinutes) {
      setShowLogo(true);
      const hideTimeout = setTimeout(() => {
        setShowLogo(false);
        localStorage.setItem("lastLogoDisplay", now.toString());
      }, 4000);
      return () => clearTimeout(hideTimeout);
    }
  }, []);

  // Resize listener for sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  // ── NEW: Set dynamic favicon and title from adminHomeControl ──
  useEffect(() => {
    if (adminHomeControl) {
      // Set page title
      document.title = adminHomeControl.websiteTitle || "Jaya999";

      // Set favicon
      const link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/png";
      link.rel = "icon";
      link.href = adminHomeControl?.favicon
        ? `${import.meta.env.VITE_BACKEND_API}uploads/${adminHomeControl.favicon}`
        : "/favicon.png"; // fallback if no favicon in DB
      document.head.appendChild(link);
    }
  }, [adminHomeControl]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className="bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${bgIMG})` }}
    >
      <PromotionModal />

      {/* Logo Overlay */}
      {showLogo && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          style={{ zIndex: -99999 }}
        >
          <img
            src={b__2}
            alt="Logo"
            className="w-40 h-40 object-contain animate-pulse"
          />
        </div>
      )}

      {/* Navbar */}
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={sidebarOpen} />

      {/* Blur overlay when mobile sidebar open */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        {sidebarOpen && window.innerWidth > 1024 && (
          <div
            className={`lg:block hidden pt-[90px] px-4 pb-32 min-w-[200px] h-screen sticky top-0 overflow-y-auto hide-scrollbar bg-[#044243] ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <SidebarMenu />
          </div>
        )}

        {/* Mobile Sidebar */}
        <div
          className={`
            fixed z-50 pt-4 px-4 pb-32 w-60 h-screen overflow-y-auto hide-scrollbar bg-[#044243]
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden
          `}
        >
          <SidebarMenu />
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-14 sm:pt-[70px] lg:pt-20 lg:w-[83px] xl:w-[86%] w-full">
          <Outlet />
          <Footer />
          <SocialLinks />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          background: "linear-gradient(180deg, #005a5a, #003e3e 50%, #002c2c)",
          boxShadow: "0 -4px 10px rgba(8, 186, 183, 0.6)",
        }}
        className="grid grid-cols-5 sticky bottom-1 w-full lg:hidden z-30 text-white border-t-2 border-[#26e7e4] rounded-full"
      >
        {navItems.map((item) => (
          <Link key={item.id} to={item.to}>
            <div className="w-full py-1 flex flex-col items-center justify-center text-sm gap-0.5">
              {item.icon}
              <p>{t(item.label)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainLayout;