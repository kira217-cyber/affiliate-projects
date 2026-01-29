import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "@/Context/AuthContext";
import axios from "axios";

const PromotionContain = () => {
  const { language = "en", user } = useContext(AuthContext);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("All");

  // Bilingual Categories – আগের মতোই, with contextual filtering
  const baseCategories = language === "bn"
    ? [
        "সব",
        "ডিপোজিট",
        "স্লট",
        "ফিশিং",
        "অ্যাপ ডাউনলোড",
        "নতুন সদস্য",
        "রিবেট",
        "র‍্যাঙ্কিং",
        "পোকার",
        "লাইভ ক্যাসিনো",
        "স্পোর্টস",
      ]
    : [
        "All",
        "Deposit",
        "Slots",
        "Fishing",
        "APP Download",
        "Newbie",
        "Rebate",
        "Ranking",
        "Poker",
        "Live Casino",
        "Sports",
      ];

  const categories = user
    ? baseCategories.filter(
        (cat) => cat !== "APP Download" && cat !== "অ্যাপ ডাউনলোড"
      )
    : baseCategories;

  // English to Bangla Category Mapping (API থেকে English আসে)
  const enToBn = {
    All: "সব",
    Deposit: "ডিপোজিট",
    Slots: "স্লট",
    Fishing: "ফিশিং",
    "APP Download": "অ্যাপ ডাউনলোড",
    Newbie: "নতুন সদস্য",
    Rebate: "রিবেট",
    Ranking: "র‍্যাঙ্কিং",
    Poker: "পোকার",
    "Live Casino": "লাইভ ক্যাসিনো",
    Sports: "স্পোর্টস",
  };

  // Ref for horizontal scroll container
  const scrollContainerRef = useRef(null);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Fetch data from API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/promotions`
        );
        setPromotions(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load promotions:", err);
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  // Language change হলে "সব" বা "All" সিলেক্ট
    useEffect(() => {
      setSelected(categories[0] || "All");
    }, [language, user]);

  // Filter logic – বাংলা + ইংরেজি দুটোতেই কাজ করে
  const filteredPromotions = promotions.filter((promo) => {
    const promoCat =
      language === "bn"
        ? enToBn[promo.category] || promo.category
        : promo.category;
    const allCat = categories[0];
    return selected === allCat || promoCat === selected;
  });

  if (loading) {
    return (
      <div className="bg-[#013b3f] min-h-screen flex items-center justify-center text-teal-300 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#013b3f] min-h-screen text-white p-4 rounded-lg max-w-5xl mx-auto mb-4">
      <h1 className="text-2xl font-bold text-teal-300 mb-4">PROMOTION</h1>

      {/* Category Menu – ঠিক আগের মতোই */}
      <div className="relative flex items-center gap-2 p-2 mb-8">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="flex-shrink-0 text-2xl text-[#26e7e4] hover:text-white transition z-10"
        >
          &lt;
        </button>

        {/* Scrollable Categories – Scrollbar 100% Hidden */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 flex-1 px-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setSelected(cat)}
              className={`whitespace-nowrap text-lg font-medium transition-colors duration-300 flex-shrink-0 ${
                selected === cat
                  ? "text-[#26e7e4] underline decoration-2 underline-offset-4 decoration-[#26e7e4]"
                  : "text-white hover:text-[#26e7e4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="flex-shrink-0 text-2xl text-[#26e7e4] hover:text-white transition z-10"
        >
          &gt;
        </button>
      </div>

      {/* Promotions Grid – শুধু title দেখানো হচ্ছে */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPromotions.length === 0 ? (
          <div className="col-span-2 text-center text-gray-400 py-10">
            {language === "bn" ? "কোনো প্রমোশন নেই" : "No promotions available"}
          </div>
        ) : (
          filteredPromotions.map((promo, index) => (
            <div
              key={promo._id || index}
              className="bg-[#002f34] border border-[#097575] shadow-md flex flex-col overflow-hidden"
            >
              <img
                src={promo.image}
                alt="Promo"
                className="w-full h-32 object-cover"
              />
              <div className="flex justify-between items-center px-4 py-3">
                <h2 className="text-sm font-bold text-yellow-400 truncate max-w-[70%]">
                  {language === "bn" ? promo.title_bn : promo.title_en}
                </h2>
                <button onClick={promo._id} className="bg-yellow-400 text-black px-4 py-2 rounded-md font-bold text-sm whitespace-nowrap">
                  {language === "bn" ? "বিস্তারিত" : "View"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PromotionContain;
