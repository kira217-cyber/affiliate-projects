import GameCardSingle from "../gameCard/GameCardSingle";

const games = [
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__SPORTS-U9W_1731920365745.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__SPORTS-LUC_1731920365583.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__SPORTS-SB_1731919214450.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__SPORTS-FB_1731919213712.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__SPORTS-PIN_1731919214083.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__SPORTS-POLY_1731919214208.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__SPORTS-BTI_1731919213488.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__SPORTS-UG2_1731919214828.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__SPORTS-RCB_1731919214328.png",
  },
];

const SportsGame = () => {
  return (
    <div>
      <GameCardSingle title="Sports" games={games} />
    </div>
  );
};

export default SportsGame;
