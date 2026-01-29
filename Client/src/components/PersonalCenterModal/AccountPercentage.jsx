import { FaUserCircle, FaUniversity, FaWallet } from "react-icons/fa";
import { useContext } from "react";
import lowImage from "../../assets/grade-low-bg.bc6a4c58.png";
import { AuthContext } from "@/Context/AuthContext";

const AccountPercentage = () => {
  const { language } = useContext(AuthContext);

  const itemsRecommended = [
    {
      icon: <FaUserCircle />,
      bg: "from-yellow-300 to-yellow-500",
      sentence: language === "bn" ? "ব্যক্তিগত তথ্য" : "Personal Information",
    },
    {
      icon: <FaWallet />,
      bg: "from-pink-500 to-pink-600",
      sentence: language === "bn" ? "ই-ওয়ালেট যুক্ত করুন" : "Bind E-wallet",
    },
    {
      icon: <FaUniversity />,
      bg: "from-yellow-600 to-yellow-700",
      sentence:
        language === "bn" ? "লেনদেন পাসওয়ার্ড" : "Transaction Password",
    },
  ];

  return (
    <div className="w-full flex justify-center mt-6">
      <div className="w-full max-w-md relative bg-white rounded-xl shadow-lg overflow-hidden">
        {/* 🔴 TOP GRADIENT BACKGROUND */}
        <div
          className="w-full pt-60 pb-10 bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${lowImage})`,
          }}
        >
          {/* ⚪ GLOW ROUND CIRCLE */}
          <div className="absolute top-6 w-full flex justify-center">
            <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-md flex flex-col items-center justify-center shadow-inner">
              <h3 className="text-5xl font-bold text-[#E71A41] drop-shadow-md">
                Low
              </h3>
              <p className="text-xs text-[#E71A41] mt-2">Safety percentage</p>
            </div>
          </div>

          {/* SCORE TEXT */}
          <div className="text-white text-center mt-20">
            <p>
              Score is <strong className="text-xl">0</strong> points
            </p>
            <p>Your account security level is Low</p>
          </div>
        </div>

        {/* 🔘 RECOMMENDED SETTINGS */}
        <div className="bg-gradient-to-b from-white to-pink-50 pb-8 pt-2">
          <h3 className="text-center text-gray-700 text-lg font-semibold mb-6">
            Recommended setting
          </h3>

          <div className="flex flex-row justify-center gap-4">
            {itemsRecommended.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span
                  className={`text-3xl p-3 rounded-full text-white bg-gradient-to-br ${item.bg} shadow-lg`}
                >
                  {item.icon}
                </span>

                <p className="text-sm text-gray-800 text-center w-20 leading-tight">
                  {item.sentence}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPercentage;
