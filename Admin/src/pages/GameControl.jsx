// src/pages/GameControl.jsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createGame,
  fetchGames,
  updateGame,
  deleteGame,
} from "../redux/Frontend Control/GameControl/GameControlAPI";
import { FaTrash, FaSpinner, FaUpload } from "react-icons/fa";
import { baseURL, baseURL_For_IMG_UPLOAD } from "../utils/baseURL";
import axios from "axios";

export default function GameControl() {
  const dispatch = useDispatch();
  const { gameControl, isLoading, isError, errorMessage } = useSelector(
    (state) => state.gameControl,
  );

  const [submenuProviders, setSubmenuProviders] = useState([]);
  const [apiGames, setApiGames] = useState([]);
  const [selectedSubmenu, setSelectedSubmenu] = useState("");
  const [apiGamesState, setApiGamesState] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const [uploadingGames, setUploadingGames] = useState({});

  const fileInputs = useRef({});

  const API_KEY =
    "300cc0adfcfb041c25c4a8234e3c0e312a44c7570677d64bdb983412f045da67";

  useEffect(() => {
    const fetchSubmenuProviders = async () => {
      try {
        const response = await axios.get(`${baseURL}/submenu-providers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (response.data.success) setSubmenuProviders(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch providers.");
      }
    };
    fetchSubmenuProviders();
    dispatch(fetchGames());
  }, [dispatch]);

  const handleProviderChange = async (submenuId) => {
    setSelectedSubmenu(submenuId);
    setApiGames([]);
    setApiGamesState({});
    setPreviewImages({});
    if (!submenuId) return;

    const selected = submenuProviders.find((s) => s._id === submenuId);
    if (!selected?.providerId) return;

    try {
      const response = await axios.get(
        `https://apigames.oracleapi.net/api/games/pagination?page=1&limit=50&provider=${selected.providerId}`,
        { headers: { "x-api-key": API_KEY } },
      );
      if (response.data.success) setApiGames(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch games.");
    }
  };

  const handleApiGameToggle = (gameAPIID, field) => {
    setApiGamesState((prev) => ({
      ...prev,
      [gameAPIID]: {
        ...prev[gameAPIID],
        [field]: !prev[gameAPIID]?.[field],
      },
    }));
  };

  const handleSaveApiGame = async (gameAPIID) => {
    if (!selectedSubmenu) return toast.error("Select a provider first.");

    const gameState = apiGamesState[gameAPIID] || {};

    try {
      await dispatch(
        createGame({
          gameAPIID,
          subOptions: selectedSubmenu,
          isHotGame: !!gameState.isHotGame,
          isNewGame: !!gameState.isNewGame,
          isLobbyGame: !!gameState.isLobbyGame,
          image: gameState.image || "",
        }),
      ).unwrap();

      toast.success("Game saved!");
      dispatch(fetchGames());

      setApiGamesState((prev) => {
        const next = { ...prev };
        delete next[gameAPIID];
        return next;
      });
      setPreviewImages((prev) => {
        const next = { ...prev };
        delete next[gameAPIID];
        return next;
      });
    } catch (error) {
      toast.error("Save failed.");
    }
  };

  const handleDeleteGame = async (gameId, imageFilename) => {
    try {
      if (imageFilename) {
        await axios.post(baseURL_For_IMG_DELETE, { filename: imageFilename });
      }
      await dispatch(deleteGame(gameId)).unwrap();
      toast.success("Game removed!");
      dispatch(fetchGames());
    } catch (error) {
      toast.error("Remove failed.");
    }
  };

  const handleSavedToggle = async (savedGame, field) => {
    try {
      await dispatch(
        updateGame({
          id: savedGame._id,
          data: { [field]: !savedGame[field] },
        }),
      ).unwrap();
      toast.success("Status updated!");
      dispatch(fetchGames());
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  const handleFileSelect = (gameId, file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPreviewImages((prev) => ({ ...prev, [gameId]: previewUrl }));
  };

  const handleImageUpload = async (gameId, isSaved, savedGameId) => {
    const file = fileInputs.current[gameId]?.files?.[0];
    if (!file) return toast.error("No image selected");

    setUploadingGames((prev) => ({ ...prev, [gameId]: true }));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(baseURL_For_IMG_UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const imageFilename = res.data?.imageUrl;
      if (!imageFilename) throw new Error("No imageUrl in response");

      if (isSaved && savedGameId) {
        await dispatch(
          updateGame({
            id: savedGameId,
            data: { image: imageFilename },
          }),
        ).unwrap();
      } else {
        setApiGamesState((prev) => ({
          ...prev,
          [gameId]: { ...prev[gameId], image: imageFilename },
        }));
      }

      toast.success("Image uploaded!");
      dispatch(fetchGames());

      if (previewImages[gameId]) URL.revokeObjectURL(previewImages[gameId]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setUploadingGames((prev) => ({ ...prev, [gameId]: false }));
      if (fileInputs.current[gameId]) fileInputs.current[gameId].value = "";
    }
  };

  const getSavedGame = (apiId) =>
    gameControl.find((g) => g.gameAPIID === apiId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-10 text-center">
          Featured Games Control
        </h1>

        {/* Provider Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          <h2 className="text-2xl font-bold text-emerald-300 mb-6">
            Select Provider
          </h2>
          <select
            value={selectedSubmenu}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="">-- Select Provider --</option>
            {submenuProviders.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.providerName}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Games Grid */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-emerald-300 mb-6">
            Games from Provider
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <FaSpinner className="w-12 h-12 text-emerald-400 animate-spin" />
            </div>
          ) : isError ? (
            <div className="bg-rose-900/40 border border-rose-700/50 text-rose-300 p-8 rounded-xl text-center">
              {errorMessage || "Failed to load games"}
            </div>
          ) : apiGames.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-lg">
              Select a provider to view games
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {apiGames.map((game) => {
                const saved = getSavedGame(game._id);
                const isSaved = !!saved;

                const tk999Img = (
                  saved?.projectImageDocs ||
                  game?.projectImageDocs ||
                  []
                ).find(
                  (d) => d?.projectName?.title === "Tk999" && d?.image,
                )?.image;

                const uploadedImage = isSaved
                  ? saved.image
                  : apiGamesState[game._id]?.image || "";
                const previewSrc = previewImages[game._id];

                const displayImage =
                  previewSrc || tk999Img
                    ? `https://apigames.oracleapi.net/${tk999Img}`
                    : uploadedImage
                      ? `${import.meta.env.VITE_REACT_APP_BACKEND_API}uploads/${uploadedImage}`
                      : game.image
                        ? `https://apigames.oracleapi.net/${game.image}`
                        : "/placeholder-game.png";

                const isHot = isSaved
                  ? saved.isHotGame
                  : !!apiGamesState[game._id]?.isHotGame;
                const isNew = isSaved
                  ? saved.isNewGame
                  : !!apiGamesState[game._id]?.isNewGame;
                const isLobby = isSaved
                  ? saved.isLobbyGame
                  : !!apiGamesState[game._id]?.isLobbyGame;

                return (
                  <motion.div
                    key={game._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/50 border border-emerald-800/50 rounded-xl overflow-hidden shadow-lg group relative"
                  >
                    <div className="relative h-48 bg-black/30">
                      <img
                        src={displayImage}
                        alt={game.name}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.target.src = "/placeholder-game.png")
                        }
                      />
                    </div>

                    <div className="p-5 space-y-4">
                      <h3 className="text-lg font-bold text-emerald-300 truncate">
                        {game.name}
                      </h3>

                      <div className="flex flex-col gap-2 text-sm">
                        {["isHotGame", "isNewGame", "isLobbyGame"].map(
                          (field) => (
                            <label
                              key={field}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  field === "isHotGame"
                                    ? isHot
                                    : field === "isNewGame"
                                      ? isNew
                                      : isLobby
                                }
                                onChange={() =>
                                  isSaved
                                    ? handleSavedToggle(saved, field)
                                    : handleApiGameToggle(game._id, field)
                                }
                                className="w-5 h-5 accent-emerald-500"
                              />
                              <span className="text-gray-200">
                                {field
                                  .replace("is", "")
                                  .replace("Game", " Game")}
                              </span>
                            </label>
                          ),
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(el) => (fileInputs.current[game._id] = el)}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(game._id, file);
                          }}
                        />

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => fileInputs.current[game._id]?.click()}
                          className="flex-1 bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                        >
                          <FaUpload size={16} />
                          {previewImages[game._id] || uploadedImage
                            ? "Change"
                            : "Add Image"}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            handleImageUpload(game._id, isSaved, saved?._id)
                          }
                          disabled={uploadingGames[game._id]}
                          className="flex-1 bg-green-700 hover:bg-green-600 text-white py-3 rounded-xl font-bold disabled:opacity-60 transition flex items-center justify-center"
                        >
                          {uploadingGames[game._id] ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            "Upload"
                          )}
                        </motion.button>
                      </div>

                      {!isSaved ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSaveApiGame(game._id)}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold transition"
                        >
                          Select & Save Game
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            handleDeleteGame(saved._id, saved.image)
                          }
                          className="w-full bg-rose-700 hover:bg-rose-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                        >
                          <FaTrash size={16} />
                          Unselect Game
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
