import { useState, useEffect } from "react";
import GameCard from "../gameCard/GameCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HotGame = ({ allHotGames }) => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isCompactCard = typeof window !== "undefined" && window.innerWidth <= 640;
  const cardHeight = isCompactCard ? 180 : 240;

  useEffect(() => {
    if (!Array.isArray(allHotGames)) {
      setIsLoading(true);
      setGames([]);
      return;
    }

    const formattedGames = allHotGames.flatMap((hotGame) =>
      hotGame.games.filter((game) => game.isHotGame === true)
    );

    setGames(formattedGames);
    setIsLoading(false);
  }, [allHotGames]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-2 py-6">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={`hot-game-skeleton-${idx}`} className="space-y-3">
            <div
              className="relative rounded-xl shadow-2xl overflow-hidden"
              style={{
                width: "100%",
                aspectRatio: "3 / 4",
                background: "linear-gradient(135deg, #0a3d42, #001f24)",
                boxShadow: "0 8px 20px rgba(0, 255, 200, 0.15)",
              }}
            >
              <Skeleton
                height={cardHeight}
                baseColor="#0d3b44"
                highlightColor="#155e6b"
                borderRadius={18}
                style={{ width: "100%" }}
              />
            </div>
            <div className="space-y-2 px-1">
              <Skeleton
                height={18}
                width="80%"
                baseColor="#0d3b44"
                highlightColor="#155e6b"
              />
              <Skeleton
                height={14}
                width="60%"
                baseColor="#0d3b44"
                highlightColor="#155e6b"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No hot games available.</p>
      </div>
    );
  }

  return (
    <div>
      <GameCard
        title="Hot Games"
        parentId={"Hot Games"}
        parentMenu={allHotGames?.[0]?.parentMenuOption?.title || "Unknown"}
        games={games}
      />
    </div>
  );
};

export default HotGame;
