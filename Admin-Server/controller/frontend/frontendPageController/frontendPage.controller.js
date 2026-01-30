const mongoose = require("mongoose");
const axios = require("axios");
const DepositPaymentMethod = require("../../../model/depositePayment.model");
const GameModel = require("../../../model/game.model");
const {
  GameNavBar,
  MenuOption,
  SubOption,
} = require("../../../model/gameNavMenu.model");
const HomeCarousel = require("../../../model/heroCarousel.model");
const Notice = require("../../../model/notice.model");
const PaymentTransaction = require("../../../model/paymentTransactionSchema");
const Promotion = require("../../../model/promotion.model");
const sendResponse = require("../../../utils/responseHandler");
const WithdrawPaymentMethod = require("../../../model/WithdrawPaymentMethod");
const WithdrawPaymentTransaction = require("../../../model/WithdrawPaymentTransaction");
const user_model = require("../../../model/user.model");
const ThemeModel = require("../../../model/ThemeModel");
const AnimationBanner = require("../../../model/AnimationBanner.model");
const User = require("../../../model/user.model");
const Admin = require("../../../model/admin.model");
const imageRegistrationSchema = require("../../../model/imageRegistrationSchema");
const models = { GameNavBar, MenuOption, SubOption };
const qs = require("qs");
const path = require("path");
const { log } = require("console");
const fs = require("fs").promises; // Ensure using promises version
const fsSync = require("fs"); // Synchronous API for existsSync
const PaymentMessage = require("../../../model/PaymentMessage");

