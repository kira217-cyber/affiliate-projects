import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "@/Context/AuthContext"; // ← এটা আপনার প্রজেক্টে আছে

// বাংলা + ইংরেজি ট্রান্সলেশন
const translations = {
  en: {
    helpCenter: "Help Center",
    aboutUs: "About Us",
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    games: "Games",
    terms: "Terms and Conditions",
    privacy: "Privacy and Security",
    faqs: "FAQs",
    welcomeHeader: "Welcome to [Your Brand]",
    awardTitle: "-- award-winning online gaming provider.",
    aboutText:
      "Established in 2006, [Your Brand] quickly developed its brand and reputation as the market leader in the global online gaming industry. The brand was founded with the principles of trust and credibility at its core, defining the ethos for the company's activities to this day. [Your Brand] has consistently demonstrated a clear focus on enriching your gaming experience. We proudly offer you a wide variety of online gaming brands, each providing its own unique, entertaining and exciting range of games, opportunities, prizes and much more.",
    isLegal: "Is it legal?",
    legalText1:
      "We run our casino under the Philippines gaming license, issued by the PAGCOR. The PAGCOR is an independent regulatory body that makes sure casinos adhere to the practices and regulations that apply to online casinos.",
    legalText2:
      "This means we follow the most rigorous practices when it comes to player protection and responsible gaming, and that our Players are protected by the law.",
    isSecure: "Is it secure?",
    secureText:
      "Yes! Our tech team monitors 24/7 non-stop all year. We adhere to the highest security standards and implement them in every area of our activity. With the use of the leading programs and protocols in this field, we ensure the safety and integrity of your personal information at all times.",
  },
  bn: {
    helpCenter: "সাহায্য কেন্দ্র",
    aboutUs: "আমাদের সম্পর্কে",
    deposit: "ডিপোজিট",
    withdrawal: "উত্তোলন",
    games: "গেমস",
    terms: "শর্তাবলী",
    privacy: "গোপনীয়তা ও নিরাপত্তা",
    faqs: "প্রশ্নোত্তর",
    welcomeHeader: "[আপনার ব্র্যান্ড]-এ স্বাগতম",
    awardTitle: "-- পুরস্কার বিজয়ী অনলাইন গেমিং প্রোভাইডার।",
    aboutText:
      "২০০৬ সালে প্রতিষ্ঠিত, [আপনার ব্র্যান্ড] দ্রুত বিশ্বব্যাপী অনলাইন গেমিং শিল্পে বাজার নেতা হিসেবে নিজের ব্র্যান্ড ও সুনাম গড়ে তুলেছে। বিশ্বাস ও নির্ভরযোগ্যতা এই ব্র্যান্ডের মূলনীতি, যা আজও কোম্পানির সকল কার্যক্রমকে নির্ধারণ করে। [আপনার ব্র্যান্ড] সবসময় আপনার গেমিং অভিজ্ঞতাকে সমৃদ্ধ করার উপর স্পষ্ট ফোকাস রেখেছে। আমরা গর্বের সাথে আপনাকে বিভিন্ন ধরনের অনলাইন গেমিং ব্র্যান্ড অফার করি, প্রতিটি ব্র্যান্ডই নিজস্ব অনন্য, মজাদার এবং রোমাঞ্চকর গেম, সুযোগ, পুরস্কার এবং আরও অনেক কিছু প্রদান করে।",
    isLegal: "এটা কি বৈধ?",
    legalText1:
      "আমরা আমাদের ক্যাসিনো ফিলিপাইনের PAGCOR কর্তৃক ইস্যুকৃত গেমিং লাইসেন্সের অধীনে পরিচালনা করি। PAGCOR একটি স্বাধীন নিয়ন্ত্রক সংস্থা যারা নিশ্চিত করে যে ক্যাসিনোগুলো অনলাইন ক্যাসিনোর জন্য প্রযোজ্য নিয়ম ও বিধিবিধান মেনে চলে।",
    legalText2:
      "এর মানে আমরা খেলোয়াড় সুরক্ষা এবং দায়িত্বশীল গেমিংয়ের ক্ষেত্রে সবচেয়ে কঠোর নিয়ম মেনে চলি এবং আমাদের খেলোয়াড়রা আইন দ্বারা সুরক্ষিত।",
    isSecure: "এটা কি নিরাপদ?",
    secureText:
      "হ্যাঁ! আমাদের টেক টিম সারা বছর ২৪/৭ ননস্টপ মনিটরিং করে। আমরা সর্বোচ্চ নিরাপত্তা মানদণ্ড মেনে চলি এবং আমাদের সকল কার্যক্রমে তা প্রয়োগ করি। এই ক্ষেত্রের শীর্ষস্থানীয় প্রোগ্রাম ও প্রোটোকল ব্যবহার করে আমরা সর্বদা আপনার ব্যক্তিগত তথ্যের নিরাপত্তা ও অখণ্ডতা নিশ্চিত করি।",
  },
};

