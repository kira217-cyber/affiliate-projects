import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";
import { TbRating18Plus } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext"; // Adjust path if needed
import logo_footer from "../../../assets/logo.png";

const Footer = () => {
  const { language, adminHomeControl } = useContext(AuthContext);

  // Translation Object
  const t = {
    en: {
      helpCenter: "Help Center",
      gameCenter: "Game Center",
      partner: "PARTNER",
      liveChat: "Live Chat",
      aboutUs: "About Us",
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      games: "Games",
      terms: "Terms and Conditions",
      privacy: "Privacy and Security",
      faqs: "FAQs",
      hotGames: "Hot Games",
      slots: "Slots",
      live: "Live",
      sports: "Sports",
      poker: "Poker",
      fish: "Fish",
      lottery: "Lottery",
      partnerText: "Partner",
      liveChatText: "Live Chat",
    },
    bn: {
      helpCenter: "সাহায্য কেন্দ্র",
      gameCenter: "খেলার কেন্দ্র",
      partner: "অংশীদার",
      liveChat: "লাইভ চ্যাট",
      aboutUs: "আমাদের সম্পর্কে",
      deposit: "ডিপজিট",
      withdrawal: "উত্তোলন",
      games: "গেমস",
      terms: "নিয়ম ও শর্তাবলী",
      privacy: "গোপনীয়তা ও নিরাপত্তা",
      faqs: "প্রশ্নোত্তর",
      hotGames: "গরম খেলা",
      slots: "স্লট",
      live: "লাইভ",
      sports: "স্পোর্টস",
      poker: "পোকার",
      fish: "ফিশিং",
      lottery: "লটারি",
      partnerText: "অংশীদার",
      liveChatText: "লাইভ চ্যাট",
    },
  };

  const translate = (key) => t[language][key] || t.en[key];

  // Help Center Links
  const helpLinks = [
    { label: translate("aboutUs"), link: "/help?tab=About Us" },
    { label: translate("deposit"), link: "/help?tab=Deposit" },
    { label: translate("withdrawal"), link: "/help?tab=Withdrawal" },
    { label: translate("games"), link: "/help?tab=Games" },
    { label: translate("terms"), link: "/help?tab=Terms and Conditions" },
    { label: translate("privacy"), link: "/help?tab=Privacy and Security" },
    { label: translate("faqs"), link: "/help?tab=FAQs" },
  ];

  // Game Center Links
  const gameLinks = [
    { label: translate("hotGames"), link: "/" },
    { label: translate("slots"), link: "/" },
    { label: translate("live"), link: "/" },
    { label: translate("sports"), link: "/" },
    { label: translate("poker"), link: "/" },
    { label: translate("fish"), link: "/" },
    { label: translate("lottery"), link: "/" },
  ];

  const vendorLogos = [
    "JL-COLOR.png",
    "SPB-COLOR.png",
    "PG-COLOR.png",
    "BNG-COLOR.png",
    "FC-COLOR.png",
    "MG-COLOR.png",
    "JDB-COLOR.png",
    "SS-COLOR.png",
    "PS-COLOR.png",
    "AMBS-COLOR.png",
    "FP-COLOR.png",
    "EZG-COLOR.png",
    "5G-COLOR.png",
    "AE-COLOR.png",
    "BOM-COLOR.png",
    "NE-COLOR.png",
    "RT-COLOR.png",
  ];

  return (
    <div className="bg-[#003a3a] w-full py-8 lg:py-16 px-4 lg:px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="lg:flex gap-5 text-white">
          {/* Mobile Buttons */}
          <div className="flex flex-wrap gap-2 w-full justify-center mb-6 lg:hidden">
            <Link
              to="https://aff.bajigo.live"
              target="_blank"
              rel="noreferrer"
              className="flex-1 mb-3 min-w-[120px] flex items-center justify-center cursor-pointer px-4 py-2 text-lg font-bold rounded-md bg-[#025659] text-[#FCCF00] hover:bg-yellow-400 hover:text-yellow-700 transition-all"
              style={{
                background: "linear-gradient(180deg, #0f727c, #004e56)",
                border: "1px solid rgba(0, 97, 72, 1)",
                borderRadius: "8px",
                boxShadow: "0 1px 0 0 #005540",
                height: "40px",
                gap: "8px",
              }}
            >
              {translate("partnerText")}
            </Link>
            <Link
              to="https://tawk.to/chat/68f68ce6a86dab1951b9ac2e/1j81hcq00"
              target="_blank"
              className="flex-1 min-w-[120px] flex items-center justify-center cursor-pointer px-4 py-2 text-lg font-bold rounded-md bg-[#025659] text-[#FCCF00] hover:bg-yellow-400 hover:text-yellow-700 transition-all"
              style={{
                background: "linear-gradient(180deg, #0f727c, #004e56)",
                border: "1px solid rgba(0, 97, 72, 1)",
                borderRadius: "8px",
                boxShadow: "0 1px 0 0 #005540",
                height: "40px",
              }}
            >
              {translate("liveChatText")}
            </Link>
          </div>

          <div className="flex justify-between gap-5 whitespace-nowrap mb-5 lg:mb-0 lg:justify-end">
            {/* Help Center */}
            <div className="hidden lg:block">
              <h2 className="text-xl font-bold text-yellow-500">
                {translate("helpCenter")}
              </h2>
              <ul className="flex flex-col gap-1 mt-2 text-base">
                {helpLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-teal-300 after:transition-all after:duration-300 hover:after:w-full hover:text-teal-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Game Center – Perfect for Mobile + Desktop */}
            {/* Game Center – Mobile: Horizontal Buttons | Desktop: Vertical List (Exactly Like Your Image) */}
            <div className="w-full">
              <h2 className="text-xl md:text-2xl font-bold text-yellow-400 drop-shadow-md mb-2">
                {translate("gameCenter")}
              </h2>

              {/* Mobile: Horizontal Wrap Buttons */}
              <div className="flex md:hidden flex-wrap gap-3">
                {gameLinks.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="group relative px-5 py-3 rounded-lg font-medium text-sm bg-gradient-to-b from-[#003840] to-[#002632] border border-[#00ffaa]/30 text-[#1FE5B6] shadow-lg hover:shadow-[#00ffaa]/30 transition-all duration-300 hover:scale-105 hover:border-[#00ffaa]/60 overflow-hidden"
                  >
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ffaa]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                    </span>
                    <span className="relative">
                      {item.label}
                      <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-[#00ffaa] to-[#23ffc8] transition-all duration-500 group-hover:w-full" />
                    </span>
                  </Link>
                ))}
              </div>

              {/* Desktop: Vertical List – Exactly Like Your Screenshot */}
              {/* Help Center */}
              <div className="hidden lg:block">
                <ul className="flex flex-col gap-1  text-base">
                  {gameLinks.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.link}
                        className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-teal-300 after:transition-all after:duration-300 hover:after:w-full hover:text-teal-300"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-4 lg:mt-8">
            <div className="flex gap-2">
              <img
                className="w-16 md:w-20 h-16 md:h-20"
                src={
                  adminHomeControl?.favicon
                    ? `${import.meta.env.VITE_BACKEND_API}uploads/${adminHomeControl.favicon}`
                    : `${logo_footer}`
                } // fallback if no favicon in DB}
                alt="Logo"
              />
              <p className="text-[12px] md:text-base mb-4 text-[#e0fff7]">
                {language === "bn" ? (
                  <>
                    এই ওয়েবসাইটটি কোম্পানি দ্বারা পরিচালিত হয়, লাইসেন্স
                    নম্বর GLH-OCCHKTW079780120 এর অধীনে এবং Gaming Services
                    Provider N.V. দ্বারা নিয়ন্ত্রিত। কুরাসাও সরকার কর্তৃক
                    অনুমোদিত, লাইসেন্স নম্বর 375/JAZ।
                  </>
                ) : (
                  <>
                    This website is operated by company, under license number
                    GLH-OCCHKTW079780120 issued to it and regulated by Gaming
                    Services Provider N.V., authorized by the Government of
                    Curaçao under license number 375/JAZ.
                  </>
                )}
              </p>
            </div>

            <div className="border-b border-teal-300 flex flex-wrap justify-center md:justify-start gap-2 pb-4 mb-4">
              <Link
                to="https://aff.bajigo.live"
                target="_blank"
                rel="noreferrer"
                className="py-1 px-4 text-lg rounded-md text-yellow-400 bg-teal-700 hidden md:block"
              >
                {translate("partner")}
              </Link>
              <Link className="py-1 px-4 text-lg rounded-md text-yellow-400 bg-teal-700 hidden md:block">
                {translate("liveChat")}
              </Link>
              <Link
                to="https://www.facebook.com/share/1BaDECaiXE/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-8 h-8 text-lg rounded-full text-white bg-blue-700"
              >
                <FaFacebookF />
              </Link>
              <Link className="flex items-center justify-center w-8 h-8 text-lg rounded-full text-white bg-red-400">
                <FaInstagram />
              </Link>
              <Link
                to="https://t.me/Nurnabi2288"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-8 h-8 text-lg rounded-full text-white bg-blue-400"
              >
                <FaTelegramPlane />
              </Link>
              <Link
                to="https://wa.me/01735586058"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-8 h-8 text-lg rounded-full text-white bg-green-500"
              >
                <FaWhatsapp />
              </Link>
              <Link className="flex items-center justify-center w-8 h-8 text-lg rounded-full text-red-400 bg-white">
                <TbRating18Plus />
              </Link>
            </div>

            <div className="grid grid-cols-6 md:grid-cols-7 gap-2">
              {vendorLogos.map((logo, index) => (
                <img
                  key={index}
                  className=""
                  src={`https://images.185949949.com/TCG_PROD_IMAGES/RNG_LIST_VENDOR/${logo}`}
                  alt={`Vendor ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
