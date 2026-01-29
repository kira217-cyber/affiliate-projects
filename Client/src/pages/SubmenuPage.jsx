import MarqueeSlider from "@/components/home/Marque/MarqueeSlider";
import { fetchHomeGameMenu } from "@/features/home-game-menu/GameHomeMenuSliceAndThunks";
import { baseURL_For_IMG_UPLOAD } from "@/utils/baseURL";
const IMAGE_BASE = "https://apigames.oracleapi.net";
import { useEffect, useRef, useState, useContext } from "react";
import { BsFire } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { fetchGameSection } from "@/features/GamePage/GamePageSliceAndThunk";
import Modal from "@/components/home/modal/Modal";
import Login from "@/components/shared/login/Login";
import RegistrationModal from "@/components/shared/login/RegistrationModal";
import { AuthContext } from "@/Context/AuthContext";

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  color: rgb(255, 255, 255);
  font-size: 1rem;
  padding: 0px 2px;
  margin-bottom: 0;
  align-items: flex-end;

  img {
    width: 4rem;
    height: 2rem;
    object-fit: contain;
    border-radius: 0.25rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;

    img {
      width: 4rem;
      height: 1.25rem;
    }
  }
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: 0.2s;
  flex-shrink: 0;
  gap: 8px;
  height: 28px;
  padding: 0 5px;
  background: ${({ isSelected }) =>
    isSelected
      ? "linear-gradient(180deg, #ffe600, #ffb800)"
      : "linear-gradient(180deg, #0f727c, #004e56)"};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected ? "rgba(255, 242, 166, .5)" : "rgba(35, 255, 200, 0.1)"};
  border-radius: 8px;
  box-shadow: ${({ isSelected }) =>
    isSelected
      ? "0 1px 0 0 #b64100, inset 0 1px 0 1px #fff2a6"
      : "0 1px 0 0 #005540"};

  color: ${({ isSelected }) => (isSelected ? "#000" : "#fff")};

  &:hover {
    background: ${({ isSelected }) =>
      isSelected
        ? "linear-gradient(180deg, #ffe600, #ffb800)"
        : "linear-gradient(180deg, #1a8a94, #006165)"};
  }
`;

const SwiperContainer = styled.div`
  width: 100%;
  height: 40px;
  padding: 0 10px;
  background: #002632;
  border: 1px solid #006165;
  border-radius: 10px;
  box-shadow: 0 2px 0 0 #002631;
  overflow: hidden;
  position: relative;
  z-index: 10;

  .swiper {
    height: 100%;
  }

  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
  }
