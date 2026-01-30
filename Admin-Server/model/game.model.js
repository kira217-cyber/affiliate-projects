const mongoose = require("mongoose");
const GameSchema = new mongoose.Schema({
  gameAPIID: { type: String, required: true },
  image: { type: String, required: false, default: "" },
  subOptions: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubOption",
    required: true,
  },
  isHotGame: { type: Boolean, default: false },
  isNewGame: { type: Boolean, default: false },
  isLobbyGame: { type: Boolean, default: false },
});
const GameModel = mongoose.model("Game", GameSchema);
module.exports = GameModel;
