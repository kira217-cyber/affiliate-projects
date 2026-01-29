import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";
import receiveImage from "../../../../assets/receiveImage.png";

const ReceiveFund = () => {
  const { language = "en" } = useContext(AuthContext);

  // ভাষা অনুযায়ী টেক্সট
  const t = {
    en: {
      type: "Type",
      claimTime: "Claim Time",
      receive: "Receive",
    },
    bn: {
      type: "প্রকার",
      claimTime: "ক্লেইম সময়",
      receive: "গ্রহণ করুন",
    },
  };

  const txt = t[language];

  return (
    <div className="p-4">
      {/* Main Card */}
      <div className="relative w-[250px] p-4 bg-white shadow-xl rounded-xl border">
        <div className="flex gap-3 items-center">
          <img src={receiveImage} alt="Fund" className="w-12 h-12" />
          <p className="text-2xl font-bold text-gray-800">000</p>
        </div>

        {/* Receive Button */}
        <button className="absolute right-2 top-4 bg-[#ececec] hover:bg-[#30d005] text-textRed hover:text-white px-4 py-1.5 text-xs font-bold rounded-full transition duration-300 shadow-md">
          {txt.receive}
        </button>
      </div>

      {/* Details */}
      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <p>
          {txt.type}: <span className="text-gray-800 font-medium">--</span>
        </p>
        <p>
          {txt.claimTime}: <span className="text-gray-800 font-medium">--</span>
        </p>
      </div>
    </div>
  );
};

export default ReceiveFund;
