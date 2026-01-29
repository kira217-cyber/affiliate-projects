import { useContext } from "react";
import { LanguageContext } from "../../../Context/LanguageContext";
import { AuthContext } from "@/Context/AuthContext";

const Rebate = () => {
  const { language } = useContext(AuthContext);

  const settlementData = [
    {
      label: language === "bn" ? "সেটেলমেন্ট তারিখ" : "Settlement Date",
      value: "2025-04-16",
    },
    {
      label: language === "bn" ? "স্লট" : "Slot",
      value: "0.00",
    },
    {
      label: language === "bn" ? "স্পোর্ট" : "Sport",
      value: "0.00",
    },
    {
      label: language === "bn" ? "লাইভ" : "Live",
      value: "0.00",
    },
    {
      label: language === "bn" ? "ফিশিং" : "Fishing",
      value: "0.00",
    },
    {
      label: language === "bn" ? "পোকার" : "Poker",
      value: "0.00",
    },
    {
      label: language === "bn" ? "লটটো" : "Lotto",
      value: "0.00",
    },
    {
      label: language === "bn" ? "মোট" : "Total",
      value: "0.00",
    },
  ];

  return (
    <div className="lg:w-1/3 p-4">
      <div className="flex border-b-2 py-1">
        <h3 className="text-textRed border-b-2 border-textRed">
          {language === "bn" ? "ম্যানুয়াল রিবেট" : "Manual Rebate"}
        </h3>
        <h3></h3>
      </div>
      <div className="flex flex-col mt-2 gap-4 whitespace-nowrap">
        {settlementData.map((item, index) => (
          <div key={index} className="flex gap-3 items-center">
            <p className="w-[40%] font-medium">{item.label}:</p>
            <div className="bg-[#646464] text-[#646464] bg-opacity-20 w-[60%] rounded-md border">
              <p className="pl-2 py-1 text-black">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rebate;
