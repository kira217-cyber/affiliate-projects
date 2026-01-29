const express = require("express");
const cors = require("cors");

const globalError = require("./error/error");
const connectDb = require("./db/db");
const config = require("./config/config");
// const router = require("./router/product.router");
const path = require("path");
const adminAuthRouter = require("./router/admin/admin.auth.router");
const frontendAuthRouter = require("./router/frontend/frontend.auth.router");
const adminUserRouter = require("./router/admin/admin.user.router");
const { uploadImage } = require("./controller/ImageUpload.Controller");
const adminHomeControlRouter = require("./router/admin/admin.homeControll.router");
const frontendHomeControlRouter = require("./router/frontend/frontend.controll.router");
const adminHomeFooterControlRouter = require("./router/admin/admin.homeFooterControll.router");
const adminOpayRouter = require("./router/admin/admin.opay.router");
const PaymentMessage = require("./model/PaymentMessage");
const Game = require("./model/game.model")
const { deleteImage } = require("./controller/ImageDelete.Controller");
const User = require("./model/user.model");
const qs = require("qs");
const bcrypt = require("bcrypt");
const { default: axios } = require("axios");
const fs = require("fs").promises;

// const { uploadImage } = require("./controller/ImageUpload.Controller");

// Create app
const app = express();

// Use middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:3001",
      "https://melbet99.com",
      "https://admin.melbet99.com",
      "http://melbet99.com",
      "http://admin.melbet99.com",
      "http://localhost:5173",
      "https://tk999.egamings.org",
      "https://tk999.oracelsoft.com",
      "https://affiliate.tk999.oracelsoft.com",
      "https://admin.tk999.oracelsoft.com",
      "https://affiliatecp666.live",
      "http://affiliatecp666.live",
      "https://cp666.live",
      "http://cp666.live",
      "https://admin.cp666.live",
      "http://admin.cp666.live",
      "https://cp666.live",
      "http://cp666.live",
      "https://cp666.live",
      "http://cp666.live",
      "*",
    ], // Allow requests from frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow specified methods
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cors());

app.use(express.urlencoded({ extended: true })); // For form data parsing (optional, not needed for multipart)
app.use(express.json()); // For JSON data (not needed for file uploads)

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// * Image upload route (uses multer from uploadImage controller)

app.post("/upload", uploadImage); // Matches frontend fetch URL

// Image delete route
app.post("/delete-image", deleteImage);
// Loader status endpoint (reads config/loader.json)
app.get("/loader", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "config", "loader.json");
    const content = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(content || "{}");
    res.json({ loader: !!json.loader });
  } catch (err) {
    res.json({ loader: false });
  }
});

// * admin routes
app.use("/api/v1/admin", [
  adminAuthRouter,
  adminUserRouter,
  adminHomeControlRouter,
  adminHomeFooterControlRouter,
  adminOpayRouter,
]);

// * view customer user routers
app.use("/api/v1/frontend", [frontendAuthRouter, frontendHomeControlRouter]);

// Custom middleware (if any can go here)

// Global error handler
app.use(globalError);

// Private route
app.get("/private", (req, res) => {
  return res.status(200).json({
    message: "I am a private route",
  });
});

// Root route
app.get("/", (req, res) => {
  res.send({
    message: "This is the root route",
  });
});

// এই API দিয়ে সব ধরনের গেমের কাউন্ট একসাথে পাবে
app.get("/api/v1/admin/game-stats", async (req, res) => {
  try {
    // একসাথে সব কাউন্ট করে ফেলা হচ্ছে (অনেক দ্রুত)
    const stats = await Promise.all([
      Game.countDocuments({}),                    // Total Game
      Game.countDocuments({ isHotGame: true }),   // Hot Game
      Game.countDocuments({ isLobbyGame: true }), // Lobby Game
      Game.countDocuments({ isNewGame: true }),   // New Game
    ]);

    const [totalGames, hotGames, lobbyGames, newGames] = stats;

    const statsData = [
      {
        title: "Total Game",
        value: totalGames.toString(),
        icon: "FaGamepad", // frontend-এ icon নাম দিয়ে রাখা যায়
        route: "/games",
      },
      {
        title: "Hot Game",
        value: hotGames.toString(),
        icon: "FaPlay",
        route: "/games?filter=hot",
      },
      {
        title: "Lobby Game",
        value: lobbyGames.toString(),
        icon: "FaStop",
        route: "/games?filter=lobby",
      },
      {
        title: "New Game",
        value: newGames.toString(),
        icon: "FaRobot",
        route: "/games?filter=new",
      },
    ];

    res.status(200).json({
      success: true,
      data: statsData,
    });
  } catch (error) {
    console.error("Game stats error:", error);
    res.status(500).json({
      success: false,
      message: "সার্ভারে সমস্যা হয়েছে",
      error: error.message,
    });
  }
});


