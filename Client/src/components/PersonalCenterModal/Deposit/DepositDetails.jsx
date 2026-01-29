import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CustomNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white z-50 ${
        type === "success" ? "bg-[#006341]" : "bg-[#d60000]"
      }`}
    >
      {message}
    </div>
  );
};

const DepositDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract from URL
  const amount = searchParams.get("amount") || "0";
  const languageParam = searchParams.get("language") || "bn";
  const paymentMethodId = searchParams.get("paymentMethodId") || "";
  const channel = searchParams.get("channel") || "Personal";
  const userId = searchParams.get("userId") || "";
  const agentWalletNumber = searchParams.get("agentWalletNumber") || "N/A";
  const agentWalletText = searchParams.get("agentWalletText") || "";
  const methodName = searchParams.get("methodName") || "Unknown";
  const methodNameBD = searchParams.get("methodNameBD") || "অজানা";
  const methodImage = searchParams.get("methodImage") || "";
  const userInputsRaw = searchParams.get("userInputs") || "[]";
  const selectedPromotionRaw = searchParams.get("selectedPromotion") || null;

  // Safe JSON Parse
  let userInputs = [];
  let selectedPromotion = null;
  try {
    userInputs = JSON.parse(userInputsRaw);
    if (!Array.isArray(userInputs)) userInputs = [];
  } catch (e) {
    userInputs = [];
  }

  try {
    if (selectedPromotionRaw)
      selectedPromotion = JSON.parse(selectedPromotionRaw);
  } catch (e) {
    selectedPromotion = null;
  }

  const [currentLanguage, setCurrentLanguage] = useState(languageParam);
  const [inputValues, setInputValues] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const IMG_URL = `${API_URL}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(agentWalletNumber);
    setNotification({
      show: true,
      message:
        currentLanguage === "bn" ? "নম্বর কপি করা হয়েছে" : "Number copied",
      type: "success",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setNotification({ show: true, message: "লগইন প্রয়োজন", type: "error" });
      return;
    }

    for (const input of userInputs) {
      if (input.isRequired === "true" && !inputValues[input.name]?.trim()) {
        setNotification({
          show: true,
          message:
            currentLanguage === "bn"
              ? `${input.labelBD || input.label} প্রয়োজন`
              : `${input.label} is required`,
          type: "error",
        });
        return;
      }
    }

    setIsLoading(true);

    const formattedInputs = userInputs.map((input) => ({
      name: input.name,
      value: inputValues[input.name] || "",
      label: input.label,
      labelBD: input.labelBD,
      type: input.type || "text",
    }));

    const payload = {
      userId,
      paymentMethodId,
      channel,
      amount: Number(amount),
      userInputs: formattedInputs,
      promotionId: selectedPromotion?._id || null,
      promotionTitle: selectedPromotion
        ? currentLanguage === "bn"
          ? selectedPromotion.bn
          : selectedPromotion.en
        : "",
    };

    try {
      const res = await axios.post(
        `${API_URL}/api/deposit/deposit-transaction`,
        payload
      );

      if (res.data.success) {
        // সফলভাবে ট্রানজেকশন তৈরি হয়েছে → টোস্ট দেখিয়ে তৎক্ষণাৎ হোমে যাওয়া
        setNotification({
          show: true,
          message:
            currentLanguage === "bn"
              ? "সফলভাবে জমা দেওয়া হয়েছে!"
              : "Successfully submitted!",
          type: "success",
        });

        // অল্প দেরি দিয়ে (টোস্ট দেখার জন্য) হোমে রিডাইরেক্ট
        // মডাল/পপআপ উইন্ডো বন্ধ করা
        setTimeout(() => {
          if (window.opener || window.history.length === 1) {
            // যদি পপআপ উইন্ডো হয় বা ব্যাক করার কোনো হিস্ট্রি না থাকে
            window.close();
          } else {
            // fallback: হোম পেজে রিডাইরেক্ট
            navigate("/");
          }
        }, 1500); // টোস্ট দেখার জন্য সামান্য দেরি
      }
    } catch (err) {
      setNotification({
        show: true,
        message: err.response?.data?.msg || "কিছু ভুল হয়েছে",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "bn" ? "en" : "bn"));
  };

  return (
    <>
      {/* Preload Lottie (যদি অন্য কোথাও লাগে) */}
      <div className="hidden">
        <iframe src="https://lottie.host/embed/01eb7485-26c2-4200-bd28-35aa8234da77/3SaIZBQqPn.lottie"></iframe>
        <iframe src="https://lottie.host/embed/8777f25c-49f0-4d4a-a532-b21fea08c387/8ogxaPjMnh.lottie"></iframe>
      </div>

      {/* Main UI */}
      <div className="min-h-screen bg-[#f5f7f8] font-['Noto_Sans_Bengali'] flex items-center justify-center">
        {notification.show && (
          <CustomNotification
            message={notification.message}
            type={notification.type}
            onClose={() =>
              setNotification({ show: false, message: "", type: "" })
            }
          />
        )}

        <div className="max-w-[600px] w-full bg-white rounded-[12px] shadow-[0_3px_12px_rgba(0,0,0,0.1)] overflow-hidden">
          {/* Header */}
          <div className="bg-[#006341] text-white p-[15px_20px] flex justify-between items-center">
            <div className="text-[18px] font-semibold">
              {currentLanguage === "bn" ? "BDT" : "Amount"}{" "}
              <span className="font-bold">{amount}</span>
              <br />
              <small>
                {currentLanguage === "bn"
                  ? "কম বা বেশি ক্যাশআউট করবেন না"
                  : "Do not cash out less or more"}
              </small>
            </div>
            <div className="flex items-center gap-[6px] text-[14px]">
              <div className="bg-white text-[#006341] font-bold px-[6px] py-[4px] rounded-[3px] text-[13px]">
                Oracle Pay
              </div>
              SERVICE
              <div
                className="bg-white text-[#333] rounded-[4px] px-[6px] py-[3px] text-[13px] cursor-pointer"
                onClick={toggleLanguage}
              >
                {currentLanguage === "bn" ? "EN | বাংলা" : "EN | Bangla"}
              </div>
            </div>
          </div>

          <div className="p-[25px]">
            {/* Warning */}
            <div className="text-[#d60000] font-semibold mb-[20px] text-[15px]">
              {currentLanguage === "bn"
                ? `আপনি যদি টাকার পরিমাণ পরিবর্তন করেন (BDT ${amount})। আপনি ক্রেডিট পেতে সক্ষম হবেন না।`
                : `If you change the amount (BDT ${amount}), you will not be able to receive credit.`}
            </div>

            {/* Wallet & Method */}
            <div className="gap-[20px] flex flex-wrap justify-between mb-[25px]">
              <div className="flex-1 min-w-[260px] mb-[20px]">
                <label className="font-semibold text-[15px]">
                  {currentLanguage === "bn" ? "ওয়ালেট নম্বর*" : "Wallet No*"}
                </label>
                <div className="text-[13px] text-[#555] mb-[6px]">
                  {currentLanguage === "bn"
                    ? "এই নাম্বারে শুধুমাত্র ক্যাশআউট গ্রহণ করা হয়"
                    : "Only cashouts are accepted to this number"}
                </div>
                <div className="flex items-center bg-[#f9f9f9] border border-[#ccc] rounded-[6px] p-[10px] text-[15px] text-[#333]">
                  <span className="flex-grow">{agentWalletNumber}</span>
                  <div
                    className="bg-[#e5f4ed] rounded-[5px] p-[6px] cursor-pointer text-[18px] text-[#00764f]"
                    onClick={handleCopy}
                  >
                    Copy
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-[260px]">
                <label className="font-semibold text-[15px] block mb-[8px]">
                  {currentLanguage === "bn"
                    ? "ওয়ালেট প্রোভাইডার"
                    : "Wallet Provider"}
                </label>
                <div className="text-[13px] text-[#555]">Method</div>
                <div className="flex items-center bg-pink-50 text-black p-[10px_16px] rounded-[8px] font-semibold gap-[10px]">
                  {methodImage && (
                    <img
                      src={`${IMG_URL}${methodImage}`}
                      alt={methodName}
                      className="w-[80px] h-[40px] rounded-full"
                    />
                  )}
                  {currentLanguage === "bn" ? methodNameBD : methodName}
                </div>
              </div>
            </div>

            {/* Dynamic Inputs */}
            {userInputs.length > 0 && (
              <div className="mb-[25px]">
                {userInputs.map((input) => (
                  <div key={input.name} className="mb-4">
                    <label className="block font-semibold text-[#d60000] mb-[6px] text-[15px]">
                      {currentLanguage === "bn" ? input.labelBD : input.label}
                      {input.isRequired === "true" && (
                        <span>
                          {" "}
                          ({currentLanguage === "bn" ? "প্রয়োজন" : "Required"})
                        </span>
                      )}
                    </label>
                    <input
                      type={input.type || "text"}
                      name={input.name}
                      value={inputValues[input.name] || ""}
                      onChange={handleInputChange}
                      placeholder={
                        currentLanguage === "bn"
                          ? input.fieldInstructionBD || "TrxID লিখুন"
                          : input.fieldInstruction || "Enter TrxID"
                      }
                      className="w-full border border-[#d60000] rounded-[6px] p-[10px] text-[15px] placeholder-[#999]"
                      required={input.isRequired === "true"}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="block w-[140px] text-center bg-white border-[1.5px] border-black text-black rounded-[10px] font-semibold text-[16px] py-[8px] mx-auto mb-[20px] hover:bg-black hover:text-white transition duration-200"
            >
              {isLoading
                ? currentLanguage === "bn"
                  ? "জমা হচ্ছে..."
                  : "Submitting..."
                : currentLanguage === "bn"
                ? "নিশ্চিত"
                : "Confirm"}
            </button>

            {/* Final Warning */}
            <div className="bg-[#fff8f8] border-l-[4px] border-[#d60000] p-[10px_12px] text-[14px] text-[#d60000] leading-[1.6]">
              <span className="font-bold">
                {currentLanguage === "bn" ? "সতর্কতা:" : "Warning:"}
              </span>{" "}
              {currentLanguage === "bn"
                ? `আপনার ট্রান্সফারটি সঠিকভাবে পূরণ করতে হবে, অন্যথায় অর্থ হারিয়ে যাবে! অনুগ্রহ করে কেবল নিচে দেয়া নির্দিষ্ট নাম্বারে আপনার ${methodNameBD} ডিপোজিট ক্যাশআউট করুন।`
                : `Your transfer must be filled correctly, otherwise the funds will be lost! Please cash out your ${methodNameBD} deposit only to the specified number below.`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DepositDetails;
