import { useState, useEffect, useContext } from "react";
// For redirect
import { useRef } from "react";
import axios from "axios";
// import { AuthContext } from "@/context/AuthContext"; // তোমার AuthContext
import { baseURL, baseURL_For_IMG_UPLOAD } from "@/utils/baseURL";
import CommonContent from "./CommonContent";
import checkImage from "../../../assets/check.8cbcb507.svg";
import { FaExclamationTriangle, FaRegFileAlt } from "react-icons/fa";
import { io } from "socket.io-client";
import { RiCustomerService2Line } from "react-icons/ri";
import { AuthContext } from "@/Context/AuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// OpayDevicesPanel hidden from user view (no import needed)

const TabsWrapper = ({ language }) => {
  const { userId } = useContext(AuthContext); // যদি লাগে

  // Prevent multiple API calls
  const opayApiCalled = useRef(false);

  const [depositPaymentMethods, setDepositPaymentMethods] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTab, setSelectedTab] = useState(null);
  const [methodName, setMethodName] = useState("");
  const [selectedProcessTab, setSelectedProcessTab] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [opayOnlineCount, setOpayOnlineCount] = useState(0);
  const [viewerApiKey, setViewerApiKey] = useState(null);
  const [opayEnabled, setOpayEnabled] = useState(false);

  // Fetch Deposit Methods + Promotions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [methodsRes, promoRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/deposit-payment-method/methods`
          ),
          axios.get(`${import.meta.env.VITE_API_URL}/api/promotions`), // তোমার promotion API
        ]);

        const methods = methodsRes.data.success ? methodsRes.data.data : [];
        const promos = promoRes.data.success ? promoRes.data.data : [];

        setDepositPaymentMethods(methods);
        setPromotions(promos);

        // Auto select first method; prefer non-Opay channel to avoid disabled default
        if (methods.length > 0) {
          const first = methods[0];
          setSelectedTab(first._id);
          setMethodName(first.methodName.toLowerCase());
          const initialGateways = Array.isArray(first.gateway)
            ? first.gateway
            : [];
          const nonOpay = initialGateways.filter(
            (g) => String(g).toLowerCase() !== "opay"
          );
          setSelectedProcessTab(nonOpay[0] || initialGateways[0] || null);
        }
      } catch (err) {
        console.error("Failed to fetch deposit data:", err);
        setError(
          err.response?.data?.msg ||
            "Failed to load payment methods. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch viewer API key + active flag from backend (stored in DB)
  useEffect(() => {
    const fetchViewerKey = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}api/v1/frontend/opay/viewer-key`
        );
        const key = res?.data?.data?.viewerApiKey || null;
        const active = !!res?.data?.data?.active;
        setViewerApiKey(key);
        setOpayEnabled(active && !!key);
      } catch (e) {
        console.error(
          "Failed to fetch viewer API key:",
          e?.response?.data || e.message
        );
        setViewerApiKey(null);
        setOpayEnabled(false);
      }
    };
    fetchViewerKey();
  }, []);

  // Socket: connect with fetched viewer API key to count active devices
  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_IO_URL;
    if (!SOCKET_URL || !viewerApiKey) return;
    if (!opayEnabled) return;
    const s = io(SOCKET_URL, { transports: ["websocket"] });
    s.on("connect", () => {
      s.emit("viewer:registerApiKey", { apiKey: viewerApiKey });
    });
    s.on("viewer:devices", (list) => {
      if (Array.isArray(list)) {
        setOpayOnlineCount(list.filter((d) => d.active).length);
      }
    });
    s.on("viewer:device", () => {
      // Optional: handle individual device updates if needed later
    });
    return () => {
      s.disconnect();
    };
  }, [viewerApiKey, opayEnabled]);

  const handleProcessTabChange = (processTab) => {
    setSelectedProcessTab(processTab);
    setSelectedPromotion(null); // reset promotion when channel changes
  };

  const handlePromotionChange = (promotion) => {
    setSelectedPromotion(promotion);
  };

  // Build tabsData exactly like before (same logic)
  const tabsData = depositPaymentMethods.reduce((acc, method) => {
    const methodPromotions = promotions.filter((promo) =>
      promo.payment_methods?.includes(method._id.toString())
    );

    let processTabs =
      method.gateway?.map((gateway) => {
        const gatewayPromotions = methodPromotions
          .flatMap((promo) => {
            if (!promo.promotion_bonuses) return [];
            return promo.promotion_bonuses
              .filter(
                (bonus) =>
                  bonus.payment_method?._id?.toString() ===
                    method._id.toString() &&
                  bonus.payment_method?.gateway?.includes(gateway)
              )
              .map((bonus) => ({
                bn: `${promo.title_bd} (${
                  bonus.bonus_type === "Percentage"
                    ? `${bonus.bonus}%`
                    : `৳${bonus.bonus}`
                })`,
                en: `${promo.title} (${
                  bonus.bonus_type === "Percentage"
                    ? `${bonus.bonus}%`
                    : `$${bonus.bonus}`
                })`,
                condition: `≥৳${
                  bonus.bonus_type === "Percentage" ? 100 : bonus.bonus
                }`,
                _id: `${promo._id}-${bonus.payment_method._id}-${gateway}`,
                minAmount: bonus.minAmount || 100,
                maxAmount: bonus.maxAmount || 10000,
              }));
          })
          .filter(Boolean);

        return { name: gateway, promotions: gatewayPromotions };
      }) || [];
    // Hide Opay when disabled; ensure Opay exists only when enabled
    const hasOpay = processTabs.some(
      (t) => String(t.name).toLowerCase() === "opay"
    );
    if (!opayEnabled) {
      processTabs = processTabs.filter(
        (t) => String(t.name).toLowerCase() !== "opay"
      );
    } else if (!hasOpay) {
      processTabs = [...processTabs, { name: "Opay", promotions: [] }];
    }

    acc[method._id] = {
      label: language === "bn" ? method.methodNameBD : method.methodName,
      Image: method.methodImage,
      processTabs,
      amounts: method.amounts || [
        100, 200, 500, 1000, 3000, 5000, 10000, 15000, 20000, 25000,
      ],
      userInputs: method.userInputs || [],
      minAmount: method.minAmount || 100,
      maxAmount: method.maxAmount || 25000,
    };

    return acc;
  }, {});

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen md:min-h-0 lg:flex-row gap-6 px-2 lg:px-6 py-6">
        {/* Left Sidebar Skeleton */}
        <div className="lg:w-1/4 grid grid-cols-4 lg:flex lg:flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="backdrop-blur-md bg-white/40 border border-white/60 rounded-lg p-3 flex items-center gap-3 shadow-sm"
            >
              <Skeleton
                height={50}
                width={50}
                baseColor="#E5E7EB"
                highlightColor="#F3F4F6"
                circle
              />
              <Skeleton
                height={18}
                width="70%"
                baseColor="#E5E7EB"
                highlightColor="#F3F4F6"
              />
            </div>
          ))}
        </div>

        {/* Right Content Skeleton */}
        <div className="lg:w-3/4 backdrop-blur-xl bg-white/50 rounded-lg shadow-lg border border-white/60 p-6">
          {/* Header */}
          <Skeleton
            height={25}
            width="40%"
            baseColor="#E5E7EB"
            highlightColor="#F3F4F6"
          />

          <div className="mt-6 space-y-4">
            <Skeleton
              height={20}
              width="80%"
              baseColor="#E5E7EB"
              highlightColor="#F3F4F6"
            />
            <Skeleton
              height={20}
              width="60%"
              baseColor="#E5E7EB"
              highlightColor="#F3F4F6"
            />
            <Skeleton
              height={150}
              width="100%"
              baseColor="#E5E7EB"
              highlightColor="#F3F4F6"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                height={50}
                baseColor="#E5E7EB"
                highlightColor="#F3F4F6"
              />
            ))}
          </div>

          <Skeleton
            className="mt-6"
            height={45}
            width="40%"
            baseColor="#E5E7EB"
            highlightColor="#F3F4F6"
          />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  // No Methods
  if (depositPaymentMethods.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        {language === "bn"
          ? "কোনো পেমেন্ট মেথড উপলব্ধ নেই"
          : "No payment methods available"}
      </div>
    );
  }

  // Main UI (একদিকে কোনো চেঞ্জ হয়নি – ১০০% আগের মতোই)
  return (
    <div className="flex flex-col overflow-y-auto max-h-[99vh] custom-scrollbar-hidden lg:flex-row gap-6 px-2 lg:px-6 pb-10 lg:pb-0">
      {/* Left Tabs */}
      <div className="lg:w-1/4 grid grid-cols-4 lg:flex lg:flex-col gap-2 py-6">
        {depositPaymentMethods.map((method) => (
          <div
            key={method._id}
            className={`relative flex flex-col items-center lg:items-start lg:flex-row p-2 rounded-lg transition-all cursor-pointer ${
              selectedTab === method._id
                ? "border-2 border-red-600 bg-white shadow-md"
                : "bg-white border border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => {
              setSelectedTab(method._id);
              setMethodName(method.methodName.toLowerCase());
              const availableTabs = (method.gateway || []).filter(
                (g) => !(String(g).toLowerCase() === "opay" && !opayEnabled)
              );
              setSelectedProcessTab(availableTabs[0] || null);
              setSelectedPromotion(null);
            }}
          >
            <img
              src={`${import.meta.env.VITE_API_URL}${method.methodImage}`}
              alt={method.methodName}
              className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
            />
            <span className="mt-2 lg:mt-0 lg:ml-3 text-xs lg:text-base font-medium text-center lg:text-left">
              {language === "bn" ? method.methodNameBD : method.methodName}
            </span>
            {selectedTab === method._id && (
              <img
                src={checkImage}
                alt="selected"
                className="absolute bottom-1 right-1 w-5 h-5"
              />
            )}
          </div>
        ))}
        {/* Opay section link removed as requested */}
      </div>

      {/* Right Content */}
      <div className="lg:w-3/4 bg-white rounded-lg shadow-lg border p-4 lg:p-6">
        {/* Header */}
        <div className="hidden lg:flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold border-l-4 border-green-600 pl-3">
            {language === "bn" ? "ডিপোজিট তথ্য" : "Deposit Info"}
          </h3>
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full">
            <FaRegFileAlt className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {language === "bn" ? "ডিপোজিট ইতিহাস" : "Deposit History"}
            </span>
          </div>
        </div>

        {/* Mobile Icons */}
        <div className="flex justify-end gap-4 lg:hidden mb-4">
          <FaRegFileAlt className="text-2xl text-gray-700" />
          <RiCustomerService2Line className="text-2xl text-gray-700" />
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg mb-6 text-sm">
          <strong>NOTE:</strong>{" "}
          {language === "bn"
            ? "অনুগ্রহ করে আপনার ডিপোজিট করার পরে অবশ্যই আপনার Trx-ID সাবমিট করবেন।"
            : "Please submit your Trx-ID after deposit for faster processing."}
        </div>

        {/* Selected Method Badge */}
        <div className="inline-flex items-center gap-3 bg-pink-50 text-black px-4 py-2 rounded-lg mb-6">
          {depositPaymentMethods
            .filter((m) => m._id === selectedTab)
            .map((m) => (
              <div key={m._id} className="flex items-center gap-3">
                <img
                  src={`${import.meta.env.VITE_API_URL}${m.methodImage}`}
                  alt=""
                  className="w-18 h-10 rounded"
                />
                <span className="font-bold">
                  {language === "bn" ? m.methodNameBD : m.methodName} VIP | OP
                </span>
              </div>
            ))}
        </div>

        {/* Warning */}
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-6 flex items-center gap-3">
          <FaExclamationTriangle className="text-2xl flex-shrink-0" />
          <p className="text-sm">
            {language === "bn"
              ? "অনুগ্রহ করে সতর্ক থাকুন! কেউ টেলিগ্রাম বা ফেসবুকে আমাদের নামে ডিপোজিট নিচ্ছে না। শুধুমাত্র এই প্ল্যাটফর্ম দিয়ে ডিপোজিট করুন।"
              : "Beware of scammers! We only accept deposits through this platform."}
          </p>
        </div>

        {/* Channel Tabs */}
        {/* Local styles for Opay shimmer */}
        <style>{`
          @keyframes opay-glow {
            0% { background-position: 0% 0%; }
            100% { background-position: 300% 0%; }
          }
          .opay-shimmer {
            background: linear-gradient(90deg, #fef08a, #facc15, #f59e0b, #facc15, #fef08a);
            background-size: 300% 100%;
            border: 2px solid #f59e0b;
            color: #713f12;
            box-shadow: 0 0 10px rgba(245,158,11,0.45);
            animation: opay-glow 3s linear infinite;
          }
          .opay-shimmer:hover { filter: brightness(1.05); }
          .opay-shimmer.selected { box-shadow: 0 0 20px rgba(234,179,8,0.75), 0 0 40px rgba(234,179,8,0.35); }
        `}</style>

        <div className="flex flex-wrap gap-3 mb-4">
          {tabsData[selectedTab]?.processTabs.map((tab) => {
            const isSelected = selectedProcessTab === tab.name;
            const isOpay = String(tab.name).toLowerCase() === "opay";
            const base = "px-6 py-3 rounded-lg font-medium transition-all";
            const cls = isOpay
              ? `${base} opay-shimmer ${isSelected ? "selected" : ""}`
              : `${base} ${
                  isSelected
                    ? "bg-red-100 text-red-700 border-2 border-red-600"
                    : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                }`;
            return (
              <button
                key={tab.name}
                onClick={() => handleProcessTabChange(tab.name)}
                className={cls}
              >
                {isOpay ? (
                  <span className="font-bold">{tab.name}</span>
                ) : (
                  tab.name
                )}
              </button>
            );
          })}
        </div>

        {/* Opay devices panel visible to user */}
        {String(selectedProcessTab).toLowerCase() === "opay" && opayEnabled && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg mb-6 hidden">
            <strong>Opay Devices Online:</strong> {opayOnlineCount}
            <br />
            <span className="text-sm">
              {opayOnlineCount > 0
                ? language === "bn"
                  ? "Opay device online, deposit korte parben."
                  : "Opay device is online, you can deposit."
                : language === "bn"
                ? "Kono Opay device online nei, deposit korte parben na."
                : "No Opay device online, deposit not available."}
            </span>
          </div>
        )}

        {/* Common Content */}
        <CommonContent
          amounts={tabsData[selectedTab]?.amounts || []}
          methodName={methodName}
          selectedProcessTab={selectedProcessTab}
          selectedPromotion={selectedPromotion}
          depositPaymentMethods={depositPaymentMethods} // এটা যোগ করো
          language={language}
          tabsData={tabsData}
          userId={userId} // যদি লাগে
          selectedTab={selectedTab}
          handlePromotionChange={handlePromotionChange}
          userInputs={tabsData[selectedTab]?.userInputs || []}
          minAmount={tabsData[selectedTab]?.minAmount || 100}
          maxAmount={tabsData[selectedTab]?.maxAmount || 25000}
          selectedAmount={selectedAmount}
          setSelectedAmount={setSelectedAmount}
          viewerApiKey={viewerApiKey}
          opayOnlineCount={opayOnlineCount}
        />
      </div>
    </div>
  );
};

export default TabsWrapper;
