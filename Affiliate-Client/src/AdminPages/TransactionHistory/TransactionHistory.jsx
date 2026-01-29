import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import SuperTransactionHistory from "../../AdminComponents/TransactionHistory/SuperTransactionHistory";
import MasterTransactionHistory from "../../AdminComponents/TransactionHistory/MasterTransactionHistory";

const TransactionHistory = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      {user?.role === "super-affiliate" ? (
        <SuperTransactionHistory></SuperTransactionHistory>
      ) : user?.role === "master-affiliate" ? (
        <MasterTransactionHistory></MasterTransactionHistory>
      ) : (
        <p className="text-center text-red-500 mt-10">
          Unauthorized access or invalid role.
        </p>
      )}
    </div>
  );
};

export default TransactionHistory;