// Get all carousel images
exports.getAllCarouselImages = async (req, res) => {
  try {
    let carousel = await HomeCarousel.findOne();
    if (!carousel) {
      carousel = await new HomeCarousel({
        images: [],
        isActive: true,
        interval: 2500,
        infiniteLoop: true,
        autoPlay: true,
      }).save();
    }
    sendResponse(
      res,
      200,
      true,
      "Fetched carousel images successfully",
      carousel
    );
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Update carousel
exports.updateCarouselImage = async (req, res) => {
  const { id } = req.params;
  const { images, isActive, interval, infiniteLoop, autoPlay } = req.body;

  try {
    const updatedCarousel = await HomeCarousel.findByIdAndUpdate(
      id,
      {
        images,
        isActive,
        interval,
        infiniteLoop,
        autoPlay,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCarousel) {
      return sendResponse(res, 404, false, "Carousel not found");
    }

    sendResponse(
      res,
      200,
      true,
      "Updated carousel successfully",
      updatedCarousel
    );
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find();
    sendResponse(res, 200, true, "Fetched all notices successfully", notices);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Update or create notice
exports.updateNotice = async (req, res) => {
  const { title, titleBD, emoji, active } = req.body;

  console.log(title, titleBD, emoji, active);

  try {
    const notice = await Notice.findOneAndUpdate(
      {}, // Match any (assuming single notice logic)
      { title, titleBD, emoji, active },
      {
        new: true, // return the new doc after update
        runValidators: true,
        upsert: true, // create if not found
      }
    );

    sendResponse(
      res,
      200,
      true,
      "Notice updated or created successfully",
      notice
    );
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// for seed
exports.seedGameNavBar = async (req, res) => {
  try {
    // Clear all existing data
    await GameNavBar.deleteMany({});
    await MenuOption.deleteMany({});
    await SubOption.deleteMany({});

    // Create MenuOptions
    const menu1 = await MenuOption.create({
      title: "Action Games",
      image: "action.png",
    });
    const menu2 = await MenuOption.create({
      title: "Puzzle Games",
      image: "puzzle.png",
    });

    // Create SubOptions for each menu
    await SubOption.insertMany([
      { title: "Shooter", image: "shooter.png", parentMenuOption: menu1._id },
      {
        title: "Battle Royale",
        image: "battle.png",
        parentMenuOption: menu1._id,
      },
      { title: "Sudoku", image: "sudoku.png", parentMenuOption: menu2._id },
      { title: "Matching", image: "match.png", parentMenuOption: menu2._id },
    ]);

    // Create GameNavBar
    const navbar = await GameNavBar.create({
      name: "Main Navbar",
      gameBoxMarginTop: "20px",
      gameNavMenuMarginBottom: "10px",
      headerBgColor: "#222",
      headerMarginBottom: "15px",
      headerMenuBgColor: "#333",
      headerMenuBgHoverColor: "#444",
      subOptionBgHoverColor: "#555",
      menuOptions: [menu1._id, menu2._id],
    });

    // Fetch GameNavBar with full nested structure
    const fullNav = await GameNavBar.findById(navbar._id)
      .populate({
        path: "menuOptions",
        populate: {
          path: "_id", // this is just to ensure `.toObject()` works nicely
        },
      })
      .lean(); // Convert to plain JS object for manipulation

    // Attach subOptions inside each menuOption manually
    for (let option of fullNav.menuOptions) {
      const subOptions = await SubOption.find({ parentMenuOption: option._id });
      option.subOptions = subOptions;
    }

    res.status(201).json({
      message: "GameNavBar seeded successfully with full nested structure",
      data: fullNav,
    });
  } catch (err) {
    console.error("Seeding error:", err.message);
    res.status(500).json({
      error: "Failed to seed GameNavBar",
      details: err.message,
    });
  }
};

// GET all navbars
exports.getAllNavbars = async (req, res) => {
  try {
    const navbars = await GameNavBar.find()
      .populate({
        path: "menuOptions",
        populate: {
          path: "_id",
        },
      })
      .lean();

    for (let nav of navbars) {
      for (let menu of nav.menuOptions) {
        const subs = await SubOption.find({ parentMenuOption: menu._id });
        menu.subOptions = subs;
      }
    }

    res.status(200).json(navbars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Navbar CRUD operations
exports.getAllNavbars = async (req, res) => {
  try {
    const navbars = await GameNavBar.find();
    res.status(200).json(navbars);
  } catch (err) {
    res.status(500).json({ message: "Error fetching navbars", error: err });
  }
};

const handleError = (res, err, status = 500) => {
  res.status(status).json({ error: err.message || "Server error" });
};

exports.getAllGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === "GameNavBar") {
      // Return single navbar or empty array
      const navbar = await models[modelName]
        .findOne()
        .populate({
          path: "menuOptions",
          populate: { path: "subOptions" },
        })
        .lean();
      return res.status(200).json(navbar ? [navbar] : []);
    }
    const items = await models[modelName]
      .find()
      .populate(
        modelName === "GameNavBar"
          ? {
              path: "menuOptions",
              populate: { path: "subOptions" },
            }
          : null
      )
      .lean();

    if (modelName === "GameNavBar") {
      for (let item of items) {
        for (let menu of item.menuOptions || []) {
          menu.subOptions = await SubOption.find({
            parentMenuOption: menu._id,
          });
        }
      }
    }
    res.status(200).json(items);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getByIdGameNavBar = (modelName) => async (req, res) => {
  try {
    const item = await models[modelName]
      .findById(req.params.id)
      .populate(modelName === "GameNavBar" ? "menuOptions" : null)
      .lean();
    if (!item) return res.status(404).json({ error: `${modelName} not found` });

    if (modelName === "GameNavBar" && item.menuOptions) {
      for (let menu of item.menuOptions) {
        menu.subOptions = await SubOption.find({ parentMenuOption: menu._id });
      }
    }
    res.status(200).json(item);
  } catch (err) {
    handleError(res, err, 404);
  }
};

exports.createGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === "GameNavBar") {
      // Check if a navbar already exists
      const existingNavbar = await models[modelName].findOne();
      if (existingNavbar) {
        return res.status(400).json({
          error:
            "Only one navbar can exist. Please update the existing navbar.",
        });
      }
      // Create with defaults (schema handles defaults)
      const navbar = await models[modelName].create(req.body || {});
      return res.status(201).json(navbar);
    }
    const item = await models[modelName].create(req.body);
    res.status(201).json(item);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.updateGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === "GameNavBar") {
      // Update the single navbar
      const navbar = await models[modelName].findOneAndUpdate({}, req.body, {
        new: true,
      });
      if (!navbar) return res.status(404).json({ error: "Navbar not found" });
      return res.status(200).json(navbar);
    }
    const item = await models[modelName].findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    res.status(200).json(item);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.removeGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === "GameNavBar") {
      return res
        .status(400)
        .json({ error: "Deleting the navbar is not allowed." });
    }
    const item = await models[modelName].findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    res.status(200).json({ message: `${modelName} deleted` });
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.getProviders = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://apigames.oracleapi.net/api/providers",
      {
        headers: {
          "x-api-key":
            "300cc0adfcfb041c25c4a8234e3c0e312a44c7570677d64bdb983412f045da67",
        },
      }
    );
    sendResponse(res, 200, true, "Providers fetched successfully", data.data);
  } catch (error) {
    console.error("Error fetching providers:", error);
    sendResponse(res, 500, false, "Server error while fetching providers");
  }
};

// * =========== frontend game nav ================

exports.getNavBarWithMenuAndSubmenu = async (req, res) => {
  try {
    const gameNavBar = await GameNavBar.findOne(); // or add filter if multiple GameNavBars exist

    const menuOptions = await MenuOption.find();

    const { data: providerData } = await axios.get(
      "https://apigames.oracleapi.net/api/providers",
      {
        headers: {
          "x-api-key":
            "300cc0adfcfb041c25c4a8234e3c0e312a44c7570677d64bdb983412f045da67",
        },
      }
    );

    const providers = providerData.data;
    const providerMap = providers?.reduce((map, provider) => {
      map[provider._id] = provider;
      return map;
    }, {});

    const menuWithSubOptions = await Promise.all(
      menuOptions?.map(async (menu) => {
        const subOptionsFromDB = await SubOption?.find({
          parentMenuOption: menu._id,
        });
        const subOptions = subOptionsFromDB?.map((sub) => {
          const provider = providerMap[sub.providerId];
          return {
            ...sub.toObject(),
            title: provider ? provider.name : "Unknown Provider",
            provider,
          };
        });
        return {
          ...menu.toObject(),
          subOptions,
        };
      })
    );

    sendResponse(res, 200, true, "GameNavBar fetched successfully", {
      ...gameNavBar.toObject(),
      menuOptions: menuWithSubOptions,
    });
  } catch (error) {
    console.error("Error fetching full GameNavBar:", error);
    sendResponse(res, 500, false, "Server error while fetching GameNavBar");
  }
};

// * ========== game section  ========== //




exports.getAllGames = async (req, res) => {
  console.log("this is game --> ");

  try {
    const games = await GameModel.find()
      .populate({
        path: "subOptions",
        populate: {
          path: "parentMenuOption",
        },
      })
      .lean();
    res.status(200).json(games);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getGameById = async (req, res) => {
  try {
    const game = await GameModel.findById(req.params.id).lean();
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.status(200).json(game);
  } catch (err) {
    handleError(res, err, 404);
  }
};

// createGame
exports.createGame = async (req, res) => {
  try {
    const { gameAPIID, subOptions, isHotGame, isNewGame, isLobbyGame, image } = req.body;

    if (!gameAPIID || !subOptions) {
      return res.status(400).json({ success: false, error: "gameAPIID and subOptions required" });
    }

    const game = await GameModel.create({
      gameAPIID,
      subOptions,
      isHotGame: !!isHotGame,
      isNewGame: !!isNewGame,
      isLobbyGame: !!isLobbyGame,
      image: image || "",               // ← এটা গ্রহণ করছে
    });

    res.status(201).json({ success: true, data: game });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// updateGame (আগের মতোই ঠিক আছে, image আপডেট হবে)
exports.updateGame = async (req, res) => {
  try {
    const { gameAPIID, image, subOptions, isHotGame, isNewGame, isLobbyGame } = req.body;
    const update = {};
    if (typeof gameAPIID !== 'undefined') update.gameAPIID = gameAPIID;
    if (typeof image !== 'undefined') update.image = image;
    if (typeof subOptions !== 'undefined') update.subOptions = subOptions;
    if (typeof isHotGame !== 'undefined') update.isHotGame = isHotGame;
    if (typeof isNewGame !== 'undefined') update.isNewGame = isNewGame;
    if (typeof isLobbyGame !== 'undefined') update.isLobbyGame = isLobbyGame;
    console.log('updateGame payload:', req.params.id, update);
    const game = await GameModel.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    );
    if (!game) return res.status(404).json({ error: "Game not found" });
    console.log('updateGame result:', game);
    res.status(200).json(game);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const game = await GameModel.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.status(200).json({ message: "Game deleted" });
  } catch (err) {
    handleError(res, err, 400);
  }
};




// * =========== frontend game page ================

// exports.getFullGameNavBar = async (req, res) => {
//   console.log("this is inside ->");

//   try {
//     const navSettings = await GameNavBar.findOne();
//     // Get all SubOptions
//     const subOptions = await SubOption.find().populate("parentMenuOption");

//     const { data: providerData } = await axios.get(
//       "https://apigames.oracleapi.net/api/providers",
//       {
//         headers: {
//           "x-api-key":
//             "300cc0adfcfb041c25c4a8234e3c0e312a44c7570677d64bdb983412f045da67",
//         },
//       }

//     );

//     const providers = providerData.data;
//     const providerMap = providers.reduce((map, provider) => {
//       map[provider._id] = provider.name;
//       return map;
//     }, {});

//     // For each SubOption, get its related games
//     const subMenusWithGames = await Promise.all(
//       subOptions.map(async (sub) => {
//         const games = await GameModel.find({ subOptions: sub._id });

//         return {
//           _id: sub._id,
//           title: providerMap[sub.providerId] || "Unknown Provider",
//           image: sub.image,
//           parentMenuOption: {
//             _id: sub.parentMenuOption?._id,
//             title: sub.parentMenuOption?.title,
//             image: sub.parentMenuOption?.image,
//           },
//           games: games,
//         };
//       })
//     );

//     sendResponse(res, 200, true, "Submenus with games fetched successfully", {
//       settings: navSettings,
//       subMenu: subMenusWithGames,
//     });
//   } catch (error) {
//     console.error("Error fetching submenus with games:", error);
//     sendResponse(res, 500, false, "Server error", { error });
//   }
// };

exports.getFullGameNavBar = async (req, res) => {
  console.log("this is inside ->");

  try {
    const navSettings = await GameNavBar.findOne();
    // Get all SubOptions
    const subOptions = await SubOption.find().populate("parentMenuOption");

    // 1. ডাটাবেস থেকে সব গেমের gameAPIID নিয়ে আসা
    const allGames = await GameModel.find().select("gameAPIID");
    const gameAPIIDs = allGames.map((game) => game.gameAPIID);

    // 2. API থেকে গেম ডাটা ফেচ করা
    const { data: apiGamesResponse } = await axios.post(
      "https://apigames.oracleapi.net/api/games/by-ids",
      { ids: gameAPIIDs },
      {
        headers: {
          "x-api-key":
            "300cc0adfcfb041c25c4a8234e3c0e312a44c7570677d64bdb983412f045da67",
        },
      }
    );

    const apiGames = apiGamesResponse.data;

    // 3. প্রোভাইডার ডাটা ফেচ করা
    const { data: providerData } = await axios.get(
      "https://apigames.oracleapi.net/api/providers",
      {
        headers: {
          "x-api-key":
            "300cc0adfcfb041c25c4a8234e3c0e312a44c7570677d64bdb983412f045da67",
        },
      }
    );

    const providers = providerData.data;
    const providerMap = providers.reduce((map, provider) => {
      map[provider._id] = provider.name;
      return map;
    }, {});

    // 4. For each SubOption, get its related games and merge with API data
    const subMenusWithGames = await Promise.all(
      subOptions.map(async (sub) => {
        const games = await GameModel.find({ subOptions: sub._id }).lean();

        // মার্জ করা গেম ডাটা
        const mergedGames = games.map((dbGame) => {
          const apiGame = apiGames.find(
            (game) => game._id === dbGame.gameAPIID
          );
          return {
            ...dbGame, // ডাটাবেসের গেম ডাটা
            apiData: apiGame || {}, // API থেকে আসা গেম ডাটা আলাদা ফিল্ডে রাখা
          };
        });

        return {
          _id: sub._id,
          title: providerMap[sub.providerId] || "Unknown Provider",
          image: sub.image,
          parentMenuOption: {
            _id: sub.parentMenuOption?._id,
            title: sub.parentMenuOption?.title,
            image: sub.parentMenuOption?.image,
          },
          games: mergedGames,
        };
      })
    );

    sendResponse(res, 200, true, "Submenus with games fetched successfully", {
      settings: navSettings,
      subMenu: subMenusWithGames,
    });
  } catch (error) {
    console.error("Error fetching submenus with games:", error);
    sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};

// ?  get the game  old code
exports.playGameController = async (req, res) => {
  try {
    const { username, money, gameID } = req.body;

    console.log("this is log game link ", req.body);

    // https://api.malta99.com/games/callback-data-game
    const postData = {
      home_url: "https://cp666.live",
      token: "e9a26dd9196e51bb18a44016a9ca1d73",
      username: username + "45",
      money: money,
      gameid: req.body.gameID,
    };

      // api.tk999.oracelsoft.com
    // const postData = {
    //   home_url: "https://api.tk999.oracelsoft.com",
    //   token: "5f4e59f09dc1a061cdb5185ceef6e75b",
    //   username: username + "45", // চাইলে random করতে পারো
    //   money: money,
    //   gameid: gameID,
    // };

    // x-dstgame-key
    // 'x-dstgame-key: yourlicensekey'

    console.log("Sending POST request to joyhobe.com with data:", postData);

    // POST রিকোয়েস্ট
    const response = await axios.post(
      "https://dstplay.net/getgameurl",
      qs.stringify(postData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-dstgame-key": postData.token,
        },
      }
    );

    console.log(
      "Response from dstplay.com:",
      response.data,
      "Status:",
      response.status
    );
    res.status(200).json({
      message: "POST request successful",
      joyhobeResponse: response.data,
    });
  } catch (error) {
    console.error("Error in POST /api/test/game:", error);
    res.status(500).json({
      error: "Failed to forward POST request",
      details: error.message,
    });
  }
};

exports.callBackController = async (req, res) => {
  try {
    // Extract required fields from request body
    let {
      member_account,
      bet_amount,
      win_amount,
      game_uid,
      serial_number,
      currency_code,
    } = req.body;

    console.log(
      "this is inside the function -> ",
      member_account,
      bet_amount,
      win_amount,
      game_uid,
      serial_number,
      currency_code
    );

    // Validate required fields
    if (!member_account || !game_uid || !serial_number || !currency_code) {
      return res.send({
        success: false,
        message: "All data are not provided.",
      });
    }

    // Ensure currency_code is BDT as per requirement
    if (currency_code !== "BDT") {
      return res.send({
        success: false,
        message: "Currency code must be BDT.",
      });
    }

    // Trim member_account to maximum 45 characters
    if (member_account) {
      member_account = member_account.substring(0, 45);
    }

    // Extract original username by removing last 2 characters
    const originalEmail = member_account.substring(
      0,
      member_account.length - 2
    );

    // Find the user by username
    const matcheduser = await User.findOne({
      email: originalEmail,
    });
    if (!matcheduser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // Prepare the game history record
    const gameRecord = {
      username: member_account,
      bet_amount: parseFloat(bet_amount) || 0,
      win_amount: parseFloat(win_amount) || 0,
      gameID: game_uid,
      serial_number: serial_number,
      currency: currency_code || "BDT",
      status: win_amount > 0 ? "won" : "lost",
      playedAt: new Date(),
    };

    // Calculate new balance
    const newBalance =
      (matcheduser.balance || 0) -
      (parseFloat(bet_amount) || 0) +
      (parseFloat(win_amount) || 0);

    // Update user balance and push game record to gameHistory
    const updatedUser = await User.findByIdAndUpdate(
      matcheduser._id,
      {
        $set: { balance: newBalance },
        $push: { gameHistory: gameRecord },
      },
      { new: true } // Return the updated document
    );

    // Log the update result for debugging
    // console.log("this is update result -> ", updateResult);

    // Check if update was successful
    if (!updatedUser) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update user data." });
    }

    // Ensure gameHistory exists and has the new record
    if (!updatedUser.gameHistory || !updatedUser.gameHistory.length) {
      return res
        .status(500)
        .json({ success: false, message: "Game history not updated." });
    }

    // Send success response
    res.json({
      success: true,
      data: {
        username: originalEmail,
        balance: updatedUser.balance,
        win_amount,
        bet_amount,
        game_uid,
        serial_number,
        gameRecordId:
          updatedUser.gameHistory[updatedUser.gameHistory.length - 1]._id,
      },
    });
  } catch (error) {
    console.error("Error in callback-data:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getTheGame = async (req, res) => {
  console.log("this is game --> ", req.params.id);
  console.log("this is user --> ", req.params.user_id);

  try {
    // 1. ডাটালেস থেভে গেম ফেচ করা
    const user = await user_model.findById(req.params.user_id).lean();

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const game = await GameModel.findById(req.params.id).lean();

    if (!game) {
      return res.status(404).json({ success: false, error: "Game not found" });
    }

    // 2. gameAPIID দিয়ে API থেভে গেম ডাটা ফেচ করা
    const gameAPIID = game.gameAPIID;
    const { data: apiGamesResponse } = await axios.post(
      "https://apigames.oracleapi.net/api/games/by-ids",
      { ids: [gameAPIID] }, // একভ gameAPIID নে অ্যারেতে কনভার্ট বরা
      {
        headers: {
          "x-api-key":
            "300cc0adfcfb041c25c4a8234e3c0e312a44c7570677d64bdb983412f045da67",
        },
      }
    );

    const apiGames = apiGamesResponse.data || [];

    // 3. API থেভে আসা গেম সাটা মার্জ লরা
    const matchedGame = apiGames.find((apiGame) => apiGame._id === gameAPIID);

    // 4. রেসপন্স তুরি লরা
    const response = {
      success: true,
      game_uuid: matchedGame?.game_uuid, // PlayGame কম্পয়নেন্টের জন্য game_uuid হিসেলে gameAPIID
      data: {
        ...game,
        apiData: matchedGame || {}, // API ডাটা আলাজ ফিল্সে
        user: {
          ...user,
        },
      },
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching game:", err);
    res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
};

// Create Promotion
exports.createPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.create(req.body);
    sendResponse(res, 201, true, "Promotion created successfully", promotion);
  } catch (error) {
    console.error("Error creating promotion:", error);
    sendResponse(res, 500, false, "Server error while creating promotion", {
      error: error.message,
    });
  }
};

// Get All Promotions
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().lean();
    sendResponse(res, 200, true, "Promotions fetched successfully", promotions);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    sendResponse(res, 500, false, "Server error while fetching promotions", {
      error: error.message,
    });
  }
};

// Get Single Promotion
exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).lean();
    if (!promotion) {
      return sendResponse(res, 404, false, "Promotion not found", null);
    }
    sendResponse(res, 200, true, "Promotion fetched successfully", promotion);
  } catch (error) {
    console.error("Error fetching promotion:", error);
    sendResponse(res, 500, false, "Server error while fetching promotion", {
      error: error.message,
    });
  }
};

// Update Promotion
exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!promotion) {
      return sendResponse(res, 404, false, "Promotion not found", null);
    }
    sendResponse(res, 200, true, "Promotion updated successfully", promotion);
  } catch (error) {
    console.error("Error updating promotion:", error);
    sendResponse(res, 500, false, "Server error while updating promotion", {
      error: error.message,
    });
  }
};

