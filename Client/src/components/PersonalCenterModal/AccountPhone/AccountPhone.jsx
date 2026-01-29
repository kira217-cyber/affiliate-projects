// import bgImage from "../../../assets/rewardimage.png";
import userImage from "../../../assets/0.png";
import {
  FaGift,
  FaWallet,
  FaCreditCard,
  FaUser,
  FaLock,
  FaChartLine,
  FaBell,
  FaEnvelope,
  FaQuestion,
  FaCog,
  FaStar,
  FaCoins,
  FaTrophy,
  FaCalendarCheck,
} from "react-icons/fa";

import { FaRegEdit } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import vipImage from "../../../assets/VIP Image.png";
import smallDeviceImage from "../../../assets/mall-bg.c29e722c.png";
import { Link } from "react-router-dom";
import { LanguageContext } from "../../../Context/LanguageContext";
import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";
// import memberInfoBg from "../../../assets/member-info-bg.f44b2894.png";

const AccountPhone = () => {
  const { language } = useContext(AuthContext);
  const items = [
    {
      name: language === "bn" ? "ডিপোজিট" : "Deposit",
      link: "/information#tab2",
    },
    {
      name: language === "bn" ? "উইথড্র" : "Withdraw",
      link: "/information#tab3",
    },
    {
      name: language === "bn" ? "আমার কার্ড" : "My Card",
      link: "/information#mycard",
    },
  ];

  const subItems = [
    {
      label: language === "bn" ? "রিওয়ার্ড সেন্টার" : "Reward Center",
      link: "information#tab7",
      icon: <FaGift />,
    },
    {
      label: language === "bn" ? "বেটিং রেকর্ড" : "Betting Record",
      link: "information#tab4",
      icon: <FaWallet />,
    },
    {
      label: language === "bn" ? "লাভ ও ক্ষতি" : "Profit & Loss",
      link: "information#tab6",
      icon: <FaCreditCard />,
    },
    {
      label: language === "bn" ? "ডিপোজিট রেকর্ড" : "Deposit Record",
      link: "information#tab2",
      icon: <FaUser />,
    },
    {
      label: language === "bn" ? "উইথড্র রেকর্ড" : "Withdrawal Record",
      link: "information#tab3",
      icon: <FaLock />,
    },
    {
      label: language === "bn" ? "অ্যাকাউন্ট রেকর্ড" : "Account Record",
      link: "information#tab5",
      icon: <FaChartLine />,
    },
    {
      label: language === "bn" ? "আমার অ্যাকাউন্ট" : "My Account",
      link: "information#tab1",
      icon: <FaBell />,
    },
    {
      label: language === "bn" ? "সিকিউরিটি সেন্টার" : "Security Center",
      link: "information#tab7",
      icon: <FaEnvelope />,
    },
    {
      label: language === "bn" ? "বন্ধুদের ইনভাইট করুন" : "Invite Friends",
      link: "information#tab8",
      icon: <FaQuestion />,
    },
    {
      label: language === "bn" ? "ম্যানুয়াল রিবেট" : "Manual Rebate",
      link: "information#tab10",
      icon: <FaCog />,
    },
    {
      label: language === "bn" ? "ইন্টার্নাল মেসেজ" : "Internal Message 2",
      link: "information#tab9",
      icon: <FaStar />,
    },
    {
      label: language === "bn" ? "সাজেশন" : "Suggestion",
      link: "information#tab7",
      icon: <FaCoins />,
    },
    {
      label: language === "bn" ? "অ্যাপ ডাউনলোড করুন" : "Download App",
      link: "information#tab7",
      icon: <FaTrophy />,
    },
    {
      label: language === "bn" ? "কাস্টমার সার্ভিস" : "Customer Service",
      link: "information#tab7",
      icon: <FaCalendarCheck />,
    },
  ];

  return (
    <div className="overflow-y-auto h-[500px] custom-scrollbar-hidden  pb-10">
      <div className=" relative ">
        <div>
          <img
            src={smallDeviceImage}
            alt=""
            className="lg:hidden w-full h-[200px]  "
          />
        </div>
        <div className="absolute rounded-md lg:bottom-0 -bottom-4 left-1/2 lg:left-0  lg:-translate-x-0  -translate-x-1/2 w-[80%] lg:w-auto text-center  lg:static">
          <div className="bg-cover   bg-vipMobileBg   bg-center p-4 rounded-lg   items-center relative">
            <div className="flex items-center gap-2 ">
              <img
                src={userImage}
                alt="User"
                className="w-16 h-16 rounded-full"
              />
              <div className="flex flex-col lg:leading-normal leading-tight">
                <div className="flex gap-1 items-center rounded-full p-1 bg-phoneVIP mx-auto text-black">
                  <img src={vipImage} alt="" className="w-[20%]" />
                  <p className="text-xs">VIP Level 1</p>
                </div>
                {/* Username & Edit */}

                <div className="flex gap-2  items-center text-black font-semibold  lg:text-black bg-opacity-80 px-2 rounded">
                  <p className="font-medium">rohankh</p>
                  <FaRegEdit />
                </div>
                <div className="lg:flex lg:gap-2 lg:leading-normal leading-tight  items-center  px-2 rounded text-[#25252599]  lg:text-black">
                  <p className="lg:text-base hidden lg:block text-xs">
                    Username:
                  </p>
                  <div className="flex gap-2  items-center text-[10px] lg:text-xs rounded-full p-1 lg:p-2 lg:bg-[#919ba6]">
                    <p className="font-medium">rohankh</p>
                    <FaRegCopy />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="py-2 pr-1  ">
                ৳ <strong> 0.00 </strong>
              </span>
            </div>
            <div className="flex gap-2 text-black">
              {items.map((item, index) => (
                <Link to={item.link} key={index}>
                  <div>
                    <p className="bg-phoneVIP text-xs rounded-full p-1 px-2">
                      {item.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="grid grid-cols-4 gap-4 text-center text-black">
          {subItems.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className="flex flex-col items-center hover:text-yellow-400 transition"
            >
              <div className=" text-[#fff2db] bg-[#ffd49a] rounded-full p-2">
                {item.icon}
              </div>
              <p className="text-xs mt-1 text-black">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPhone;
