import { useContext } from "react";
import { LanguageContext } from "../../../../Context/LanguageContext";

const Income = () => {
  const rewardData = [
    {
      label_en: "Invitation Reward",
      label_bn: "আমন্ত্রণ পুরস্কার",
      amount: 0.0,
    },
    {
      label_en: "Medicine Reward",
      label_bn: "অসুধ পুরস্কার",
      amount: 50.0,
    },
    {
      label_en: "Deposit Rebate",
      label_bn: "জমা রিবেট",
      amount: 25.0,
    },
    {
      label_en: "Betting Rebate",
      label_bn: "বেটিং রিবেট",
      amount: 100.0,
    },
    {
      label_en: "Leaderboard",
      label_bn: "সূচিপত্রধারী",
      amount: 75.0,
    },
  ];
  const rewardDataTwo = [
    {
      label_en: "Eligible Referrers",
      label_bn: "যোগ্য পরিচায়করা",
      amount: 0,
    },
    {
      label_en: "Depositors",
      label_bn: "জমাদানদার",
      amount: 0,
    },
  ];
  const totalData = [
    {
      label_en: "Invitation Reward",
      label_bn: "আমন্ত্রণ পুরস্কার",
      amount: 0.0,
    },
    {
      label_en: "Medicine Reward",
      label_bn: "অসুধ পুরস্কার",
      amount: 50.0,
    },
    {
      label_en: "Deposit Rebate",
      label_bn: "জমা রিবেট",
      amount: 25.0,
    },
    {
      label_en: "Betting Rebate",
      label_bn: "বেটিং রিবেট",
      amount: 100.0,
    },
    {
      label_en: "Leaderboard",
      label_bn: "সূচিপত্রধারী",
      amount: 75.0,
    },
  ];
  const totalRewardDataTwo = [
    {
      label_en: "Eligible Referrers",
      label_bn: "যোগ্য পরিচায়করা",
      amount: 0,
    },
    {
      label_en: "Depositors",
      label_bn: "জমাদানদার",
      amount: 0,
    },
  ];
  const { language } = useContext(LanguageContext);
  return (
    <div className="text-[#566073] lg:h-auto h-[500px] overflow-y-auto custom-scrollbar-hidden pb-32 lg:pb-0">
      {/* todays income */}
      <div className="bg-[#f6f6f6] p-1">
        <div className="flex my-4 lg:my-0 ">
          <h3 className="font-bold">Today&apos;s income:</h3>
          <p className="font-bold text-[#3b2987]">
            <span className=" mx-2">ট</span>
            0.00
          </p>
        </div>
        <div className="bg-inviteRewardImage">
          <div className=" grid grid-cols-1 lg:grid-cols-5 lg:gap-4">
            {rewardData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between lg:flex-col items-center text-xs lg:text-base p-1 lg:p-4  rounded"
              >
                <p className="text-right">
                  {language === "bn" ? item.label_bn : item.label_en}
                </p>
                <p className="font-bold  w-[25%] md:w-[10%] lg:w-auto text-[#3b2987]">
                  <span className="mx-2">ট</span>
                  {item.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 lg:justify-items-center">
            {rewardDataTwo.map((item, index) => (
              <div
                key={index}
                className=" flex justify-between lg:flex-col items-center text-xs lg:text-base p-1 lg:p-4  rounded"
              >
                <p>{language === "bn" ? item.label_bn : item.label_en}</p>
                <p className="font-bold text-[#3b2987]">
                  {item.amount.toFixed()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* total income */}
      <div className="bg-[#f6f6f6] p-1 mt-4 lg:mt-0">
        <div className="flex  my-4 lg:my-0 ">
          <h3 className="font-bold">Total income:</h3>
          <p className="font-bold text-[#3b2987]">
            <span className=" mx-2">ট</span>
            0.00
          </p>
        </div>
        <div className="bg-inviteRewardImage">
          <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-4">
            {totalData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between lg:flex-col items-center text-xs lg:text-base p-1 lg:p-4  rounded"
              >
                <p className="">
                  {language === "bn" ? item.label_bn : item.label_en}
                </p>
                <p className="font-bold w-[25%] md:w-[10%] lg:w-auto text-[#3b2987]">
                  <span className="mx-2">ট</span>
                  {item.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 lg:justify-items-center">
            {totalRewardDataTwo.map((item, index) => (
              <div
                key={index}
                className="flex justify-between lg:flex-col items-center text-xs lg:text-base p-1 lg:p-4  rounded"
              >
                <p>{language === "bn" ? item.label_bn : item.label_en}</p>
                <p className="font-bold text-[#3b2987]">
                  {item.amount.toFixed()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs lg:text-sm">
          নোট: সিস্টেম তথ্য প্রতি ১৫ মিনিটে আপডেট করে।
        </p>
      </div>
    </div>
  );
};

export default Income;
