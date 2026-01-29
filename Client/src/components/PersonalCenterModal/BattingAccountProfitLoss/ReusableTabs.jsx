import { useContext, useState } from "react";
import { LanguageContext } from "../../../Context/LanguageContext";
import { AuthContext } from "@/Context/AuthContext";

const ReusableTabs = ({ data, filterOptions, filters }) => {
  const { language ,userId} = useContext(AuthContext);
  console.log("UserID in ReusableTabs:", userId);

  const tableHeaders = [
    { label: { en: "Bet Time", bn: "বেট সময়" }, key: "betTime" },
    { label: { en: "Bet Amount", bn: "বেট পরিমাণ" }, key: "betAmount" },
    { label: { en: "Valid Bet", bn: "বৈধ বেট" }, key: "validBet" },
    { label: { en: "Award", bn: "অর্থ পুরস্কার" }, key: "award" },
    { label: { en: "Profit Loss", bn: "লাভ ক্ষতি" }, key: "profitLoss" },
    { label: { en: "Game Name", bn: "গেম নাম" }, key: "gameName" },
    { label: { en: "Game Number", bn: "গেম নম্বর" }, key: "gameNumber" },
  ];

  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeRadioTab, setActiveRadioTab] = useState(0);

  const mainTab = data[activeMainTab];
  const radioTab = mainTab.radioTabs[activeRadioTab];

  return (
    <div className="p-4 space-y-4  ">
      {/* Main Tabs */}
      <div className="flex gap-10 text-xs lg:text-base overflow-x-auto border-b">
        {data?.map((tab, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveMainTab(i);
              setActiveRadioTab(0); // reset radio tab
            }}
            className={`pb-2 ${
              i === activeMainTab
                ? "border-b-2  border-textRed text-[#1296db] lg:text-textRed font-semibold"
                : ""
            }`}
          >
            {language === "bn" ? tab.tabTitle.bn : tab.tabTitle.en}
          </button>
        ))}
      </div>

      {/* Radio Tabs */}
      <div className="flex  gap-3 items-center [#1296db] flex-wrap">
        {/* Radio Tabs */}
        {mainTab?.radioTabs?.map((r, i) => (
          <label key={i} className="lg:flex hidden items-center gap-1">
            <input
              type="radio"
              name="radioTab"
              checked={i === activeRadioTab}
              onChange={() => setActiveRadioTab(i)}
            />
            {language === "bn" ? r.label.bn : r.label.en}
          </label>
        ))}
        <div className="flex flex-col lg:flex-row  gap-2  lg:gap-1">
          {/* Date Picker */}
          <label className="border border-black border-opacity-50 p-1 rounded-md">
            <input
              type="datetime-local"
              className="text-sm text-[#1296db] lg:text-black px-2 py-1"
            />
          </label>

          {/* Select Dropdown */}
          <label className="flex items-center lg:text-black text-[#1296db] gap-2 border border-black border-opacity-50 p-1 rounded-md">
            <span className="text-sm">
              <span className="text-sm">
                {filters
                  ? language === "bn"
                    ? filters.label.bn
                    : filters.label.en
                  : language === "bn"
                  ? "ফিল্টার:"
                  : "Filter:"}
              </span>
            </span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              {filterOptions?.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {language === "bn" ? opt.label.bn : opt.label.en}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="px-5 py-1 hidden lg:block rounded-full text-white bg-bgRed">
          Search
        </button>
      </div>

      {/* Table */}
      <div>
        <p className="text-sm mb-2">
          Showing {radioTab?.tableData?.length} result(s)
        </p>
        <table className="w-full border ">
          <thead className="hidden lg:table-header-group ">
            <tr className="bg-gray-200 ">
              {tableHeaders?.map((header, i) => (
                <th key={i} className="border p-2 font-normal">
                  {language === "bn" ? header.label.bn : header.label.en}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="">
            {radioTab?.tableData?.length > 0 ? (
              radioTab?.tableData?.map((row, i) => (
                <tr key={i} className="hidden lg:lg:table-row ">
                  {tableHeaders.map((header, j) => (
                    <td key={j} className="border p-2  ">
                      {row[header.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="border text-xl lg:text-base p-4 text-center lg:text-gray-500 text-[#1296db]"
                >
                  {language === "en" ? "No data matches" : "কোন ডেটা নেই"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Total Section */}
      <div className=" border-t border-gray-300 min-h-screen md:min-h-0 bg-white shadow-md ">
  <div className=" lg:w-[40%] flex justify-between items-center px-4 py-2">
    <p className="font-semibold lg:block hidden">
      
      {language === "en"?"Total":"মোট"}
      </p>
    <div className="hidden lg:flex gap-12">
      <p className="text-gray-700">0.00</p>
      <p className="text-gray-700">0.00</p>
      <p className="text-gray-700">0.00</p>
      <p className="text-gray-700">0.00</p>
    </div>
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full lg:hidden">
      <div>
        <p className="text-sm ">বেট পরিমাণ</p>
        <p className="text-[#70b603]">0.00</p>
      </div>
      <div>
        <p className="text-sm ">জয়</p>
        <p className="text-[#70b603]">0.00</p>
      </div>
      <div>
        <p className="text-sm ">বৈধ বেট</p>
        <p className="text-[#70b603]">0.00</p>
      </div>
      <div>
        <p className="text-sm ">লাভ এবং লস</p>
        <p className="text-[#70b603]">0.00</p>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default ReusableTabs;