const HelpCenterTabs = () => {
  const { language = "en" } = useContext(AuthContext); // ← ভাষা নেওয়া হচ্ছে
  const t = translations[language];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedTab = queryParams.get("tab");

  const tabs = [
    { label: t.aboutUs, header: t.aboutUs },
    { label: t.deposit, header: t.deposit },
    { label: t.withdrawal, header: t.withdrawal },
    { label: t.games, header: t.games },
    { label: t.terms, header: t.terms },
    { label: t.privacy, header: t.privacy },
    { label: t.faqs, header: t.faqs },
  ];

  const defaultIndex = tabs.findIndex(
    (tab) => tab.label.toLowerCase() === selectedTab?.toLowerCase()
  );

  const [activeIndex, setActiveIndex] = useState(
    defaultIndex >= 0 ? defaultIndex : 0
  );

  useEffect(() => {
    if (defaultIndex >= 0) setActiveIndex(defaultIndex);
  }, [defaultIndex]);

  // সব ট্যাবের জন্য একই কন্টেন্ট (চাইলে পরে আলাদা করতে পারবেন)
  const content = {
    header: tabs[activeIndex]?.header || t.aboutUs,
    title: t.awardTitle,
    text: t.aboutText,
    title_2: t.isLegal,
    text_2: t.legalText1,
    text_3: t.legalText2,
    title_3: t.isSecure,
    text_4: t.secureText,
  };

  return (
    <div className="mb-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-1 bg-[#004e56] text-white p-3 md:p-4 rounded-xl shadow-md">
      {/* Left Tab Menu */}
      <div className="col-span-1">
        <h2 className="text-xl lg:text-2xl font-bold text-cyan-300 mb-4">
          {t.helpCenter}
        </h2>
        <ul className="flex flex-col gap-2">
          {tabs.map((tab, index) => (
            <li key={index}>
              <button
                className={`w-full text-base font-semibold text-left px-3 md:px-4 py-1.5 md:py-3 rounded-lg flex items-center justify-between transition-all ${
                  activeIndex === index
                    ? "bg-yellow-400 text-black font-bold shadow-lg"
                    : "bg-[#003a3a] hover:bg-teal-700"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {tab.label}
                <span className="text-lg ml-2">{">"}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Content Area */}
      <div className="col-span-3 p-4 md:p-6 bg-[#003840]/50 rounded-xl">
        <h3 className="text-2xl lg:text-3xl font-bold text-teal-300 mb-4">
          {content.header}
        </h3>

        <p className="text-lg font-semibold text-yellow-300 mb-3">
          {content.title}
        </p>
        <p className="text-sm md:text-base text-gray-200 leading-relaxed mb-6">
          {content.text}
        </p>

        <h4 className="text-xl font-bold text-teal-300 mb-2">
          {content.title_2}
        </h4>
        <p className="text-sm md:text-base text-gray-200 leading-relaxed mb-4">
          {content.text_2}
        </p>
        <p className="text-sm md:text-base text-gray-200 leading-relaxed mb-6">
          {content.text_3}
        </p>

        <h4 className="text-xl font-bold text-teal-300 mb-2">
          {content.title_3}
        </h4>
        <p className="text-sm md:text-base text-gray-200 leading-relaxed">
          {content.text_4}
        </p>
      </div>
    </div>
  );
};

export default HelpCenterTabs;