// Delete Promotion
exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return sendResponse(res, 404, false, "Promotion not found", null);
    }
    sendResponse(res, 200, true, "Promotion deleted successfully", promotion);
  } catch (error) {
    console.error("Error deleting promotion:", error);
    sendResponse(res, 500, false, "Server error while deleting promotion", {
      error: error.message,
    });
  }
};

//* ================= frontend game page end ================

// * ================= frontend deposit payment gateway ================

// * ================= deposit payment gateway start ================

exports.createDepositPaymentMethod = async (req, res) => {
  try {
    const depositPaymentMethod = await DepositPaymentMethod.create(req.body);
    sendResponse(
      res,
      201,
      true,
      "Deposit payment method created successfully",
      depositPaymentMethod
    );
  } catch (error) {
    console.error("Error creating deposit payment method:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while creating deposit payment method",
      { error: error.message }
    );
  }
};

exports.getAllDepositPaymentMethods = async (req, res) => {
  try {
    const depositPaymentMethods = await DepositPaymentMethod.find().lean();
    sendResponse(
      res,
      200,
      true,
      "Deposit payment methods fetched successfully",
      depositPaymentMethods
    );
  } catch (error) {
    console.error("Error fetching deposit payment methods:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while fetching deposit payment methods",
      { error: error.message }
    );
  }
};

exports.getDepositPaymentMethodById = async (req, res) => {
  try {
    const depositPaymentMethod = await DepositPaymentMethod.findById(
      req.params.id
    ).lean();
    if (!depositPaymentMethod) {
      return sendResponse(
        res,
        404,
        false,
        "Deposit payment method not found",
        null
      );
    }
    sendResponse(
      res,
      200,
      true,
      "Deposit payment method fetched successfully",
      depositPaymentMethod
    );
  } catch (error) {
    console.error("Error fetching deposit payment method:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while fetching deposit payment method",
      { error: error.message }
    );
  }
};

exports.updateDepositPaymentMethod = async (req, res) => {
  try {
    const depositPaymentMethod = await DepositPaymentMethod.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!depositPaymentMethod) {
      return sendResponse(
        res,
        404,
        false,
        "Deposit payment method not found",
        null
      );
    }
    sendResponse(
      res,
      200,
      true,
      "Deposit payment method updated successfully",
      depositPaymentMethod
    );
  } catch (error) {
    console.error("Error updating deposit payment method:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while updating deposit payment method",
      { error: error.message }
    );
  }
};

exports.deleteDepositPaymentMethod = async (req, res) => {
  try {
    const depositPaymentMethod = await DepositPaymentMethod.findByIdAndDelete(
      req.params.id
    );
    if (!depositPaymentMethod) {
      return sendResponse(
        res,
        404,
        false,
        "Deposit payment method not found",
        null
      );
    }
    sendResponse(
      res,
      200,
      true,
      "Deposit payment method deleted successfully",
      depositPaymentMethod
    );
  } catch (error) {
    console.error("Error deleting deposit payment method:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while deleting deposit payment method",
      { error: error.message }
    );
  }
};

