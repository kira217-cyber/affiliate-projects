import GameCard from "../gameCard/GameCard";

const games = [
  {
    name: "Super Ace",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/JL/EN/JL0092.png",
    playLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//AMG-WHITE.png",
  },
  {
    name: "Super Elements",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/JL/EN/JL0188.png",
    playLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//BNG-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/BSP/EN/BSP053.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//PS-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/BSP/EN/BSP051.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//BT-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/BSP/EN/BSP049.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//PS-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/BSP/EN/BSP047.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/BSP/EN/BSP045.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//PP-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/BSP/EN/BSP043.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/BSP/EN/BSP041.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/JL/EN/JL0216.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/BSP/EN/BSP054.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/BSP/EN/BSP052.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/BSP/EN/BSP052.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/BSP/EN/BSP050.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
];

const PokerGame = () => {
  return (
    <div>
      <GameCard title="Poker" games={games} />
    </div>
  );
};

export default PokerGame;
