import { useContext } from "react";
import { LanguageContext } from "../../../../Context/LanguageContext";

const Record = () => {
  const { language } = useContext(LanguageContext);

  const filterOptions = [
    { label: { en: "Invitation Rewards", bn: "আমন্ত্রণ পুরস্কার" }, value: "all" },
    { label: { en: "Achievements Rewards", bn: "অর্জন পুরস্কার" }, value: "jili" },
    { label: { en: "Deposit Rebate", bn: "জমা রিবেট" }, value: "pg" },
  ];
  
  const tableHeaders =
  [
    { label: { en: "Registration Date", bn: "নিবন্ধনের তারিখ" }, key: "betTime" },
    { label: { en: "Username", bn: "ব্যবহারকারীর নাম" }, key: "betAmount" },
    { label: { en: "Amount", bn: "পরিমাণ" }, key: "validBet" }
  ];
  
  return (
    <div className="">
      <div className="flex  gap-3 items-center [#1296db] flex-wrap">
        {/* select option */}
        <label className="flex items-center lg:text-black text-[#1296db] gap-2 border border-black border-opacity-50 p-1 rounded-md">
          <span className="text-sm">
            <span className="text-sm">
              {language === "en" ? "Types" : "প্রকার"}
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

        {/* Date Picker */}
        <label className="border border-black border-opacity-50 p-1 rounded-md">
          <input
            type="datetime-local"
            className="text-sm text-[#1296db] lg:text-black px-2 py-1"
          />
        </label>
        {/* button */}
        <button className="px-5 py-1 hidden lg:block rounded-full text-white bg-bgRed">
          Search
        </button>
      </div>
      {/* Table */}
      <div className="pt-2">
        
        <table className="w-full border ">
          <thead className=" ">
            <tr className="bg-gray-200 text-xs lg:text-base whitespace-nowrap ">
              {tableHeaders.map((header, i) => (
                <th key={i} className="border p-2 font-normal">
                  {language === "bn" ? header.label.bn : header.label.en}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="">
             
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="border text-xl lg:text-base p-4 text-center lg:text-gray-500 text-[#1296db]"
                >
                  {language === "en" ? "No data matches" : "কোন ডেটা নেই"}
                </td>
              </tr>
            
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Record;