`;

const SubmenuPage = () => {
  const dispatch = useDispatch();
  const swiperRef = useRef(null);
  const { language } = useContext(AuthContext);
  const [selectedItem, setSelectedItem] = useState({
    label: language === "bn" ? "সব" : "All",
    id: "1",
  });
  const [categoryGame, setCategoryGame] = useState([]);
  const { submenu } = useParams();
  const [category, setCategory] = useState(null);
  const [gameInitData, setGameInitData] = useState([]);
  const [subOption, setSubOption] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { homeGameMenu } = useSelector((state) => state.homeGameMenu || {});
  const { data } = useSelector((state) => state.gameSection || {});
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    dispatch(fetchHomeGameMenu());
    dispatch(fetchGameSection());
  }, [dispatch]);

  useEffect(() => {
    const filterSubmenuGame =
      homeGameMenu?.menuOptions?.find((item) => item._id === submenu) || null;

    if (submenu === "Hot Games") {
      const allGames =
        data?.subMenu?.flatMap((item) => item?.games || []) || [];
      setCategoryGame(allGames);
      setGameInitData(allGames);
    } else {
      const allGames =
        data?.subMenu
          ?.filter((item) => item?.parentMenuOption?._id === category?._id)
          .flatMap((item) => item?.games || []) || [];
      setCategoryGame(allGames);
      setGameInitData(allGames);
    }

    setCategory(filterSubmenuGame);
  }, [data, submenu, homeGameMenu, category?._id]);

  const allButtonLabel = language === "bn" ? "সব" : "All";

  useEffect(() => {
    const dynamicMenuItems =
      category?.subOptions?.map((option) => ({
        id: option?._id || "",
        label: option?.title || "Unknown",
        icon: option?.image ? (
          `${baseURL_For_IMG_UPLOAD}s/${option.image}`
        ) : (
          <BsFire />
        ),
        path: `/menu/${option?._id || ""}`,
      })) || [];

    const localHotItem = {
      id: "1",
      label: allButtonLabel,
      icon: (
        <span style={{ fontSize: "10px", fontWeight: "bold" }}>
          {allButtonLabel}
        </span>
      ),
      path: "/",
    };

    setSubOption([localHotItem, ...dynamicMenuItems]);
  }, [category, language, allButtonLabel]);

  useEffect(() => {
    if (selectedItem.id === "1") {
      setCategoryGame(gameInitData);
    } else {
      const filterGame =
        gameInitData?.filter((item) => item?.subOptions === selectedItem.id) ||
        [];
      setCategoryGame(filterGame);
    }
  }, [selectedItem, gameInitData]);

  // Auto-shine effect (same as GameCard)
  useEffect(() => {
    if (categoryGame.length === 0) return;

    let animationFrameId = null;
    let timeoutId = null;

    const triggerShine = () => {
      const cards = document.querySelectorAll(".auto-shine");

      cards.forEach((card) => {
        if (card instanceof HTMLElement) {
          card.classList.remove("shine-animate");
          void card.offsetWidth; // Trigger reflow
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
  }, [categoryGame.length]);

  return (
    <div className="px-1 sm:px-4 submenu-page-container">
      <MarqueeSlider />

      <div
        className="relative bg-[#004E56] shadow-md w-full max-w-5xl mx-auto my-2 lg:my-4 p-2 rounded-2xl border border-[rgba(0,28,44,.4)] overflow-hidden"
        style={{
          boxShadow: "0 1px 0 0 #001c2c, inset 0 2px 0 0 #006165",
          zIndex: 5,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            gap: "8px",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
          }}
        >
          <div>
            <h2
              style={{
                justifySelf: "flex-start",
                padding: "unset",
                marginRight: window.innerWidth < 768 ? "0" : "100px",
                fontSize: "24px",
                fontWeight: "700",
                color: "#23ffc8",
                textTransform: "uppercase",
              }}
            >
              {submenu === "Hot Games"
                ? "Hot Games"
                : category?.title || ""}
            </h2>
          </div>

          <SwiperContainer
            onMouseEnter={() => swiperRef.current?.swiper?.autoplay?.stop()}
            onMouseLeave={() => swiperRef.current?.swiper?.autoplay?.start()}
          >
            <Swiper
              ref={swiperRef}
              modules={[Autoplay]}
              spaceBetween={8}
              slidesPerView="auto"
              loop={subOption.length > 0}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
            >
              {subOption.map((item) => (
                <SwiperSlide key={`${item.id}-${item.label}`}>
                  <MenuItem
                    onClick={() =>
                      setSelectedItem({ label: item.label, id: item.id })
                    }
                    isSelected={selectedItem.label === item.label}
                  >
                    <IconContainer
                      style={{
                        color:
                          selectedItem.label === item.label ? "black" : "white",
                        fontWeight: "bold",
                      }}
                    >
                      {typeof item.icon === "string" ? (
                        <img src={item.icon} alt={`${item.label} icon`} />
                      ) : (
                        item.icon
                      )}
                    </IconContainer>
                  </MenuItem>
                </SwiperSlide>
              ))}
            </Swiper>
          </SwiperContainer>
        </div>

        {/* Game Grid with Auto-Shine Effect */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-2">
          {categoryGame?.map((game, index) => {
            // Image logic (prioritize Tk999)
            const docs =
              game?.apiData?.projectImageDocs || game?.projectImageDocs || [];
            const match = docs.find(
              (d) => d?.projectName?.title === "Tk999" && d?.image
            );
            const imgPath =
              match?.image || game?.image || game?.apiData?.image || "";
            const src = imgPath ? `${IMAGE_BASE}/${imgPath}` : "";

            return (
              <div
                key={game._id || index}
                className="relative group overflow-hidden rounded-lg xl:rounded-xl shadow-2xl cursor-pointer transition-all duration-500 hover:scale-105 auto-shine"
                style={{
                  aspectRatio: "3/4",
                  background: "linear-gradient(135deg, #0a3d42, #001f24)",
                  boxShadow: "0 8px 20px rgba(0, 255, 200, 0.15)",
                }}
              >
                <div className="shine-layer"></div>

                <img
                  src={src}
                  alt={game?.apiData?.name || game?.name || "Game"}
                  className="w-full h-full object-cover rounded-lg xl:rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:blur-[2px]"
                />

                {game?.showHeart && (
                  <Link to={game?.heartLink || "#"}>
                    <div className="absolute top-2 right-2 bg-[#ffffff45] bg-opacity-80 rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                  </Link>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 px-2">
                  {!user ? (
                    <button onClick={() => setShowRegisterModal(true)}>
                      <div className="py-2 px-4 text-sm md:text-base font-bold text-[#b64100] bg-[#ffd900] rounded-lg shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        {game.playText || "PLAY NOW"}
                      </div>
                    </button>
                  ) : (
                    <Link to={`/liveGame/${game._id}`}>
                      <div className="py-2 px-4 text-sm md:text-base font-bold text-[#b64100] bg-[#ffd900] rounded-lg shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        {game.playText || "PLAY NOW"}
                      </div>
                    </Link>
                  )}

                  {game?.freeTrialLink && (
                    <Link to={game.freeTrialLink}>
                      <div className="mt-2 py-2 px-4 text-sm md:text-base font-bold text-[#b64100] bg-[#ffd900] rounded-lg shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        {game.trialText || "Free Trial"}
                      </div>
                    </Link>
                  )}

                  <p className="mt-3 text-white text-xs md:text-sm font-semibold text-center">
                    {game?.apiData?.name || game?.name || "Unknown Game"}
                  </p>

                  {category?.image && (
                    <img
                      className="w-8 mt-2"
                      src={`${baseURL_For_IMG_UPLOAD}s/${category.image}`}
                      alt="vendor logo"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
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

      {/* Auto-shine CSS (same as GameCard) */}
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

export default SubmenuPage;
