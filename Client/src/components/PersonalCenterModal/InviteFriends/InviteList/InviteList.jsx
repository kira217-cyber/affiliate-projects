import { useContext, useState } from "react";
import { LanguageContext } from "../../../../Context/LanguageContext";

const InviteList = () => {
  const { language } = useContext(LanguageContext);

  const data = [
    {
      tabTitle: { en: "Sport", bn: "স্পোর্টস" },
      radioTabs: [
        {
          label: { en: "Today", bn: "আজ" },
          tableData: []
        },
        {
          label: { en: "Yesterday", bn: "গতকাল" },
          tableData: [
            {
              RegistrationDate: "10/09/25",
              Username: "Rohan",
              FirstDepositDate: "10/09/25",
              Status: "True"
            }
          ]
        },
        {
          label: { en: "7 days", bn: "৭ দিন" },
          tableData: []
        }
      ]
    },
    {
      tabTitle: { en: "Slot", bn: "স্লট" },
      radioTabs: [
        {
          label: { en: "Day 1", bn: "দিন ১" },
          tableData: [
            {
              RegistrationDate: "10/09/25",
              Username: "Rohan",
              FirstDepositDate: "10/09/25",
              Status: "True"
            }
          ]
        }
      ]
    },
    {
      tabTitle: { en: "Live", bn: "লাইভ" },
      radioTabs: [
        {
          label: { en: "Day 1", bn: "দিন ১" },
          tableData: [
            {
              RegistrationDate: "10/09/25",
              Username: "Rohan",
              FirstDepositDate: "10/09/25",
              Status: "True"
            }
          ]
        }
      ]
    },
    {
      tabTitle: { en: "Fishing", bn: "ফিশিং" },
      radioTabs: [
        {
          label: { en: "Day 1", bn: "দিন ১" },
          tableData: [
            {
              RegistrationDate: "10/09/25",
              Username: "Rohan",
              FirstDepositDate: "10/09/25",
              Status: "True"
            }
          ]
        }
      ]
    },
    {
      tabTitle: { en: "Poker", bn: "পোকার" },
      radioTabs: [
        {
          label: { en: "Day 1", bn: "দিন ১" },
          tableData: [
            {
              RegistrationDate: "10/09/25",
              Username: "Rohan",
              FirstDepositDate: "10/09/25",
              Status: "True"
            }
          ]
        }
      ]
    },
    {
      tabTitle: { en: "Lotto", bn: "লটারি" },
      radioTabs: [
        {
          label: { en: "Day 1", bn: "দিন ১" },
          tableData: [
            {
              RegistrationDate: "10/09/25",
              Username: "Rohan",
              FirstDepositDate: "10/09/25",
              Status: "True"
            }
          ]
        }
      ]
    }
  ];

  const filterOptions = [
    { label: { en: "All", bn: "সব" }, value: "all" },
    { label: { en: "Qualified", bn: "যোগ্য" }, value: "qualified" },
    { label: { en: "Not qualified", bn: "অযোগ্য" }, value: "notQualified" }
  ];

  const filterOptionsTwo = [
    { label: { en: "Registration Date", bn: "নিবন্ধনের তারিখ" }, value: "registration" },
    { label: { en: "First Deposit Date", bn: "প্রথম জমার তারিখ" }, value: "qualified" }
  ];

  const tableHeaders = [
    { label: { en: "Registration Date", bn: "নিবন্ধনের তারিখ" }, key: "RegistrationDate" },
    { label: { en: "Username", bn: "ইউজারনেম" }, key: "Username" },
    { label: { en: "First Deposit Date", bn: "প্রথম জমার তারিখ" }, key: "FirstDepositDate" },
    { label: { en: "Status", bn: "স্ট্যাটাস" }, key: "Status" }
  ];

  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeRadioTab, setActiveRadioTab] = useState(0);

  const mainTab = data[activeMainTab];
  const radioTab = mainTab.radioTabs[activeRadioTab];
  console.log(setActiveMainTab);

  return (
    <div className="p-4 space-y-4 ">
      <div className="flex gap-3 items-center flex-wrap">
        <select className="border border-gray-300 rounded px-2 py-1 text-sm">
          {filterOptionsTwo.map((opt, i) => (
            <option key={i} value={opt.value}>
              {language === "bn" ? opt.label.bn : opt.label.en}
            </option>
          ))}
        </select>

        {mainTab.radioTabs.map((r, i) => (
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

        <div className="flex flex-col lg:flex-row gap-2 lg:gap-1">
          <input
            type="datetime-local"
            className="border border-black border-opacity-50 p-1 rounded-md text-sm text-[#1296db] lg:text-black"
          />
          <select className="border border-black border-opacity-50 p-1 rounded-md text-sm">
            {filterOptions.map((opt, i) => (
              <option key={i} value={opt.value}>
                {language === "bn" ? opt.label.bn : opt.label.en}
              </option>
            ))}
          </select>
        </div>

        <button className="px-5 py-1 hidden lg:block rounded-full text-white bg-bgRed">
          Search
        </button>
      </div>

      <div>
        <table className="w-full border">
          <thead className="hidden lg:table-header-group">
            <tr className="bg-gray-200 text-xs">
              {tableHeaders.map((header, i) => (
                <th key={i} className="border p-2 font-normal">
                  {language === "bn" ? header.label.bn : header.label.en}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {radioTab.tableData.length > 0 ? (
              radioTab.tableData.map((row, i) => (
                <tr key={i} className="hidden lg:table-row">
                  {tableHeaders.map((header, j) => (
                    <td key={j} className="border p-2">
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

      <div className="lg:w-[65%] fixed bottom-1 lg:bottom-0 border-t border-gray-300 bg-white shadow-md">
        <div className="lg:w-[40%] flex justify-between items-center px-4 py-2">
          <p className="font-semibold lg:block hidden">
            {language === "en" ? "Total" : "মোট"}
          </p>
          <div className="hidden lg:flex gap-12">
            <p className="text-gray-700">0.00</p>
            <p className="text-gray-700">0.00</p>
            <p className="text-gray-700">0.00</p>
            <p className="text-gray-700">0.00</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full lg:hidden">
            <div><p className="text-sm">বেট পরিমাণ</p><p className="text-[#70b603]">0.00</p></div>
            <div><p className="text-sm">জয়</p><p className="text-[#70b603]">0.00</p></div>
            <div><p className="text-sm">বৈধ বেট</p><p className="text-[#70b603]">0.00</p></div>
            <div><p className="text-sm">লাভ এবং লস</p><p className="text-[#70b603]">0.00</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteList;
