import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaKey,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const OracleWalletAgent = () => {
  const API = import.meta.env.VITE_REACT_APP_BACKEND_API2; // backend base url

  const [businessToken, setBusinessToken] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);

  // Load settings
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/oraclepay-business/admin`);
        if (res.data?.success) {
          setBusinessToken(res.data?.data?.businessToken || "");
          setActive(!!res.data?.data?.active);
        } else {
          toast.error(res.data?.message || "Failed to load OraclePay settings");
        }
      } catch (e) {
        toast.error(
          e?.response?.data?.message || "Failed to load OraclePay settings",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [API]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await axios.put(`${API}/api/oraclepay-business/admin`, {
        businessToken,
        active,
      });

      if (res.data?.success) {
        toast.success("OraclePay settings saved!");
      } else {
        toast.error(res.data?.message || "Failed to save");
      }
    } catch (e) {
      toast.error(
        e?.response?.data?.message || "Failed to save OraclePay settings",
      );
    } finally {
      setLoading(false);
    }
  };

  // Masked token display (always hidden by default)
  const maskedToken = businessToken
    ? "•".repeat(Math.min(businessToken.length, 24))
    : "No token set";

  return (
    <div className="p-5 md:p-8 min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black text-gray-100">
      <div className="max-w-3xl mx-auto bg-gradient-to-b from-emerald-950/70 to-black/70 rounded-xl border border-emerald-800/50 shadow-2xl shadow-emerald-950/40 backdrop-blur-sm p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-7">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-100 tracking-tight">
              Oracle Wallet Agent
            </h2>
            <p className="text-sm text-emerald-300/80 mt-2">
              Set <b>X-Opay-Business-Token</b> and activate to enable OraclePay
              / Opay deposit on client site.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-emerald-950/50 border border-emerald-800/60 rounded-lg px-4 py-2.5 text-sm">
            <FaShieldAlt className="text-emerald-400" />
            <span className="text-emerald-200/90 font-medium">
              Token stays server-side only
            </span>
          </div>
        </div>

        {/* Main Form */}
        <div className="space-y-7">
          {/* Token Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-emerald-200 flex items-center gap-2.5">
              <FaKey className="text-emerald-400 text-lg" />
              X-Opay-Business-Token
            </label>

            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                value={showToken ? businessToken : maskedToken}
                onChange={(e) => setBusinessToken(e.target.value)}
                placeholder="YOUR_BUSINESS_API_TOKEN"
                className="w-full bg-black/40 border border-emerald-800/70 rounded-lg px-4 py-3.5 text-emerald-100 placeholder-emerald-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all font-mono"
                autoComplete="off"
                spellCheck={false}
              />

              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 transition-colors p-1.5 rounded-md hover:bg-emerald-950/50"
              >
                {showToken ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <div className="text-xs text-emerald-400/70 leading-relaxed mt-1.5">
              <span className="text-green-400">✔</span> This token <b>never</b>{" "}
              goes to the client.
              <br />
              <span className="text-green-400">✔</span> Backend uses it to call
              OraclePay APIs.
              <br />
              <span className="text-amber-400">⚠</span> No token = feature won't
              work even if Active is ON.
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-5">
            <div>
              <p className="font-semibold text-emerald-100 text-lg">
                OraclePay Active
              </p>
              <p className="text-sm text-emerald-300/80 mt-1">
                When enabled, clients will see Opay/OraclePay deposit option.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActive((v) => !v)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
                active
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              {active ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
              {active ? "Active" : "Inactive"}
            </button>
          </div>

          {/* Status Indicator */}
          <div
            className={`rounded-xl border px-5 py-4 text-sm font-medium ${
              active && businessToken.trim()
                ? "bg-emerald-900/40 border-emerald-600/50 text-emerald-200"
                : "bg-amber-950/40 border-amber-800/50 text-amber-200"
            }`}
          >
            {active && businessToken.trim() ? (
              <span className="flex items-center gap-2">
                <span className="text-green-400 text-lg">●</span>
                <b>Ready:</b> Token is set + Active → OraclePay enabled on
                client
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="text-amber-400 text-lg">⚠</span>
                <b>Not Ready:</b>{" "}
                {active
                  ? "Active is ON but token is empty"
                  : "Feature is Inactive"}
              </span>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-red-900/40 border border-red-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            type="button"
          >
            <FaSave />
            {loading ? "Saving..." : "Save Settings"}
          </button>

          {/* Tip */}
          <div className="text-xs text-emerald-400/60 italic mt-4">
            Tip: In production, make sure <b>PUBLIC_BACKEND_URL</b> uses{" "}
            <b>https</b> so webhooks work correctly.
          </div>
        </div>
      </div>
    </div>
  );
};

export default OracleWalletAgent;
