import GameCardSingle from "../gameCard/GameCardSingle";

const games = [
  {
    image:
      "https://images.185949949.com/prod-images/game_icon/tk999bdtf1/h5BigImage/gcs__elott-SEAlott_1731919211947.png",
  },
];

const LotteryGame = () => {
  return (
    <div>
      <GameCardSingle title="Lottery" games={games} />
    </div>
  );
};

export default LotteryGame;
