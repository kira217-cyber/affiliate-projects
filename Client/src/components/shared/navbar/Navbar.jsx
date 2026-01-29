// src/components/Navbar.jsx
import Modal from "@/components/home/modal/Modal";
import { useState, useEffect, useContext } from "react";
import { RiLuggageDepositFill, RiMenuUnfoldFill } from "react-icons/ri";
import Login from "../login/Login";
import RegistrationModal from "../login/RegistrationModal";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { BiMoneyWithdraw } from "react-icons/bi";
import { FaCaretDown } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { FaBangladeshiTakaSign, FaIdCardClip } from "react-icons/fa6";
import { GiDiceSixFacesSix } from "react-icons/gi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { BiSolidMessageRounded } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { MdOutlineInsertChart } from "react-icons/md";
import PersonalCenterModal from "@/pages/PersonalCenterModal";
import logo from "../../../assets/headerLOGO.png"; // fallback logo
import PromoBanner from "@/components/shared/appBanner/AppBanner";
import { AuthContext } from "@/Context/AuthContext";

const Navbar = ({ onMenuClick, isSidebarOpen }) => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [referralFromUrl, setReferralFromUrl] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    user,
    balance,
    logout,
    isBalanceLoading,
    refreshBalance,
    adminHomeControl, // ← Now available from context
    language,
    setIsInformationModalOpen,
    isInformationModalOpen,
  } = useContext(AuthContext);

  const [isHovering, setIsHovering] = useState(false);

  console.log("Admin Home Control in Navbar:", adminHomeControl);

  // Referral from URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralFromUrl(ref);
      setShowRegisterModal(true);
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  // Translation Map
  const t = {
    bn: {
      "My Account": "আমার অ্যাকাউন্ট",
      "Betting Record": "বাজির রেকর্ড",
      "Account Record": "লাভ ও ক্ষতি",
      "Internal Message": "মেসেজ",
      Deposit: "ডিপজিট",
      Withdrawal: "উত্তোলন",
      "Customer Service": "গ্রাহক সেবা",
      "Sign out": "লগ আউট",
      Login: "লগইন",
      Register: "রেজিস্টার",
    },
    en: {
      "My Account": "My Account",
      "Betting Record": "Betting Record",
      "Account Record": "Account Record",
      "Internal Message": "Internal Message",
      Deposit: "Deposit",
      Withdrawal: "Withdrawal",
      "Customer Service": "Customer Service",
      "Sign out": "Sign out",
      Login: "Login",
      Register: "Register",
    },
  };

  const translate = (key) => t[language][key] || key;

  const menuItems = [
    {
      id: "tab1",
      label: "My Account",
      icon: <FiUser />,
      link: "/information#tab1",
    },
    {
      id: "tab4",
      label: "Betting Record",
      icon: <GiDiceSixFacesSix />,
      link: "/information#tab4",
    },
    {
      id: "tab9",
      label: "Account Record",
      icon: <MdOutlineInsertChart />,
      link: "/information#tab9",
    },
    {
      id: "tab9",
      label: "Internal Message",
      icon: <BiSolidMessageRounded />,
      link: "/information#tab9",
    },
    {
      id: "tab2",
      label: "Deposit",
      icon: <RiLuggageDepositFill />,
      link: "/information#tab2",
    },
    {
      id: "tab3",
      label: "Withdrawal",
      icon: <BiMoneyWithdraw />,
      link: "/information#tab3",
    },
    {
      id: "tab1",
      label: "Customer Service",
      icon: <MdOutlineAccountBalanceWallet />,
      link: "https://tawk.to/chat/68f68ce6a86dab1951b9ac2e/1j81hcq00",
      target: "_blank",
    },
    { id: "tab1", label: "Sign out", icon: <MdLogout />, onClick: logout },
  ];

  const actions = [
    {
      id: "tab2",
      label: "Deposit",
      icon: <RiLuggageDepositFill />,
      link: "/information#tab2",
    },
    {
      id: "tab3",
      label: "Withdrawal",
      icon: <BiMoneyWithdraw size={20} />,
      link: "/information#tab3",
    },
  ];

  return (
    <>
      <div className="bg-[#00352f] fixed top-0 left-0 w-full z-50 shadow-md">
        <PromoBanner />
        <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-2.5 gap-2 border-b-2 border-[#075a51]">
          {/* Left: Menu + Logo (Dynamic from adminHomeControl) */}
          <div className="flex items-center gap-2 sm:gap-5 md:gap-8 text-lg">
            <button
              className="p-2 text-white outline-none"
              onClick={onMenuClick}
            >
              <RiMenuUnfoldFill
                className={`text-xl sm:text-2xl transform transition-transform duration-300 ${
                  isSidebarOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <Link to="/">
              <img
                className="w-20 sm:w-20 md:w-30 xl:w-40 2xl:w-40"
                src={
                  adminHomeControl?.websiteLogoWhite
                    ? `${import.meta.env.VITE_BACKEND_API}uploads/${adminHomeControl.websiteLogoWhite}`
                    : logo // fallback to your static import
                }
                alt="Website Logo"
              />
            </Link>
          </div>

          {/* Right: Auth Buttons or User Info */}
          <div className="relative flex gap-2 lg:gap-4 items-center font-bold text-sm lg:text-lg">
            {user ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative z-50">
                  <div
                    className="flex items-center gap-1.5 bg-yellow-400 p-1 pr-2 rounded-xl cursor-pointer"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <img
                      src={
                        user.profileImage ||
                        "https://images.185949949.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
                      }
                      className="lg:w-8 lg:h-8 w-6 h-6 rounded-full"
                      alt="User"
                    />
                    <FaCaretDown className="text-black" />
                  </div>

                  {isHovering && (
                    <div
                      className="absolute left-0 p-1 w-full lg:w-52 min-w-[150px] bg-[#00303b] text-white rounded-xl border border-[#00b4c0] shadow-xl"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      {menuItems.map((item, index) => (
                        <Link
                          to={item.link || "#"}
                          key={index}
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#00464f] text-xs sm:text-sm md:text-base lg:text-lg border-b border-[#00464f] last:border-b-0 transition-colors rounded-lg"
                          onClick={(e) => {
                            if (item.onClick) {
                              e.preventDefault();
                              item.onClick();
                            } else {
                              setIsInformationModalOpen(true);
                            }
                          }}
                          target={item.target || "_self"}
                        >
                          <span className="text-base">{item.icon}</span>
                          <span style={{ fontSize: "10px" }}>
                            {translate(item.label)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Balance */}
                <div className="flex gap-2 items-center px-4 py-1 sm:py-1.5 text-[#23ffc8] bg-[#002632] border border-[#006165] rounded-md sm:rounded-xl">
                  <FaIdCardClip className="text-white" />
                  <div className="flex gap-2 items-center">
                    <div className="flex gap-0.5 items-center border-b border-[#002632] hover:border-[#23ffc8] duration-300">
                      <FaBangladeshiTakaSign size={14} />
                      {isBalanceLoading ? (
                        <div className="h-4 w-12 bg-gray-700 rounded animate-pulse"></div>
                      ) : (
                        <span>{balance || 0}</span>
                      )}
                    </div>
                    <TfiReload
                      size={14}
                      onClick={refreshBalance}
                      className={`cursor-pointer transition-transform ${
                        isBalanceLoading ? "animate-spin" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Deposit / Withdraw (Desktop) */}
                <div className="md:flex gap-2 lg:gap-3 items-center hidden">
                  {actions.map((action, index) => (
                    <Link to={action.link} key={index}>
                      <div
                        onClick={() => setIsInformationModalOpen(true)}
                        className="flex gap-1.5 text-[#b64100] bg-[#ffd900] hover:bg-[#d2b92c] items-center px-3 py-1 sm:py-1.5 rounded-md sm:rounded-xl duration-300"
                      >
                        {action.icon}
                        {translate(action.label)}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              /* ========== LOGIN / REGISTER BUTTONS (MOBILE & DESKTOP) ========== */
              <div className="flex gap-2">
                {/* LOGIN BUTTON */}
                <div
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center justify-center cursor-pointer 
                    min-w-[80px] w-[80px] h-8 px-2 
                    text-sm font-bold text-yellow-400 
                    bg-gradient-to-b from-[#0f727c] to-[#004e56] 
                    border border-[#11aa7d] rounded-lg 
                    shadow-md hover:shadow-lg transition-shadow 
                    md:min-w-[100px] md:w-auto md:h-10 md:px-3 md:text-base"
                >
                  {translate("Login")}
                </div>

                {/* REGISTER BUTTON */}
                <div
                  onClick={() => setShowRegisterModal(true)}
                  className="flex items-center justify-center cursor-pointer 
                    min-w-[80px] w-[80px] h-8 px-2 
                    text-sm font-bold text-orange-600 
                    bg-gradient-to-b from-[#ffe600] to-[#ffb800] 
                    border border-[#fff2a6] rounded-xl 
                    shadow-inner shadow-[#fff2a6] hover:shadow-xl transition-shadow 
                    md:min-w-[100px] md:w-auto md:h-10 md:px-3 md:text-base"
                >
                  {translate("Register")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Login
          onClose={() => setShowLoginModal(false)}
          onRegisterClick={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      </Modal>

      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      >
        <RegistrationModal
          onClose={() => setShowRegisterModal(false)}
          openLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
          initialReferral={referralFromUrl}
        />
      </Modal>

      <PersonalCenterModal
        isOpen={isInformationModalOpen}
        onClose={() => setIsInformationModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
