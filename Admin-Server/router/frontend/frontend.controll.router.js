const express = require("express");

const {
  getAllCarouselImages,
  getAllNotices,
  getNavBarWithMenuAndSubmenu,
  getFullGameNavBar,
  getAllPromotionsWithSubMenu,
  getAllDepositPaymentMethods,
  createPaymentTransaction,
  getPaymentTransactionById,
  getUserPaymentTransactions,
  createWithdrawPaymentTransaction,
  getWithdrawPaymentTransactionById,
  getUserWithdrawPaymentTransactions,
  getWithdrawPaymentMethods,
  getGameById,
  createTheme,
  getThemes,
  updateTheme,
  deleteTheme,
  getAnimationBanner,
  updateAnimationBanner,
  getBannersRegistration,
  createBannerRegistration,
  updateBannerRegistration,
  deleteBannerRegistration,
  playGameController,
  getTheGame,
  callBackController,
  autoPayment,
  checkAutoPayment,
} = require("../../controller/frontend/frontendPageController/frontendPage.controller");

const {
  getFavoritesPoster,
  updateFavoritesPoster,
  deleteFavoritesPosterImage,
  getFeaturedGames,
  updateFeaturedGames,
  addFeaturedGameItem,
  updateFeaturedGameItem,
  removeFeaturedGameItem,
} = require("../../controller/frontend/frontendFooterController/frontendFooterController");

const frontendHomeControlRouter = express.Router();
const { getViewerApiKey } = require("../../controller/frontend/opay.controller");
const { opayVerificationCallback } = require("../../controller/frontend/opay.webhook.controller");

frontendHomeControlRouter.get("/homeCarousel", getAllCarouselImages);

// Opay viewer key for client
frontendHomeControlRouter.get("/opay/viewer-key", getViewerApiKey);

// OraclePay webhook callback (public)
frontendHomeControlRouter.post("/opay/callback", opayVerificationCallback);

frontendHomeControlRouter.get("/notice", getAllNotices);

frontendHomeControlRouter.get("/game-nav-menu", getNavBarWithMenuAndSubmenu);

frontendHomeControlRouter.get("/game-section", getFullGameNavBar);

frontendHomeControlRouter.post("/playGame", playGameController);

frontendHomeControlRouter.post("/call-back", callBackController);

frontendHomeControlRouter.get("/get-the-game/:id/:user_id", getTheGame);

frontendHomeControlRouter.get("/promotions", getAllPromotionsWithSubMenu);

frontendHomeControlRouter.get(
  "/deposit-payment-method",
  getAllDepositPaymentMethods
);
frontendHomeControlRouter.post(
  "/payment-transactions",
  createPaymentTransaction
);
frontendHomeControlRouter.get(
  "/payment-transactions/:id",
  getPaymentTransactionById
);
frontendHomeControlRouter.get(
  "/payment-transactions/user/:userId",
  getUserPaymentTransactions
);
frontendHomeControlRouter.post("/auto-payment", autoPayment); // New POST route
frontendHomeControlRouter.get(
  "/check-auto-payment/:transactionId",
  checkAutoPayment
); // New GET route

frontendHomeControlRouter.get(
  "/deposit-payment-method",
  getAllDepositPaymentMethods
);

frontendHomeControlRouter.post(
  "/payment-transactions",
  createPaymentTransaction
);

frontendHomeControlRouter.get(
  "/payment-transactions/:id",
  getPaymentTransactionById
);

frontendHomeControlRouter.get(
  "/payment-transactions/user/:userId",
  getUserPaymentTransactions
);

frontendHomeControlRouter.get(
  "/withdraw-payment-method",
  getWithdrawPaymentMethods
);

frontendHomeControlRouter.post(
  "/withdraw-payment-transactions",
  createWithdrawPaymentTransaction
);
frontendHomeControlRouter.get(
  "/withdraw-payment-transactions/:id",
  getWithdrawPaymentTransactionById
);
frontendHomeControlRouter.get(
  "/withdraw-payment-transactions/user/:userId",
  getUserWithdrawPaymentTransactions
);

frontendHomeControlRouter.route("/game/:id").get(getGameById);

// FavoritesPoster Routes
frontendHomeControlRouter.get("/favorites-poster", getFavoritesPoster);
frontendHomeControlRouter.put("/favorites-poster", updateFavoritesPoster);
frontendHomeControlRouter.delete(
  "/favorites-poster/image/:imageUrl",
  deleteFavoritesPosterImage
);

// FeaturedGames Routes
frontendHomeControlRouter.get("/featured-games", getFeaturedGames);
frontendHomeControlRouter.put("/featured-games", updateFeaturedGames);
frontendHomeControlRouter.post("/featured-games/item", addFeaturedGameItem);
frontendHomeControlRouter.put(
  "/featured-games/item/:itemId",
  updateFeaturedGameItem
);
frontendHomeControlRouter.delete(
  "/featured-games/item/:itemId",
  removeFeaturedGameItem
);

// * ============================ frontend side controller start ================

// CRUD Routes
frontendHomeControlRouter.post("/admin-home-control", createTheme); // Create new theme
frontendHomeControlRouter.get("/admin-home-control", getThemes); // Get all themes
frontendHomeControlRouter.put("/admin-home-control/:id", updateTheme); // Update theme by ID
frontendHomeControlRouter.delete("/admin-home-control/:id", deleteTheme); // Delete theme by ID

// * ============================== animation banner  start ================

// Animation Banner Routes
frontendHomeControlRouter
  .route("/animation-banner")
  .get(getAnimationBanner)
  .put(updateAnimationBanner);

frontendHomeControlRouter.post(
  "/bannersRegistration",
  createBannerRegistration
); // Create banner
frontendHomeControlRouter.get("/bannersRegistration", getBannersRegistration); // Get all banners
frontendHomeControlRouter.put(
  "/bannersRegistration/:id",
  updateBannerRegistration
); // Update banner
frontendHomeControlRouter.delete(
  "/bannersRegistration/:id",
  deleteBannerRegistration
); // Delete banner

module.exports = frontendHomeControlRouter;
