import { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "@/Context/AuthContext";

const AutoDeposit = () => {
  const { userId, user,language } = useContext(AuthContext);

  const [oraclePayEnabled, setOraclePayEnabled] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const amounts = useMemo(() => [100, 200, 500, 1000, 3000, 5000, 10000, 25000], []);
  const [selectedAmount, setSelectedAmount] = useState(100);

  // ✅ NEW: user input amount
  const [customAmount, setCustomAmount] = useState("100");

  const [processing, setProcessing] = useState(false);

  const checkImage = "https://i.ibb.co.com/6c7zBpFc/deposit.png";

  // fetch enabled status
  useEffect(() => {
    const fetchOraclePayStatus = async () => {
      try {
        setLoadingStatus(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/oraclepay-business/status`,
        );
        setOraclePayEnabled(!!res?.data?.data?.enabled);
      } catch {
        setOraclePayEnabled(false);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchOraclePayStatus();
  }, []);

  const clampNumber = (val) => {
    const n = Number(val);
    if (!Number.isFinite(n)) return 0;
    return Math.floor(n);
  };

  const handleAmountChange = (a) => {
    setSelectedAmount(a);
    setCustomAmount(String(a));
  };

  // ✅ user types amount
  const handleCustomAmountChange = (e) => {
    // only allow digits
    const v = e.target.value.replace(/[^\d]/g, "");
    setCustomAmount(v);

    const n = clampNumber(v);
    setSelectedAmount(n || 0);
  };

  const handleProcess = async () => {
    try {
      if (!oraclePayEnabled) {
        toast.error(
          language === "bn"
            ? "Auto Deposit এখন Available নেই"
            : "Auto Deposit is disabled",
        );
        return;
      }

      const amount = clampNumber(customAmount || selectedAmount);
      if (!amount || amount < 5) {
        toast.error(
          language === "bn" ? "Minimum amount 5" : "Minimum amount is 5",
        );
        return;
      }

      if (!userId) {
        toast.error(
          language === "bn"
            ? "Please login again"
            : "User not found. Please login again.",
        );
        return;
      }

      setProcessing(true);

      const invoiceNumber = `DEP-${userId}-${Date.now()}`;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/oraclepay-business/create`,
        {
          amount,
          userIdentity: userId,
          invoiceNumber,
          checkoutItems: {
            type: "deposit",
            method: "auto",
            gateway: "oraclepay",
            username: user?.username || "",
          },
        },
      );

      if (res.data?.success && res.data?.payment_page_url) {
        window.location.href = res.data.payment_page_url;
        return;
      }

      toast.error(res.data?.message || "Payment link create failed");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Payment link create failed");
    } finally {
      setProcessing(false);
    }
  };

  // loading status UI
  if (loadingStatus) {
    return (
      <div className="p-3 md:p-6">
        <div className="bg-white border rounded-xl p-6 text-center font-bold text-gray-600">
          Loading...
        </div>
      </div>
    );
  }

  // if disabled, hide page nicely
  if (!oraclePayEnabled) {
    return (
      <div className="p-3 md:p-6 min-h-screen md:min-h-0">
        <div className="bg-white border rounded-xl p-6 text-center">
          <h2 className="text-lg md:text-xl font-extrabold text-gray-900">
            {language === "bn" ? "Auto Deposit" : "Auto Deposit"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {language === "bn"
              ? "এই মুহূর্তে Auto Deposit বন্ধ আছে। পরে চেষ্টা করুন।"
              : "Auto Deposit is currently disabled. Please try later."}
          </p>
        </div>
      </div>
    );
  }

  const amountNumber = clampNumber(customAmount || selectedAmount);
  const isMatchPreset = amounts.includes(amountNumber);

  return (
    <div className="px-3 py-4 min-h-screen md:min-h-0 md:px-6 md:py-6 w-full">
      {/* ✅ responsive container: mobile full, laptop centered */}
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white border rounded-2xl shadow-sm p-4 md:p-6">
          {/* header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-[#145252] rounded-lg p-4">
            <div>
              <h2 className="text-lg md:text-2xl font-extrabold text-white">
                {language === "bn" ? "Auto Deposit" : "Auto Deposit"}
              </h2>
              <p className="text-xs md:text-sm text-white mt-1">
                {language === "bn"
                  ? "পরিমাণ সিলেক্ট করুন অথবা নিজের মতো টাইপ করুন"
                  : "Select amount or type your own amount"}
              </p>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-white">
                {language === "bn" ? "User" : "User"}
              </div>
              <div className="font-extrabold text-white text-base md:text-lg">
                {user?.username || "User"}
              </div>
            </div>
          </div>

          {/* amount section */}
          <div className="mt-6">
            <div className="text-sm font-bold text-gray-700 mb-2">
              {language === "bn" ? "ডিপোজিট পরিমাণ" : "Deposit Amount"}
            </div>

            {/* preset buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 flex-wrap">
              {amounts.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => handleAmountChange(a)}
                  className={`relative px-4 py-2 rounded-lg border-2 font-bold transition-all ${
                    amountNumber === a
                      ? "border-[#d60000] bg-[#d60000] text-white shadow-lg"
                      : "border-gray-300 bg-white text-black hover:border-gray-500"
                  }`}
                >
                  ৳{a}
                  {amountNumber === a && (
                    <div className="absolute -bottom-1 -right-1">
                      <img src={checkImage} alt="selected" className="w-6" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* ✅ custom input */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="w-full">
                <label className="text-xs font-bold text-gray-600">
                  {language === "bn"
                    ? "কাস্টম পরিমাণ (নিজে লিখুন)"
                    : "Custom amount (type)"}
                </label>

                <div className="mt-2 flex items-center gap-2">
                  <div className="px-3 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 font-extrabold">
                    ৳
                  </div>

                  <input
                    inputMode="numeric"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder={language === "bn" ? "যেমন: 250" : "e.g. 250"}
                    className="w-full border-2 border-gray-300 p-3 rounded-lg font-bold text-lg outline-none focus:border-black"
                  />
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  {language === "bn"
                    ? "শুধু সংখ্যা লিখুন। Minimum 5."
                    : "Numbers only. Minimum 5."}
                </div>
              </div>

              {/* selected display */}
              <div className="w-full">
                <label className="text-xs font-bold text-gray-600">
                  {language === "bn" ? "সিলেক্টেড পরিমাণ" : "Selected Amount"}
                </label>
                <input
                  type="text"
                  readOnly
                  value={`৳${amountNumber || 0}`}
                  className="mt-2 w-full border-2 border-gray-300 p-4 rounded-lg text-center font-extrabold text-2xl bg-gray-50"
                />

                {/* {!isMatchPreset && amountNumber > 0 && (
                  <div className="mt-2 text-xs font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    {language === "bn"
                      ? "কাস্টম পরিমাণ সিলেক্ট করা হয়েছে"
                      : "Custom amount selected"}
                  </div>
                )} */}
              </div>
            </div>
          </div>

          {/* process button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleProcess}
              disabled={processing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-white border-2 border-black font-extrabold text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ minWidth: "220px", backgroundColor: "#145252" }}
            >
              {processing
                ? language === "bn"
                  ? "প্রসেস হচ্ছে..."
                  : "Processing..."
                : language === "bn"
                  ? "Deposit Now"
                  : "Deposit Now"}
            </button>
          </div>

          {/* small note */}
          <div className="mt-4 text-xs text-gray-600 text-center">
            {language === "bn"
              ? "Process এ ক্লিক করলে OraclePay payment page এ নিয়ে যাবে।"
              : "Clicking Process will redirect to OraclePay payment page."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoDeposit;
