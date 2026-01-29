import {  useState } from "react";



const Balance = () => {

    
      const [balance, setBalance] = useState(Math.floor(Math.random() * 1000)); // Initial Balance
    
      const [loading, setLoading] = useState(false);
      const [showBalance, setShowBalance] = useState(true);

      const reloadBalance = () => {
        setLoading(true); // Start loading
        setTimeout(() => {
          setBalance(Math.floor(Math.random() * 1000)); // Generate new random balance
          setLoading(false); // Stop loading
        }, 1500); // Simulate a delay (1.5s)
      };
    
      const toggleBalanceVisibility = () => {
        setShowBalance((prev) => !prev); // Toggle show/hide
      };
    return (
        <div className="lg:hidden  ">
            

          <div className="px-3 h-4  lg:text-white text-[#25252599]  flex  flex-row">
        <div className=" flex flex-row text-base items-center font-medium">
          <span className="py-2 pr-1  ">৳</span>
          <span className="">
            {loading ? "..." : showBalance ? balance.toFixed(2) : "-"}
          </span>
        </div>

        <div className="flex flex-row items-center py-2">
          {/* ভাষা অনুযায়ী টেক্সট */}

          <button onClick={reloadBalance} className="ml-2 md:pt-1">
            {loading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 "
                viewBox="0 0 24 24"
                fill="none"
                stroke="#25252599"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1 2.13-9" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=" h-5 w-5 "
                viewBox="0 0 24 24"
                fill="none"
                stroke="#25252599"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1 2.13-9" />
              </svg>
            )}
          </button>

          <button
            onClick={toggleBalanceVisibility}
            className="ml-2  "
          >
            {showBalance ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5  "
                viewBox="0 0 24 24"
                fill="none"
                stroke="#25252599"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 lg:text-white text-[#25252599] "
                viewBox="0 0 24 24"
                fill="none"
                stroke="#25252599"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a17.33 17.33 0 0 1 2.31-3.81" />
                <path d="M9.53 9.53A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3a3 3 0 0 1-.53 1.71" />
                <path d="M1 1l22 22" />
              </svg>
            )}
          </button>
        </div>
      </div>

        </div>
    );
};

export default Balance;