import { useState, useEffect, useContext } from "react";
import checkImage from "../../../assets/check.8cbcb507.svg";
import { AuthContext } from "@/Context/AuthContext";

// Custom Notification Component
const CustomNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-2 rounded-md shadow-lg text-white font-medium transition-all animate-pulse ${
        type === "success" ? "bg-[#006341]" : "bg-[#d60000]"
      }`}
    >
      {message}
    </div>
  );
};

const CommonContent = ({
  amounts,
  selectedProcessTab,
  selectedTab,
  language,
  selectedPromotion,
  tabsData,
  userId,
  handlePromotionChange,
  minAmount,
  maxAmount,
  selectedAmount: parentSelectedAmount,
  setSelectedAmount: setParentSelectedAmount,
  depositPaymentMethods,
  methodName,
  opayOnlineCount,
  viewerApiKey,
}) => {
  const { user } = useContext(AuthContext);

  const [selectedAmount, setSelectedAmount] = useState(amounts[0] || 100);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync selected amount with parent component
  useEffect(() => {
    setSelectedAmount(parentSelectedAmount || amounts[0] || 100);
  }, [parentSelectedAmount, amounts]);

  // Handle amount selection
  const handleAmountChange = (amount) => {
    setSelectedAmount(amount);
    setParentSelectedAmount(amount);
  };

  // Show notification (auto hide after 3 seconds)
  const showNotification = (msg, type = "error") => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Find current payment method from database
  const currentMethodFromDB =
    depositPaymentMethods?.find((method) => method._id === selectedTab) || {};

  // Main deposit handler
  const handleApply = async (e) => {
    e.preventDefault();

    // Validate amount
    if (!selectedAmount || selectedAmount < minAmount || selectedAmount > maxAmount) {
      showNotification(
        language === "bn"
          ? `পরিমাণ ${minAmount} - ${maxAmount} এর মধ্যে হতে হবে`
          : `Amount must be between ${minAmount} - ${maxAmount}`,
        "error"
      );
      return;
    }

    // Check login
    if (!user?._id) {
      showNotification(
        language === "bn" ? "অনুগ্রহ করে লগইন করুন" : "Please login first",
        "error"
      );
      return;
    }

    


    // Special handling for Opay
    if (String(selectedProcessTab).toLowerCase() === "opay") {
      if (opayOnlineCount > 0) {
        setIsLoading(true);
        const amount = selectedAmount;
        const userIdentifyAddress = userId;
        const url = `${import.meta.env.VITE_SOCKET_IO_URL}/api/external/generate?methods=${encodeURIComponent(
          methodName
        )}&amount=${amount}&userIdentifyAddress=${encodeURIComponent(
          userIdentifyAddress
        )}`;
        const apiKey = viewerApiKey || "";
        if (!apiKey) {
          setIsLoading(false);
          showNotification(
            language === "bn" ? "API Key পাওয়া যায়নি" : "API Key missing",
            "error"
          );
          return;
        }
        try {
          const res = await fetch(url, {
            method: "GET",
            headers: {
              "X-API-Key": apiKey,
            },
          });
          const data = await res.json();
          setIsLoading(false);
          if (data?.payment_page_url) {
            window.location.href = data.payment_page_url;
            return;
          } else {
            showNotification(
              (language === "bn"
                ? "পেমেন্ট পেজ URL পাওয়া যায়নি।"
                : "Payment page URL not found.") +
                (data?.msg ? ` ${data.msg}` : ""),
              "error"
            );
          }
        } catch (err) {
          setIsLoading(false);
          showNotification(
            (language === "bn"
              ? "পেমেন্ট পেজ লোড করতে সমস্যা হয়েছে।"
              : "Failed to load payment page.") +
              (err?.message ? ` ${err.message}` : ""),
            "error"
          );
        }
        return;
      } else {
        // Opay selected but no device online, fetch support number
        setIsLoading(true);
        const apiKey = viewerApiKey || "";
        if (!apiKey) {
          setIsLoading(false);
          showNotification(language === "bn" ? "API Key পাওয়া যায়নি" : "API Key missing", "error");
          return;
        }
        try {
          const res = await fetch(`${import.meta.env.VITE_SOCKET_IO_URL}/api/external/support-number`, {
            method: "GET",
            headers: {
              "X-API-Key": apiKey,
            },
          });
          const data = await res.json();
          setIsLoading(false);
          if (data?.success && data.supportNumber) {
            showNotification(
              (language === "bn"
                ? `অনুগ্রহ করে সাপোর্ট নম্বরে যোগাযোগ করুন: ${data.supportNumber}`
                : `Please contact support number: ${data.supportNumber}`),
              "error"
            );
          } else {
            showNotification(
              language === "bn"
                ? "কোনো সাপোর্ট নম্বর পাওয়া যায়নি।"
                : "No support number found.",
              "error"
            );
          }
        } catch (err) {
          setIsLoading(false);
          showNotification(
            (language === "bn"
              ? "সাপোর্ট নম্বর আনতে সমস্যা হয়েছে।"
              : "Failed to fetch support number.") +
              (err?.message ? ` ${err.message}` : ""),
            "error"
          );
        }
        return;
      }
    }

    // Default flow: Open deposit details in popup
    const params = new URLSearchParams({
      amount: selectedAmount,
      language: language,
      paymentMethodId: currentMethodFromDB._id || "",
      channel: selectedProcessTab || "Personal",
      userId: userId,
      token: user?.token || "",
      agentWalletNumber: currentMethodFromDB.agentWalletNumber || "N/A",
      agentWalletText: currentMethodFromDB.agentWalletText || "",
      methodName: currentMethodFromDB.methodName || "Unknown",
      methodNameBD: currentMethodFromDB.methodNameBD || "অজানা",
      methodImage: currentMethodFromDB.methodImage || "",
      userInputs: JSON.stringify(currentMethodFromDB.userInputs || []),
      selectedPromotion: selectedPromotion
        ? JSON.stringify(selectedPromotion)
        : "",
    });

    console.log("Opening Deposit Details with:", params.toString());

    const popup = window.open(
      `/deposit-details?${params.toString()}`,
      "depositPopup",
      "width=650,height=800,scrollbars=yes,resizable=yes,left=300,top=50"
    );

    if (!popup) {
      showNotification(
        language === "bn"
          ? "পপআপ ব্লক হয়েছে! পপআপ অনুমতি দিন।"
          : "Popup blocked! Please allow popups.",
        "error"
      );
    }
  };

  return (
    <div className="w-full">
      {/* Notification */}
      {notification.show && (
        <CustomNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: "", type: "" })}
        />
      )}

      {/* Amount Selection */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <p className="font-semibold min-w-[140px]">
            {language === "bn" ? "ডিপোজিট পরিমাণ:" : "Deposit Amount:"}
          </p>

          <div className="flex flex-col flex-1">
            {/* Predefined Amount Buttons */}
            <div className="flex gap-2 flex-wrap mb-4">
              {amounts.map((amount) => (
                <div
                  key={amount}
                  onClick={() => handleAmountChange(amount)}
                  className={`relative px-4 py-2 rounded-lg border-2 cursor-pointer transition-all text-lg font-medium ${
                    selectedAmount === amount
                      ? "border-[#d60000] bg-[#d60000] text-white shadow-lg"
                      : "border-gray-300 bg-white text-black hover:border-gray-500"
                  }`}
                >
                  ৳{amount}
                  {selectedAmount === amount && (
                    <div className="absolute -bottom-1 -right-1">
                      <img src={checkImage} alt="selected" className="w-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Amount Display */}
            <input
              type="text"
              value={`৳${selectedAmount}`}
              readOnly
              className="border-2 border-gray-300 p-4 rounded-lg w-full text-center font-bold text-2xl bg-gray-50"
            />

            {/* Deposit Limit Info */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
              <p className="text-lg font-semibold text-[#d60000]">
                {language === "bn" ? "জমাসীমা:" : "Deposit Limit:"}{" "}
                <span className="text-2xl">৳{minAmount} - ৳{maxAmount}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {language === "bn" ? "জমার তথ্য: 24/24" : "Deposit Info: 24/24"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Promotion Display */}
      {selectedPromotion && (
        <div className="my-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
          <p className="text-lg font-semibold">
            {language === "bn" ? "নির্বাচিত প্রমোশন:" : "Selected Promotion:"}{" "}
            <span className="text-green-700 font-bold">
              {language === "bn" ? selectedPromotion.bn : selectedPromotion.en}
            </span>
          </p>
        </div>
      )}

      {/* Main Deposit Button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleApply}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl text-black border-2 border-black font-bold text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            backgroundColor: currentMethodFromDB.backgroundColor || "#ffffff",
            minWidth: "200px",
          }}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-8 w-8 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span>{language === "bn" ? "লোড হচ্ছে..." : "Loading..."}</span>
            </>
          ) : (
            <span>
              {language === "bn" ? "এখনই ডিপোজিট করুন" : "Proceed to Deposit"}
            </span>
          )}
        </button>
      </div>

      {/* Hidden Promotion Selection (for future use) */}
      <div style={{ display: "none" }}>
        {/* Promotion selection logic here if needed later */}
      </div>
    </div>
  );
};

export default CommonContent;