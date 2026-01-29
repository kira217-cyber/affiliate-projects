import { Link } from "react-router-dom";
import { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import RightItem from "./RightItem";

const Withdrawal = () => {
  // Options data
  const options = [{ id: 1, label: "+8801737300000" }];

  // State for selected option
  const [selectedOption, setSelectedOption] = useState("");

  // Handle change
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    console.log("Selected Option:", event.target.value);
  };
  return (
    <div className="flex gap-4">
      <div className="w-full p-3 sm:p-4 lg:p-6 bg-white rounded-lg space-y-4">
        <h1 className="text-lg font-semibold hidden md:block">আমানত</h1>
        <div className="grid grid-cols-2 bg-gray-700 rounded-t-xl md:hidden">
          <Link to={"/profile/deposit"}>
            <div className="w-full p-2 text-yellow-300 text-center">আমানত</div>
          </Link>
          <Link to={"/profile/withdrawal"}>
            <div className="w-full p-2 text-yellow-300 text-center border-b-4 border-yellow-400">
              উত্তোলন
            </div>
          </Link>
        </div>

        <div className="space-y-2">
          <h2 className="text-base">
            উত্তোলনের বিকল্প <span className="text-red-500">*</span>
          </h2>
          <div className="flex gap-4">
            <Link>
              <div className="p-4 px-4 w-24 h-16 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-2xl border-2 border-yellow-400">
                <img
                  src="https://www.babu88h.com/static/svg/deposit-ewallet-nagad.svg"
                  alt=""
                />
              </div>
            </Link>
            <Link>
              <div className="p-4 w-24 h-16 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-2xl border-2 border-gray-300">
                <img
                  src="https://www.babu88h.com/static/svg/deposit-ewallet-bkash.svg"
                  alt=""
                />
              </div>
            </Link>
          </div>
        </div>
        <h2 className="text-base">
          মোবাইল নম্বর <span className="text-red-500">*</span>
        </h2>
        <div className="space-y-4 w-full md:w-80">
          <select
            id="options"
            value={selectedOption}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {options.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 justify-between w-full md:w-80">
          <h2 className="text-base">
            উত্তোলনযোগ্য পরিমাণ <span className="text-red-500">*</span>
          </h2>
          <FaQuestionCircle />
        </div>
        <form action="">
          <input
            type="text"
            className="w-full md:w-80 py-1.5 px-4 border-2 border-gray-300 outline-none rounded-md"
            placeholder="ন্যূনতম ৳ 800.00 - সর্বোচ্চ ৳ 30,000.00
"
          />
        </form>
        <button className="py-3 px-10 w-full sm:w-80 text-sm text-white bg-blue-500 hover:bg-blue-600 duration-300 rounded-full border">
          উত্তোলন
        </button>
      </div>
      <RightItem />
    </div>
  );
};

export default Withdrawal;
