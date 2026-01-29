import { useContext } from "react";
import { LanguageContext } from "../../../../Context/LanguageContext";

import { RxCross1 } from "react-icons/rx";
// import { motion } from "framer-motion";
import ReusableTabs from "../../BattingAccountProfitLoss/ReusableTabs";
import { AuthContext } from "@/Context/AuthContext";

const TicketRecord = ({ activeModal, setActiveModal }) => {
  const { language } = useContext(AuthContext);

  const tabData = [
    {
      tabTitle: { en: "Sport", bn: "স্পোর্টস" },
      radioTabs: [
        {
          label: { en: "Today", bn: "আজ" },
          tableData: [],
        },
        {
          label: { en: "Yesterday", bn: "গতকাল" },
          tableData: [
            {
              betTime: "11:00 AM",
              betAmount: "$150",
              validBet: "$140",
              award: "$100",
              profitLoss: "-$40",
              gameName: "Poker",
              gameNumber: "G456",
            },
          ],
        },
        {
          label: { en: "7 days", bn: "৭ দিন" },
          tableData: [],
        },
      ],
    },
  ];
  const filter = [
    { label: { en: "Vendor", bn: "বিক্রেতা" }, value: "vendor" },
    {
      label: { en: "Transaction Type", bn: "লেনদেন প্রকার" },
      value: "transactionType",
    },
    { label: { en: "Ticket Type", bn: "টিকিটের ধরন" }, value: "ticketType" },
  ];
  const tabOptions = [
    { label: { en: "All", bn: "সব" }, value: "all" },
    { label: { en: "Red Rain", bn: "রেড রেন" }, value: "jili" },
    { label: { en: "Golden Egg", bn: "সোনারি ডিম" }, value: "pg" },
    { label: { en: "Reward Wheel", bn: "পুরস্কার চাকা" }, value: "jdb" },
    {
      label: { en: "Cash Receipt", bn: "টাকা প্রাপ্তির রশিদ" },
      value: "cash_receipt",
    },
    {
      label: { en: "Merchandise Voucher", bn: "মার্চেন্ডাইজ ভাউচার" },
      value: "merch_voucher",
    },
    {
      label: { en: "Free Spin Voucher", bn: "ফ্রি স্পিন ভাউচার" },
      value: "free_spin_voucher",
    },
  ];

  return (
    <div>
      {/* Item Buttons */}

      {/* Modal */}
      {activeModal && (
        <div
          className="fixed  inset-0 z-50 flex justify-end bg-black bg-opacity-50  overflow-hidden"
          onClick={() => setActiveModal(null)}
        >
          <div className="relative hidden lg:flex flex-col justify-center gap-4">
            <div
              className="bg-white w-full p-2 absolute top-0"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 66%)",
              }}
            >
              <button
                onClick={() => setActiveModal(null)}
                className="text-white text-sm rounded-full p-1 bg-red-600"
              >
                <RxCross1 />
              </button>
            </div>
            <h3 className=" ">Record</h3>
          </div>
          <div
            className="bg-white w-auto  p-4  shadow-lg relative"
            // onClick={(e) => e.stopPropagation()}
            // initial={{ x: "100%" }}
            // animate={{ x: 0 }}
            // exit={{ x: "-100%" }}
            // transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Close button */}

            {/* Modal title */}
            <h2 className="text-center text-lg font-semibold mb-4 text-gray-800">
              {language === "bn" ? "টিকিটের রেকর্ড" : "Ticket Record"}
            </h2>

            {/* Modal content */}
            <ReusableTabs
              data={tabData}
              filterOptions={tabOptions}
              filters={filter[0]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketRecord;
