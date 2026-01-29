import { RxCaretLeft, RxCaretRight, RxCross2 } from "react-icons/rx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import { useEffect, useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
const IMAGE_BASE = "https://apigames.oracleapi.net";
import Modal from "@/components/home/modal/Modal";
import Login from "@/components/shared/login/Login";
import RegistrationModal from "@/components/shared/login/RegistrationModal";
import { AuthContext } from "@/Context/AuthContext";

const GameCard = ({ title = "HOT GAMES", games = [], parentId = "" }) => {
  const swiperRef = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const { user, language } = useContext(AuthContext);
  const navigate = useNavigate();

  const t = {
    en: {
      viewAll: "View All",
      playGame: "Play Game",
      hotGames: "Hot Games",
      favorites: "Favorites",
      slots: "Slots",
      live: "Live Casino",
      sports: "Sports",
      esports: "E-Sports",
      poker: "Poker",
      fishing: "Fishing",
      lottery: "Lottery",
    },
    bn: {
      viewAll: "সব দেখুন",
      playGame: "খেলুন",
      hotGames: "গরম খেলা",
      favorites: "পছন্দের গেমস",
      slots: "স্লট",
      live: "লাইভ ক্যাসিনো",
      sports: "স্পোর্টস",
      esports: "ই-স্পোর্টস",
      poker: "পোকার",
      fishing: "ফিশিং",
      lottery: "লটারি",
    },
  };
  const translate = (key) => t[language]?.[key] || t.en[key];

  const getTitle = () => {
    const map = {
      "HOT GAMES": translate("hotGames"),
      "Hot Games": translate("hotGames"),
      FAVORITES: translate("favorites"),
      SLOT: translate("slots"),
      LIVE: translate("live"),
      SPORTS: translate("sports"),
      "E-SPORTS": translate("esports"),
      POCKER: translate("poker"),
      FISHING: translate("fishing"),
      LOTTERY: translate("lottery"),
    };
    return map[title.toUpperCase()] || title;
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slidePrev = () => swiperRef.current?.slidePrev();
  const slideNext = () => swiperRef.current?.slideNext();

  const handlePlayClick = (game) => {
    const targetGame = game || selectedGame;
    if (!targetGame) return;

    if (!user) {
      setShowRegisterModal(false);
      setShowLoginModal(true);
      return;
    }

    navigate(`/liveGame/${targetGame._id}`);
    setSelectedGame(null);
  };

  const handleCardClick = (game) => {
    if (isMobile) {
      setSelectedGame(game);
      return;
    }
    handlePlayClick(game);
  };

  useEffect(() => {
    if (games.length === 0) return;

    let animationFrameId = null;
    let timeoutId = null;

    const triggerShine = () => {
      const cards = document.querySelectorAll(".auto-shine");

      cards.forEach((card) => {
        if (card instanceof HTMLElement) {
          card.classList.remove("shine-animate");
          void card.offsetWidth;
          card.classList.add("shine-animate");
        }
      });

      timeoutId = setTimeout(() => {
        if (!document.hidden) {
          animationFrameId = requestAnimationFrame(triggerShine);
        } else {
          timeoutId = setTimeout(triggerShine, 3000);
        }
      }, 3000);
    };

    const startDelay = setTimeout(() => {
      triggerShine();
    }, 1000);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [games.length]);

  return (
    <div className="max-w-5xl mx-auto mb-8 game-card-container relative">
      <div className="flex justify-between items-center mb-4 lg:mb-3 mt-4">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#10f3c8] uppercase">
          {getTitle()}
        </h2>
        <div className="flex items-center gap-2">
          <Link
            to={`/submenu/${parentId}`}
            className="px-3 py-1.5 text-sm font-bold rounded-lg bg-gradient-to-b from-[#0f727c] to-[#004e56] border-2 border-[#00a97a] text-[#ffe600] hover:bg-yellow-400 hover:text-white transition-all shadow-lg"
          >
            {translate("viewAll")}
          </Link>
          <button
            onClick={slidePrev}
            className="p-1.5 rounded-lg bg-[#003840]/80 hover:bg-[#00ffaa]/20 border border-[#00ffaa]/30 text-white transition-all"
          >
            <RxCaretLeft size={20} />
          </button>
          <button
            onClick={slideNext}
            className="p-1.5 rounded-lg bg-[#003840]/80 hover:bg-[#00ffaa]/20 border border-[#00ffaa]/30 text-white transition-all"
          >
            <RxCaretRight size={20} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Grid]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        observer={true}
        observeParents={true}
        spaceBetween={8}
        grid={{
          rows: title === "Sports" || title === "Live" ? 1 : 2,
          fill: "row",
        }}
        slidesPerView={5}
        breakpoints={{
          0: { slidesPerView: 3, spaceBetween: 8 },
          480: { slidesPerView: 3.5, spaceBetween: 10 },
          768: { slidesPerView: 4.5, spaceBetween: 12 },
          1024: { slidesPerView: 5.3, spaceBetween: 14 },
          1440: { slidesPerView: 5.3, spaceBetween: 16 },
        }}
        className="swiper-container"
        style={{ padding: "0 5px" }}
      >
        {games.map((game, index) => (
          <SwiperSlide key={game._id || index}>
            <div
              className="relative group overflow-hidden rounded-xl shadow-2xl cursor-pointer transition-all duration-500 hover:scale-105 auto-shine"
              style={{
                width: "100%",
                aspectRatio: "3/4",
                background: "linear-gradient(135deg, #0a3d42, #001f24)",
                boxShadow: "0 8px 20px rgba(0, 255, 200, 0.15)",
              }}
              onClick={() => handleCardClick(game)}
            >
              <div className="shine-layer"></div>

              {/* FIXED IMAGE SIZE */}
              <div className="w-full h-full">
                <img
                  src={(() => {
                    const docs =
                      game?.apiData?.projectImageDocs ||
                      game?.projectImageDocs ||
                      [];
                    const match = docs.find(
                      (d) => d?.projectName?.title === "Tk999" && d?.image
                    );
                    const imgPath =
                      match?.image || game?.image || game?.apiData?.image || "";
                    return imgPath ? `${IMAGE_BASE}/${imgPath}` : "";
                  })()}
                  alt={game?.apiData?.name || game?.name || "game"}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="absolute inset-0 hidden md:flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handlePlayClick(game);
                  }}
                  className="text-white text-2xl font-bold uppercase tracking-wider animate-pulse"
                >
                  Play
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {isMobile && selectedGame && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t-4 border-[#00ffaa] shadow-2xl transition-transform duration-300">
          <div className="flex flex-col p-4">
            <button
              onClick={() => setSelectedGame(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <RxCross2 size={28} />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={(() => {
                  const docs =
                    selectedGame?.apiData?.projectImageDocs ||
                    selectedGame?.projectImageDocs ||
                    [];
                  const match = docs.find(
                    (d) => d?.projectName?.title === "Tk999" && d?.image
                  );
                  const imgPath =
                    match?.image ||
                    selectedGame?.image ||
                    selectedGame?.apiData?.image ||
                    "";
                  return imgPath ? `${IMAGE_BASE}/${imgPath}` : "";
                })()}
                className="w-24 h-24 object-cover rounded-xl shadow-lg border-2 border-[#00ffaa] -mt-12"
              />
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {selectedGame?.apiData?.name || selectedGame?.name}
              </h3>
            </div>

            <button
              onClick={() => handlePlayClick(selectedGame)}
              className="w-full py-4 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {translate("playGame")}
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Login
          onClose={() => setShowLoginModal(false)}
          onRegisterClick={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      </Modal>

      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      >
        <RegistrationModal
          onClose={() => setShowRegisterModal(false)}
          openLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      </Modal>

      <style>{`
        .auto-shine {
          position: relative;
          overflow: hidden;
        }
        .shine-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 30%, white 50%, transparent 70%);
          transform: translateX(-150%);
          pointer-events: none;
          border-radius: inherit;
        }
        .shine-animate .shine-layer {
          animation: shineSwipe 1.4s ease-out forwards;
        }
        @keyframes shineSwipe {
          0% {
            transform: translateX(-150%) skewX(-15deg);
          }
          100% {
            transform: translateX(150%) skewX(-15deg);
          }
        }
      `}</style>
    </div>
  );
};

export default GameCard;
