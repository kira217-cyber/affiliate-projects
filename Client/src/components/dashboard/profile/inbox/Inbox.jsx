import { useState } from "react";
import {
  RiCheckboxBlankLine,
  RiCheckboxFill,
  RiDeleteBinLine,
} from "react-icons/ri";
import { Link } from "react-router-dom";
import { HiOutlineMailOpen } from "react-icons/hi";

const Inbox = () => {
  // Tab Buttons
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { id: 0, label: "ইনবক্স" },
    { id: 1, label: "বিজ্ঞপ্তি" },
  ];

  // Checkbox state
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="p-4 lg:p-6 bg-white rounded-lg space-y-4">
      <h1 className="text-lg font-semibold">ইনবক্স বার্তা</h1>
      <div className="space-y-6">
        {/* Tab Buttons */}
        <div className="flex gap-2 sm:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 px-2 w-full sm:w-40 text-base text-black border-2 border-yellow-400 rounded-xl ${
                activeTab === tab.id
                  ? "bg-yellow-400"
                  : "border border-yellow-400"
              } transition duration-300`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-5 border-t border-gray-300">
          <div className="py-1.5 px-4 space-y-3 whitespace-nowrap overflow-x-auto">
            <div className="pr-3 text-sm text-gray-500 rounded-xl bg-gray-100 flex items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-10">
                <div
                  onClick={() => setIsChecked(!isChecked)}
                  className="p-2 hover:bg-gray-300 rounded-full duration-300 cursor-pointer"
                >
                  {isChecked ? (
                    <RiCheckboxFill size={20} className="text-gray-600" />
                  ) : (
                    <RiCheckboxBlankLine size={20} />
                  )}
                </div>
                <p>বাছাই করুন/বাছাই বাতিল করুন</p>
              </div>
              <div className="flex items-center gap-2">
                <Link>
                  <div className="py-2 px-2 flex items-center gap-1 hover:bg-gray-200 duration-300">
                    <HiOutlineMailOpen size={16} />
                    পড়েছেন চিহ্নিত করুন
                  </div>
                </Link>
                <Link>
                  <div className="py-2 px-2 flex items-center gap-1  hover:bg-gray-200 duration-300">
                    <RiDeleteBinLine size={16} />
                    মুছে ফেলা
                  </div>
                </Link>
              </div>
            </div>

            <div className="pr-3 text-sm font-bold text-gray-500 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-10">
                <div
                  onClick={() => setIsChecked(!isChecked)}
                  className="p-2 hover:bg-gray-300 rounded-full duration-300 cursor-pointer"
                >
                  {isChecked ? (
                    <RiCheckboxFill size={20} className="text-gray-600" />
                  ) : (
                    <RiCheckboxBlankLine size={20} />
                  )}
                </div>
                <p>🎉 আশ্চর্যজনক সাপ্তাহিক ক্যাশব্যাক 🎉</p>
              </div>
              <div className="flex items-center gap-4">
                <p>2025-01-27</p>
                <p>10:20</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
