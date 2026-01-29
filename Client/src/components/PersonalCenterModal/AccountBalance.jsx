const AccountBalance = ({
  reloadBalance,
  loading,
  toggleBalanceVisibility,
  showBalance,
  balance,
}) => {
  return (
    <div className="px-2 mt-3">
      <div className=" px-4 py-3 flex justify-between items-center">

        {/* LEFT MONEY */}
        <div className="flex items-center text-3xl font-semibold text-black">
          <span className="text-4xl mr-1">৳</span>
          <span className="text-gray-800">
            {loading ? "..." : showBalance ? balance : "**"}
          </span>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-3">

          {/* RELOAD */}
          <button onClick={reloadBalance}>
            {loading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#f56908"
              >
                <path d="M23 4v6h-6" />
                <path d="M20.49 15a9 9 0 1 1 2.13-9" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f56908"
                strokeWidth="2"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1 2.13-9" />
              </svg>
            )}
          </button>

          {/* EYE ICON */}
          <button onClick={toggleBalanceVisibility}>
            {showBalance ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#f56908"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#f56908"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8" />
                <path d="M9.53 9.53A3 3 0 0 1 12 9" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountBalance;
