import { useContext } from "react";
import RewardIcon from "../../../../assets/reward-icon-1.7c7b88f3.png";
import RewardIcon2 from "../../../../assets/reward-icon-2.d7878105.png";
import RewardIcon3 from "../../../../assets/reward-icon-3.5dbdcc20.png";
import RewardIcon4 from "../../../../assets/reward-icon-4.e85f0909.png";
import RewardIcon5 from "../../../../assets/reward-icon-5.d10152dc.png";
import RewardIcon6 from "../../../../assets/reward-icon-5.d10152dc.png";
import { LanguageContext } from "../../../../Context/LanguageContext";

const InviteReward = () => {
  const { language } = useContext(LanguageContext);

  const inviteRewardData = [
    {
      img: RewardIcon,
      title_en: "Over 5 valid referral in total.",
      title_bn: "মোট ৫টি বৈধ রেফারেল সম্পন্ন হয়েছে।",
      reward: "50.00",
      current: 0,
      target: 5,
    },
    {
      img: RewardIcon2,
      title_en: "Over 10 valid referral in total.",
      title_bn: "মোট ১০টি বৈধ রেফারেল সম্পন্ন হয়েছে।",
      reward: "120.00",
      current: 3,
      target: 10,
    },
    {
      img: RewardIcon3,
      title_en: "Over 15 valid referral in total.",
      title_bn: "মোট ১৫টি বৈধ রেফারেল সম্পন্ন হয়েছে।",
      reward: "200.00",
      current: 5,
      target: 15,
    },
    {
      img: RewardIcon4,
      title_en: "Over 20 valid referral in total.",
      title_bn: "মোট ২০টি বৈধ রেফারেল সম্পন্ন হয়েছে।",
      reward: "350.00",
      current: 10,
      target: 20,
    },
    {
      img: RewardIcon5,
      title_en: "Over 30 valid referral in total.",
      title_bn: "মোট ৩০টি বৈধ রেফারেল সম্পন্ন হয়েছে।",
      reward: "600.00",
      current: 12,
      target: 30,
    },
    {
      img: RewardIcon6,
      title_en: "Over 50 valid referral in total.",
      title_bn: "মোট ৫০টি বৈধ রেফারেল সম্পন্ন হয়েছে।",
      reward: "1000.00",
      current: 18,
      target: 50,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto lg:h-auto md:h-auto lg:pb-0 md:pb-0 pb-32 h-[500px] custom-scrollbar-hidden lg:grid-cols-3 gap-4">
        {inviteRewardData.map((item, index) => (
          <div
            key={index}
            className="flex bg-inviteRewardImage font-semibold items-center text-[#666666] p-2 rounded-md"
          >
            <img src={item.img} alt="" className="w-[20%]" />
            <div className="flex text-xs flex-col items-start ml-2">
              <h3>{language === "bn" ? item.title_bn : item.title_en}</h3>
              <p>{item.reward}</p>
            </div>
            <div className="flex flex-col items-center ml-auto">
              <p>
                <span className="text-lg font-bold text-[#3B2987]">
                  {item.current}
                </span>{" "}
                / {item.target}
              </p>
              <button className="bg-buttonAvailableBg text-white rounded-md p-1 text-xs mt-1">
                {language === "bn" ? "প্রাপ্য" : "Available"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InviteReward;
