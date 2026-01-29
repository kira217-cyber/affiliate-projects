import GameCardSingle from "../gameCard/GameCardSingle";

const games = [
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__SPORTS-TF_1731919214703.png",
  },
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__SPORTS-IA_1731919213836.png",
  },
];

const ESportsGame = () => {
  return (
    <div>
      <GameCardSingle title="E-Sports" games={games} />
    </div>
  );
};

export default ESportsGame;