//* ================= frontend promotion start ================

// Get All Promotions with related SubOptions
exports.getAllPromotionsWithSubMenu = async (req, res) => {
  try {
    const promotions = await Promotion.find()
      .populate("game_type")
      .populate({
        path: "promotion_bonuses",
        populate: {
          path: "payment_method",
          model: "DepositPaymentMethod",
        },
      });
    sendResponse(
      res,
      200,
      true,
      "Promotions fetched successfully with submenus",
      promotions
    );
  } catch (error) {
    console.error("Error fetching promotions:", error);
    sendResponse(res, 500, false, "Server error while fetching promotions", {
      error: error.message,
    });
  }
};

// * ================= frontend promotion end ================

// * ================= frontend deposit payment transaction create gateway ================

exports.getWithdrawPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await WithdrawPaymentMethod.find({
      status: "active",
    }).lean();

    if (!paymentMethods || paymentMethods.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        "No active withdraw payment methods found",
        null
      );
    }

    sendResponse(
      res,
      200,
      true,
      "Withdraw payment methods fetched successfully",
      paymentMethods
    );
  } catch (error) {
    console.error("Error fetching withdraw payment methods:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while fetching withdraw payment methods",
      {
        error: error.message,
      }
    );
  }
};

// Utility to validate MongoDB ObjectId (24-character hex string)
const isValidObjectId = (id) => {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
};

exports.createPaymentTransaction = async (req, res) => {
  try {
    const {
      userId,
      userIdentifier,
      paymentMethodId,
      channel,
      amount,
      promotionId,
      userInputs,
    } = req.body;

    console.log("Received payload:", req.body);

    // Validate required fields
    if (!userId || !paymentMethodId || !amount) {
      return sendResponse(
        res,
        400,
        false,
        "Missing required fields: userId, paymentMethodId, and amount are required",
        null
      );
    }

    // Validate paymentMethodId format
    if (!isValidObjectId(paymentMethodId)) {
      return sendResponse(res, 400, false, "Invalid payment method ID", null);
    }
    if (promotionId && !isValidObjectId(promotionId)) {
      return sendResponse(res, 400, false, "Invalid promotion ID", null);
    }

    // Validate user exists (supports cross-db identifiers)
    let user = null;
    if (userId && isValidObjectId(userId)) {
      user = await User.findById(userId);
    }
    if (!user && userIdentifier) {
      user = await User.findOne({
        $or: [
          { username: userIdentifier },
          { player_id: userIdentifier },
          { email: userIdentifier },
          { phoneNumber: userIdentifier },
        ],
      });
    }
    // Fallback: try Admin collection in affiliate DB
    if (!user && userIdentifier) {
      const admin = await Admin.findOne({
        $or: [
          { username: userIdentifier },
          { player_id: userIdentifier },
          { email: userIdentifier },
          { phoneNumber: userIdentifier },
        ],
      });
      if (admin) {
        user = admin;
      }
    }
    if (!user) {
      return sendResponse(res, 400, false, "User not found", null);
    }

    // Validate amount
    if (typeof amount !== "number" || amount < 200 || amount > 30000) {
      return sendResponse(
        res,
        400,
        false,
        "Amount must be a number between 200 and 30,000",
        null
      );
    }

    // Fetch payment method details
    const paymentMethod = await DepositPaymentMethod.findById(paymentMethodId);
    if (!paymentMethod) {
      return sendResponse(res, 400, false, "Invalid payment method", null);
    }
    console.log("Payment Method:", paymentMethod);

    // Validate payment method fields
    if (
      !paymentMethod.methodName ||
      !paymentMethod.agentWalletNumber ||
      !paymentMethod.agentWalletText ||
      !paymentMethod.paymentPageImage
    ) {
      return sendResponse(
        res,
        400,
        false,
        "Payment method missing required fields",
        null
      );
    }

    // Validate channel against paymentMethod.gateway array
    if (channel) {
      if (typeof channel !== "string") {
        return sendResponse(res, 400, false, "Channel must be a string", null);
      }
      if (
        Array.isArray(paymentMethod.gateway) &&
        paymentMethod.gateway.length > 0
      ) {
        if (!paymentMethod.gateway.includes(channel)) {
          return sendResponse(
            res,
            400,
            false,
            `Channel '${channel}' is not allowed for this payment method`,
            null
          );
        }
      }
    }

    // Validate and format userInputs
    let formattedUserInputs = [];
    if (Array.isArray(userInputs) && userInputs.length > 0) {
      const inputConfigs = paymentMethod.userInputs || [];
      formattedUserInputs = userInputs.map((input) => {
        const config = inputConfigs.find((cfg) => cfg.name === input.name);
        if (!config) {
          throw new Error(`Invalid input field: ${input.name}`);
        }
        return {
          _id: input._id || new mongoose.Types.ObjectId(),
          name: input.name,
          value: input.value.toString(),
          label: input.label || config.label,
          labelBD: input.labelBD || config.labelBD,
          type: input.type || config.type,
        };
      });

      // Validate formatted userInputs
      for (const input of formattedUserInputs) {
        if (
          !input.name ||
          !input.value ||
          !input.label ||
          !input.labelBD ||
          !input.type ||
          !["number", "text", "file"].includes(input.type)
        ) {
          return sendResponse(
            res,
            400,
            false,
            "Invalid userInputs structure",
            null
          );
        }
      }
    }

    // Fetch promotion details if promotionId is provided
    let promotionBonus = null;
    let promotionTitle = null;
    if (promotionId) {
      const promotion = await Promotion.findById(promotionId);
      console.log("Promotion:", promotion);
      if (!promotion) {
        return sendResponse(res, 400, false, "Promotion not found", null);
      }

      promotionTitle =
        promotion.title || promotion.title_bd || "Unknown Promotion";

      if (
        promotion.promotion_bonuses &&
        Array.isArray(promotion.promotion_bonuses)
      ) {
        const bonus = promotion.promotion_bonuses.find((b) => {
          const isPaymentMethodMatch =
            b.payment_method && b.payment_method.toString() === paymentMethodId;
          const isGatewayMatch =
            !channel ||
            (b.gateway &&
              Array.isArray(b.gateway) &&
              b.gateway.includes(channel));
          console.log("Checking bonus:", {
            bonus: b,
            paymentMethodId,
            channel,
            isPaymentMethodMatch,
            isGatewayMatch,
          });
          return isPaymentMethodMatch && isGatewayMatch;
        });

        if (bonus) {
          if (
            ["Fix", "Percentage"].includes(bonus.bonus_type) &&
            typeof bonus.bonus === "number"
          ) {
            promotionBonus = {
              bonus_type: bonus.bonus_type,
              bonus: bonus.bonus,
            };
          } else {
            console.log("Invalid bonus structure:", bonus);
            return sendResponse(
              res,
              400,
              false,
              "Invalid promotion bonus structure",
              null
            );
          }
        } else {
          console.log("No matching bonus found for:", {
            paymentMethodId,
            channel,
          });
          promotionBonus = null;
        }
      } else {
        console.log("No promotion bonuses found for promotion:", promotionId);
        promotionBonus = null;
      }
    }

    // Create transaction
    const transaction = await PaymentTransaction.create({
      userId: user._id,
      paymentMethod: {
        methodName: paymentMethod.methodName,
        agentWalletNumber: paymentMethod.agentWalletNumber,
        agentWalletText: paymentMethod.agentWalletText,
        paymentPageImage: paymentMethod.paymentPageImage,
        gateway: channel || "",
      },
      channel: channel || "",
      amount,
      promotionId: promotionId || null,
      promotionTitle,
      promotionBonus,
      userInputs: formattedUserInputs,
      status: "pending",
    });

    console.log("Created transaction:", transaction);
    sendResponse(
      res,
      201,
      true,
      "Payment transaction created successfully",
      transaction
    );
  } catch (error) {
    console.error("Error creating payment transaction:", error);
    sendResponse(
      res,
      500,
      false,
      error.message || "Server error while creating payment transaction",
      null
    );
  }
};

// * ========================================================

let writeLock = false; // 🔒 simple in-memory lock

// Text parser function

const parseTransactionText = (text) => {
  let amount, from, trxID, date, time;

  // Regular expressions
  const amountRegex = /Tk\.?\s*([\d,]+\.?\d*)/i; // ✅ now supports 1,000.00
  const fromRegex = /(?:from|Customer|Sender)\s*(?:A\/C:)?\s*([0-9X*]{3,14})/i;
  const trxIDRegex = /(?:TrxID|TxnID|TxnId)\s*[:\s]*([A-Z0-9]+)/i;
  const dateTimeRegex =
    /(?:Date:)?\s*(?:(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{1,2}-[A-Z]{3}-\d{2,4}))\s+(?:(?:at\s+)?(\d{1,2}:\d{2}(?::\d{2})?\s*[ap]m)|(?:at\s+)?(\d{1,2}:\d{2}))/i;

  const amountMatch = text.match(amountRegex);
  amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : null; // ✅ remove commas before parsing

  const fromMatch = text.match(fromRegex);
  from = fromMatch ? fromMatch[1] : "not-exist";

  const trxIDMatch = text.match(trxIDRegex);
  trxID = trxIDMatch ? trxIDMatch[1] : null;

  const dateTimeMatch = text.match(dateTimeRegex);
  date = dateTimeMatch ? dateTimeMatch[1] || dateTimeMatch[2] : null;
  time = dateTimeMatch ? dateTimeMatch[3] || dateTimeMatch[4] : null;

  console.log("Parsed Data:", { amount, from, trxID, date, time });
  return { amount, from, trxID, date, time };
};

