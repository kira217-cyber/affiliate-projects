import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";
import promoBg from "../../../../assets/promo-bg.b716fece.jpg";
import promoLeftBg from "../../../../assets/WhatsApp Image 2025-04-14 at 04.24.56_f89f7f5d.jpg";
import promoRightBg from "../../../../assets/rightBg.jpg";

const TicketReceive = () => {
  const { language = "en" } = useContext(AuthContext);

  // ভাষা অনুযায়ী টেক্সট
  const text = {
    bn: {
      noTicket: "কোন টিকেট পাওয়া যায় নি",
      coupon: "কুপন",
      amount: "০০০",
      expiry: "শেষ তারিখ ----.--.--",
      remaining: "বাকি",
      days: "দিন",
      receive: "প্রাপ্ত করুন",
    },
    en: {
      noTicket: "No ticket received",
      coupon: "Coupon",
      amount: "000",
      expiry: "Expiry Date ----.--.--",
      remaining: "Remaining",
      days: "days",
      receive: "Receive",
    },
  };

  const t = text[language];

  return (
    <div>
      <div
        style={{ backgroundImage: `url(${promoBg})` }}
        className="w-full bg-cover bg-center"
      >
        <div className="flex justify-center p-8">
          <h3 className="text-lg font-semibold text-[#555] text-center mb-6">
            {t.noTicket}
          </h3>

          <div className="flex gap-4 max-w-2xl w-full justify-center">
            {/* Left Promo Card - Coupon */}
            <div className="relative w-1/2 rounded-xl overflow-hidden shadow-lg">
              <img
                src={promoLeftBg}
                alt="Coupon"
                className="w-full h-full object-cover"
              />

              <h3 className="absolute top-2 left-2 text-xs text-white px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm">
                {t.coupon}
              </h3>

              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xl font-extrabold drop-shadow-2xl">
                {t.amount}
              </p>

              <p className="absolute bottom-2 left-2 text-white text-[10px] px-2 py-[2px] rounded bg-black/50 backdrop-blur">
                {t.expiry}
              </p>
            </div>

            {/* Right Promo Card - Countdown */}
            <div className="relative w-1/2 rotate-12 rounded-xl overflow-hidden shadow-lg">
              <img
                src={promoRightBg}
                alt="Countdown"
                className="w-full h-full object-cover"
              />

              <h3 className="absolute top-2 left-1/2 -translate-x-1/2 text-xs bg-yellow-500 text-black px-3 py-1 rounded-md font-bold shadow-md">
                {t.remaining}
              </h3>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-white">
                <h3 className="text-xl font-bold drop-shadow-md">
                  00 {t.days}
                </h3>
                <p className="text-sm drop-shadow">00:00</p>
              </div>

              <button className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white text-red-600 text-[7px] font-bold px-3 py-1.5 rounded-full shadow-lg hover:bg-gray-100 transition whitespace-nowrap">
                {t.receive}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketReceive;
