import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";

import referralImage from "../../../../assets/referralImage.png";
import avatar1Image from "../../../../assets/avatar-1.75e2f918.png";
import avatar2Image from "../../../../assets/avatar-2.a5a7a8bd.png";
import avatar3Image from "../../../../assets/avatar-3.18b3089b.png";
import firstIcon from "../../../../assets/first-icon.444cf06e.svg";
import secIcon from "../../../../assets/sec-icon.76c7f79a.svg";
import thirdIcon from "../../../../assets/third-icon.2ca64103.svg";

const OverviewIncome = () => {
  const { language = "en" } = useContext(AuthContext);

  // ভাষা অনুযায়ী টেক্সট
  const t = {
    en: {
      todayIncome: "Today's Income",
      yesterdayIncome: "Yesterday's Income",
      registers: "Registers",
      validReferral: "Valid Referral",
      revenueGoals: "Revenue goals",
      inviteToMeet: "Invite",
      userToMeet: "user",
      toMeetTarget: "to meet the target",
    },
    bn: {
      todayIncome: "আজকের আয়",
      yesterdayIncome: "গতকালের আয়",
      registers: "রেজিস্টার",
      validReferral: "বৈধ রেফারেল",
      revenueGoals: "আয়ের লক্ষ্য",
      inviteToMeet: "আমন্ত্রণ করুন",
      userToMeet: "জন ইউজার",
      toMeetTarget: "লক্ষ্য পূরণ করতে",
    },
  };

  const txt = t[language];

  const overviewData = [
    {
      id: 1,
      title: txt.todayIncome,
      amount: "৳ 0.00",
      bgFrom: "#2EB3FF",
      bgTo: "#0099FF",
    },
    {
      id: 2,
      title: txt.yesterdayIncome,
      amount: "৳ 0.00",
      bgFrom: "#A066FF",
      bgTo: "#6F2DFF",
    },
    {
      id: 3,
      title: txt.registers,
      amount: "0",
      bgFrom: "#CC8FFF",
      bgTo: "#A45CFF",
    },
    {
      id: 4,
      title: txt.validReferral,
      amount: "0",
      bgFrom: "#52D4FF",
      bgTo: "#00B5FF",
    },
  ];

  const winnersData = [
    {
      id: 1,
      avatar: avatar1Image,
      name: "hj*****v",
      amount: "৳ 8,768,494",
      rankColor: "#B6ECFF",
      icon: firstIcon,
    },
    {
      id: 2,
      avatar: avatar2Image,
      name: "aa*****a",
      amount: "৳ 3,464,751",
      rankColor: "#C9F7D7",
      icon: secIcon,
    },
    {
      id: 3,
      avatar: avatar3Image,
      name: "01*****4",
      amount: "৳ 2,245,593",
      rankColor: "#FFD5E6",
      icon: thirdIcon,
    },
  ];

  return (
    <div className="w-full mx-auto">
      {/* TOP 4 INCOME TABS */}
      <div className="grid grid-cols-2 gap-3">
        {overviewData.map((item) => (
          <div
            key={item.id}
            className="rounded-xl py-3 text-center text-white shadow-md"
            style={{
              background: `linear-gradient(135deg, ${item.bgFrom} 0%, ${item.bgTo} 100%)`,
            }}
          >
            <h3 className="text-sm font-semibold">{item.title}</h3>
            <p className="text-xl font-bold">{item.amount}</p>
          </div>
        ))}
      </div>

      {/* REVENUE GOAL SECTION */}
      <div className="bg-gradient-to-r from-[#3A45E0] to-[#1B1F73] text-white rounded-lg mt-4 p-4 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-1">{txt.revenueGoals}</h2>

        <div className="flex items-center gap-3">
          <img src={referralImage} alt="Referral" className="w-20" />

          <div className="flex flex-col">
            <p className="text-2xl font-bold text-[#FFD26A]">৳ 1,000.00</p>
            <p className="text-xs mt-1">
              {txt.inviteToMeet}{" "}
              <span className="font-bold">1 {txt.userToMeet}</span>{" "}
              {txt.toMeetTarget}
            </p>
          </div>
        </div>
      </div>

      {/* WINNER BOARD */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {winnersData.map((item) => (
          <div
            key={item.id}
            className="rounded-lg py-3 flex flex-col items-center"
            style={{ backgroundColor: item.rankColor }}
          >
            <div className="relative w-14 h-14">
              <img
                src={item.avatar}
                className="w-full h-full rounded-full object-cover border-2 border-white shadow-lg"
                alt="Winner Avatar"
              />
              <img
                src={item.icon}
                className="absolute -top-2 -left-2 w-6 h-6"
                alt="Rank Icon"
              />
            </div>

            <p className="text-xs font-semibold mt-1">{item.name}</p>
            <p className="text-sm font-bold">{item.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewIncome;