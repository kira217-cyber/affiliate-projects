import { useContext, useState } from "react";
import { LanguageContext } from "../../../Context/LanguageContext";
import Overview from "./Overview/Overview";
import InviteReward from "./InviteReward/InviteReward";
import Income from "./Income/Income";
import Record from "./Record/Record";
import InviteList from "./InviteList/InviteList";
import { AuthContext } from "@/Context/AuthContext";


const Invite = () => {
    const { language } = useContext(AuthContext);
    const tabs = [
        {
          title: language === "bn" ? "সারসংক্ষেপ" : "Overview",
          key: "overview",
        },
        {
          title: language === "bn" ? " পুরস্কার" : "Reward",
          key: "reward",
        },
        {
          title: language === "bn" ? "আয়" : "Income",
          key: "income",
        },
        {
          title: language === "bn" ? "রেকর্ডস" : "Records",
          key: "records",
        },
        {
          title: language === "bn" ? "আমন্ত্রণ তালিকা" : "Invite List",
          key: "invite",
        },
      ];
     
      
      
    
  const [activeTab, setActiveTab] = useState(tabs[0].key);


  return (
    <div className="w-full p-4 min-h-screen md:min-h-0">
      {/* Tabs */}
      <div className="flex space-x-4 overflow-x-auto pr-6 lg:pr-0 whitespace-nowrap border-b border-gray-300 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-textRed text-textRed"
                : "text-gray-600 hover:text-textRed"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px] p-4 border rounded-lg shadow bg-white">
        {activeTab === "overview" && (
          <div>
            <Overview/>
          </div>
        )}
        {activeTab === "reward" && (
          <div>
            <InviteReward/>
          </div>
        )}
        {activeTab === "income" && (
          <div>
            <Income/>
          </div>
        )}
        {activeTab === "records" && (
          <div>
            <Record/>
          </div>
        )}
        {activeTab === "invite" && (
          <div>
           <InviteList/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invite;
