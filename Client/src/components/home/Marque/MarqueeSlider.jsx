import { getNotices } from "@/features/notice/NoticeControlThunk";
import { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AuthContext } from "@/Context/AuthContext"; // Your existing context

const MarqueeSlider = () => {
  const dispatch = useDispatch();

  // Get notice data
  const { title, titleBD, emoji, isLoading, isError, errorMessage, active } =
    useSelector((state) => state.noticeControl);

  // Get language & color from AuthContext + Theme (color only)
  const { language, user } = useContext(AuthContext);
  const { secondaryColor } = useSelector((state) => state.theme);

  // Fetch notices on mount
  useEffect(() => {
    dispatch(getNotices());
  }, [dispatch]);

  // Loading state
  if (isLoading) {
    const bubbleHeight = typeof window !== "undefined" && window.innerWidth <= 768 ? 44 : 56;
    return (
      <div className="relative bg-[#002f2f] rounded-full shadow-md w-full max-w-5xl mx-auto my-2 lg:my-4 pr-4 py-1.5 md:py-2 overflow-hidden">
        <Skeleton
          height={bubbleHeight}
          baseColor="#00393a"
          highlightColor="#015c5f"
          borderRadius={9999}
        />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="relative bg-[#002f2f] rounded-full shadow-md w-full max-w-5xl mx-auto my-2 lg:my-4 pr-4 py-1.5 md:py-2 overflow-hidden">
        <p className="text-white text-xs sm:text-base pl-10">
          Error: {errorMessage}
        </p>
      </div>
    );
  }

  // No notice or not active
  if (!title || !titleBD || !active) {
    return (
      <div className="relative bg-[#002f2f] rounded-full shadow-md w-full max-w-5xl mx-auto my-2 lg:my-4 pr-4 py-1.5 md:py-2 overflow-hidden">
        <p className="text-white text-xs sm:text-base pl-10">
          {language === "bn"
            ? "কোনো নোটিশ পাওয়া যায়নি"
            : "No notice available"}
        </p>
      </div>
    );
  }

  // Main marquee with correct language
  const displayText = language === "bn" ? titleBD : title;

  const topMarginClass = user ? "mt-5" : "mt-20";

  return (
    <div className={`relative ${topMarginClass} mb-2 bg-[#002f2f] border-[1px] border-[#046e54] rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] w-full max-w-5xl mx-auto my-2 lg:my-4 pr-4 py-1.5 md:py-1.5 overflow-hidden`}>
      {/* Dynamic Emoji */}
      <div
        className="absolute px-2 top-1/2 -translate-y-1/2 text-base lg:text-xl bg-[#002f2f]"
        style={{ color: secondaryColor }}
      >
        {emoji}
      </div>

      {/* Scrolling Marquee Text */}
      <Link
        to="/promotions"
        className="block font-bold whitespace-nowrap text-xs sm:text-base animate-marquee hover:[animation-play-state:paused] cursor-pointer pl-10"
        style={{ color: secondaryColor }}
      >
        {emoji} {displayText}
      </Link>
    </div>
  );
};

export default MarqueeSlider;
