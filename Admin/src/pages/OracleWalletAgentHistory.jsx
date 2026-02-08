import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaTable,
  FaThLarge,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const StatusBadge = ({ status }) => {
  const s = String(status || "").toUpperCase();

  let cls = "bg-yellow-950/60 text-yellow-300 border-yellow-700/50";
  if (s === "PAID") {
    cls = "bg-emerald-900/60 text-emerald-300 border-emerald-600/50";
  } else if (s === "FAILED") {
    cls = "bg-red-950/60 text-red-300 border-red-700/50";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-bold border rounded-full ${cls}`}
    >
      {s || "PENDING"}
    </span>
  );
};

const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return dt.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OracleWalletAgentHistory = () => {
  const [view, setView] = useState("table"); // "table" | "card"
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(""); // "", PENDING, PAID, FAILED

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 20;

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const API_BASE = import.meta.env.VITE_REACT_APP_BACKEND_API2;

  const fetchData = async ({
    pageArg = page,
    qArg = q,
    statusArg = status,
  } = {}) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/api/oraclepay-business/deposits/admin`,
        {
          params: {
            page: pageArg,
            limit,
            q: qArg || "",
            status: statusArg || "",
          },
        },
      );

      if (res.data?.success) {
        setRows(res.data.data || []);
        setPagination(
          res.data.pagination || { page: 1, limit, total: 0, totalPages: 1 },
        );
      } else {
        setRows([]);
        setPagination({ page: 1, limit, total: 0, totalPages: 1 });
      }
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchData({ pageArg: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce search & filter
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchData({ pageArg: 1, qArg: q, statusArg: status });
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status]);

  const canPrev = page > 1;
  const canNext = page < (pagination.totalPages || 1);

  const goPrev = () => {
    if (!canPrev) return;
    const nextPage = page - 1;
    setPage(nextPage);
    fetchData({ pageArg: nextPage });
  };

  const goNext = () => {
    if (!canNext) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData({ pageArg: nextPage });
  };

  const header = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-5 border-b border-emerald-800/40">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-emerald-100 tracking-tight">
            Oracle Wallet Agent History
          </h2>
          <p className="text-sm text-emerald-400/80 mt-1">
            Total Records:{" "}
            <span className="font-bold text-emerald-300">
              {pagination.total || 0}
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/70" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by username / invoice / trx..."
              className="w-full bg-black/40 border border-emerald-800/70 rounded-lg pl-11 pr-4 py-2.5 text-emerald-100 placeholder-emerald-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-44 bg-black/40 border border-emerald-800/70 rounded-lg px-4 py-2.5 text-emerald-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
          >
            <option value="">All Status</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="FAILED">FAILED</option>
          </select>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView("table")}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all ${
                view === "table"
                  ? "bg-emerald-700/70 border-emerald-600 text-white shadow-md"
                  : "border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FaTable />
              Table
            </button>
            <button
              onClick={() => setView("card")}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all ${
                view === "card"
                  ? "bg-emerald-700/70 border-emerald-600 text-white shadow-md"
                  : "border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FaThLarge />
              Cards
            </button>
          </div>
        </div>
      </div>
    );
  }, [pagination.total, q, status, view]);

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black text-gray-100">
      <div className="bg-gradient-to-b from-emerald-950/70 to-black/70 rounded-xl border border-emerald-800/50 shadow-2xl shadow-emerald-950/40 backdrop-blur-sm p-5 md:p-6">
        {header}

        {/* Content Area */}
        <div className="mt-6">
          {loading ? (
            <div className="py-16 text-center text-emerald-400 font-medium">
              Loading transactions...
            </div>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center text-emerald-400/80 font-medium">
              No transactions found.
            </div>
          ) : view === "table" ? (
            <div className="w-full overflow-x-auto rounded-lg border border-emerald-800/40">
              <table className="min-w-[1100px] w-full text-sm">
                <thead>
                  <tr className="bg-emerald-950/60 text-emerald-300">
                    <th className="text-left p-4 font-semibold">User</th>
                    <th className="text-left p-4 font-semibold">Amount</th>
                    <th className="text-left p-4 font-semibold">Invoice</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Trx ID</th>
                    <th className="text-left p-4 font-semibold">Bank</th>
                    <th className="text-left p-4 font-semibold">Created</th>
                    <th className="text-left p-4 font-semibold">Paid At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40">
                  {rows.map((r) => (
                    <tr
                      key={r._id}
                      className="hover:bg-emerald-950/40 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-emerald-100">
                          {r.userName || "Unknown"}
                        </div>
                        <div className="text-xs text-emerald-400/70 break-all mt-0.5">
                          {r.userIdentity}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-emerald-300">
                        ৳{r.amount}
                      </td>
                      <td className="p-4 font-medium text-emerald-200">
                        {r.invoiceNumber}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="p-4 text-xs text-emerald-300/90 break-all font-mono">
                        {r.transactionId || "—"}
                      </td>
                      <td className="p-4 text-emerald-200 font-medium">
                        {r.bank || "—"}
                      </td>
                      <td className="p-4 text-emerald-300/90">
                        {fmtDate(r.createdAt)}
                      </td>
                      <td className="p-4 text-emerald-300/90">
                        {fmtDate(r.paidAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Card View
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {rows.map((r) => (
                <div
                  key={r._id}
                  className="bg-black/30 border border-emerald-800/50 rounded-xl p-5 hover:border-emerald-600/60 transition-all shadow-md"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="text-lg font-bold text-emerald-100">
                        {r.userName || "Unknown"}
                      </div>
                      <div className="text-xs text-emerald-400/80 break-all mt-0.5">
                        {r.userIdentity}
                      </div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-emerald-400/70">Amount</div>
                      <div className="text-xl font-bold text-emerald-300">
                        ৳{r.amount}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-emerald-400/70">Invoice</div>
                      <div className="font-medium text-emerald-200 break-all">
                        {r.invoiceNumber}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-xs text-emerald-400/70">
                        Transaction ID
                      </div>
                      <div className="font-mono text-emerald-300/90 break-all text-sm">
                        {r.transactionId || "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-emerald-400/70">Bank</div>
                      <div className="text-emerald-200">{r.bank || "—"}</div>
                    </div>

                    <div>
                      <div className="text-xs text-emerald-400/70">Created</div>
                      <div className="text-emerald-300/90">
                        {fmtDate(r.createdAt)}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-xs text-emerald-400/70">Paid At</div>
                      <div className="text-emerald-300/90">
                        {fmtDate(r.paidAt)}
                      </div>
                    </div>
                  </div>

                  {/* Checkout Items Preview */}
                  {r.checkoutItems &&
                    Object.keys(r.checkoutItems).length > 0 && (
                      <div className="mt-5 pt-4 border-t border-emerald-800/40">
                        <div className="text-xs text-emerald-400/70 mb-2">
                          Checkout Items
                        </div>
                        <pre className="text-[11px] bg-black/40 border border-emerald-900/60 rounded-lg p-3 overflow-auto max-h-32 text-emerald-200/90 font-mono">
                          {JSON.stringify(r.checkoutItems, null, 2)}
                        </pre>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-emerald-800/40 pt-5">
          <div className="text-sm text-emerald-300/80">
            Page{" "}
            <span className="font-bold text-emerald-200">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-bold text-emerald-200">
              {pagination.totalPages}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              disabled={!canPrev}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium transition-all ${
                canPrev
                  ? "border-emerald-600 text-emerald-300 hover:bg-emerald-950/50"
                  : "border-emerald-900/40 text-emerald-700 opacity-50 cursor-not-allowed"
              }`}
            >
              <FaChevronLeft size={14} /> Prev
            </button>

            <button
              onClick={goNext}
              disabled={!canNext}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium transition-all ${
                canNext
                  ? "border-emerald-600 text-emerald-300 hover:bg-emerald-950/50"
                  : "border-emerald-900/40 text-emerald-700 opacity-50 cursor-not-allowed"
              }`}
            >
              Next <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OracleWalletAgentHistory;
