import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import SuperAffiliate from "../../AdminComponents/SuperAffiliate/SuperAffiliate";
import MasterAffiliate from "../../AdminComponents/MasterAffiliate/MasterAffiliate";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {user?.role === "super-affiliate" ? (
        <SuperAffiliate />
      ) : user?.role === "master-affiliate" ? (
        <MasterAffiliate />
      ) : (
        <p className="text-center text-red-500 mt-10">
          Unauthorized access or invalid role.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
