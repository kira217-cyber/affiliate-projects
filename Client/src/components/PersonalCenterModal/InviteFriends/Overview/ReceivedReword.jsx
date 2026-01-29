import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";

const data = [
  {
    id: 1,
    status: "Received",
    amount: "৳120.00",
    mobile: "01********4",
    mobile2: "Prize Wheel",
  },
  {
    id: 2,
    status: "Received",
    amount: "৳160.00",
    mobile: "01********8",
    mobile2: "Prize Wheel",
  },
  {
    id: 3,
    status: "Received",
    amount: "৳500.00",
    mobile: "01********2",
    mobile2: "Prize Wheel",
  },
  {
    id: 4,
    status: "Received",
    amount: "৳320.00",
    mobile: "01********9",
    mobile2: "Prize Wheel",
  },
];

const ReceivedReword = () => {
  const { language = "en" } = useContext(AuthContext);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  // Auto change every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % data.length);
        setAnimate(false);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ভাষা অনুযায়ী শুধু টাইটেল টেক্সট
  const titleText =
    language === "bn" ? "কে রিওয়ার্ড পেয়েছে" : "Who received the rewards";

  return (
    <div className="w-full flex justify-start items-center gap-8 px-4 rounded-md bg-[#cde4ff]">
      <p className="text-sm font-bold text-[#1c2ca3]">{titleText}</p>

      {/* FIXED HEIGHT WRAPPER */}
      <div className="h-[40px] overflow-hidden flex items-center">
        <div
          className={`w-[300px] sm:w-[380px] md:w-[720px] bg-[#eef6ff] 
            text-[#1f2b41] rounded-full flex items-center justify-between
            px-3 py-1 shadow-md font-semibold
            transition-all duration-300
            ${
              animate
                ? "translate-x-full opacity-0"
                : "translate-x-0 opacity-100"
            }
          `}
        >
          {/* Mobile Number */}
          <span className="text-[14px]">{data[index].mobile}</span>

          {/* Status - ভাষা অনুযায়ী */}
          <span className="text-[14px]">
            {language === "bn" ? "পেয়েছে" : data[index].status}
          </span>

          {/* Amount */}
          <span className="text-[14px] flex items-center gap-1">
            ৳ {data[index].amount.replace("৳", "")}
          </span>

          {/* Source */}
          <span className="text-[14px]">
            {language === "bn" ? "প্রাইজ হুইল" : data[index].mobile2}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReceivedReword;
