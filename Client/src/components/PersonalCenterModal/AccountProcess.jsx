import {
  MdOutlineAttachMoney,
  MdOutlineMoneyOff,
  MdLogin,
} from "react-icons/md";
import { LanguageContext } from "../../Context/LanguageContext";
import { useContext } from "react";

const AccountProcess = () => {
  const { language } = useContext(LanguageContext);

  const items = [
    {
      icon: <MdOutlineAttachMoney />,
      sentence:
        language === "bn"
          ? "০টি জমা অনুরোধ প্রক্রিয়াধীন"
          : "0 deposit request processing",
    },
    {
      icon: <MdOutlineMoneyOff />,
      sentence:
        language === "bn"
          ? "০টি উত্তোলন অনুরোধ প্রক্রিয়াধীন"
          : "0 withdrawal request processing",
    },
  ];

  return (
    <div className=" mt-3 p-4">
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-2xl text-black bg-bgYellow rounded-full p-2 shadow-md">
              {item.icon}
            </span>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {item.sentence}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountProcess;
