import { RxCross1 } from "react-icons/rx";
import { FaChevronLeft } from "react-icons/fa";
// import { motion } from "framer-motion";

const RegulationModal = ({ setIsRulesOpen }) => {
  const depositRebateData = [
    { amount: "৳ ১০০+", rebate: "৫%" },
    { amount: "৳ ৫০০+", rebate: "৭%" },
    { amount: "৳ ১,০০০+", rebate: "১০%" },
    { amount: "৳ ৫,০০০+", rebate: "১২%" },
    { amount: "৳ ১০,০০০+", rebate: "১৫%" },
  ];

  const referralRewardData = [
    { referrals: "৫ জন", reward: "৳৫০" },
    { referrals: "১০ জন", reward: "৳১২০" },
    { referrals: "২০ জন", reward: "৳৩০০" },
    { referrals: "৫০ জন", reward: "৳৮৫০" },
    { referrals: "১০০ জন", reward: "৳২০০০" },
  ];

  return (
    <div
      className="fixed  inset-0 z-50 flex justify-end bg-black bg-opacity-50  overflow-hidden"
      onClick={() => setIsRulesOpen(false)}
    >
      <div
        className="flex lg:w-auto w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative hidden lg:flex flex-col justify-center gap-4">
          <div
            className="bg-white w-full p-2 absolute top-0"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 66%)",
            }}
          >
            <button
              onClick={() => setIsRulesOpen(false)}
              className="text-white text-sm rounded-full p-1 bg-red-600"
            >
              <RxCross1 />
            </button>
          </div>
          <h3 className="text-transparent">view</h3>
        </div>
        <div
          className=" w-full  bg-white shadow-lg "
          // initial={{ x: "100%" }}
          // animate={{ x: 0 }}
          // exit={{ x: "-100%" }}
          // transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex lg:hidden bg-informationBG lg:bg-transparent  justify-between items-center px-4 py-3 border-b">
            <span
              onClick={() => setIsRulesOpen(false)}
              className="lg:hidden text-white"
            >
              <FaChevronLeft />
            </span>
            <h2 className="text-sm   px-2 w-full lg:w-4/5 lg:border-l-4 border-borderGreen text-white text-center lg:text-gray-800">
              Refer Friend
            </h2>
          </div>
          <div className="bg-white mx-auto overflow-y-auto h-[600px] custom-scrollbar-hidden lg:pb-0 pb-32 p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">
              রেফারেল রিবেট এবং অ্যাচিভমেন্ট বোনাসের নিয়ম
            </h2>
            <div>
              <p>
                <strong>রেফারেল ডিপোজিট রিবেট:</strong>
              </p>
              <p className="text-xs py-2">
                ডিপোজিট রিবেট বোনাস নিচের টেবিল অনুসারে গণনা করা হবে:
              </p>

              <table className="w-full border border-gray-300 text-center">
                <thead className=" bg-gray-200 fon-normal text-sm text-[#666666] ">
                  <tr className="">
                    <th className=" py-1 border-b">ডিপোজিট পরিমাণ</th>
                    <th className=" py-1 border-b">ডিপোজিট রিবেট %</th>
                  </tr>
                </thead>
                <tbody>
                  {depositRebateData.map((item, index) => (
                    <tr key={index} className="border-t py-1">
                      <td className="py-1">{item.amount}</td>
                      <td className="py-1">{item.rebate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="py-2">
                <p>কৃতিত্ব বোনাস পড়ুন:</p>
                <p className="text-xs">
                  রেফারেল অর্জন বোনাস নিম্নলিখিত মানদণ্ডের উপর ভিত্তি করে দেওয়া
                  হবে:
                </p>
              </div>
            </div>

            <table className="w-full border border-gray-300 text-center mt-6">
              <thead className="bg-gray-200 text-sm text-[#666666]">
                <tr>
                  <th className="py-1 border-b">মোট রেফারেল</th>
                  <th className="py-1 border-b">পুরষ্কার</th>
                </tr>
              </thead>
              <tbody>
                {referralRewardData.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-1">{item.referrals}</td>
                    <td className="py-1">{item.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulationModal;