// const text =
//   "You have received Cash-out of Tk. 150.00 from 01768734982. Comm: TK. 0.61425. Balance Tk. 4902.81. TrxID 01K6YMAPGB at 07/10/2025 12:04.";
// console.log(parseTransactionText(text));

exports.autoPayment = async (req, res) => {
  const date = new Date().toISOString().split("T")[0];
  const dirPath = path.join(__dirname, "../../../uploads/auto-payment");
  const filePath = path.join(dirPath, `${date}.json`);

  try {
    // Wait if another write is happening
    while (writeLock) {
      await new Promise((r) => setTimeout(r, 50));
    }
    writeLock = true; // lock before writing

    await fs.mkdir(dirPath, { recursive: true });

    // Read old data
    let existingData = {};
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      existingData = JSON.parse(fileContent || "{}");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }

    // New data
    const body = req.body;
    const newData = {
      type: body.type || "notification",
      title: body.title || "Unknown",
      text: body.text || "",
      timestamp:
        body.timestamp ||
        new Date().toISOString().replace("T", " ").split(".")[0],
      device_id: body.device_id || "unknown_device",
      device_name: body.device_name || "unknown_device",
    };

    // Append to file
    const nextIndex = Object.keys(existingData).length;
    existingData[`data-${nextIndex}`] = newData;

    // Safe write to file
    await fs.writeFile(
      filePath,
      JSON.stringify(existingData, null, 2),
      "utf-8"
    );

    // Check if text matches the required format and save to MongoDB
    const parsedData = parseTransactionText(newData.text);

    // 16216 , NAGAD , bKash , upay

    if (
      newData.title === "16216" ||
      newData.title === "NAGAD" ||
      newData.title === "bKash" ||
      newData.title === "upay"
    ) {
      // ok

      if (
        parsedData.amount &&
        parsedData.from &&
        parsedData.trxID &&
        parsedData.date &&
        parsedData.time
      ) {
        try {
          const transaction = new PaymentMessage({
            amount: parsedData.amount,
            from: parsedData.from,
            fullMessage: newData.text,
            trxID: parsedData.trxID,
            date: parsedData.date,
            time: parsedData.time,
            deviceName: newData.device_name,
            deviceId: newData.device_id,
            type: newData.type,
            title: newData.title,
          });
          await transaction.save();
          console.log("✅ Transaction saved to MongoDB:", parsedData);
        } catch (mongoErr) {
          console.error("❌ Error saving to MongoDB:", mongoErr.message);
        }
      } else {
        console.log(
          "❌ Parsed data incomplete, skipping MongoDB save:",
          parsedData
        );
      }
    }

    writeLock = false; // unlock

    console.log("✅ Auto-payment entry saved to file:", newData);
    return sendResponse(
      res,
      200,
      true,
      "Auto payment data added successfully",
      newData
    );
  } catch (err) {
    writeLock = false; // ensure unlock even on error
    console.error("❌ Error saving auto payment:", err.message);
    return sendResponse(res, 500, false, `Server error: ${err.message}`, null);
  }
};
// * ========================================================

// GET /check-auto-payment/:transactionId: Check for matching auto-payment

// 🚀 Main Controller - SIMPLIFIED TIMEZONE HANDLING
// 🚀 Main Controller
exports.checkAutoPayment = async (req, res) => {
  const { transactionId } = req.params;
  const debugLogs = [];

  try {
    // Step 1: Validate transactionId
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      debugLogs.push({ step: "Validation", message: "Invalid transaction ID" });
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
        data: { debugLogs },
      });
    }

    // Step 2: Find transaction by ID
    const transaction = await PaymentTransaction.findOne({ _id: transactionId })
      .populate("userId", "name email phoneNumber")
      .populate("promotionId", "title")
      .lean();

    debugLogs.push({
      step: "Transaction fetched",
      transactionId,
      createdAtUTC: transaction?.createdAt?.toISOString(),
      userInputs: transaction?.userInputs,
    });

    console.log("this is transaction -> ", transaction);

    if (!transaction || transaction.status !== "pending") {
      debugLogs.push({
        step: "Transaction check",
        message: "Transaction not found or not pending",
      });
      return res.status(404).json({
        success: false,
        message: "Transaction not found or not pending",
        data: { debugLogs },
      });
    }

    const userTrxId_DB = transaction?.userInputs[0]?.value;

    console.log("🚀 userTrxId_DB", userTrxId_DB);

    // Step 3: Extract userInputs.trxId
    // const userTrxId = transaction.userInputs?.find(
    //   (input) => input.name === "trxId"
    // )?.value;
    // if (!userTrxId) {
    //   debugLogs.push({
    //     step: "User inputs",
    //     message: "No trxId found in userInputs",
    //   });
    //   return res.status(400).json({
    //     success: false,
    //     message: "No transaction ID found in user inputs",
    //     data: { debugLogs },
    //   });
    // }

    // debugLogs.push({
    //   step: "User inputs extracted",
    //   userTrxId_DB,
    //   transactionAmount: transaction.amount,
    // });

    // Step 4: Query paymentMessage collection for last 5 minutes
    const createdAt = new Date(transaction.createdAt);
    const fiveMinutesAgo = new Date(createdAt.getTime() - 5 * 60 * 1000);
    const paymentMessage = await mongoose.model("PaymentMessage").findOne({
      trxID: userTrxId_DB,
      createdAt: { $gte: fiveMinutesAgo },
    });

    console.log("this is paymentMessages ", paymentMessage);

    // debugLogs.push({
    //   step: "PaymentMessage query",
    //   fiveMinutesAgo: fiveMinutesAgo.toISOString(),
    //   foundMessages: paymentMessages.length,
    // });

    let matched = false;
    let matchedMessage = null;

    console.log("this is bodyyy paymentMessages -> ", paymentMessage);

    // console.log(
    //   "this is trann ---->>>>> ",
    //   paymentMessages,
    //   debugLogs,
    //   transaction
    // );

    // Step 5: Process each payment message
    if (paymentMessage) {
      if (
        paymentMessage?.amount === transaction?.amount &&
        paymentMessage?.trxID === userTrxId_DB
      ) {
        matched = true;
        matchedMessage = paymentMessage;
      }
    }

    // Step 7: Process matched transaction
    if (matched) {
      let totalAmount = transaction.amount;

      // Apply promotion bonus if applicable
      if (transaction.promotionBonus?.bonus) {
        const { bonus_type, bonus } = transaction.promotionBonus;
        if (bonus_type === "Fix") totalAmount += bonus;
        else if (bonus_type === "Percentage")
          totalAmount += (transaction.amount * bonus) / 100;
      }

      // Update user balance
      await User.findByIdAndUpdate(transaction.userId, {
        $inc: { balance: totalAmount, deposit: totalAmount },
      });

      // Update transaction status
      const updatedTransaction = await PaymentTransaction.findByIdAndUpdate(
        transactionId,
        { $set: { status: "completed" } },
        { new: true, runValidators: true }
      )
        .populate("userId", "name email phoneNumber")
        .populate("promotionId", "title")
        .lean();

      debugLogs.push({
        step: "Transaction updated",
        transactionId,
        totalAmount,
        status: "completed",
      });

      return res.status(200).json({
        success: true,
        message: "Transaction completed successfully",
        data: {
          status: "completed",
          transaction: { ...updatedTransaction, totalAmount },
          matchedMessage: matchedMessage.text,
          debugLogs,
        },
      });
    } else {
      debugLogs.push({
        step: "Match result",
        message: "No matching transaction found",
      });
      return res.status(200).json({
        success: true,
        message: "No matching payment found",
        data: { status: "pending", transaction, debugLogs },
      });
    }
  } catch (err) {
    debugLogs.push({ step: "Error", error: err.message });
    console.error("Error checking auto payment:", err);
    return res.status(500).json({
      success: false,
      message: `Server error: ${err.message}`,
      data: { debugLogs },
    });
  }
};

exports.getPaymentTransactionById = async (req, res) => {
  try {
    const transaction = await PaymentTransaction.findById(req.params.id)
      .populate("userId", "username email")
      .populate("promotionId", "title")
      .lean();

    if (!transaction) {
      return sendResponse(
        res,
        404,
        false,
        "Payment transaction not found",
        null
      );
    }

    sendResponse(
      res,
      200,
      true,
      "Payment transaction fetched successfully",
      transaction
    );
  } catch (error) {
    console.error("Error fetching payment transaction:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while fetching payment transaction",
      {
        error: error.message,
      }
    );
  }
};

