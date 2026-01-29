import GameCard from "../gameCard/GameCard";

const games = [
  {
    name: "Super Ace",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/BT/EN/BT0099.png",
    playLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//BT-WHITE.png",
  },
  {
    name: "Super Elements",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/KA/EN/KA0817.png",
    playLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//BNG-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/KA/EN/KA0799.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//PS-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/KA/EN/KA0787.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//BT-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/KA/EN/KA0769.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//PS-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/SG/EN/SG0179.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/KA/EN/KA0751.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//PP-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/KA/EN/KA0775.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/KA/EN/KA0811.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/KA/EN/KA0793.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/KA/EN/KA0781.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/KA/EN/KA0763.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/KA/EN/KA0757.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
  {
    name: "lucky",
    image: "https://images.185949949.com/TCG_GAME_ICONS/rx2/KA/EN/KA0745.png",
    playLink: "/",
    trialLink: "/",
    vendorLogo:
      "https://images.185949949.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR//JL-WHITE.png",
  },
];

const FishGame = () => {
  return (
    <div>
      <GameCard title="Fish" games={games} />
    </div>
  );
};

export default FishGame;
