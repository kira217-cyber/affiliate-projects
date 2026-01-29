import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import SuperWithdraw from "../../AdminComponents/WithdrawSystem/SuperWithdraw";
import MasterWithdraw from "../../AdminComponents/WithdrawSystem/MasterWithdraw";


const Withdraw = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      {user?.role === "super-affiliate" ? (
        <SuperWithdraw></SuperWithdraw>
      ) : user?.role === "master-affiliate" ? (
        <MasterWithdraw></MasterWithdraw>
      ) : (
        <p className="text-center text-red-500 mt-10">
          Unauthorized access or invalid role.
        </p>
      )}
    </div>
  );
};

export default Withdraw;
