import { useEffect, useState, useRef, useContext } from "react";
import { baseURL, baseURL_For_IMG_UPLOAD } from "@/utils/baseURL";
// Use fixed CDN/API base for game images
const IMAGE_BASE = "https://apigames.oracleapi.net";
import { Link } from "react-router-dom";
import Modal from "@/components/home/modal/Modal";
import Login from "@/components/shared/login/Login";
import RegistrationModal from "@/components/shared/login/RegistrationModal";
import { AuthContext } from "@/Context/AuthContext";

export default function AnimationBanner({ data }) {
  const [gamesData, setGamesData] = useState([]);
  const [counter, setCounter] = useState(123456789); // Initial number
  const reelRefs = useRef([]); // Refs for each reel

  const [bannerData, setBannerData] = useState({
    titleBD: "জ্যাকপট",
    titleEN: "JACKPOT",
    titleColor: "#FFFF00",
    bannerBackgroundColor: "#012632",
    numberBackgroundColor: "#FFFFFF",
    numberColor: "#000000",
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { language, user } = useContext(AuthContext);

  // Fetch AnimationBanner data from backend
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch(`${baseURL}/animation-banner`);
        if (!response.ok) {
          throw new Error("Failed to fetch AnimationBanner data");
        }
        const data = await response.json();

        setBannerData({
          titleBD: data.titleBD || "জ্যাকপট",
          titleEN: data.titleEN || "JACKPOT", // assuming backend may send english too
          titleColor: data.titleColor || "#FFFF00",
          bannerBackgroundColor: data.bannerBackgroundColor || "#012632",
          numberBackgroundColor: data.numberBackgroundColor || "#FFFFFF",
          numberColor: data.numberColor || "#000000",
        });
      } catch (error) {
        console.error("Error fetching AnimationBanner:", error.message);
        setBannerData({
          titleBD: "জ্যাকপট",
          titleEN: "JACKPOT",
          titleColor: "#FFFF00",
          bannerBackgroundColor: "#012632",
          numberBackgroundColor: "#FFFFFF",
          numberColor: "#000000",
        });
      }
    };

    fetchBannerData();
  }, []);

  // Extract all games from subMenu
  useEffect(() => {
    if (data?.subMenu) {
      const allGames = data.subMenu.reduce((acc, menu) => {
        return [...acc, ...menu.games];
      }, []);
      setGamesData(allGames);
    }
  }, [data]);

  // Animation control
  useEffect(() => {
    const digitCount = 9; // Number of digits in counter
    reelRefs.current = reelRefs.current.slice(0, digitCount);

    const generateRandomNumber = () => {
      return Math.floor(100000000 + Math.random() * 900000000);
    };

    const animateReels = () => {
      reelRefs.current.forEach((reel, index) => {
        if (reel) {
          reel.style.animation = `scroll${
            index % 2 === 1 ? "Down" : "Up"
          } 0.5s linear infinite`;
        }
      });

      const slowTimeout = setTimeout(() => {
        const digits = counter.toString().padStart(9, "0").split("");
        reelRefs.current.forEach((reel, index) => {
          if (reel) {
            const targetDigit = parseInt(digits[index]);
            const offset = (targetDigit * 10) % 100;
            reel.style.animation = `slowDown 3s ease-out forwards`;
            reel.style.setProperty("--stop-position", `-${offset}%`);
          }
        });

        setTimeout(() => {
          setCounter(generateRandomNumber());
          animateReels();
        }, 5000);
      }, 1000);

      return () => clearTimeout(slowTimeout);
    };

    animateReels();

    return () => {
      reelRefs.current.forEach((reel) => {
        if (reel) reel.style.animation = "";
      });
    };
  }, [counter]);

  // Get parentMenu data
  const parentMenu = {
    title: data?.subMenu?.[0]?.title || "CO9",
    image: data?.subMenu?.[0]?.parentMenuOption?.image || null,
  };

  // Duplicate gamesData for seamless infinite loop
  const duplicatedGames = [...gamesData, ...gamesData];

  // Format counter to array of digits and commas
  const formatCounter = (num) => {
    const str = num.toString().padStart(9, "0");
    return [
      "৳",
      ...str.slice(0, 3).split(""),
      ",",
      ...str.slice(3, 6).split(""),
      ",",
      ...str.slice(6, 9).split(""),
    ];
  };

  const reelDigits = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];

  // Decide title based on current language
  const displayTitle =
    language === "bn" ? bannerData.titleBD : bannerData.titleEN;

  return (
    <div
      className="h-full w-full max-w-5xl mx-auto rounded-xl overflow-hidden flex flex-col md:grid md:grid-cols-12 banner-container"
      style={{ backgroundColor: bannerData.bannerBackgroundColor }}
    >
      {/* Left Side - Jackpot Section */}
      <div
        className="jackpot-section w-full md:col-span-6 grid grid-cols-12"
        style={{
          backgroundImage:
            "url('https://www.tk999.org/img/jp-bg.bda60d56.png')",
          backgroundSize: "auto 200px",
          backgroundPosition: "left top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <p
          className="col-span-12 text-right text-5xl md:text-6xl flex items-end justify-end h-full mr-8"
          style={{
            color: bannerData.titleColor,
            fontFamily:
              language === "bn"
                ? "'Kalpurush', Arial, sans-serif"
                : "system-ui, sans-serif",
          }}
        >
          {displayTitle}
        </p>

        <div className="col-span-12 flex justify-center items-center h-full relative overflow-hidden">
          <div className="odometer flex justify-center items-center gap-[8px] p-[10px_14px] rounded-[14px] bg-[#0b1222] shadow-[0_0_25px_rgba(242,15,91,0.25),0_0_40px_rgba(255,180,0,0.15)]">
            {formatCounter(counter).map((text, index) => {
              const digitIndex = Math.floor((index - 1) / 2);
              return (
                <span key={index} className="inline-flex items-center">
                  {text === "৳" || text === "," ? (
                    <span
                      className={`static font-[800] px-[2px] text-[clamp(1.5rem,3vw,3.5rem)] ${
                        text === "৳" ? "mr-[4px]" : ""
                      }`}
                      style={{
                        color:
                          text === "৳"
                            ? bannerData.numberColor
                            : bannerData.titleColor,
                      }}
                    >
                      {text === "," ? ",\u00A0" : text}
                    </span>
                  ) : (
                    <div
                      className={`slot ${index % 2 === 1 ? "down" : ""}`}
                      style={{
                        width: "clamp(21px, 3.72vw, 39.68px)",
                        height: "clamp(34px, 6vw, 64px)",
                        borderRadius: "5px",
                        background: "#FFFFFF",
                      }}
                    >
                      <div
                        className="reel flex flex-col"
                        ref={(el) => (reelRefs.current[digitIndex] = el)}
                        style={{
                          fontSize: "clamp(34px, 6vw, 64px)",
                          color: bannerData.numberColor,
                        }}
                      >
                        {reelDigits.map((digit, i) => (
                          <span
                            key={i}
                            className="flex items-center justify-center"
                            style={{
                              height: "clamp(34px, 6vw, 64px)",
                            }}
                          >
                            {digit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Login
          onClose={() => setShowLoginModal(false)}
          onRegisterClick={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      </Modal>

      {/* Register Modal */}
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

      {/* Right Side - Games Section */}
      <div className="games-section w-full md:col-span-6 p-1 overflow-hidden">
        <div className="slider-container h-full">
          <div className="slider-track flex">
            {duplicatedGames.map((game, index) => (
              <div
                key={`${game?.name}-${index}`}
                className="relative group overflow-hidden rounded-lg shadow-md w-[130px] h-[176px] flex-shrink-0 mx-1"
              >
                {(() => {
                  const docs =
                    game?.apiData?.projectImageDocs ||
                    game?.projectImageDocs ||
                    [];
                  const match = docs.find(
                    (d) => d?.projectName?.title === "Tk999" && d?.image,
                  );
                  const imgPath =
                    match?.image || game?.image || game?.apiData?.image || "";
                  const src = imgPath ? `${IMAGE_BASE}/${imgPath}` : "";
                  return (
                    <img
                      src={src}
                      alt={game?.apiData?.name || game?.name || "game"}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110 group-hover:blur-[2px]"
                    />
                  );
                })()}
                {game.showHeart && (
                  <Link to={game.heartLink || "#"}>
                    <div className="absolute top-1 right-1 bg-[#ffffff45] bg-opacity-80 rounded-full p-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                  </Link>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 px-1 uppercase">
                  <Link to={game.link}>
                    <div
                      className="py-0.5 px-1 text-[8px] font-bold text-[#b64100] bg-[#ffd900] rounded-md mb-1 transform scale-50 group-hover:scale-100 group-hover:py-1 group-hover:px-2 group-hover:text-[10px] transition-all duration-700 ease-in-out"
                      onClick={() => !user && setShowRegisterModal(true)}
                    >
                      {game.playText ||
                        (language === "bn" ? "এখন খেলুন" : "PLAY NOW")}
                    </div>
                  </Link>
                  {game.freeTrialLink && (
                    <Link to={game.freeTrialLink}>
                      <div className="py-0.5 px-1 text-[8px] font-bold text-[#b64100] bg-[#ffd900] rounded-md mb-1 transform scale-50 group-hover:scale-100 group-hover:py-1 group-hover:px-2 group-hover:text-[10px] transition-all duration-700 ease-in-out">
                        {game.trialText ||
                          (language === "bn" ? "ফ্রি ট্রায়াল" : "Free Trial")}
                      </div>
                    </Link>
                  )}
                  <p className="text-white text-[10px] font-semibold text-center line-clamp-2">
                    {game?.name}
                  </p>
                  {parentMenu?.image && (
                    <img
                      className="w-4 mt-1"
                      src={`${baseURL_For_IMG_UPLOAD}s/${parentMenu?.image}`}
                      alt="vendor logo"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline CSS remains unchanged */}
      <style>{`
        :root {
          --digit-size: clamp(34px, 6vw, 64px);
          --gap: 8px;
        }

        .banner-container {
          display: flex;
          flex-direction: column;
        }

        .jackpot-section,
        .games-section {
          height: 180px;
        }

        .slider-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .slider-track {
          display: flex;
          animation: slideRightToLeft 5s linear infinite;
        }

        .slider-container:hover .slider-track {
          animation-play-state: paused;
        }

        .odometer {
          font-family: "Roboto Mono", monospace;
        }

        .slot {
          width: calc(var(--digit-size) * 0.62);
          height: var(--digit-size);
          overflow: hidden;
          border-radius: 5px;
          background: #ffffff;
          position: relative;
        }

        .slot::after {
          content: "";
          position: absolute;
          inset: auto 0 0 0;
          height: 38%;
          background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.25));
        }

        .reel {
          display: flex;
          flex-direction: column;
          font: 700 var(--digit-size) / 1 "Roboto Mono", monospace;
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
          will-change: transform;
        }

        .slot.down .reel {
          animation-direction: reverse;
        }

        .reel span {
          display: grid;
          place-items: center;
          height: var(--digit-size);
        }

        .static {
          font-family: Inter, system-ui, sans-serif;
        }

        @keyframes slideRightToLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scrollUp {
          from {
            transform: translateY(0%);
          }
          to {
            transform: translateY(-50%);
          }
        }

        @keyframes scrollDown {
          from {
            transform: translateY(-50%);
          }
          to {
            transform: translateY(0%);
          }
        }

        @keyframes slowDown {
          0% {
            transform: translateY(0%);
            animation-timing-function: linear;
          }
          100% {
            transform: translateY(var(--stop-position));
            animation-timing-function: ease-out;
          }
        }

        @media (min-width: 768px) {
          .banner-container {
            display: grid;
            grid-template-columns: repeat(12, minmax(0, 1fr));
            height: 180px;
          }

          .jackpot-section,
          .games-section {
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
}