// GET total amount sum
app.get("/api/v1/admin/total-amount/opay", async (req, res) => {
  try {
    const result = await PaymentMessage.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      totalAmount: result[0]?.totalAmount || 0,
      totalTransactions: result[0]?.totalTransactions || 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate total amount",
      error: error.message,
    });
  }
});


// GET today's total amount
app.get("/api/v1/admin/today-total/opay", async (req, res) => {
  try {
    // today date => DD/MM/YYYY
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    const todayDate = `${dd}/${mm}/${yyyy}`;

    const result = await PaymentMessage.aggregate([
      {
        $match: { date: todayDate },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      date: todayDate,
      totalAmount: result[0]?.totalAmount || 0,
      totalTransactions: result[0]?.totalTransactions || 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate today's total",
      error: error.message,
    });
  }
});



// এই API টা কল করলে গেম লোড হবে → POST /api/playgame
app.post("/playgame", async (req, res) => {
  try {
    const { gameID, username, money } = req.body;

   
    console.log("PlayGame Request Body:", req.body);

    // if (!gameID || !username || !money) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "gameID is required in request body", gameID, username, money,
    //   });
    // }

    // const postData = {
    //   home_url: "https://cp666.live",
    //   token: "e9a26dd9196e51bb18a44016a9ca1d73",
    //   username: username + "45", // চাইলে random করতে পারো
    //   money: money,
    //   gameid: gameID,
    // };

    // api.tk999.oracelsoft.com
    const postData = {
      home_url: "https://api.tk999.oracelsoft.com",
      token: "5f4e59f09dc1a061cdb5185ceef6e75b",
      username: username + "45", // চাইলে random করতে পারো
      money: money,
      gameid: gameID,
    };

    console.log(postData);

    const response = await axios.post(
      // "https://dstplay.net/getgameurl",
      "https://crazybet99.com/getgameurl",
      qs.stringify(postData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-dstgame-key": postData.token,
        },
      }
    );

    // DST থেকে যে URL আসবে সেটা frontend এ পাঠাচ্ছি
    res.json({
      success: true,
      gameUrl: response.data.url || response.data.game_url || response.data,
    });
  } catch (error) {
    console.error("PlayGame API Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to launch game",
      error: error.response?.data || error.message,
    });
  }
});

// ✅ Create static admin user with hashed password
app.post("/create-admin", async (req, res) => {
  try {
    // Static admin data
    const adminData = {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123", // Plain password, will hash below
      phoneNumber: "01234567890",
      player_id: "ADMIN001",
      role: "admin",
      isVerified: true,
      emailVerified: true,
      phoneNumberVerified: true,
    };

    // ✅ Hash the password
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    const admin = new User(adminData);
    await admin.save();

    res.status(201).json({ success: true, message: "Admin created", admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Reset admin: delete existing admin by email and create a new one
app.get("/reset-admin", async (req, res) => {
  try {
    const {
      email = "admin@example.com",
      name = "Admin User",
      password = "12345678",
      phoneNumber = "01234567890",
      player_id = "ADMIN001",
    } = req.body || {};

    // Delete existing admin
    await User.deleteOne({ email, role: "admin" });

    // Create new admin
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const admin = new User({
      name,
      email,
      password: hashed,
      phoneNumber,
      player_id,
      role: "admin",
      isVerified: true,
      emailVerified: true,
      phoneNumberVerified: true,
      status: "active",
    });
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin reset: old admin deleted, new admin created",
      admin: { _id: admin._id, email: admin.email, player_id: admin.player_id },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// MongoDB connection and server start
connectDb(config.DB_CONN)
  .then(() => {
    console.log("Database connected");
    // On server start: ensure admin password is set to hash(12345678)
    (async () => {
      try {
        const adminEmail = "admin@example.com";
        const plain = "12345678";
        const admin = await User.findOne({ email: adminEmail });
        if (admin) {
          const isSame = await bcrypt.compare(plain, admin.password);
          if (!isSame) {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(plain, salt);
            admin.password = hashed;
            await admin.save();
            console.log("Admin password reset to predefined hash.");
          } else {
            console.log("Admin password already matches predefined value.");
          }
        } else {
          console.log("Admin user not found; skipping password reset.");
        }
      } catch (err) {
        console.error("Failed to reset admin password:", err.message);
      }
    })();
    app.listen(config.PORT, () => {
      console.log(`Server is running at ${config.PORT}`);
    });
  })
  .catch((e) => console.log("Database connection failed:", e));

module.exports = app; // Optional: export app for testing or other modules

// added 2
