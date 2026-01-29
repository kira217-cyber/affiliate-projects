import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/Context/AuthContext";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TransactionHistory = () => {
  const { language, userId } = useContext(AuthContext);

  const [activeMainTab, setActiveMainTab] = useState(0); // 0: Deposit, 1: Withdraw
  const [depositHistory, setDepositHistory] = useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // ← Changed to 7 per page

  // ================= Fetch Deposit & Withdraw =================
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchDeposits = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/deposit/deposit-transaction`,
        );
        let allDeposits = [];
        if (Array.isArray(res.data)) allDeposits = res.data;
        else if (res.data?.deposits) allDeposits = res.data.deposits;
        else if (res.data?.data) allDeposits = res.data.data;

        const userDeposits = allDeposits.filter((d) => {
          const itemUserId = d.userId?._id || d.userId?.$oid || d.userId;
          return itemUserId === userId;
        });

        userDeposits.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setDepositHistory(userDeposits);
      } catch (err) {
        console.error("Deposit fetch error:", err);
        setDepositHistory([]);
      }
    };

    const fetchWithdraws = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/withdraw-transaction`);
        let allWithdraws = [];
        if (Array.isArray(res.data)) allWithdraws = res.data;
        else if (res.data?.withdraws) allWithdraws = res.data.withdraws;
        else if (res.data?.data) allWithdraws = res.data.data;

        const userWithdraws = allWithdraws.filter((w) => {
          const itemUserId = w.userId?._id || w.userId?.$oid || w.userId;
          return itemUserId === userId;
        });

        userWithdraws.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setWithdrawHistory(userWithdraws);
      } catch (err) {
        console.error("Withdraw fetch error:", err);
        setWithdrawHistory([]);
      }
    };

    const loadAll = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchDeposits(), fetchWithdraws()]);
      setLoading(false);
    };

    loadAll();
  }, [userId]);

  // ================= Current & Filtered History =================
  const currentHistory = activeMainTab === 0 ? depositHistory : withdrawHistory;

  const filteredHistory = currentHistory.filter((item) => {
    if (!dateFilter) return true;
    const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
    return itemDate === dateFilter;
  });

  // ================= Pagination Logic =================
  const totalItems = filteredHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // ================= Tabs =================
  const tabs = [
    { title: { en: "Deposit History", bn: "ডিপোজিট ইতিহাস" } },
    { title: { en: "Withdraw History", bn: "উত্তোলন ইতিহাস" } },
  ];

  // ================= Table Headers =================
  const tableHeaders = [
    { en: "Date & Time", bn: "তারিখ ও সময়" },
    { en: "Method", bn: "পদ্ধতি" },
    { en: "Amount", bn: "পরিমাণ" },
    { en: "Transaction ID / Number", bn: "ট্রানজেকশন আইডি / নম্বর" },
    { en: "Status", bn: "স্ট্যাটাস" },
  ];

  const formatDateTime = (date) => new Date(date).toLocaleString();

  const getStatusColor = (status) => {
    if (status === "completed") return "text-green-600 bg-green-100";
    if (status === "pending") return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getTransactionInfo = (item) => {
    if (activeMainTab === 0) {
      // Deposit
      const txn = item.userInputs?.find(
        (i) =>
          i.name?.toLowerCase().includes("transaction") ||
          i.label?.toLowerCase().includes("transaction"),
      );
      const agentWallet = item.paymentMethod?.agentWalletNumber;
      return `${txn?.value || "-"} ${agentWallet ? `/ ${agentWallet}` : ""}`;
    } else {
      // Withdraw
      const number = item.userInputs?.find((i) => i.type === "number");
      return number?.value ? `------------- / ${number.value}` : "-";
    }
  };

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen md:min-h-0">
      {/* Tabs */}
      <div className="flex gap-8 overflow-x-auto border-b pb-3 bg-[#063A49] text-white rounded-t-lg">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveMainTab(i);
              setCurrentPage(1); // Reset pagination on tab change
            }}
            className={`pb-3 px-4 font-medium whitespace-nowrap transition-colors ${
              i === activeMainTab
                ? "border-b-4 border-blue-500 text-white"
                : "text-yellow-300 hover:text-white"
            }`}
          >
            {language === "bn" ? tab.title.bn : tab.title.en}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-600"
        />
        <button className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
          {language === "bn" ? "খুঁজুন" : "Search"}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="font-medium">
            {language === "bn"
              ? `মোট: ${filteredHistory.length} টি`
              : `Total: ${filteredHistory.length} records`}
          </p>
          {totalPages > 1 && (
            <p className="text-sm text-gray-600">
              {language === "bn"
                ? `পেজ ${currentPage} / ${totalPages}`
                : `Page ${currentPage} of ${totalPages}`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <Skeleton height={24} count={5} />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">{error}</div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {language === "bn"
              ? "কোন লেনদেন পাওয়া যায়নি"
              : "No transactions found"}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-[#063A49] text-white">
                  <tr>
                    {tableHeaders.map((h, i) => (
                      <th key={i} className="text-left p-4 text-sm font-medium">
                        {language === "bn" ? h.bn : h.en}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-sm">
                        {formatDateTime(item.createdAt)}
                      </td>
                      <td className="p-4 text-sm">
                        {item.paymentMethod?.methodNameBD ||
                          item.paymentMethod?.methodName ||
                          "-"}
                      </td>
                      <td className="p-4 text-sm font-medium">
                        {item.amount?.toFixed(2) || "-"}
                      </td>
                      <td className="p-4 text-sm">
                        {getTransactionInfo(item)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.status,
                          )}`}
                        >
                          {item.status === "completed"
                            ? language === "bn"
                              ? "সফল"
                              : "Success"
                            : item.status === "pending"
                              ? language === "bn"
                                ? "পেন্ডিং"
                                : "Pending"
                              : language === "bn"
                                ? "বাতিল"
                                : "Rejected"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {currentItems.map((item, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {language === "bn" ? "তারিখ ও সময়" : "Date & Time"}
                      </span>
                      <span className="font-medium">
                        {formatDateTime(item.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {language === "bn" ? "পদ্ধতি" : "Method"}
                      </span>
                      <span>
                        {item.paymentMethod?.methodNameBD ||
                          item.paymentMethod?.methodName ||
                          "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {language === "bn" ? "পরিমাণ" : "Amount"}
                      </span>
                      <span className="font-bold text-lg">
                        {item.amount?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {language === "bn"
                          ? "ট্রানজেকশন"
                          : "Transaction ID/Number"}
                      </span>
                      <span>{getTransactionInfo(item)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {language === "bn" ? "স্ট্যাটাস" : "Status"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.status,
                        )}`}
                      >
                        {item.status === "completed"
                          ? language === "bn"
                            ? "সফল"
                            : "Success"
                          : item.status === "pending"
                            ? language === "bn"
                              ? "পেন্ডিং"
                              : "Pending"
                            : language === "bn"
                              ? "বাতিল"
                              : "Rejected"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600">
                  {language === "bn"
                    ? `দেখানো হচ্ছে ${indexOfFirstItem + 1} - ${
                        indexOfLastItem > totalItems
                          ? totalItems
                          : indexOfLastItem
                      } এর মধ্যে ${totalItems}`
                    : `Showing ${indexOfFirstItem + 1} - ${
                        indexOfLastItem > totalItems
                          ? totalItems
                          : indexOfLastItem
                      } of ${totalItems}`}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition text-sm"
                  >
                    {language === "bn" ? "আগে" : "Prev"}
                  </button>

                  {/* Page numbers (limited view) */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .slice(
                        Math.max(0, currentPage - 3),
                        Math.min(totalPages, currentPage + 2),
                      )
                      .map((page) => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`px-3 py-1.5 rounded text-sm font-medium min-w-[32px] ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition text-sm"
                  >
                    {language === "bn" ? "পরে" : "Next"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
