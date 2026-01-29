import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";
import signInRulesImage from "../../../../assets/sign-rules.6b536871.png";
import giftImage from "../../../../assets/gift.5366dc7e.png";

const SignBonus = () => {
  const { language = "en" } = useContext(AuthContext);

  // ভাষা অনুযায়ী টেক্সট
  const t = {
    en: {
      lastSignin: "Last Signin",
      totalBonus: "Sign in total bonus",
      effectiveTime: "Effective time of the task",
      permanently: "Permanently effective",
      dailyLoginBonus: "Daily Login Bonus",
      signInToday: "Sign in today",
      rechargeThreshold: "Recharge Threshold",
      signInButton: "Sign In",
    },
    bn: {
      lastSignin: "সর্বশেষ সাইন ইন",
      totalBonus: "মোট সাইন ইন বোনাস",
      effectiveTime: "টাস্কের কার্যকর সময়",
      permanently: "স্থায়ীভাবে কার্যকর",
      dailyLoginBonus: "প্রতিদিনের লগইন বোনাস",
      signInToday: "আজ সাইন ইন করুন",
      rechargeThreshold: "রিচার্জ থ্রেশহোল্ড",
      signInButton: "সাইন ইন",
    },
  };

  const txt = t[language];

  return (
    <div>
      {/* Top Image + Stats */}
      <div className="relative">
        <img src={signInRulesImage} alt="Sign In Rules" className="w-full" />
        <div className="absolute rounded-md -bottom-4 left-1/2 -translate-x-1/2 w-[80%] grid grid-cols-2 gap-4 text-center bg-white shadow-lg border">
          <div className="border-r py-3">
            <p className="text-sm text-gray-600">{txt.lastSignin}</p>
            <p className="text-lg font-semibold text-textRed">0</p>
          </div>
          <div className="py-3">
            <p className="text-sm text-gray-600">{txt.totalBonus}</p>
            <p className="text-lg font-semibold text-textRed">0</p>
          </div>
        </div>
      </div>

      {/* Large Device - Desktop View */}
      <div className="mt-10 p-4 hidden lg:block">
        <p className="font-bold">
          {txt.effectiveTime} :{" "}
          <strong className="text-textRed">{txt.permanently}</strong>
        </p>
        <h3 className="text-center text-2xl font-bold mt-4 text-[#4c11d3]">
          {txt.dailyLoginBonus}
        </h3>
        <p className="text-center text-gray-600 mt-2">
          {txt.dailyLoginBonus.toLowerCase()}
        </p>
      </div>

      {/* Small Device - Mobile View */}
      <div className="lg:hidden">
        <div className="border-b-4 pt-2">
          <h3 className="mt-6 w-[60%] pb-1 mx-auto text-center border-b-4 border-textRed text-textRed font-semibold text-lg">
            {txt.dailyLoginBonus}
          </h3>
        </div>

        <div className="flex gap-3 items-center justify-center py-4 px-6">
          <img src={giftImage} alt="Gift" className="w-[12%]" />
          <div className="flex-1">
            <p className="text-textRed font-semibold">{txt.dailyLoginBonus}</p>
            <p className="text-[11px] font-medium text-[#6f6f6f]">{txt.signInToday}</p>
          </div>
          <button className="text-white rounded-full bg-bgRed py-2 px-6 text-sm font-bold shadow-md hover:bg-red-700 transition">
            {txt.signInButton}
          </button>
        </div>

        <div className="text-[#6f6f6f] text-[10px] flex gap-6 justify-center pb-4">
          <div className="text-center">
            <p>{txt.rechargeThreshold}:</p>
            <p className="text-textRed font-bold">৳ 200.00</p>
          </div>
          <div className="text-center">
            <p>{txt.rechargeThreshold}:</p>
            <p className="text-textRed font-bold">৳ 200.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignBonus;