import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";

const RescueFundInformation = () => {
  const { language = "en" } = useContext(AuthContext);

  // ভাষা অনুযায়ী হেডার ও প্রোডাক্ট নাম
  const t = {
    en: {
      products: "Products",
      netLoss: "Net Loss",
      ratio: "Rescue Ratio",
      productNames: ["Slot", "Sports", "Fishing", "Live Casino", "Esports"],
    },
    bn: {
      products: "প্রোডাক্টস",
      netLoss: "নেট লস",
      ratio: "রেসকিউ রেশিও",
      productNames: ["স্লট", "স্পোর্টস", "ফিশিং", "লাইভ ক্যাসিনো", "ই-স্পোর্টস"],
    },
  };

  const txt = t[language];

  const productData = [
    {
      title: txt.products,
      items: txt.productNames, // এখানে বাংলা/ইংরেজি অটো চেঞ্জ হবে
    },
    {
      title: txt.netLoss,
      items: [
        "≥ 99.00",
        "≥ 999.00",
        "≥ 4999.00",
        "≥ 500.00",
        "≥ 8000.00",
        "≥ 99.00",
        "≥ 999.00",
        "≥ 4999.00",
        "≥ 500.00",
        "≥ 8000.00",
        "≥ 99.00",
        "≥ 999.00",
        "≥ 4999.00",
        "≥ 500.00",
        "≥ 8000.00",
      ],
    },
    {
      title: txt.ratio,
      items: [
        "৳9",
        "৳99",
        "৳999",
        "৳9999",
        "0.25%",
        "1%",
        "2.5%",
      ],
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 h-64 overflow-y-auto text-center">
      {productData.map((column, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-gray-600 mb-3 text-lg sticky top-0 bg-white z-10 py-2 border-b">
            {column.title}
          </h3>
          <div className="space-y-1">
            {column.items.map((item, idx) => (
              <p
                key={idx}
                className="text-sm text-gray-700 py-2 border-b last:border-none hover:bg-gray-50 transition"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RescueFundInformation;