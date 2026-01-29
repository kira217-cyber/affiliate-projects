import { BsFire } from "react-icons/bs";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { baseURL_For_IMG_UPLOAD } from "@/utils/baseURL";
import Button from "./Button";
import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";
// import { AuthContext } from "@/context/AuthContext";

/* ────────────────────── Translation Object ────────────────────── */
const translations = {
  bn: {
    "HOT GAMES": "গরম খেলা",
    FAVORITES: "পছন্দের গেমস",
    SLOT: "স্লট গেম",
    LIVE: "লাইভ সাসির",
    SPORTS: "স্পোর্টস",
    "E-SPORTS": "ই-স্পোর্টস",
    POKER: "পোকার",
    FISHING: "ফিশিং",
    LOTTERY: "লটারি",
  },
  en: {
    "HOT GAMES": "Hot Game",
    FAVORITES: "Favorites",
    SLOT: "Slot",
    LIVE: "Live",
    SPORTS: "Sports",
    "E-SPORTS": "E-Sports",
    POKER: "Poker",
    FISHING: "Fishing",
    LOTTERY: "Lottery",
  },
};
/* ──────────────────────────────────────────────────────────────── */

/* ────────────────────── Styled Components ────────────────────── */
const MenuContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MenuList = styled.div`
  display: flex;
  gap: 0.5rem;
  min-width: max-content;

  @media (min-width: 1024px) {
    gap: 0.5rem;
  }
`;

const MenuItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
  justify-content: center;
  height: 45px;
  padding: 6px 14px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  color: rgb(224, 255, 247);
  background: #013941;
  border-radius: 10px;
  border: 0.8px solid #026e7aff;
  box-shadow: rgba(0, 38, 40, 1) 0px 2px 0px 0px;
  transition: all 0.2s ease;

  &:hover {
    background: #028e9bff;
    transform: translateY(-2px);
  }

  @media (min-width: 1024px) {
    flex-direction: column;
    height: 75px;
    width: 100px;
    gap: 4px;
    padding: 10px 0;
    font-size: 13px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  svg {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 1024px) {
    img,
    svg {
      width: 26px;
      height: 26px;
    }
  }
`;

const Label = styled.p`
  white-space: nowrap;
  color: rgb(224, 255, 247);
  font-weight: bold;

  @media (min-width: 1024px) {
    font-size: 13px;
  }
`;

const ErrorContainer = styled.div``;
const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #f87171;
`;
/* ──────────────────────────────────────────────────────────────── */

/* ────────────────────── Component ────────────────────── */
const Menu = ({ homeGameMenu, isLoading, isError, errorMessage }) => {
  const { language } = useContext(AuthContext); // only language is needed
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  const hotGameItem = {
    id: 1,
    label: "HOT GAMES",
    icon: <BsFire />,
    path: "/",
  };

  const dynamicMenuItems =
    homeGameMenu?.menuOptions?.map((option) => ({
      id: option._id,
      label: option.title.toUpperCase(), // uppercase key for lookup
      icon: option.image ? (
        `${baseURL_For_IMG_UPLOAD}s/${option.image}`
      ) : (
        <BsFire />
      ),
      path: `/submenu/${option._id}`,
    })) || [];

  const menuItems = [hotGameItem, ...dynamicMenuItems];

  const getLabel = (key) => translations[language][key] || key;

  if (isLoading) {
    return (
      <>
        <Button />
        <div className="pb-2 lg:pb-4 w-full max-w-5xl mx-auto rounded-xl overflow-hidden">
          <MenuContainer>
            <MenuList>
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={`menu-skeleton-${idx}`}
                  className="flex flex-row lg:flex-col items-center gap-2 justify-center h-[45px] lg:h-[75px] w-[120px] lg:w-[100px] px-4 lg:px-0"
                >
                  <Skeleton
                    circle
                    width={isDesktop ? 36 : 26}
                    height={isDesktop ? 36 : 26}
                    baseColor="#013941"
                    highlightColor="#015b63"
                  />
                  <Skeleton
                    width={isDesktop ? 60 : 90}
                    height={12}
                    baseColor="#013941"
                    highlightColor="#015b63"
                  />
                </div>
              ))}
            </MenuList>
          </MenuContainer>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <ErrorContainer>
        <ErrorMessage>
          {errorMessage || "Failed to load menu options"}
        </ErrorMessage>
      </ErrorContainer>
    );
  }

  return (
    <>
      <Button />
      <div className="pb-2 lg:pb-4 w-full max-w-5xl mx-auto rounded-xl overflow-hidden">
        <MenuContainer
          style={{
            marginTop: homeGameMenu?.gameBoxMarginTop
              ? `${homeGameMenu.gameBoxMarginTop}px`
              : "0px",
            marginBottom: homeGameMenu?.gameNavMenuMarginBottom
              ? `${homeGameMenu.gameNavMenuMarginBottom}px`
              : "0px",
          }}
        >
          <MenuList>
            {menuItems.map((item) => (
              <Link key={item.id} to={item.path}>
                <MenuItem>
                  <IconContainer>
                    {typeof item.icon === "string" ? (
                      <img src={item.icon} alt="icon" />
                    ) : (
                      item.icon
                    )}
                  </IconContainer>

                  <Label>{getLabel(item.label)}</Label>
                </MenuItem>
              </Link>
            ))}
          </MenuList>
        </MenuContainer>
      </div>
    </>
  );
};

export default Menu;
