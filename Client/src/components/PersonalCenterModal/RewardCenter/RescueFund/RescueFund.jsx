import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";

import rescueFundBg from "../../../../assets/rescue-fund-bg.253b620b.png";
import userImage from "../../../../assets/0.png";
import taskBg from "../../../../assets/task-bg.578f551b.png";
import RescueFundInformation from "./RescueFundInformation";
import RescueFundModal from "./RescueFundModal";

const RescueFund = () => {
  const { language = "en" ,user,balance} = useContext(AuthContext);

  // ভাষা অনুযায়ী টেক্সট
  const t = {
    en: {
      rescueFunds: "Rescue Funds",
    },
    bn: {
      rescueFunds: "রেসকিউ ফান্ড",
    },
  };

  const txt = t[language];

  return (
    <div>
      {/* Large Device - Desktop */}
      <div className="hidden lg:block">
        <img src={rescueFundBg} alt="Rescue Fund Background" className="w-full bg-cover" />
        <div className="rounded-md gap-4 text-center bg-white -mt-20 relative z-10 shadow-2xl">
          <h3 className="text-2xl font-bold text-[#4c11d3] py-6">
            {txt.rescueFunds}
          </h3>
          <div className="bg-white p-6 rounded-md shadow-md max-w-4xl mx-auto border">
            <RescueFundInformation />
          </div>
        </div>
      </div>

      {/* Small Device - Mobile */}
      <div className="lg:hidden">
        <div className="relative">
          <img 
            src={taskBg} 
            alt="Task Background" 
            className="w-full h-[220px] object-cover"
          />

          {/* User Info Overlay */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[85%] flex items-center gap-4 bg-black/40 backdrop-blur-sm p-4 rounded-xl shadow-xl">
            <img
              src={userImage}
              alt="User"
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
            />
            <div className="text-white">
              <p className="font-bold text-lg">{user?.username}</p>
              <p className="text-xl font-semibold">৳ {balance}</p>
            </div>
          </div>
        </div>

        {/* Mobile Modal */}
        <RescueFundModal />
      </div>
    </div>
  );
};

export default RescueFund;