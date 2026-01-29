import { useState, useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";
import TicketRecordImage from "../../../../assets/ticket-records.a568aa3b.svg";
import TicketReceive from "./TicketReceive";
import TicketRecord from "./TicketRecord";

const RewardTicket = () => {
  const { language = "en" } = useContext(AuthContext);
  const [activeModal, setActiveModal] = useState(null);

  // ভাষা অনুযায়ী টেক্সট
  const text = {
    bn: {
      receiveCenter: "প্রাপ্তি কেন্দ্র",
      ticketRecord: "টিকিটের রেকর্ড",
    },
    en: {
      receiveCenter: "Receive Center",
      ticketRecord: "Ticket Record",
    },
  };

  const t = text[language];

  return (
    <div className="bg-white">
      {/* Title Part */}
      <div className="text-[#4c11d3] py-1 flex gap-12 items-center">
        <p className="text-black border-l-4 px-2 border-[#4c11d3] font-medium">
          {t.receiveCenter}
        </p>

        <div
          className="flex gap-2 px-4 cursor-pointer rounded-full bg-opacity-10 hover:bg-opacity-100 bg-[#4c11d3] transition-all duration-300 group"
          onClick={() => setActiveModal("TicketRecord")}
        >
          <img
            src={TicketRecordImage}
            alt="Ticket Record"
            className="w-5 h-5"
          />
          <p className="text-black group-hover:text-white font-medium">
            {t.ticketRecord}
          </p>
        </div>
      </div>

      {/* Receive Ticket Section */}
      <TicketReceive />

      {/* Ticket Record Modal */}
      <TicketRecord activeModal={activeModal} setActiveModal={setActiveModal} />
    </div>
  );
};

export default RewardTicket;