exports.getUserPaymentTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return sendResponse(res, 400, false, "Invalid user ID", null);
    }

    const transactions = await PaymentTransaction.find({ userId })
      .populate("promotionId", "title")
      .sort({ createdAt: -1 })
      .lean();

    sendResponse(
      res,
      200,
      true,
      "User payment transactions fetched successfully",
      transactions
    );
  } catch (error) {
    console.error("Error fetching user payment transactions:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while fetching user payment transactions",
      {
        error: error.message,
      }
    );
  }
};

// * ================= frontend withdraw payment transaction create gateway ================

// Utility to validate MongoDB ObjectId (24-character hex string)

exports.createWithdrawPaymentTransaction = async (req, res) => {
  try {
    const { userId, paymentMethodId, channel, amount, userInputs } = req.body;

    // Validate required fields
    if (!userId || !paymentMethodId || !amount) {
      return sendResponse(
        res,
        400,
        false,
        "Missing required fields: userId, paymentMethodId, and amount are required",
        null
      );
    }

    // Validate ObjectId formats
    if (!isValidObjectId(userId) || !isValidObjectId(paymentMethodId)) {
      return sendResponse(
        res,
        400,
        false,
        "Invalid user ID or payment method ID",
        null
      );
    }

    // Validate amount
    if (typeof amount !== "number" || amount < 200 || amount > 30000) {
      return sendResponse(
        res,
        400,
        false,
        "Amount must be a number between 200 and 30,000",
        null
      );
    }

    // Check user balance
    const user = await user_model.findById(userId);
    if (!user) {
      return sendResponse(res, 400, false, "User not found", null);
    }
    if (user.balance < amount) {
      return sendResponse(res, 400, false, "Insufficient balance", null);
    }

    // Fetch payment method details
    const paymentMethod = await WithdrawPaymentMethod.findById(paymentMethodId);
    if (!paymentMethod) {
      return sendResponse(res, 400, false, "Invalid payment method", null);
    }

    // Validate payment method fields
    if (!paymentMethod.methodName || !paymentMethod.methodImage) {
      return sendResponse(
        res,
        400,
        false,
        "Payment method missing required fields",
        null
      );
    }

    // Validate channel against paymentMethod.gateway array
    if (channel) {
      if (typeof channel !== "string") {
        return sendResponse(res, 400, false, "Channel must be a string", null);
      }
      if (
        Array.isArray(paymentMethod.gateway) &&
        paymentMethod.gateway.length > 0
      ) {
        if (!paymentMethod.gateway.includes(channel)) {
          return sendResponse(
            res,
            400,
            false,
            "Channel must be one of the allowed gateways",
            null
          );
        }
      }
    }

    // Validate userInputs
    if (userInputs) {
      if (!Array.isArray(userInputs)) {
        return sendResponse(
          res,
          400,
          false,
          "userInputs must be an array",
          null
        );
      }
      for (const input of userInputs) {
        if (
          !input.name ||
          !input.value ||
          !input.label ||
          !input.labelBD ||
          !input.type ||
          !["number", "text", "file"].includes(input.type)
        ) {
          return sendResponse(
            res,
            400,
            false,
            "Invalid userInputs structure",
            null
          );
        }
      }
    }

    // Create transaction
    const transaction = await WithdrawPaymentTransaction.create({
      userId,
      paymentMethod: {
        methodName: paymentMethod.methodName,
        methodImage: paymentMethod.methodImage,
        gateway: channel || "",
      },
      channel: channel || "",
      amount,
      userInputs: userInputs || [],
      status: "pending",
    });

    sendResponse(
      res,
      201,
      true,
      "Withdraw payment transaction created successfully",
      transaction
    );
  } catch (error) {
    console.error("Error creating withdraw payment transaction:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while creating withdraw payment transaction",
      {
        error: error.message,
      }
    );
  }
};

exports.getWithdrawPaymentTransactionById = async (req, res) => {
  try {
    const transaction = await WithdrawPaymentTransaction.findById(req.params.id)
      .populate("userId", "username email")
      .lean();

    if (!transaction) {
      return sendResponse(
        res,
        404,
        false,
        "Withdraw payment transaction not found",
        null
      );
    }

    sendResponse(
      res,
      200,
      true,
      "Withdraw payment transaction fetched successfully",
      transaction
    );
  } catch (error) {
    console.error("Error fetching withdraw payment transaction:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while fetching withdraw payment transaction",
      {
        error: error.message,
      }
    );
  }
};

exports.getUserWithdrawPaymentTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return sendResponse(res, 400, false, "Invalid user ID", null);
    }

    const transactions = await WithdrawPaymentTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    sendResponse(
      res,
      200,
      true,
      "User withdraw payment transactions fetched successfully",
      transactions
    );
  } catch (error) {
    console.error("Error fetching user withdraw payment transactions:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while fetching user withdraw payment transactions",
      {
        error: error.message,
      }
    );
  }
};

// * ================= withdraw payment gateway start ================

exports.createWithdrawPaymentMethod = async (req, res) => {
  try {
    const withdrawPaymentMethod = await WithdrawPaymentMethod.create(req.body);
    sendResponse(
      res,
      201,
      true,
      "Withdraw payment method created successfully",
      withdrawPaymentMethod
    );
  } catch (error) {
    console.error("Error creating withdraw payment method:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while creating withdraw payment method",
      { error: error.message }
    );
  }
};

exports.getAllWithdrawPaymentMethods = async (req, res) => {
  try {
    const withdrawPaymentMethods = await WithdrawPaymentMethod.find().lean();
    sendResponse(
      res,
      200,
      true,
      "Withdraw payment methods fetched successfully",
      withdrawPaymentMethods
    );
  } catch (error) {
    console.error("Error fetching withdraw payment methods:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while fetching withdraw payment methods",
      { error: error.message }
    );
  }
};

exports.getWithdrawPaymentMethodById = async (req, res) => {
  try {
    const withdrawPaymentMethod = await WithdrawPaymentMethod.findById(
      req.params.id
    ).lean();
    if (!withdrawPaymentMethod) {
      return sendResponse(
        res,
        404,
        false,
        "Withdraw payment method not found",
        null
      );
    }
    sendResponse(
      res,
      200,
      true,
      "Withdraw payment method fetched successfully",
      withdrawPaymentMethod
    );
  } catch (error) {
    console.error("Error fetching withdraw payment method:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while fetching withdraw payment method",
      { error: error.message }
    );
  }
};

exports.updateWithdrawPaymentMethod = async (req, res) => {
  try {
    const withdrawPaymentMethod = await WithdrawPaymentMethod.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!withdrawPaymentMethod) {
      return sendResponse(
        res,
        404,
        false,
        "Withdraw payment method not found",
        null
      );
    }
    sendResponse(
      res,
      200,
      true,
      "Withdraw payment method updated successfully",
      withdrawPaymentMethod
    );
  } catch (error) {
    console.error("Error updating withdraw payment method:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while updating withdraw payment method",
      { error: error.message }
    );
  }
};

exports.deleteWithdrawPaymentMethod = async (req, res) => {
  try {
    const withdrawPaymentMethod = await WithdrawPaymentMethod.findByIdAndDelete(
      req.params.id
    );
    if (!withdrawPaymentMethod) {
      return sendResponse(
        res,
        404,
        false,
        "Withdraw payment method not found",
        null
      );
    }
    sendResponse(
      res,
      200,
      true,
      "Withdraw payment method deleted successfully",
      withdrawPaymentMethod
    );
  } catch (error) {
    console.error("Error deleting withdraw payment method:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while deleting withdraw payment method",
      { error: error.message }
    );
  }
};

// * ============================ frontend side controller start ================

