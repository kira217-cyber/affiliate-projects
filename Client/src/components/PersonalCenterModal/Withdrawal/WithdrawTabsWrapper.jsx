import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  X,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WithdrawTabsWrapper = () => {
  const { language, userId, balance, setBalance } = useContext(AuthContext);
  const navigate = useNavigate();

  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(null);
  const [selectedProcessTab, setSelectedProcessTab] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editWalletId, setEditWalletId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);

  const [selectedAmount, setSelectedAmount] = useState("");
  const [transactionPassword, setTransactionPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [inputValues, setInputValues] = useState({});
  const [registeredWallets, setRegisteredWallets] = useState([]);
  const [selectedWalletId, setSelectedWalletId] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Turnover states
  const [activeTurnovers, setActiveTurnovers] = useState([]);
  const [turnoverLoading, setTurnoverLoading] = useState(true);
  const [hasUnfinishedTurnover, setHasUnfinishedTurnover] = useState(false);
  const [showTurnoverModal, setShowTurnoverModal] = useState(false); // New: right slide modal for mobile

  // Fetch payment methods
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/withdraw-payment-methods/methods`,
      )
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setMethods(data);
          if (data.length > 0) {
            setSelectedTab(data[0]._id);
            setSelectedProcessTab(data[0].gateway?.[0] || null);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch user's wallets
  const fetchWallets = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wallets/${userId}`,
      );
      if (res.data.success) {
        const wallets = res.data.data || [];
        setRegisteredWallets(wallets);
        if (wallets.length > 0 && !selectedWalletId) {
          setSelectedWalletId(wallets[0]._id.toString());
        }
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to load wallets", "error");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWallets();
    }
  }, [userId]);

  // Fetch active turnovers
  const fetchActiveTurnovers = async () => {
    if (!userId) return;

    setTurnoverLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/withdraw-transaction/my-active-turnovers?userId=${userId}`,
      );
      if (res.data.success) {
        const turnovers = res.data.data || [];
        setActiveTurnovers(turnovers);

        const unfinished = turnovers.some((t) => t.remainingTurnover > 0);
        setHasUnfinishedTurnover(unfinished);
      }
    } catch (err) {
      console.error("Turnover fetch error:", err);
      showNotification("Failed to load turnover status", "error");
    } finally {
      setTurnoverLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchActiveTurnovers();
    }
  }, [userId]);

  // Current method
  const currentMethod = methods.find((m) => m._id === selectedTab) || {};
  const userInputs = currentMethod.userInputs || [];
  const minAmount = currentMethod.minAmount || 200;
  const maxAmount = currentMethod.maxAmount || 30000;
  const hasPasswordField = userInputs.some(
    (i) => i.name === "transactionPassword",
  );

  // Reset when method changes
  useEffect(() => {
    setSelectedAmount("");
    setTransactionPassword("");
    setInputValues(
      userInputs.reduce((acc, inp) => ({ ...acc, [inp.name]: "" }), {}),
    );
  }, [selectedTab]);

  // Prefill for edit mode
  useEffect(() => {
    if (isEditMode && editWalletId) {
      const wallet = registeredWallets.find(
        (w) => w._id.toString() === editWalletId,
      );
      if (wallet) {
        const prefill = {};
        wallet.inputs.forEach((inp) => {
          prefill[inp.name] = inp.value;
        });
        setInputValues(prefill);
        setSelectedProcessTab(wallet.processTab);
        setSelectedTab(wallet.methodId);
      }
    } else {
      setInputValues(
        userInputs.reduce((acc, inp) => ({ ...acc, [inp.name]: "" }), {}),
      );
    }
  }, [isEditMode, editWalletId, registeredWallets]);

  // Timer
  useEffect(() => {
    if (!showConfirmModal) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowConfirmModal(false);
          showNotification(
            language === "bn" ? "সময় শেষ হয়েছে!" : "Time expired!",
            "error",
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showConfirmModal]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const showNotification = (message, type = "error") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      4000,
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  // Save wallet (add or update)
  const handleSaveWallet = async () => {
    if (!userId) {
      showNotification("User not found", "error");
      return;
    }

    const payload = {
      userId,
      methodId: selectedTab,
      processTab: selectedProcessTab,
      inputs: Object.entries(inputValues)
        .filter(([name]) => name !== "transactionPassword")
        .map(([name, value]) => {
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

    try {
      let res;
      if (isEditMode) {
        res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/wallets/${editWalletId}`,
          payload,
        );
      } else {
        res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/wallets`,
          payload,
        );
      }

      if (res.data.success) {
        showNotification(
          isEditMode ? "Wallet updated!" : "Wallet added!",
          "success",
        );
        fetchWallets();
        setOpenModal(false);
        setIsEditMode(false);
        setEditWalletId(null);
      }
    } catch (err) {
      showNotification(
        err.response?.data?.msg || "Error saving wallet",
        "error",
      );
    }
  };

  // Delete wallet
  const handleDeleteWallet = async (walletId) => {
    if (
      !window.confirm(
        language === "bn" ? "ওয়ালেট মুছে ফেলবেন?" : "Delete this wallet?",
      )
    )
      return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/wallets/${walletId}?userId=${userId}`,
      );
      if (res.data.success) {
        showNotification("Wallet deleted!", "success");
        fetchWallets();
        if (selectedWalletId === walletId) setSelectedWalletId(null);
      }
    } catch (err) {
      showNotification("Error deleting wallet", "error");
    }
  };

  // Withdraw validation
  const handleWithdraw = () => {
    if (
      !selectedAmount ||
      Number(selectedAmount) < minAmount ||
      Number(selectedAmount) > maxAmount
    ) {
      showNotification(`Amount must be between ${minAmount} - ${maxAmount}`);
      return;
    }
    if (registeredWallets.length === 0) {
      showNotification("Please add a wallet first");
      return;
    }
    if (balance < Number(selectedAmount)) {
      showNotification("Insufficient balance");
      return;
    }
    if (hasPasswordField && !transactionPassword.trim()) {
      showNotification("Transaction password required");
      return;
    }

    if (hasUnfinishedTurnover) {
      showNotification(
        language === "bn"
          ? "টার্নওভার পূর্ণ করুন প্রথমে!"
          : "Complete turnover requirements first!",
        "error",
      );
      return;
    }

    setShowConfirmModal(true);
  };

  // Confirm submit
  const handleConfirmSubmit = async () => {
    setSubmitLoading(true);
    const selectedWallet = registeredWallets.find(
      (w) => w._id.toString() === selectedWalletId,
    );

    let payloadInputs = selectedWallet.inputs.map((input) => {
      const cfg = userInputs.find((i) => i.name === input.name);
      return {
        ...input,
        type: cfg?.type || "text",
      };
    });

    if (hasPasswordField) {
      const cfg = userInputs.find((i) => i.name === "transactionPassword");
      payloadInputs.push({
        name: "transactionPassword",
        value: transactionPassword.trim(),
        label: cfg?.label || "Transaction Password",
        labelBD: cfg?.labelBD || "ট্রানজেকশন পাসওয়ার্ড",
        type: cfg?.type || "password",
      });
    }

    const payload = {
      userId,
      paymentMethodId: selectedTab,
      channel: selectedWallet.processTab,
      amount: Number(selectedAmount),
      userInputs: payloadInputs,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/withdraw-transaction/request`,
        payload,
      );

      if (res.status >= 200 && res.status < 300) {
        showNotification("Withdrawal submitted successfully!", "success");
        setBalance((prev) => prev - Number(selectedAmount));
        setShowConfirmModal(false);
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      showNotification(err.response?.data?.msg || "Server error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const selectedWallet = registeredWallets.find(
    (w) => w._id?.toString() === selectedWalletId,
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen md:min-h-0 lg:flex-row gap-6 px-2 lg:px-6 py-6">
        <div className="lg:w-1/4 grid grid-cols-4 lg:flex lg:flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="backdrop-blur-md bg-white/40 border border-white/60 rounded-lg p-3 flex items-center gap-3 shadow-sm"
            >
              <Skeleton
                height={50}
                width={50}
                circle
                baseColor="#E5E7EB"
                highlightColor="#F3F4F6"
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

        <div className="lg:w-3/4 backdrop-blur-xl bg-white/50 rounded-lg shadow-lg border border-white/60 p-6">
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

  return (
    <>
      {notification.show && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg text-white font-bold shadow-xl ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-4xl min-h-screen md:min-h-0 mx-auto bg-white rounded-xl p-4 sm:p-6 pb-20 md:pb-6 relative">
        {/* Payment Methods Tabs */}
        <div className="flex flex-wrap gap-3 mb-6 overflow-x-auto pb-2">
          {methods.map((method) => (
            <div
              key={method._id}
              onClick={() => {
                setSelectedTab(method._id);
                setSelectedProcessTab(method.gateway?.[0] || null);
              }}
              className={`cursor-pointer border rounded-md px-4 py-2 flex items-center gap-2 transition-all flex-shrink-0 ${
                selectedTab === method._id
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <img
                src={`${import.meta.env.VITE_API_URL}${method.methodImage}`}
                alt=""
                className="w-8 h-8 object-contain"
              />
              <span className="font-semibold">
                {language === "bn" ? method.methodNameBD : method.methodName}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Wallet & Form */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              {selectedWallet ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${currentMethod.methodImage}`}
                      alt=""
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-semibold text-lg">
                      {language === "bn"
                        ? currentMethod.methodNameBD
                        : currentMethod.methodName}
                    </p>
                    {selectedWallet.processTab && (
                      <p className="text-sm text-gray-600">
                        Type:{" "}
                        <span className="font-medium">
                          {selectedWallet.processTab}
                        </span>
                      </p>
                    )}
                    {selectedWallet.inputs.map((inp) => (
                      <p key={inp.name} className="text-sm">
                        <span className="text-gray-500">
                          {language === "bn"
                            ? inp.labelBD || inp.label
                            : inp.label}
                          :
                        </span>{" "}
                        <span className="font-medium">{inp.value}</span>
                      </p>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <button
                      onClick={() => {
                        setIsEditMode(true);
                        setEditWalletId(selectedWallet._id.toString());
                        setOpenModal(true);
                      }}
                      className="text-blue-600"
                    >
                      <Edit2 size={22} />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteWallet(selectedWallet._id.toString())
                      }
                      className="text-red-600"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                  {registeredWallets.length > 1 && (
                    <select
                      value={selectedWalletId || ""}
                      onChange={(e) => setSelectedWalletId(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 mt-4"
                    >
                      {registeredWallets.map((w) => {
                        const acc =
                          w.inputs.find(
                            (i) =>
                              i.name.includes("account") ||
                              i.name.includes("number"),
                          )?.value || "Wallet";
                        return (
                          <option key={w._id} value={w._id.toString()}>
                            {acc} ({w.processTab || "Default"})
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-32 h-20 mx-auto bg-gray-200 rounded-md mb-4" />
                  <p className="text-gray-400 text-sm">Empty E-Wallet</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setIsEditMode(false);
                setEditWalletId(null);
                setOpenModal(true);
              }}
              disabled={registeredWallets.length >= 5}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 rounded-full font-semibold mb-6"
            >
              + Add wallet{" "}
              {registeredWallets.length > 0 &&
                `(${registeredWallets.length}/5)`}
            </button>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Central Wallet:</span>
                <span className="text-blue-500 font-semibold">0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Available Amount:</span>
                <span className="text-blue-500 font-semibold">
                  {balance || "0.00"}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="number"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(e.target.value)}
                placeholder={`100 ~ ${maxAmount}`}
                className="w-full border border-gray-300 rounded-full px-6 py-3 text-center"
              />
            </div>

            {hasPasswordField && registeredWallets.length > 0 && (
              <div className="relative mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  value={transactionPassword}
                  onChange={(e) => setTransactionPassword(e.target.value)}
                  placeholder="Transaction Password"
                  className="w-full border border-gray-300 rounded-full px-6 py-3 pr-12"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            <div className="flex items-center">
              <button
                onClick={handleWithdraw}
                disabled={
                  !selectedAmount ||
                  registeredWallets.length === 0 ||
                  submitLoading ||
                  hasUnfinishedTurnover
                }
                className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-500 text-gray-800 px-8 py-3 rounded-full font-bold"
              >
                {submitLoading ? "Processing..." : "Submit"}
              </button>
              <p className="text-sm ml-4">
                Remaining Withdrawal Today:{" "}
                <span className="text-red-500 font-semibold">99</span>
              </p>
            </div>
          </div>

          {/* Right Column - Desktop only */}
          <div className="hidden lg:block">
            <div className="bg-orange-50 border border-orange-200 text-orange-600 px-6 py-4 rounded-lg space-y-4">
              Withdrawal Time :<br />
              <span className="font-bold text-lg">24 hours</span>
              {/* Desktop Turnover List */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2">
                  {language === "bn"
                    ? "অ্যাকটিভ টার্নওভার"
                    : "Active Turnovers"}
                </h4>
                {turnoverLoading ? (
                  <Skeleton height={100} />
                ) : activeTurnovers.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {language === "bn"
                      ? "কোনো টার্নওভার নেই"
                      : "No active turnovers"}
                  </p>
                ) : (
                  <div className="space-y-3 text-sm">
                    {activeTurnovers.map((t, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-md border">
                        <p>
                          <strong>Required:</strong> ৳
                          {t.requiredTurnover.toFixed(2)}
                        </p>
                        <p>
                          <strong>Completed:</strong> ৳
                          {t.completedTurnover.toFixed(2)}
                        </p>
                        <p>
                          <strong>Remaining:</strong> ৳
                          {t.remainingTurnover.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Activated:{" "}
                          {new Date(t.activatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    {hasUnfinishedTurnover && (
                      <p className="text-red-500 text-xs mt-2">
                        {language === "bn"
                          ? "টার্নওভার পূর্ণ না হলে উইথড্র করতে পারবেন না!"
                          : "Cannot withdraw until turnover is completed!"}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Floating Turnover Button ── */}
      <button
        onClick={() => setShowTurnoverModal(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-red-600 to-rose-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform lg:hidden"
      >
        <span className="text-sm font-bold">
          {language === "bn" ? "টার্নওভার" : "Turnover"}
        </span>
      </button>

      {/* ── Mobile Turnover Slide-in Modal ── */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 overflow-y-auto ${
          showTurnoverModal ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-bold text-lg">
            {language === "bn" ? "অ্যাকটিভ টার্নওভার" : "Active Turnovers"}
          </h3>
          <X
            className="cursor-pointer text-gray-600 hover:text-gray-800"
            size={28}
            onClick={() => setShowTurnoverModal(false)}
          />
        </div>

        <div className="p-6">
          {turnoverLoading ? (
            <Skeleton height={120} count={2} />
          ) : activeTurnovers.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              {language === "bn"
                ? "কোনো অ্যাকটিভ টার্নওভার নেই"
                : "No active turnovers"}
            </p>
          ) : (
            <div className="space-y-4">
              {activeTurnovers.map((t, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <span className="text-gray-600 block text-xs">
                        Required
                      </span>
                      <p className="font-bold">
                        ৳{t.requiredTurnover.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-xs">
                        Completed
                      </span>
                      <p className="font-bold">
                        ৳{t.completedTurnover.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-600 block text-xs">
                      Remaining
                    </span>
                    <p className="font-bold text-red-600 text-lg">
                      ৳{t.remainingTurnover.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Activated: {new Date(t.activatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}

              {hasUnfinishedTurnover && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mt-4">
                  <p className="text-red-700 text-sm font-medium text-center">
                    {language === "bn"
                      ? "টার্নওভার পূর্ণ না হলে উইথড্র করতে পারবেন না!"
                      : "Cannot withdraw until turnover is completed!"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overlay for all modals */}
      {(openModal || showConfirmModal || showTurnoverModal) && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => {
            setOpenModal(false);
            setShowConfirmModal(false);
            setShowTurnoverModal(false);
          }}
        />
      )}

      {/* Bind/Edit Wallet Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          openModal ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <h3 className="font-semibold text-lg">
              {isEditMode ? "Edit" : "Bind"} E-wallet
            </h3>
          </div>
          <X
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            size={24}
            onClick={() => setOpenModal(false)}
          />
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-500">E-wallet :</label>
              <select
                className="w-full border rounded-lg px-4 py-3 mt-1"
                value={selectedTab || ""}
                onChange={(e) => setSelectedTab(e.target.value)}
              >
                {methods.map((m) => (
                  <option key={m._id} value={m._id}>
                    {language === "bn" ? m.methodNameBD : m.methodName}
                  </option>
                ))}
              </select>
            </div>

            {userInputs
              .filter((i) => i.name !== "transactionPassword")
              .map((input) => (
                <div key={input.name}>
                  <label className="text-sm text-gray-500">
                    {language === "bn"
                      ? input.labelBD || input.label
                      : input.label}
                    {input.isRequired === "true" && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type={input.type || "text"}
                    name={input.name}
                    value={inputValues[input.name] || ""}
                    onChange={handleInputChange}
                    placeholder={
                      language === "bn"
                        ? input.fieldInstructionBD || "Enter here"
                        : input.fieldInstruction || "Enter here"
                    }
                    className="w-full border rounded-lg px-4 py-3 mt-1"
                  />
                </div>
              ))}

            {currentMethod.gateway && currentMethod.gateway.length > 0 && (
              <div>
                <label className="text-sm text-gray-500">E-wallet type :</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {currentMethod.gateway.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedProcessTab(tab)}
                      className={`py-2 rounded-lg border ${
                        selectedProcessTab === tab
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-gray-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSaveWallet}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-full font-bold mt-6"
            >
              {isEditMode ? "Update Wallet" : "Submit"}
            </button>
          </div>

          <div className="flex flex-col items-center justify-center text-gray-400">
            <div className="w-40 h-28 bg-gray-200 rounded-xl mb-4" />
            <p className="text-sm">Preview</p>
            <p className="text-xs mt-2 text-center text-gray-500">
              {registeredWallets.length}/5 Registered
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {language === "bn"
                  ? "উইথড্রয়াল নিশ্চিত করুন"
                  : "Confirm Withdrawal"}
              </h3>
              <div
                className={`px-4 py-2 rounded-full bg-red-100 text-red-600 ${
                  timeLeft <= 60 && "animate-pulse"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Amount:</strong> ৳{selectedAmount}
              </p>
              <p>
                <strong>Agent Wallet:</strong>{" "}
                {currentMethod.agentWalletNumber || "N/A"}
              </p>
              {selectedWallet && (
                <div className="mt-4 pt-4 border-t">
                  <p className="font-semibold mb-2">Selected Wallet:</p>
                  {selectedWallet.inputs.map((inp) => (
                    <p key={inp.name}>
                      {language === "bn" ? inp.labelBD || inp.label : inp.label}
                      : {inp.value}
                    </p>
                  ))}
                </div>
              )}
              <p className="text-sm">
                {language === "bn"
                  ? currentMethod.instructionBD
                  : currentMethod.instruction}
              </p>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 border border-gray-400 rounded-full font-medium"
              >
                {language === "bn" ? "বাতিল" : "Cancel"}
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={submitLoading}
                className="flex-1 py-3 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 disabled:opacity-70"
              >
                {submitLoading
                  ? "Submitting..."
                  : language === "bn"
                    ? "নিশ্চিত করুন"
                    : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrawTabsWrapper;
