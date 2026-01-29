import GameCardSingle from "../gameCard/GameCardSingle";

const games = [
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__LIVE-EG4_1731919212262.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__LIVE-PT_1744013691306.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__LIVE-WJ_1731920365309.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__LIVE-Sex_1731919213239.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__LIVE-GPI_1731919212582.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__LIVE-SA_1731919213120.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__LIVE-OG2_1731919212861.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__LIVE-VIA_1731919213364.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__LIVE-PP_1731919212990.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__LIVE-MG_1731919212717.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__live-ez_1746618563725.png",
  },
];

const Live = () => {
  return (
    <div>
      <GameCardSingle title="Live" games={games} />
    </div>
  );
};

export default Live;