// Create new theme (only if none exists)
exports.createTheme = async (req, res) => {
  try {
    const existingTheme = await ThemeModel.findOne();
    if (existingTheme) {
      return res
        .status(400)
        .json({ message: "A theme already exists. Use update to modify it." });
    }

    const {
      primaryColor,
      secondaryColor,
      sidebarHeaderColor,
      sidebarBodyColor,
      sidebarTitle,
      sidebarTitleBD,
      websiteTitle,
    } = req.body;

    // Validate required fields
    if (
      !primaryColor ||
      !secondaryColor ||
      !sidebarHeaderColor ||
      !sidebarBodyColor ||
      !sidebarTitle ||
      !sidebarTitleBD ||
      !websiteTitle
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Validate sidebarTitle length
    if (sidebarTitle.length > 10) {
      return res
        .status(400)
        .json({ message: "Sidebar title must be 10 characters or less" });
    }

    const theme = new ThemeModel({
      primaryColor,
      secondaryColor,
      sidebarHeaderColor,
      sidebarBodyColor,
      sidebarTitle,
      sidebarTitleBD,
      websiteTitle,
      favicon: req.body.favicon || "",
      websiteLogoWhite: req.body.websiteLogoWhite || "",
      websiteLogoDark: req.body.websiteLogoDark || "",
    });

    await theme.save();
    res.status(201).json({ message: "Theme created successfully", theme });
  } catch (error) {
    console.error("Create Theme Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get the single theme
exports.getThemes = async (req, res) => {
  try {
    const theme = await ThemeModel.findOne();
    if (!theme) {
      return res.status(200).json({}); // Return empty object if no theme exists
    }
    res.status(200).json(theme);
  } catch (error) {
    console.error("Get Themes Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update the single theme by ID
exports.updateTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      primaryColor,
      secondaryColor,
      sidebarHeaderColor,
      sidebarBodyColor,
      sidebarTitle,
      sidebarTitleBD,
      websiteTitle,
      favicon,
      websiteLogoWhite,
      websiteLogoDark,
    } = req.body;

    // Validate required fields
    if (
      !primaryColor ||
      !secondaryColor ||
      !sidebarHeaderColor ||
      !sidebarBodyColor ||
      !sidebarTitle ||
      !sidebarTitleBD ||
      !websiteTitle
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Validate sidebarTitle length
    if (sidebarTitle.length > 10) {
      return res
        .status(400)
        .json({ message: "Sidebar title must be 10 characters or less" });
    }

    const updatedTheme = await ThemeModel.findByIdAndUpdate(
      id,
      {
        primaryColor,
        secondaryColor,
        sidebarHeaderColor,
        sidebarBodyColor,
        sidebarTitle,
        sidebarTitleBD,
        websiteTitle,
        favicon,
        websiteLogoWhite,
        websiteLogoDark,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedTheme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    res
      .status(200)
      .json({ message: "Theme updated successfully", theme: updatedTheme });
  } catch (error) {
    console.error("Update Theme Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete the single theme by ID
exports.deleteTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTheme = await ThemeModel.findByIdAndDelete(id);

    if (!deletedTheme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    res.status(200).json({ message: "Theme deleted successfully" });
  } catch (error) {
    console.error("Delete Theme Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// * ============================== animation banner  start ================

// Get the single AnimationBanner document
exports.getAnimationBanner = async (req, res) => {
  try {
    const banner = await AnimationBanner.findOne();
    if (!banner) {
      return res
        .status(404)
        .json({ message: "AnimationBanner document not found." });
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update the single AnimationBanner document
exports.updateAnimationBanner = async (req, res) => {
  console.log("Update AnimationBanner Request Body:", req.body);

  try {
    const {
      titleEN,
      titleBD,
      titleColor,
      bannerBackgroundColor,
      numberBackgroundColor,
      numberColor,
    } = req.body;
    let banner = await AnimationBanner.findOne();

    if (!banner) {
      // If no document exists, create one with provided or default values
      banner = new AnimationBanner({
        titleEN: titleEN || "Jackpot",
        titleBD: titleBD || "জ্যাকপট",
        titleColor: titleColor || "#FFFF00",
        bannerBackgroundColor: bannerBackgroundColor || "#012632",
        numberBackgroundColor: numberBackgroundColor || "#FFFFFF",
        numberColor: numberColor || "#000000",
      });
      await banner.save();
      return res
        .status(201)
        .json({ message: "AnimationBanner created successfully.", banner });
    }

    // Update existing document
    banner.titleEN = titleEN || banner.titleEN;
    banner.titleBD = titleBD || banner.titleBD;
    banner.titleColor = titleColor || banner.titleColor;
    banner.bannerBackgroundColor =
      bannerBackgroundColor || banner.bannerBackgroundColor;
    banner.numberBackgroundColor =
      numberBackgroundColor || banner.numberBackgroundColor;
    banner.numberColor = numberColor || banner.numberColor;

    await banner.save();
    res
      .status(200)
      .json({ message: "AnimationBanner updated successfully.", banner });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ? login page image upload

// Create or update banner (save image URL to database)
exports.createBannerRegistration = async (req, res) => {
  try {
    const { url, type } = req.body;
    if (!url || !type) {
      return res.status(400).json({ error: "URL and type are required" });
    }

    // Check if a banner with the given type already exists
    const existingBanner = await imageRegistrationSchema.findOne({ type });
    if (existingBanner) {
      // Update existing banner
      const updatedBanner = await imageRegistrationSchema.findOneAndUpdate(
        { type },
        { url, createdAt: Date.now() },
        { new: true }
      );
      return res.status(200).json({ success: true, data: updatedBanner });
    }

    // Create new banner if none exists
    const banner = new imageRegistrationSchema({
      url,
      type,
    });
    await banner.save();
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ error: "Failed to create or update banner" });
  }
};

// Get all banners
exports.getBannersRegistration = async (req, res) => {
  try {
    const banners = await imageRegistrationSchema.find();
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch banners" });
  }
};

// Update banner
exports.updateBannerRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, type } = req.body;

    // Check if another banner with the same type exists (excluding the current banner)
    const existingBanner = await imageRegistrationSchema.findOne({
      type,
      _id: { $ne: id },
    });
    if (existingBanner) {
      return res
        .status(400)
        .json({ error: `A banner with type ${type} already exists` });
    }

    const banner = await imageRegistrationSchema.findByIdAndUpdate(
      id,
      { url, type, createdAt: Date.now() },
      { new: true }
    );
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ error: "Failed to update banner" });
  }
};

// Delete banner
exports.deleteBannerRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await imageRegistrationSchema.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete banner" });
  }
};

// Get all carousel images
exports.getAllCarouselImages = async (req, res) => {
  try {
    let carousel = await HomeCarousel.findOne();
    if (!carousel) {
      carousel = await new HomeCarousel({
        images: [],
        isActive: true,
        interval: 2500,
        infiniteLoop: true,
        autoPlay: true,
      }).save();
    }
    sendResponse(
      res,
      200,
      true,
      "Fetched carousel images successfully",
      carousel
    );
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Update carousel
exports.updateCarouselImage = async (req, res) => {
  const { id } = req.params;
  const { images, isActive, interval, infiniteLoop, autoPlay } = req.body;

  try {
    const updatedCarousel = await HomeCarousel.findByIdAndUpdate(
      id,
      {
        images,
        isActive,
        interval,
        infiniteLoop,
        autoPlay,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCarousel) {
      return sendResponse(res, 404, false, "Carousel not found");
    }

    sendResponse(
      res,
      200,
      true,
      "Updated carousel successfully",
      updatedCarousel
    );
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find();
    sendResponse(res, 200, true, "Fetched all notices successfully", notices);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Update or create notice
exports.updateNotice = async (req, res) => {
  const { title, titleBD, emoji, active } = req.body;
  try {
    const notice = await Notice.findOneAndUpdate(
      {}, // Match any (assuming single notice logic)
      { title, titleBD, emoji, active },
      {
        new: true, // return the new doc after update
        runValidators: true,
        upsert: true, // create if not found
      }
    );
    sendResponse(
      res,
      200,
      true,
      "Notice updated or created successfully",
      notice
    );
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

exports.getAllGameNavBar = (modelName) => async (req, res) => {
  try {
    const items = await models[modelName].find().lean();
    res.status(200).json(items);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getByIdGameNavBar = (modelName) => async (req, res) => {
  try {
    const item = await models[modelName].findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    res.status(200).json(item);
  } catch (err) {
    handleError(res, err, 404);
  }
};

exports.createGameNavBar = (modelName) => async (req, res) => {
  try {
    const item = await models[modelName].create(req.body);
    res.status(201).json(item);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.updateGameNavBar = (modelName) => async (req, res) => {
  try {
    const item = await models[modelName].findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    res.status(200).json(item);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.removeGameNavBar = (modelName) => async (req, res) => {
  try {
    const item = await models[modelName].findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    res.status(200).json({ message: `${modelName} deleted` });
  } catch (err) {
    handleError(res, err, 400);
  }
};

// New function to get submenus merged with provider data
exports.getSubmenuProviders = async (req, res) => {
  console.log("Fetching submenu providers...");

  try {
    // 1. Fetch all providers from the external API
    const providerResponse = await axios.get(
      `https://apigames.oracleapi.net/api/providers`,
      {
        headers: {
          "x-api-key":
            "300cc0adfcfb041c25c4a8234e3c0e312a44c7570677d64bdb983412f045da67",
        },
      }
    );
    const providers = providerResponse.data.data;

    const providerMap = new Map(providers.map((p) => [p._id, p]));

    // 2. Fetch all sub-options from the local database
    const subOptions = await SubOption.find().lean();

    // 3. Merge the data
    const mergedSubmenus = subOptions.map((sub) => {
      const providerInfo = providerMap.get(sub.providerId);
      return {
        ...sub,
        providerName: providerInfo ? providerInfo.name : "Unknown Provider",
        providerImage: providerInfo ? providerInfo.image : "",
      };
    });

    sendResponse(
      res,
      200,
      true,
      "Submenu providers fetched successfully",
      mergedSubmenus
    );
  } catch (error) {
    console.error("Error fetching submenu providers:", error);
    sendResponse(
      res,
      500,
      false,
      "Server error while fetching submenu providers"
    );
  }
};

// * ========== game section  ========== //
// exports.getAllGames = async (req, res) => {
//   try {
//     const games = await GameModel.find()
//       .populate({
//         path: "subOptions",
//         populate: {
//           path: "parentMenuOption",
//         },
//       })
//       .lean();
//     res.status(200).json(games);
//   } catch (err) {
//     handleError(res, err);
//   }
// };

// exports.getGameById = async (req, res) => {
//   try {
//     const game = await GameModel.findById(req.params.id).lean();
//     if (!game) return res.status(404).json({ error: "Game not found" });
//     res.status(200).json(game);
//   } catch (err) {
//     handleError(res, err, 404);
//   }
// };

// exports.createGame = async (req, res) => {
//   try {
//     const { gameAPIID, image = "", subOptions, isHotGame } = req.body;

//     if (!gameAPIID || !subOptions) {
//       return sendResponse(res, 400, false, "gameAPIID and subOptions are required");
//     }

//     // Prevent duplicates per category
//     const existingGame = await GameModel.findOne({ gameAPIID, subOptions });
//     if (existingGame) {
//       return sendResponse(
//         res,
//         409,
//         false,
//         "This game has already been added to this category."
//       );
//     }

//     const game = await GameModel.create({
//       gameAPIID,
//       image,
//       subOptions,
//       isHotGame,
//     });
//     sendResponse(res, 201, true, "Game created successfully", game);
//   } catch (err) {
//     handleError(res, err, 400);
//   }
// };

// exports.updateGame = async (req, res) => {
//   try {
//     const { image, subOptions, isHotGame } = req.body;
//     const update = {};
//     if (image !== undefined) update.image = image;
//     if (subOptions !== undefined) update.subOptions = subOptions;
//     if (typeof isHotGame === "boolean") update.isHotGame = isHotGame;

//     const game = await GameModel.findByIdAndUpdate(
//       req.params.id,
//       { $set: update },
//       { new: true }
//     );
//     if (!game) return sendResponse(res, 404, false, "Game not found");
//     sendResponse(res, 200, true, "Game updated successfully", game);
//   } catch (err) {
//     handleError(res, err, 400);
//   }
// };

// exports.deleteGame = async (req, res) => {
//   try {
//     const game = await GameModel.findByIdAndDelete(req.params.id);
//     if (!game) return sendResponse(res, 404, false, "Game not found");
//     sendResponse(res, 200, true, "Game deleted successfully");
//   } catch (err) {
//     handleError(res, err, 400);
//   }
// };

/**
 * 
// for seed

exports.seedGameNavBar = async (req, res) => {
  try {
    // Clear all existing data
    await GameNavBar.deleteMany({});
    await MenuOption.deleteMany({});
    await SubOption.deleteMany({});

    // Create MenuOptions
    const menu1 = await MenuOption.create({ title: 'Action Games', image: 'action.png' });
    const menu2 = await MenuOption.create({ title: 'Puzzle Games', image: 'puzzle.png' });

    // Create SubOptions for each menu
    await SubOption.insertMany([
      { title: 'Shooter', image: 'shooter.png', parentMenuOption: menu1._id },
      { title: 'Battle Royale', image: 'battle.png', parentMenuOption: menu1._id },
      { title: 'Sudoku', image: 'sudoku.png', parentMenuOption: menu2._id },
      { title: 'Matching', image: 'match.png', parentMenuOption: menu2._id }
    ]);

    // Create GameNavBar
    const navbar = await GameNavBar.create({
      name: 'Main Navbar',
      gameBoxMarginTop: '20px',
      gameNavMenuMarginBottom: '10px',
      headerBgColor: '#222',
      headerMarginBottom: '15px',
      headerMenuBgColor: '#333',
      headerMenuBgHoverColor: '#444',
      subOptionBgHoverColor: '#555',
      menuOptions: [menu1._id, menu2._id]
    });

    // Fetch GameNavBar with full nested structure
    const fullNav = await GameNavBar.findById(navbar._id)
      .populate({
        path: 'menuOptions',
        populate: {
          path: '_id', // this is just to ensure `.toObject()` works nicely
        }
      })
      .lean(); // Convert to plain JS object for manipulation

    // Attach subOptions inside each menuOption manually
    for (let option of fullNav.menuOptions) {
      const subOptions = await SubOption.find({ parentMenuOption: option._id });
      option.subOptions = subOptions;
    }

    res.status(201).json({
      message: 'GameNavBar seeded successfully with full nested structure',
      data: fullNav
    });
  } catch (err) {
    console.error('Seeding error:', err.message);
    res.status(500).json({
      error: 'Failed to seed GameNavBar',
      details: err.message
    });
  }
};








// GET all navbars
exports.getAllNavbars = async (req, res) => {
  try {
    const navbars = await GameNavBar.find()
      .populate({
        path: 'menuOptions',
        populate: {
          path: '_id'
        }
      })
      .lean();

    for (let nav of navbars) {
      for (let menu of nav.menuOptions) {
        const subs = await SubOption.find({ parentMenuOption: menu._id });
        menu.subOptions = subs;
      }
    }

    res.status(200).json(navbars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};










// Navbar CRUD operations
exports.getAllNavbars = async (req, res) => {
  try {
    const navbars = await GameNavBar.find();
    res.status(200).json(navbars);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching navbars', error: err });
  }
};









const models = { GameNavBar, MenuOption, SubOption };

const handleError = (res, err, status = 500) => {
  res.status(status).json({ error: err.message || 'Server error' });
};

exports.getAllGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === 'GameNavBar') {
      // Return single navbar or empty array
      const navbar = await models[modelName]
        .findOne()
        .populate({
          path: 'menuOptions',
          populate: { path: 'subOptions' }
        })
        .lean();
      return res.status(200).json(navbar ? [navbar] : []);
    }
    const items = await models[modelName]
      .find()
      .populate(modelName === 'GameNavBar' ? {
        path: 'menuOptions',
        populate: { path: 'subOptions' }
      } : null)
      .lean();
    
    if (modelName === 'GameNavBar') {
      for (let item of items) {
        for (let menu of item.menuOptions || []) {
          menu.subOptions = await SubOption.find({ parentMenuOption: menu._id });
        }
      }
    }
    res.status(200).json(items);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getByIdGameNavBar = (modelName) => async (req, res) => {
  try {
    const item = await models[modelName]
      .findById(req.params.id)
      .populate(modelName === 'GameNavBar' ? 'menuOptions' : null)
      .lean();
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    
    if (modelName === 'GameNavBar' && item.menuOptions) {
      for (let menu of item.menuOptions) {
        menu.subOptions = await SubOption.find({ parentMenuOption: menu._id });
      }
    }
    res.status(200).json(item);
  } catch (err) {
    handleError(res, err, 404);
  }
};

exports.createGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === 'GameNavBar') {
      // Check if a navbar already exists
      const existingNavbar = await models[modelName].findOne();
      if (existingNavbar) {
        return res.status(400).json({ error: 'Only one navbar can exist. Please update the existing navbar.' });
      }
      // Create with defaults (schema handles defaults)
      const navbar = await models[modelName].create(req.body || {});
      return res.status(201).json(navbar);
    }
    const item = await models[modelName].create(req.body);
    res.status(201).json(item);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.updateGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === 'GameNavBar') {
      // Update the single navbar
      const navbar = await models[modelName].findOneAndUpdate({}, req.body, { new: true });
      if (!navbar) return res.status(404).json({ error: 'Navbar not found' });
      return res.status(200).json(navbar);
    }
    const item = await models[modelName].findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    res.status(200).json(item);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.removeGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === 'GameNavBar') {
      return res.status(400).json({ error: 'Deleting the navbar is not allowed.' });
    }
    const item = await models[modelName].findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    res.status(200).json({ message: `${modelName} deleted` });
  } catch (err) {
    handleError(res, err, 400);
  }
};








// * ========== game section  ========== //
exports.getAllGames = async (req, res) => {
  try {
    const games = await GameModel.find()
      .populate({
        path: 'subOptions',
        populate: {
          path: 'parentMenuOption',
        },
      })
      .lean();
    res.status(200).json(games);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getGameById = async (req, res) => {
  try {
    const game = await GameModel.findById(req.params.id).lean();
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json(game);
  } catch (err) {
    handleError(res, err, 404);
  }
};

exports.createGame = async (req, res) => {
  try {
    const game = await GameModel.create(req.body);
    res.status(201).json(game);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.updateGame = async (req, res) => {
  try {
    const game = await GameModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json(game);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const game = await GameModel.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json({ message: 'Game deleted' });
  } catch (err) {
    handleError(res, err, 400);
  }
};


 */
