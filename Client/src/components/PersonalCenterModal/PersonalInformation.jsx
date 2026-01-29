import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { LanguageContext } from "@/Context/LanguageContext";
import {
  FaUser,
  FaPiggyBank,
  FaMoneyBillWave,
  FaClipboardList,
  FaRegFileAlt,
  FaBalanceScale,
  FaGift,
  FaUserFriends,
  FaComments,
  FaRedoAlt,
} from "react-icons/fa";
import Account from "./Account";
import NameTab from "./NameTab";
import Withdrawal from "./Withdrawal/Withdrawal";
import Deposit from "./Deposit/Deposit";
import AccountDetailsModal from "./AccountDetailsModal";
import ReusableTabs from "./BattingAccountProfitLoss/ReusableTabs";
import Reward from "./RewardCenter/Reward";
import Invite from "./InviteFriends/Invite";
import Message from "./Message/Message";
import AccountPhone from "./AccountPhone/AccountPhone";
import Rebate from "./Rebate/Rebate";
import WithdrawTabsWrapper from "./Withdrawal/WithdrawTabsWrapper";
import { AuthContext } from "@/Context/AuthContext";
import TransactionHistory from "./TransactionHistory/TransactionHistory";
import BattingRecord from "./BattingRecord/BattingRecord";

// TabControl Component
const TabControl = ({ tabs, activeTab, setActiveTab, language }) => {
  return (
    <div
      className="w-1/5 hidden rounded-l-xl lg:flex flex-col text-white shadow-md py-6 bg-[#00352f]"
      style={{
        backgroundImage:
          "url('https://i.ibb.co.com/bj4q5xrW/abstract-textured-backgound-1258-30436.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h3 className="text-center font-bold text-2xl py-4">
        {language === "en" ? (
          <>
            Personal <br /> Center
          </>
        ) : (
          <>
            ব্যক্তিগত <br /> কেন্দ্র
          </>
        )}
      </h3>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`p-4 text-sm flex items-center gap-2 transition-all duration-300 font-medium ${
            activeTab === tab.id
              ? "bg-informationActiveColor"
              : "hover:bg-informationActiveColor"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="text-lg">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

const PersonalInformation = ({ tab = "tab1" }) => {
  const { language, initialTab } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(tab);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Simplified form data
  const [formData, setFormData] = useState({
    nickName: "",
    email: "",
    fullName: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    bank: "",
    accountNumber: "",
    eWalletService: "",
    eWalletAccountNumber: "",
    phoneNumber: "",
    countryCode: "+1",
  });

  // Define handleInputChange early
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert(`${activeModal} submitted!`);
  };

  // Simplified items array
  const items = [
    {
      title: language === "bn" ? "ব্যক্তিগত তথ্য" : "Personal Information",
      action: "changeName",
    },
    {
      title: language === "bn" ? "লগইন পাসওয়ার্ড" : "Login password",
      action: "changePassword",
    },
    {
      title: language === "bn" ? "ব্যাংক অ্যাকাউন্ট" : "Bank Account",
      action: "registerBankAccount",
    },
    {
      title: language === "bn" ? "ই-ওয়ালেট যুক্ত করুন" : "Bind E-wallet",
      action: "bindEwallet",
    },
    {
      title: language === "bn" ? "লেনদেনের পাসওয়ার্ড" : "Transaction Password",
      action: "changeTransactionPassword",
    },
    {
      title: language === "bn" ? "ফোন ভেরিফিকেশন" : "Phone verification",
      action: "verifyPhone",
    },
  ];

  // Simplified tab data
  const tabData = [
    {
      tabTitle: { en: "Sport", bn: "স্পোর্টস" },
      radioTabs: [{ label: { en: "Today", bn: "আজ" }, tableData: [] }],
    },
    {
      tabTitle: { en: "Slot", bn: "স্লট" },
      radioTabs: [{ label: { en: "Day 1", bn: "দিন ১" }, tableData: [] }],
    },
  ];

  const tabOptions = [
    { label: { en: "All", bn: "সব" }, value: "all" },
    { label: { en: "Jili", bn: "জিলি" }, value: "jili" },
  ];

  const filter = [
    { label: { en: "Vendor", bn: "বিক্রেতা" }, value: "vendor" },
    {
      label: { en: "Transaction Type", bn: "লেনদেন প্রকার" },
      value: "transactionType",
    },
  ];

  const tabs = [
    {
      id: "tab1",
      label: language === "bn" ? "আমার অ্যাকাউন্ট" : "My Account",
      icon: <FaUser />,
      content: (
        <div>
          <div className="hidden lg:block">
            <Account
              language={language}
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              activeModal={activeModal}
              setActiveModal={setActiveModal}
              items={items}
              handleSubmit={handleSubmit}
            />
          </div>
          <div className="lg:hidden">
            <NameTab
              language={language}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>
      ),
    },
    {
      id: "tab2",
      label: language === "bn" ? "জমা" : "Deposit",
      icon: <FaPiggyBank />,
      content: <Deposit />,
    },
    {
      id: "tab3",
      label: language === "bn" ? "উত্তোলনের" : "Withdrawal",
      icon: <FaMoneyBillWave />,
      content: <WithdrawTabsWrapper />,
    },
    {
      id: "tab4",
      label: language === "bn" ? "বেটিং রেকর্ড" : "Betting Record",
      icon: <FaClipboardList />,
      content: <BattingRecord />,
    },
    {
      id: "tab5",
      label: language === "bn" ? "ট্রান্সেকশন রেকর্ড" : "Transaction Record",
      icon: <FaRegFileAlt />,
      content: <TransactionHistory />,
    },
    {
      id: "tab6",
      label: language === "bn" ? "প্রোফিট ও লস" : "Profit and Loss",
      icon: <FaBalanceScale />,
      content: (
        <ReusableTabs
          data={tabData}
          filterOptions={tabOptions}
          filters={filter[0]}
        />
      ),
    },
    {
      id: "tab7",
      label: language === "bn" ? "পুরস্কার কেন্দ্র" : "Reward Center",
      icon: <FaGift />,
      content: <Reward />,
    },
    {
      id: "tab8",
      label: language === "bn" ? "বন্ধু আমন্ত্রণ" : "Invite Friends",
      icon: <FaUserFriends />,
      content: <Invite />,
    },
    {
      id: "tab9",
      label: language === "bn" ? "অভ্যন্তরীণ বার্তা" : "Internal Message",
      icon: <FaComments />,
      content: <Message />,
    },
    {
      id: "tab10",
      label: language === "bn" ? "ম্যানুয়াল রিবেট" : "Manual Rebate",
      icon: <FaRedoAlt />,
      content: <Rebate />,
    },
    {
      id: "tab12",
      label: language === "bn" ? "আমার অ্যাকাউন্ট" : "My Account",
      icon: <FaRedoAlt />,
      content: <AccountPhone />,
    },
  ];

  useEffect(() => {
    const tabFromHash = location.hash.replace("#", "");
    if (tabFromHash) setActiveTab(tabFromHash);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <div className=" bg-white rounded-xl mt-0 md:mt-20 md:flex flex-col items-center">
      <div className="flex flex-col lg:flex-row max-w-7xl w-full bg-bgAccountTwo shadow-lg rounded-lg">
        <TabControl
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
        />
        <div className="lg:hidden bg-informationBG py-2">
          <h3 className="text-center text-white">
            {tabs.find((tab) => tab.id === activeTab)?.label}
          </h3>
        </div>
        <div className="w-full text-black">
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
