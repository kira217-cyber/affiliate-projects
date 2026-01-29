import { AuthContext } from "@/Context/AuthContext";
import { fetchHomeGameMenu } from "@/features/home-game-menu/GameHomeMenuSliceAndThunks";
import { baseURL_For_IMG_UPLOAD } from "@/utils/baseURL";
import { useEffect, useState, useContext } from "react";
import {
  BsFire,
  BsGift,
  BsStar,
  BsShield,
  BsChatDots,
  BsDownload,
  BsGlobe,
  BsX,
} from "react-icons/bs";
import { FaUserFriends, FaTrophy, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";



/* ────────────────────── Styled Components ────────────────────── */
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 20px;
`;

const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  padding: 16px 8px;
  background: linear-gradient(to bottom, #003840, #002125);
  border: 1px solid #003840;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);

  &:hover {
    background: linear-gradient(to bottom, #0a6670, #00404c);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;

  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }

  svg {
    font-size: 26px;
    color: #cd6d5f;
  }
`;

const Label = styled.p`
  color: #e0fff7;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  margin: 0;
`;

/* ────────────────────── Language Modal ────────────────────── */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #001f24;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 300px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #e0fff7;
  font-size: 20px;
  cursor: pointer;
`;

const LanguageOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(to right, #003840, #002125);
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(to right, #0a6670, #00404c);
  }

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }

  span {
    color: #e0fff7;
    font-size: 14px;
    font-weight: 600;
  }
`;

/* ────────────────────── Icon Map ────────────────────── */
const iconMap = {
  "HOT GAMES": <BsFire />,
  "INVITE FRIENDS": <FaUserFriends />,
  FAVORITES: <BsStar />,
  PROMOTION: <BsGift />,
  SLOTS: (
    <img
      src="/icons/slots.png"
      alt="slots"
      style={{ filter: "brightness(0) invert(1)" }}
    />
  ),
  "REWARD CENTER": <FaTrophy />,
  LIVE: (
    <img
      src="/icons/live.png"
      alt="live"
      style={{ filter: "brightness(0) invert(1)" }}
    />
  ),
  "MANUAL REBATE": <BsShield />,
  SPORTS: (
    <img
      src="/icons/sports.png"
      alt="sports"
      style={{ filter: "brightness(0) invert(1)" }}
    />
  ),
  VIP: <BsStar />,
  "E-SPORTS": (
    <img
      src="/icons/esports.png"
      alt="esports"
      style={{ filter: "brightness(0) invert(1)" }}
    />
  ),
  MISSION: <FaUsers />,
  POKER: (
    <img
      src="/icons/poker.png"
      alt="poker"
      style={{ filter: "brightness(0) invert(1)" }}
    />
  ),
  ENGLISH: <BsGlobe />,
  FISH: (
    <img
      src="/icons/fish.png"
      alt="fish"
      style={{ filter: "brightness(0) invert(1)" }}
    />
  ),
  DOWNLOAD: <BsDownload />,
  LOTTERY: (
    <img
      src="/icons/lottery.png"
      alt="lottery"
      style={{ filter: "brightness(0) invert(1)" }}
    />
  ),
  "CUSTOMER SERVICE": <BsChatDots />,
};

/* ────────────────────── Component ────────────────────── */
const SidebarMenu = () => {
  const dispatch = useDispatch();
  const { homeGameMenu } = useSelector((state) => state.homeGameMenu);
  const { language, setLanguage } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchHomeGameMenu());
  }, [dispatch]);

  const openLanguageModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("sidebarLang", lang);
    closeModal();
  };

  /* ────────────────────── Translation Map ────────────────────── */
  const t = {
    bn: {
      রেফার: "রেফার",
      প্রমোশন: "প্রমোশন",
      পুরস্কার: "পুরস্কার",
      ভিআইপি: "ভিআইপি",
      মিশন: "মিশন",
      ডাউনলোড: "ডাউনলোড",
      চ্যাট: "চ্যাট",
      "HOT GAMES": "গরম খেলা",
      SLOTS: "স্লট",
      POKER: "পোকার",
      LIVE: "লাইভ কেসিন",
      SPORTS: "স্পোর্টস",
      "E-SPORTS": "ই-স্পোর্টস",
      FISHING: "ফিশিং",
      LOTTERY: "লটারি",
      FAVORITES: "পছন্দের",
      "REWARD CENTER": "পুরস্কার কেন্দ্র",
      "MANUAL REBATE": "ম্যানুয়াল রিবেট",
      "CUSTOMER SERVICE": "গ্রাহক সেবা",
      LANGUAGE_BN: "বাংলা",
      LANGUAGE_EN: "English",
    },
    en: {
      রেফার: "Refer",
      প্রমোশন: "Promotion",
      পুরস্কার: "Rewards",
      ভিআইপি: "VIP",
      মিশন: "Mission",
      ডাউনলোড: "Download",
      চ্যাট: "Chat",
      "HOT GAMES": "Hot Games",
      SLOTS: "Slots",
      POKER: "Poker",
      LIVE: "Live Casino",
      SPORTS: "Sports",
      "E-SPORTS": "E-Sports",
      FISHING: "Fishing",
      LOTTERY: "Lottery",
      FAVORITES: "Favorites",
      "REWARD CENTER": "Reward Center",
      "MANUAL REBATE": "Manual Rebate",
      "CUSTOMER SERVICE": "Customer Service",
      LANGUAGE_BN: "Bangla",
      LANGUAGE_EN: "English",
    },
  };

  const translate = (key) => t[language][key] || key;

  /* ────────────────────── Dynamic Menu ────────────────────── */
  const dynamicMenuItems =
    homeGameMenu?.menuOptions?.map((option) => {
      const englishKey = option.title.toUpperCase(); // Always English key
      const fallbackLabel = option.title_bn || option.title; // Bangla if exists

      return {
        id: option._id,
        key: englishKey, // For translation
        label: fallbackLabel, // Fallback only
        icon: option.image ? (
          <img
            src={`${baseURL_For_IMG_UPLOAD}s/${option.image}`}
            alt={option.title}
          />
        ) : (
          iconMap[englishKey] || <BsFire />
        ),
        path: `/submenu/${option._id}`,
      };
    }) || [];

  /* ────────────────────── Static Menu ────────────────────── */
  const languageButtonLabel = translate(
    language === "bn" ? "LANGUAGE_BN" : "LANGUAGE_EN"
  );

  const staticMenuItems = [
    { id: 2, label: "রেফার", key: "রেফার", icon: <FaUserFriends />, path: "" },
    {
      id: 4,
      label: "প্রমোশন",
      key: "প্রমোশন",
      icon: <BsGift />,
      path: "/promotions",
    },
    { id: 6, label: "পুরস্কার", key: "পুরস্কার", icon: <FaTrophy />, path: "" },
    { id: 10, label: "ভিআইপি", key: "ভিআইপি", icon: <BsStar />, path: "" },
    { id: 12, label: "মিশন", key: "মিশন", icon: <FaUsers />, path: "" },
    {
      id: 14,
      label: languageButtonLabel,
      icon: <BsGlobe />,
      path: "",
      onClick: openLanguageModal,
    },
    {
      id: 16,
      label: "ডাউনলোড",
      key: "ডাউনলোড",
      icon: <BsDownload />,
      path: "/CP66.apk",
      download: true,
    },
    { id: 18, label: "চ্যাট", key: "চ্যাট", icon: <BsChatDots />, path: "" },
  ];

  return (
    <>
      <Container>
        {/* Left column – dynamic */}
        <div className="space-y-2">
          {dynamicMenuItems.map((item) => (
            <Link key={item.id} to={item.path}>
              <MenuItem>
                <IconWrapper>{item.icon}</IconWrapper>
                <Label>{translate(item.key) || item.label}</Label>
              </MenuItem>
            </Link>
          ))}
        </div>

        {/* Right column – static */}
        <div className="space-y-2">
          {staticMenuItems.map((item) => (
            <div key={item.id} onClick={item.onClick}>
              {item.onClick ? (
                <MenuItem>
                  <IconWrapper>{item.icon}</IconWrapper>
                  <Label>{item.label}</Label>
                </MenuItem>
              ) : item.download ? (
                <a href={item.path} download>
                  <MenuItem>
                    <IconWrapper>{item.icon}</IconWrapper>
                    <Label>{translate(item.key) || item.label}</Label>
                  </MenuItem>
                </a>
              ) : (
                <Link to={item.path}>
                  <MenuItem>
                    <IconWrapper>{item.icon}</IconWrapper>
                    <Label>{translate(item.key) || item.label}</Label>
                  </MenuItem>
                </Link>
              )}
            </div>
          ))}
        </div>
      </Container>

      {/* Language Modal */}
      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>
              <BsX />
            </CloseButton>

            <LanguageOption onClick={() => changeLanguage("bn")}>
              <img src="https://flagcdn.com/w40/bd.png" alt="Bangladesh" />
              <span>{translate("LANGUAGE_BN")}</span>
            </LanguageOption>

            <LanguageOption onClick={() => changeLanguage("en")}>
              <img src="https://flagcdn.com/w40/us.png" alt="USA" />
              <span>{translate("LANGUAGE_EN")}</span>
            </LanguageOption>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default SidebarMenu;
