import React, { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";

import InvitationRewardImage from "../../../../../assets/invitation-reward.94bc2714.png";
import AchievementRewardImage from "../../../../../assets/chievement-reward.2915c15d.png";
import DepositRebateImage from "../../../../../assets/chievement-reward.2915c15d.png";
import BettingRebateImage from "../../../../../assets/chievement-reward.2915c15d.png";

const PriceReview = () => {
  const { language = "en" } = useContext(AuthContext);

  // ভাষা অনুযায়ী টেক্সট
  const t = {
    en: {
      title: "Rewards Released to Date",
      invitation: "Invitation Rewards",
      achievement: "Achievement Rewards",
      deposit: "Deposit Rebate",
      betting: "Betting Rebate",
      claimed: "claimed",
    },
    bn: {
      title: "এখন পর্যন্ত ছাড়কৃত রিওয়ার্ড",
      invitation: "আমন্ত্রণ রিওয়ার্ড",
      achievement: "অর্জন রিওয়ার্ড",
      deposit: "ডিপোজিট রিবেট",
      betting: "বেটিং রিবেট",
      claimed: "জন দাবি করেছে",
    },
  };

  const txt = t[language];

  const rewardData = [
    {
      img: InvitationRewardImage,
      title: txt.invitation,
      amount: "৳ 24,918,2.00",
      claimed: `126522 ${txt.claimed}`,
    },
    {
      img: AchievementRewardImage,
      title: txt.achievement,
      amount: "৳ 776,980.00",
      claimed: `10592 ${txt.claimed}`,
    },
    {
      img: DepositRebateImage,
      title: txt.deposit,
      amount: "৳ 23,545,4.87",
      claimed: `111128 ${txt.claimed}`,
    },
    {
      img: BettingRebateImage,
      title: txt.betting,
      amount: "৳ 36,525,9.42",
      claimed: `151203 ${txt.claimed}`,
    },
  ];

  return (
    <div className="bg-[#f3f6ff] p-4 rounded-lg">
      <h3 className="text-sm text-[#1b1b4b] font-semibold mb-3">{txt.title}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rewardData.map((item, index) => (
          <div
            key={index}
            className="flex items-center bg-white p-4 rounded-lg shadow-md"
          >
            <img src={item.img} alt="" className="w-12 h-12 mr-2" />

            <div className="flex flex-col">
              <p className="text-[#566073] text-[14px]">{item.title}</p>
              <p className="text-[#3b2987] font-bold text-sm">{item.amount}</p>
              <p className="text-[#666] text-[14px]">{item.claimed}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceReview;
