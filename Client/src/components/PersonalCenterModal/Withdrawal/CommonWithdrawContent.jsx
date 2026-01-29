// CommonWithdrawContent.jsx (updated with exact design from image + side modal from right)
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegFileAlt } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const CustomNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-semibold text-base ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
};

const CommonWithdrawContent = ({
  amounts = [],
  selectedProcessTab,
  setSelectedProcessTab,
  selectedTab,
  language,
  currentMethod = {},
  userInputs = [],
  minAmount = 200,
  maxAmount = 30000,
}) => {
  const { userId, balance, setBalance } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedAmount, setSelectedAmount] = useState("");
  const [inputValues, setInputValues] = useState({});
  const [transactionPassword, setTransactionPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [showBindModal, setShowBindModal] = useState(false);
  const [registeredWallets, setRegisteredWallets] = useState([]);
  const [selectedWalletId, setSelectedWalletId] = useState(null);

  const hasPasswordField = userInputs.some(
    (i) => i.name === "transactionPassword"
  );
  const remainingWithdrawals = 99; // static as per image

  useEffect(() => {
    setSelectedAmount("");
    setInputValues(
      userInputs.reduce((acc, inp) => ({ ...acc, [inp.name]: "" }), {})
    );
    setTransactionPassword("");
    setShowModal(false);
    setTimeLeft(20 * 60);
    setShowBindModal(false);
    setRegisteredWallets([]);
    setSelectedWalletId(null);
  }, [selectedTab, userInputs]);

  useEffect(() => {
    if (!showModal) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowModal(false);
          setNotification({
            show: true,
            message: language === "bn" ? "সময় শেষ হয়েছে!" : "Time expired!",
            type: "error",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showModal, language]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "transactionPassword") {
      setTransactionPassword(value);
    } else {
      setInputValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBindSubmit = () => {
    for (const input of userInputs) {
      if (input.isRequired === "true" && !inputValues[input.name]?.trim()) {
        setNotification({
          show: true,
          message:
            language === "bn"
              ? `${input.labelBD || input.label} আবশ্যক`
              : `${input.label} is required`,
          type: "error",
        });
        return;
      }
    }
    if (registeredWallets.length >= 5) {
      setNotification({
        show: true,
        message: language === "bn" ? "সর্বোচ্চ ৫টি ওয়ালেট" : "Max 5 wallets",
        type: "error",
      });
      return;
    }

    const newWallet = {
      id: Date.now(),
      processTab: selectedProcessTab,
      inputs: Object.entries(inputValues).map(([name, value]) => {
        const cfg = userInputs.find((i) => i.name === name);
        return {
          name,
          value: value.trim(),
          label: cfg?.label || "",
          labelBD: cfg?.labelBD || "",
          type: cfg?.type || "text",
        };
      }),
    };

    setRegisteredWallets([...registeredWallets, newWallet]);
    if (!selectedWalletId) setSelectedWalletId(newWallet.id);
    setShowBindModal(false);
    setInputValues(
      userInputs.reduce((acc, inp) => ({ ...acc, [inp.name]: "" }), {})
    );
  };

  const handleApply = () => {
    if (
      !selectedAmount ||
      selectedAmount < minAmount ||
      selectedAmount > maxAmount
    ) {
      setNotification({
        show: true,
        message:
          language === "bn"
            ? `পরিমাণ ${minAmount} - ${maxAmount} এর মধ্যে হতে হবে`
            : `Amount must be between ${minAmount} - ${maxAmount}`,
        type: "error",
      });
      return;
    }
    if (registeredWallets.length === 0 || !selectedWalletId) {
      setNotification({
        show: true,
        message:
          language === "bn"
            ? "প্রথমে ই-ওয়ালেট বাইন্ড করুন"
            : "Bind an e-wallet first",
        type: "error",
      });
      return;
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!userId)
      return setNotification({
        show: true,
        message: "Please login again",
        type: "error",
      });
    if (hasPasswordField && !transactionPassword.trim()) {
      setNotification({
        show: true,
        message:
          language === "bn"
            ? "ট্রানজেকশন পাসওয়ার্ড দিন"
            : "Transaction password required",
        type: "error",
      });
      return;
    }
    if (Number(balance) < selectedAmount) {
      setNotification({
        show: true,
        message:
          language === "bn" ? "অপর্যাপ্ত ব্যালেন্স" : "Insufficient balance",
        type: "error",
      });
      return;
    }

    setLoading(true);
    const selectedWallet = registeredWallets.find(
      (w) => w.id === selectedWalletId
    );
    let payloadUserInputs = selectedWallet.inputs;
    if (hasPasswordField) {
      const cfg = userInputs.find((i) => i.name === "transactionPassword");
      payloadUserInputs = [
        ...payloadUserInputs,
        {
          name: "transactionPassword",
          value: transactionPassword.trim(),
          label: cfg?.label || "",
          labelBD: cfg?.labelBD || "",
          type: cfg?.type || "text",
        },
      ];
    }

    const payload = {
      userId,
      paymentMethodId: selectedTab,
      channel: selectedWallet.processTab,
      amount: selectedAmount,
      userInputs: payloadUserInputs,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/withdraw-transaction/request`,
        payload
      );
      if (res.status >= 200 && res.status < 300) {
        setNotification({
          show: true,
          message:
            language === "bn"
              ? "উইথড্রয়াল সফলভাবে জমা হয়েছে!"
              : "Withdrawal Request Submitted Successfully!",
          type: "success",
        });
        setBalance((prev) => prev - selectedAmount);
        setShowModal(false);
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setNotification({
        show: true,
        message:
          err.response?.data?.msg ||
          (language === "bn" ? "সার্ভারে সমস্যা হয়েছে" : "Server error"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {notification.show && (
        <CustomNotification
          message={notification.message}
          type={notification.type}
          onClose={() =>
            setNotification({ show: false, message: "", type: "" })
          }
        />
      )}

      {/* Withdrawal Time & Recent Withdrawal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-medium">
          Withdrawal Time: 24 hours
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 p-2 rounded-full">
              <FaRegFileAlt className="text-gray-600" />
            </div>
            <p className="text-gray-600">No Withdrawal Request</p>
          </div>
          <button className="bg-gray-100 text-gray-600 px-4 py-1 rounded text-sm">
            More
          </button>
        </div>
      </div>

      {/* E-Wallet Card Placeholder */}
      <div className="relative mx-auto max-w-xs">
        <div className="bg-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="h-48 bg-gradient-to-b from-gray-300 to-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="font-medium">Empty E-Wallet</p>
            </div>
          </div>
          <div className="p-4 text-center">
            <p className="text-gray-600 font-medium">Empty E-Wallet</p>
          </div>
        </div>
      </div>

      {/* Add Wallet Button */}
      <div className="text-center">
        <button
          onClick={() => setShowBindModal(true)}
          className="bg-red-500 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-red-600 transition"
        >
          + Add wallet
        </button>
      </div>

      {/* Wallet Info */}
      <div className="text-center space-y-2">
        <p className="text-gray-700">
          Central Wallet: <span className="font-bold">0.00</span>
        </p>
        <p className="text-gray-700">
          Available: <span className="font-bold text-blue-600">{balance}</span>
        </p>
      </div>

      {/* Withdrawal Amount */}
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">
          Withdrawal Amount:
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="number"
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(e.target.value)}
            placeholder="100 ~ 25,000"
            className="flex-1 p-3 text-center outline-none"
            min={minAmount}
            max={maxAmount}
          />
          <button
            onClick={() => setSelectedAmount(balance)}
            className="bg-gray-100 px-4 py-3 flex items-center gap-2 text-gray-600"
          >
            <MdRefresh /> Return Balance
          </button>
        </div>
      </div>

      {/* Transaction Password */}
      {hasPasswordField && (
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Transaction Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={transactionPassword}
              onChange={handleInputChange}
              name="transactionPassword"
              className="w-full p-3 border border-gray-300 rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleApply}
        disabled={loading}
        className="w-full bg-gray-300 text-gray-800 py-4 rounded-full font-bold text-lg hover:bg-gray-400 transition disabled:opacity-50"
      >
        {loading
          ? language === "bn"
            ? "প্রক্রিয়া চলছে..."
            : "Processing..."
          : "Submit"}
      </button>

      <p className="text-center text-red-600 text-sm">
        Remaining Number of Withdrawal Today: {remainingWithdrawals}
      </p>

      {/* Right Side Bind Modal */}
      {showBindModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-full max-w-md h-full bg-white shadow-2xl transform transition-transform duration-300 translate-x-0 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Bind E-wallet</h2>
                <button
                  onClick={() => setShowBindModal(false)}
                  className="text-2xl text-gray-600"
                >
                  &times;
                </button>
              </div>

              <p className="text-red-500 mb-4">
                Registered E-wallet ({registeredWallets.length}/5)
              </p>

              {/* E-wallet Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  E-wallet:
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3"
                  disabled
                >
                  <option>{currentMethod.label || "bKash"}</option>
                </select>
              </div>

              {/* Process Tabs as Buttons */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  E-wallet Type:
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentMethod.processTabs?.map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => setSelectedProcessTab(tab.name)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        selectedProcessTab === tab.name
                          ? "bg-red-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              {userInputs
                .filter((input) => input.name !== "transactionPassword")
                .map((input) => (
                  <div key={input.name} className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      {language === "bn"
                        ? input.labelBD || input.label
                        : input.label}
                      {input.isRequired === "true" && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type={input.type || "text"}
                      name={input.name}
                      value={inputValues[input.name] || ""}
                      onChange={handleInputChange}
                      placeholder={
                        language === "bn"
                          ? input.fieldInstructionBD
                          : input.fieldInstruction
                      }
                      className="w-full border border-gray-300 rounded-lg p-3"
                    />
                  </div>
                ))}

              <button
                onClick={handleBindSubmit}
                className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg font-medium mt-6"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal (same as before, can be styled similarly if needed) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {language === "bn"
                    ? "উইথড্রয়াল নিশ্চিত করুন"
                    : "Confirm Withdrawal"}
                </h3>
                <div
                  className={`px-4 py-2 rounded-full ${
                    timeLeft <= 60
                      ? "bg-red-100 text-red-600 animate-pulse"
                      : "bg-gray-100"
                  }`}
                >
                  {language === "bn" ? "বাকি সময়:" : "Time left:"}{" "}
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Agent Wallet Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="font-bold">
                  {currentMethod.agentWalletText || "Agent Wallet"}
                </p>
                <p className="text-2xl font-bold mt-1">
                  {currentMethod.agentWalletNumber || "N/A"}
                </p>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <p className="font-bold">
                  {language === "bn" ? "নির্দেশনা:" : "Instructions:"}
                </p>
                <div
                  className="mt-2 text-sm"
                  dangerouslySetInnerHTML={{
                    __html:
                      language === "bn"
                        ? currentMethod.instructionBD
                        : currentMethod.instruction,
                  }}
                />
              </div>

              {/* Wallet Details */}
              {selectedWalletId && (
                <div className="mb-6">
                  <p className="font-bold">Selected Wallet Details</p>
                  {registeredWallets
                    .find((w) => w.id === selectedWalletId)
                    ?.inputs.map((inp) => (
                      <p key={inp.name} className="mt-1">
                        {language === "bn" ? inp.labelBD : inp.label}:{" "}
                        {inp.value}
                      </p>
                    ))}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-300 rounded-lg font-medium"
                  disabled={loading}
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-50"
                >
                  {loading
                    ? language === "bn"
                      ? "জমা হচ্ছে..."
                      : "Submitting..."
                    : language === "bn"
                    ? "নিশ্চিত করুন"
                    : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonWithdrawContent;
