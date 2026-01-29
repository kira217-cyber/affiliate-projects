import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";
import { FaRegEdit } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";

import bgImage from "../../../assets/rewardimage.png";
import userImage from "../../../assets/0.png";
import vipImage from "../../../assets/VIP Image.png";
import smallDeviceImage from "../../../assets/mall-bg.c29e722c.png";
import Balance from "./Balance";

const RewardBalance = () => {
  const { language = "en", user, balance } = useContext(AuthContext);

  // ভাষা অনুযায়ী টেক্সট
  const t = {
    en: {
      username: "Username",
      availableBalance: "Available Balance",
      vipLevel: "VIP Level 1",
      benefits: "Benefits",
    },
    bn: {
      username: "ইউজারনেম",
      availableBalance: "উপলব্ধ ব্যালেন্স",
      vipLevel: "ভিআইপি লেভেল ১",
      benefits: "সুবিধা",
    },
  };

  const txt = t[language];

  return (
    <div className="lg:py-2 relative">
      {/* Mobile Background */}
      <div>
        <img
          src={smallDeviceImage}
          alt="Mobile Background"
          className="lg:hidden w-full h-[200px] object-cover"
        />
      </div>

      {/* Main Card */}
      <div className="absolute rounded-md lg:bottom-0 -bottom-4 left-1/2 lg:left-0 lg:-translate-x-0 -translate-x-1/2 w-[80%] lg:w-auto text-center lg:static">
        <div
          className="bg-cover bg-vipMobileBg lg:bg-none bg-center p-4 rounded-lg items-center relative shadow-2xl"
          style={
            window.innerWidth >= 1024
              ? { backgroundImage: `url(${bgImage})` }
              : {}
          }
        >
          <div>
            <div className="flex gap-2 items-start">
              <img
                src={userImage}
                alt="User Avatar"
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              />

              <div className="flex flex-col lg:leading-normal leading-tight flex-1">
                {/* Username & Edit */}
                <div className="flex gap-2 items-center text-black font-semibold lg:text-white bg-white/80 lg:bg-transparent px-2 py-1 rounded">
                  <p className="font-medium">{user?.username}</p>
                  <FaRegEdit className="text-sm cursor-pointer hover:text-textRed" />
                </div>

                {/* Username Label + Copy */}
                <div className="flex lg:gap-2 items-center text-[#25252599] lg:text-white mt-1">
                  <p className="lg:text-base hidden lg:block text-xs font-medium">
                    {txt.username}:
                  </p>
                  <div className="flex gap-2 items-center text-[10px] lg:text-xs rounded-full p-1 lg:p-2 lg:bg-[#919ba6] bg-gray-200">
                    <p className="font-medium">{user?.username}</p>
                    <FaRegCopy className="cursor-pointer hover:text-textRed" />
                  </div>
                </div>

                <Balance />
              </div>
            </div>

            {/* Available Balance - Desktop Only */}
            <div className="lg:flex hidden flex-col gap-2 items-center text-white mt-4">
              <p className="text-lg font-medium">{txt.availableBalance}</p>
              <p className="font-bold text-5xl lg:text-6xl">
                <strong>{balance}</strong>
              </p>
            </div>

            {/* VIP Level - Mobile Only */}
            <div className="py-4 lg:hidden">
              <div className="flex justify-between text-[#25252599] text-xs">
                <div className="flex items-center gap-2">
                  <img src={vipImage} alt="VIP" className="w-[20%]" />
                  <p>{txt.vipLevel}</p>
                </div>
                <div>
                  <p>{txt.benefits}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 h-px bg-[#25252599]"></div>
                <p className="text-sm text-[#25252599]">1/2</p>
                <div className="flex-1 h-px bg-[#25252599]"></div>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <span className="absolute right-6 top-2 lg:top-4">
            <TfiReload className="text-2xl font-bold text-white bg-[rgba(0,0,0,0.3)] p-2 rounded-full cursor-pointer hover:bg-textRed hover:text-white transition duration-300" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default RewardBalance;
