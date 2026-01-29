import { useState } from "react";

import WithdrawWallet from "./WithdrawWallet";
import downloadWithdrawal from "../../../assets/downloadWithdrawl.png";
import WalletIcon from "../../../assets/EWALLET_BANK_DEFAULT_ICON.webp";
import BankIcon from "../../../assets/NORMAL_BANK_DEFAULT_ICON.webp";
import downloadEdit from "../../../assets/downloadEdit.png";
import WithdrawBank from "./WithdrawBank";
import EWalletDetailsTab from "../EWalletDetailsTab";
import BankDetailsTab from "../BankDetailsTab";

const Withdrawal = ({
  handleModalSwitchSeparate,
  language,
  formData,
  handleInputChange,
  setFormData,
  items,
}) => {
  const [mainTab, setMainTab] = useState("withdrawal");
  const [subTab, setSubTab] = useState("ewallet");

  const handleViewMoreClick = () => {
    const dummyItem = { from: "Withdrawal Page" };
    if (subTab === "ewallet") {
      handleModalSwitchSeparate("bindEwallet", dummyItem);
    } else if (subTab === "bank") {
      handleModalSwitchSeparate("registerBankAccount", dummyItem);
    }
  };

  return (
    <div className="px-4 ">
      {/* Main Tabs */}
      <div className="lg:flex hidden gap-4 mb-4">
        <button
          className={`px-4 py-2  ${
            mainTab === "withdrawal"
              ? "border-b-2 border-textRed text-textRed"
              : " text-black"
          }`}
          onClick={() => {
            setMainTab("withdrawal");
            setSubTab("ewallet");
          }}
        >
          {language === "bn" ? "জমা সম্পর্কিত তথ্য" : "Withdrawal"}
        </button>
        <button
          className={`px-4 py-2  ${
            mainTab === "account"
              ? "border-b-2 border-textRed text-textRed"
              : " text-black"
          }`}
          onClick={() => {
            setMainTab("account");
            setSubTab("ewallet");
          }}
        >
          {language === "bn" ? "অ্যাকাউন্ট ম্যানেজমেন্ট" : "Account Management"}
        </button>
      </div>
      <div className="lg:flex   gap-4 bg-[#f5f5f5] ">
        <div className="border-r-2 p-2 pr-2">
          {/* Sub Tabs + Link */}
          <div className="flex justify-center lg:whitespace-normal whitespace-nowrap lg:justify-normal  gap-2 text-xs lg:text-sm items-center mb-4">
            <div className="flex   gap-4">
              <button
                className={`px-3 flex items-center gap-1  py-1 rounded lg:border ${
                  subTab === "ewallet"
                    ? "lg:border border-b-2 border-textRed "
                    : " text-black"
                }`}
                onClick={() => setSubTab("ewallet")}
              >
                <img src={WalletIcon} alt="" className="w-[30%]" />
                {language === "bn" ? "ই-ওয়ালেট" : "E-wallet"}
              </button>
              <button
                className={`flex gap-1 items-center px-3 py-1 rounded lg:border ${
                  subTab === "bank" ? "border-b-2 lg:border border-textRed" : " text-black"
                }`}
                onClick={() => setSubTab("bank")}
              >
                <img src={BankIcon} alt="" className="w-[23%]" />
                {language === "bn" ? "ব্যাংক অ্যাকাউন্ট" : "Bank Account"}
              </button>
            </div>

            {/* View More Info Link */}
            <div
              onClick={handleViewMoreClick}
              className="lg:flex hidden items-center gap-2 text-blue-600 cursor-pointer"
            >
              <img
                src={downloadEdit}
                alt=""
                className="w-[15%] bg-[#23e63a] rounded-full p-1"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className=" p-4 rounded bg-gray-50">
            {mainTab === "withdrawal" && subTab === "ewallet" && (
              <p>
                <WithdrawWallet
                  handleModalSwitchSeparate={handleModalSwitchSeparate}
                  dummyItem={{ from: "Withdrawal Page" }}
                  language={language}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  setFormData={setFormData}
                />
              </p>
            )}
            {mainTab === "withdrawal" && subTab === "bank" && (
              <p>
                <WithdrawBank
                  handleModalSwitchSeparate={handleModalSwitchSeparate}
                  dummyItem={{ from: "Withdrawal Page" }}
                  items={items}
                />
              </p>
            )}
            <div className="hidden lg:block">
            
            {mainTab === "account" && subTab === "ewallet" && (
              <p>
                <EWalletDetailsTab
                  language={language}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  setFormData={setFormData}
                  items={items}
                />
              </p>
            )}
            {mainTab === "account" && subTab === "bank" && (
              <p>
                <BankDetailsTab
                  language={language}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  setFormData={setFormData}
                  items={items}
                />
              </p>
            )}
              
              </div>
          </div>
        </div>

        <div className="bg-[#f5f5f5] lg:block hidden p-2">
          <h3 className="whitespace-nowrap text-center  pl-4 border-blue-600 border-l-2 text-sm ">
            {language === "bn" ? "সাম্প্রতিক উত্তোলন" : "Recent Withdrawals"}
          </h3>

          <div className="flex gap-6 items-center mt-2 bg-white p-2 py-8">
            <img
              src={downloadWithdrawal}
              alt="withdrawal status"
              className="w-6 h-6"
            />
            <p className="text-gray-700 text-xs ">
              {language === "bn"
                ? "উত্তোলনের অনুরোধ পাওয়া যায়নি"
                : "No withdrawal request found"}
            </p>
          </div>
          <div className="flex items-center">
            <button className="mt-2 mx-auto px-4 py-1 bg-white text-black rounded">
              {language === "bn" ? "ফাঁকা" : "Empty"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
