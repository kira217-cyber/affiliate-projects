import { useContext, useState } from "react";
import { AuthContext } from "@/Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

import rulesImage from "../../../../assets/member_card_rules.53f6222a.png";
import { FcRules } from "react-icons/fc";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import iconRed from "../../../../assets/icon-question-red.d2ee0e6e.svg";
import shareIcon from "../../../../assets/shareIcon.svg";
import iconCopy from "../../../../assets/icon-copy.5b4960cd.svg";

import ReferModal from "./OverViewModals/ReferModal";
import RegulationModal from "./OverViewModals/RegulationModal";

const OverviewRules = () => {
  const { language = "en", user } = useContext(AuthContext);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isReferOpen, setIsReferOpen] = useState(false);

  const referralLink = `${import.meta.env.VITE_API_URL_REFERRAL}/?ref=${user?.referralCode || ""}`;

  // ভাষা অনুযায়ী টেক্সট (ডিজাইনের সাথে মিল রেখে)
  const t = {
    en: {
      rules: "Rules",
      myTier: "My Tier",
      highestLevel: "This is the highest level.",
      referFriends: "Refer Friends Now!",
      shareToFriends: "Share to your friends",
      copy: "Copy",
    },
    bn: {
      rules: "নিয়ম",
      myTier: "আমার লেভেল",
      highestLevel: "এটিই সর্বোচ্চ লেভেল।",
      referFriends: "এখনই বন্ধু রেফার করুন!",
      shareToFriends: "শেয়ার করুন",
      copy: "কপি",
    },
  };

  const txt = t[language];

  // কপি ফাংশন – টোস্টও ভাষা অনুযায়ী
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success(
      language === "bn"
        ? "রেফারেল লিংক কপি করা হয়েছে!"
        : "Referral link copied to clipboard!"
    );
  };

  return (
    <div className="py-2 lg:py-0">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Top Card */}
      <div className="relative">
        <img src={rulesImage} alt="" className="w-full rounded-md" />

        {/* Rules Button */}
        <div
          className="flex items-center bg-white/90 px-2 py-1 rounded-full absolute top-2 right-2 cursor-pointer shadow"
          onClick={() => setIsRulesOpen(true)}
        >
          <FcRules className="text-black" />
          <p className="ml-1 text-xs font-bold">{txt.rules}</p>
        </div>

        {/* My Tier Label */}
        <h3 className="absolute text-xs top-2 left-2 font-bold">{txt.myTier}</h3>

        {/* Tier Level */}
        <p className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-2xl">
          L1
        </p>

        {/* Left/Right buttons (desktop only) */}
        <div className="hidden lg:block">
          <span className="absolute bg-[#666] text-white rounded-full p-1 top-1/2 -left-3 -translate-y-1/2 shadow">
            <FaChevronLeft className="w-3 h-3" />
          </span>
          <span className="absolute bg-[#666] text-white rounded-full p-1 top-1/2 right-0 -translate-y-1/2 shadow">
            <FaChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Big Level Box */}
      <div className="flex mt-2 py-8 items-center justify-center bg-[#e6e6ff] rounded-md">
        <p className="font-semibold">{txt.highestLevel}</p>
      </div>

      {/* Refer Friends */}
      <div
        className="flex justify-center items-center gap-2 mt-3 cursor-pointer"
        onClick={() => setIsReferOpen(true)}
      >
        <img src={iconRed} alt="" className="w-5 h-5" />
        <p className="font-bold text-sm">{txt.referFriends}</p>
      </div>

      {/* Share Section */}
      <div className="flex flex-col items-center justify-center py-6 bg-[#f2f2ff] px-2 rounded-md mt-3">
        <h3 className="text-[#382987] font-semibold mb-2">
          {txt.shareToFriends}
        </h3>

        <p className="bg-white px-2 py-1 rounded-full border text-[13px] shadow">
          https:{referralLink}
        </p>

        {/* Share Buttons */}
        <div className="flex gap-2 mt-4">
          <div className="animate-pulse bg-[#ddd9ff] flex gap-2 items-center px-3 py-2 rounded-md shadow cursor-pointer">
            <img src={shareIcon} alt="" className="w-4 h-4" />
            <p className="text-xs font-semibold">{txt.shareToFriends}</p>
          </div>

          <button
            onClick={handleCopy}
            className="bg-[#428dfc] flex gap-2 items-center px-3 py-2 rounded-md text-white shadow cursor-pointer"
          >
            <img src={iconCopy} alt="" className="w-4 h-4" />
            <p className="text-xs font-semibold">{txt.copy}</p>
          </button>
        </div>
      </div>

      {/* Modals */}
      {isRulesOpen && (
        <RegulationModal setIsRulesOpen={setIsRulesOpen} language={language} />
      )}
      {isReferOpen && <ReferModal setIsReferOpen={setIsReferOpen} />}
    </div>
  );
};

export default OverviewRules;