import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";
import bonusInfoImage from "../../../../assets/bonusInfoImage.png";
import infoImage from "../../../../assets/Info.png";

const BonusInformation = () => {
  const { language = "en" } = useContext(AuthContext);

  // ভাষা অনুযায়ী ডেটা
  const bonusData =
    language === "bn"
      ? [
          { day: "দিন ১", amount: "৳ ১০.০০" },
          { day: "দিন ২", amount: "৳ ১৫.০০" },
          { day: "দিন ৩", amount: "৳ ২০.০০" },
          { day: "দিন ৪", amount: "৳ ২৫.০০" },
          { day: "দিন ৫", amount: "৳ ৩০.০০" },
          { day: "দিন ৬", amount: "৳ ৪০.০০" },
          { day: "দিন ৭", amount: "৳ ৫০.০০" },
        ]
      : [
          { day: "Day 1", amount: "৳ 10.00" },
          { day: "Day 2", amount: "৳ 15.00" },
          { day: "Day 3", amount: "৳ 20.00" },
          { day: "Day 4", amount: "৳ 25.00" },
          { day: "Day 5", amount: "৳ 30.00" },
          { day: "Day 6", amount: "৳ 40.00" },
          { day: "Day 7", amount: "৳ 50.00" },
        ];

  // বাটনের টেক্সট
  const signInText = language === "bn" ? "সাইন ইন" : "Sign In";

  return (
    <div className="bg-[#F5F5F5] px-2 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {bonusData.map((item, index) => (
          <div
            key={index}
            className="bg-white relative py-1 px-6 rounded-lg flex flex-col items-center shadow-2xl border border-gray-100"
          >
            <div className="flex flex-col items-center mt-3">
              <p className="font-semibold text-gray-700 text-sm md:text-base">
                {item.day}
              </p>
              <p className="text-sm md:text-lg font-bold text-[#4CAF50] mt-1">
                {item.amount}
              </p>
            </div>

            <img
              src={bonusInfoImage}
              alt="Bonus"
              className="w-[70%] mt-3 rounded"
            />

            <button className="mt-3 bg-[#656565] hover:bg-bgRed text-white text-sm px-4 py-1 rounded-full transition duration-200 shadow-md">
              {signInText}
            </button>

            <img
              src={infoImage}
              alt="Info"
              className="w-4 h-4 absolute right-2 top-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BonusInformation;
