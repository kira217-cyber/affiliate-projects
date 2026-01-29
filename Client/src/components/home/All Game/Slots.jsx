import { useEffect, useState } from "react";
import GameCard from "../gameCard/GameCard";
import { baseURL_For_IMG_UPLOAD } from "@/utils/baseURL";

const Slots = ({ data, games }) => {
  const [gamesData, setGamesData] = useState([]);

  useEffect(() => {
    if (!data?.subOptions || !games?.subMenu) return;

    // Map through subOptions and collect games for each matching subMenu
    const allGamesData = data.subOptions.reduce((acc, option) => {
      // Find the subMenu that matches the subOption by _id
      const matchingSubMenu = games.subMenu.find(
        (sub) => sub._id === option._id
      );

      if (matchingSubMenu && matchingSubMenu.games) {
        // Add games with their corresponding subOption title
        return [
          ...acc,
          ...matchingSubMenu.games.map((game) => ({
            ...game,
            subOptionTitle: option.title, // Attach the subOption title for reference
          })),
        ];
      }
      return acc;
    }, []);

    setGamesData(allGamesData);
  }, [data, games]);

  useEffect(() => {
    console.log("Slots component - gamesData:", gamesData);
  }, [gamesData]);

  return (
    <div>
      <GameCard
        title={data.title}
        parentId={data._id}
        games={gamesData}
        parentMenu={data.title} // Pass the parent menu title
      />
    </div>
  );
};

export default Slots;
