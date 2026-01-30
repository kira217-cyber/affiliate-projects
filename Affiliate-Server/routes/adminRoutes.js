import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const router = express.Router();

// Helper: সকল downline user ID পাওয়া (direct + indirect) — শুধু role: "user" গুলোর
async function getAllDownlineUserIds(affiliateId) {
  const downlineUserIds = new Set(); // শুধু "user" role এর ID গুলো রাখবো

  async function recurse(currentId) {
    const user = await Admin.findById(currentId)
      .select("createdUsers role")
      .lean();

    if (!user) return;

    // যদি এই নোডটা "user" role হয় → তার ID add করো এবং আর নিচে যাবে না
    if (user.role === "user") {
      downlineUserIds.add(currentId.toString());
      return;
    }

    // অন্যথায় (super-affiliate বা master-affiliate) → তার createdUsers এর মধ্যে যাও
    for (const childId of user.createdUsers || []) {
      const childStr = childId.toString();
      // ডুপ্লিকেট এড়ানোর জন্য চেক (অপশনাল, কিন্তু ভালো প্র্যাকটিস)
      if (!downlineUserIds.has(childStr)) {
        await recurse(childId);
      }
    }
  }

  await recurse(affiliateId);
  return Array.from(downlineUserIds);
}

async function getDirectDownline(affiliateId) {
  const affiliate = await Admin.findById(affiliateId)
    .select("createdUsers")
    .populate({
      path: "createdUsers",
      select:
        "username referralCode role balance commissionBalance gameLossCommissionBalance depositCommissionBalance referCommissionBalance createdAt",
    })
    .lean();

  return affiliate?.createdUsers || [];
}

// API: /api/affiliate/stats/BAEAFD  (যেখানে BAEAFD হলো referralCode)
router.get("/affiliate/stats/:referralCode", async (req, res) => {
  try {
    const { referralCode } = req.params;

    const affiliate = await Admin.findOne({
      referralCode: referralCode.toUpperCase(),
    }).lean();

    if (
      !affiliate ||
      !["super-affiliate", "master-affiliate"].includes(affiliate.role)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // এখানে শুধু "user" role এর downline ID গুলো পাবে
    const downlineUserIds = await getAllDownlineUserIds(affiliate._id);

    if (downlineUserIds.length === 0) {
      return res.json({
        todayPlayerWin: 0,
        todayPlayerLoss: 0,
        activePlayerCount: 0,
        totalDownlineBalance: 0,
      });
    }

    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // শুধু user role এর ডাটা নেওয়া (যেহেতু আমরা শুধু তাদের ID পেয়েছি)
    const downlineUsers = await Admin.find({
      _id: {
        $in: downlineUserIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    })
      .select("balance gameHistory")
      .lean();

    let todayWin = 0;
    let todayLoss = 0;
    let totalBalance = 0;

    downlineUsers.forEach((user) => {
      totalBalance += user.balance || 0;

      (user.gameHistory || []).forEach((game) => {
        if (new Date(game.createdAt) >= dayAgo) {
          if (game.status === "won") todayWin += game.amount || 0;
          if (game.status === "lost") todayLoss += game.amount || 0;
        }
      });
    });

    res.json({
      todayPlayerWin: todayWin,
      todayPlayerLoss: todayLoss,
      activePlayerCount: downlineUsers.length,
      totalDownlineBalance: totalBalance,
    });
  } catch (error) {
    console.error("Affiliate stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// নতুন API: Downline list with stats
router.get("/affiliate/downline-list/:referralCode", async (req, res) => {
  try {
    const { referralCode } = req.params;

    const affiliate = await Admin.findOne({
      referralCode: referralCode.toUpperCase(),
    }).lean();

    if (
      !affiliate ||
      !["super-affiliate", "master-affiliate"].includes(affiliate.role)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const directDownline = await getDirectDownline(affiliate._id);

    if (directDownline.length === 0) {
      return res.json({
        downline: [],
        totalDownline: 0,
        totalBalance: 0,
        totalCommission: 0,
      });
    }

    // Summary calculation
    let totalBalance = 0;
    let totalCommission = 0;
    let totalDownlineCount = directDownline.length;

    const downlineList = directDownline.map((user) => {
      const userBalance = user.balance || 0;
      const userCommission =
        (user.gameLossCommissionBalance || 0) +
        (user.depositCommissionBalance || 0) +
        (user.referCommissionBalance || 0);

      totalBalance += userBalance;
      totalCommission += userCommission;

      return {
        _id: user._id,
        username: user.username,
        referralCode: user.referralCode,
        role: user.role,
        balance: userBalance,
        totalCommission: userCommission,
        createdAt: user.createdAt,
      };
    });

    res.json({
      downline: downlineList,
      summary: {
        totalDownline: totalDownlineCount,
        totalBalance,
        totalCommission,
      },
    });
  } catch (error) {
    console.error("Downline list error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /register
router.post("/register", async (req, res) => {
  const { username, email, whatsapp, password, referral } = req.body;

  try {
    // Check if user already exists
    const exists = await Admin.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: "User already exists" });

    let referredBy = null;
    let referrer = null;

    if (referral) {
      referrer = await Admin.findOne({ referralCode: referral });
      if (!referrer)
        return res.status(400).json({ message: "Invalid referral code" });
      referredBy = referrer._id;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new Admin({
      username,
      email,
      whatsapp,
      password: hashedPassword,
      role: referral ? "master-affiliate" : "super-affiliate",
      referredBy,
      isActive: false, // সবাই প্রথমে inactive থাকবে
    });

    const savedUser = await user.save();

    // যদি রেফারার থাকে (মানে রেফার লিংক দিয়ে এসেছে)
    if (referrer) {
      // রেফারারের createdUsers ও pendingRequests এ যোগ করা
      await Admin.findByIdAndUpdate(referrer._id, {
        $push: {
          createdUsers: savedUser._id,
          pendingRequests: savedUser._id,
        },
      });

      // এখানে মূল কাজ: Refer Commission যোগ করা
      const referBonus = referrer.referCommission || 0; // যদি ১০ হয়, তাহলে ১০ টাকা

      if (referBonus > 0) {
        await Admin.findByIdAndUpdate(referrer._id, {
          $inc: {
            referCommissionBalance: referBonus, // বোনাস যোগ হচ্ছে
          },
        });

        // অপশনাল: লগ রাখতে চাইলে একটা Transaction মডেলে সেভ করতে পারো
        // await new ReferralBonus({ referrer: referrer._id, newUser: savedUser._id, amount: referBonus }).save();
      }
    }

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        isActive: savedUser.isActive,
        referralCode: savedUser.referralCode,
        referralLink: `${process.env.VITE_API_URL}/register?ref=${savedUser.referralCode}`,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// routes/auth.js → POST /main/register
router.post("/main/register", async (req, res) => {
  const { username, whatsapp, password, referral } = req.body;

  try {
    // ইউজার আগে থেকে আছে কিনা? (email চেক বাদ দিয়েছি)
    const exists = await Admin.findOne({ username });
    if (exists)
      return res.status(400).json({ message: "Username already exists" });

    let referredBy = null;
    let referrer = null;
    let newUserRole = "user";
    let superReferrer = null;

    // রেফারেল কোড চেক
    if (referral) {
      referrer = await Admin.findOne({ referralCode: referral });
      if (!referrer) {
        return res.status(400).json({ message: "Invalid referral code" });
      }
      referredBy = referrer._id;

      if (referrer.role === "super-affiliate") {
        newUserRole = "master-affiliate";
      } else if (referrer.role === "master-affiliate") {
        newUserRole = "user";
      }
    }

    // পাসওয়ার্ড হ্যাশ
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // master-affiliate হলে approval দরকার
    const isActive = newUserRole === "master-affiliate" ? false : true;

    // নতুন ইউজার তৈরি (email ফিল্ড বাদ)
    const user = new Admin({
      username,
      whatsapp,
      password: hashedPassword,
      role: newUserRole,
      referredBy,
      isActive,
    });

    const savedUser = await user.save();

    // === রেফার বোনাস লজিক (একই রাখা হয়েছে) ===
    if (referredBy && referrer) {
      const updateReferrer = { $push: { createdUsers: savedUser._id } };
      if (newUserRole === "master-affiliate") {
        updateReferrer.$push.pendingRequests = savedUser._id;
      }
      await Admin.findByIdAndUpdate(referredBy, updateReferrer);

      // শুধু Master Affiliate → User রেজিস্ট্রেশনে বোনাস
      if (newUserRole === "user" && referrer.role === "master-affiliate") {
        const referBonus = referrer.referCommission || 0;
        if (referBonus > 0) {
          // ১. Master Affiliate কে বোনাস
          await Admin.findByIdAndUpdate(referredBy, {
            $inc: { referCommissionBalance: referBonus },
          });

          // ২. Super Affiliate কে বাকি অংশ
          if (referrer.referredBy) {
            superReferrer = await Admin.findById(referrer.referredBy);
            if (superReferrer && superReferrer.role === "super-affiliate") {
              const superBonusAmount = superReferrer.referCommission || 0;
              const superReferBonus = superBonusAmount - referBonus;
              console.log("Super bonus:", superReferBonus);
              if (superReferBonus > 0) {
                await Admin.findByIdAndUpdate(superReferrer._id, {
                  $inc: { referCommissionBalance: superReferBonus },
                });
              }
            }
          }
        }
      }
    }

    // সাকসেস রেসপন্স (email বাদ)
    res.status(201).json({
      message: "Registration successful",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        role: savedUser.role,
        isActive: savedUser.isActive,
        referralCode: savedUser.referralCode,
        referralLink: `${process.env.VITE_CLIENT_URL}/register?ref=${savedUser.referralCode}`,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Admin.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is pending approval" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        referralCode: user.referralCode,
        referralLink: `${process.env.VITE_API_URL}/register?ref=${user.referralCode}`,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// routes/admin.js
router.get("/admin", async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(401).json({ message: "No user ID" });

    const user = await Admin.findById(id)
      .select("-password")
      .populate({
        path: "pendingRequests",
        select:
          "username email whatsapp balance password isActive gameWinCommission gameLossCommission depositCommission referCommission commissionBalance",
      })
      .populate({
        path: "createdUsers",
        select:
          "username email whatsapp balance password isActive gameWinCommission gameLossCommission depositCommission referCommission commissionBalance",
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/count-users → Total normal users (role: "user")
router.get("/count-users", async (req, res) => {
  try {
    const count = await Admin.countDocuments({ role: "user" });
    res.json({
      success: true,
      count: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/admin/count-affiliates → Total affiliates (super-affiliate + master-affiliate)
router.get("/count-affiliates", async (req, res) => {
  try {
    const count = await Admin.countDocuments({
      role: { $in: ["super-affiliate", "master-affiliate"] },
    });
    res.json({
      success: true,
      count: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PATCH: Approve / Update commissions (super-affiliate & master উভয়ের জন্য)
router.patch("/approve-user/:id", async (req, res) => {
  const { id } = req.params;
  const {
    gameLossCommission = 0,
    depositCommission = 0,
    referCommission = 0,
    gameWinCommission = 0, // ← নতুন
  } = req.body;

  try {
    const user = await Admin.findByIdAndUpdate(
      id,
      {
        isActive: true,
        gameLossCommission: Number(gameLossCommission),
        depositCommission: Number(depositCommission),
        referCommission: Number(referCommission),
        gameWinCommission: Number(gameWinCommission), // ← নতুন
      },
      { new: true },
    ).select(
      "username email whatsapp isActive gameLossCommission depositCommission referCommission gameWinCommission commissionBalance",
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.referredBy) {
      await Admin.findByIdAndUpdate(user.referredBy, {
        $pull: { pendingRequests: id },
      });
    }

    res.json({ message: "User updated & activated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /deactivate-user/:id
router.patch("/deactivate-user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Admin.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deactivated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const { userId, firstName, lastName, username, email, whatsapp, password } =
      req.body;

    // userId ছাড়া হলে এরর
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await Admin.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // আপডেট ফিল্ড
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.whatsapp = whatsapp || user.whatsapp;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // রেসপন্স
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      whatsapp: user.whatsapp,
      referralCode: user.referralCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/pending-affiliates-count", async (req, res) => {
  try {
    const [superCount, masterCount] = await Promise.all([
      Admin.countDocuments({
        role: "super-affiliate",
        isActive: false,
      }),
      Admin.countDocuments({
        role: "master-affiliate",
        isActive: false,
      }),
    ]);

    const totalPending = superCount + masterCount;

    res.status(200).json({
      success: true,
      totalPending,
      breakdown: {
        superAffiliate: superCount,
        masterAffiliate: masterCount,
      },
      message: `${totalPending} pending affiliate requests (super: ${superCount}, master: ${masterCount})`,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// POST /api/update-user-credentials/:id
router.patch("/update-master-affiliate-credentials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const user = await Admin.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ইউজারনেম আপডেট
    if (username && username !== user.username) {
      const existing = await Admin.findOne({ username });
      if (existing)
        return res.status(400).json({ message: "Username already taken" });
      user.username = username;
    }

    // পাসওয়ার্ড আপডেট (যদি দেওয়া থাকে)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// routes/admin.js
router.get("/super-affiliates", async (req, res) => {
  try {
    const superAffiliates = await Admin.find({
      role: "super-affiliate",
    }).select(
      "username email whatsapp balance password isActive referCommissionBalance depositCommissionBalance gameWinCommissionBalance gameLossCommissionBalance gameLossCommission gameWinCommission depositCommission referCommission commissionBalance",
    );

    res.json({ users: superAffiliates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// routes/admin.js
router.get("/master-affiliates", async (req, res) => {
  try {
    const masterAffiliates = await Admin.find({
      role: "master-affiliate",
    }).select(
      "username email whatsapp balance password isActive referCommissionBalance depositCommissionBalance gameWinCommissionBalance gameLossCommissionBalance gameWinCommission gameLossCommission depositCommission referCommission commissionBalance",
    );

    res.json({ users: masterAffiliates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Create New Super Affiliate
router.post("/create/super-affiliates", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      whatsapp,
      gameLossCommission,
      depositCommission,
      referCommission,
      gameWinCommission, // ← নতুন
    } = req.body;

    // Validation
    if (!username || !email || !password || !whatsapp) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const existingUser = await Admin.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Admin({
      username,
      email,
      password: hashedPassword,
      whatsapp,
      role: "super-affiliate",
      gameLossCommission: parseFloat(gameLossCommission) || 0,
      depositCommission: parseFloat(depositCommission) || 0,
      referCommission: parseFloat(referCommission) || 0,
      gameWinCommission: parseFloat(gameWinCommission) || 0, // ← নতুন
      isActive: false,
    });

    await newUser.save();

    res.status(201).json({
      message: "Super Affiliate created successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        whatsapp: newUser.whatsapp,
        role: newUser.role,
        isActive: newUser.isActive,
      },
    });
  } catch (error) {
    console.error("Create Super Affiliate Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST: Create New Master Affiliate
router.post("/create/master-affiliates", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      whatsapp,
      gameLossCommission,
      depositCommission,
      referCommission,
      gameWinCommission, // নতুন যোগ করা
      referredBy, // Super Affiliate ID
    } = req.body;

    // Validation
    if (!username || !email || !password || !whatsapp || !referredBy) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Check if username or email already exists
    const existingUser = await Admin.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // Check if referredBy (Super Affiliate) exists and is valid
    const superAffiliate = await Admin.findById(referredBy);
    if (!superAffiliate || superAffiliate.role !== "super-affiliate") {
      return res.status(400).json({ message: "Invalid Super Affiliate" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new Master Affiliate
    const newMaster = new Admin({
      username,
      email,
      password: hashedPassword,
      whatsapp,
      role: "master-affiliate",
      gameLossCommission: parseFloat(gameLossCommission) || 0,
      depositCommission: parseFloat(depositCommission) || 0,
      referCommission: parseFloat(referCommission) || 0,
      gameWinCommission: parseFloat(gameWinCommission) || 0, // নতুন
      referredBy: superAffiliate._id,
      isActive: false,
    });

    await newMaster.save();

    // Add new master to super affiliate's createdUsers array
    await Admin.findByIdAndUpdate(superAffiliate._id, {
      $push: { createdUsers: newMaster._id },
    });

    res.status(201).json({
      message: "Master Affiliate created successfully",
      user: {
        _id: newMaster._id,
        username: newMaster.username,
        email: newMaster.email,
        role: newMaster.role,
        referredBy: superAffiliate.username,
      },
    });
  } catch (error) {
    console.error("Create Master Affiliate Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all normal users
router.get("/users", async (req, res) => {
  try {
    const users = await Admin.find({ role: "user" }).select("-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await Admin.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const updates = req.body;

    // Hash password only if provided and not empty
    if (updates.password && updates.password.trim() !== "") {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password; // Don't update password if blank
    }

    const updatedUser = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// CREATE normal user
router.post("/create/user", async (req, res) => {
  const {
    username,
    email,
    password,
    whatsapp,
    referredBy,
    gameLossCommission,
    depositCommission,
    referCommission,
  } = req.body;

  if (!username || !email || !password || !whatsapp || !referredBy)
    return res.status(400).json({ message: "All fields required" });

  const exists = await Admin.findOne({ $or: [{ username }, { email }] });
  if (exists)
    return res.status(400).json({ message: "Username or email exists" });

  const master = await Admin.findById(referredBy);
  if (!master || master.role !== "master-affiliate")
    return res.status(400).json({ message: "Invalid Master Affiliate" });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const newUser = new Admin({
    username,
    email,
    password: hashed,
    whatsapp,
    role: "user",
    gameLossCommission: parseFloat(gameLossCommission) || 0,
    depositCommission: parseFloat(depositCommission) || 0,
    referCommission: parseFloat(referCommission) || 0,
    referredBy: master._id,
    isActive: true,
  });

  await newUser.save();
  await Admin.findByIdAndUpdate(master._id, {
    $push: { createdUsers: newUser._id },
  });

  res.status(201).json({ message: "User created", user: newUser });
});

// Toggle active
router.patch("/toggle-user/:id", async (req, res) => {
  await Admin.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive });
  res.json({ message: "Updated" });
});

// Update credentials
router.patch("/update-user-credentials/:id", async (req, res) => {
  const { username, password } = req.body;
  const update = {};
  if (username) update.username = username;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(password, salt);
  }
  await Admin.findByIdAndUpdate(req.params.id, update);
  res.json({ message: "Updated" });
});

// PATCH: Update User Commission
router.patch("/update-user-commission/:id", async (req, res) => {
  try {
    const { gameLossCommission, depositCommission, referCommission } = req.body;
    await Admin.findByIdAndUpdate(req.params.id, {
      gameLossCommission: parseFloat(gameLossCommission) || 0,
      depositCommission: parseFloat(depositCommission) || 0,
      referCommission: parseFloat(referCommission) || 0,
    });
    res.json({ message: "Commission updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// routes/profile.js বা যেখানে রাখো
router.put("/update-name", async (req, res) => {
  try {
    const { userId, firstName, lastName, username, email } = req.body;

    // userId ছাড়া হলে এরর
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await Admin.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // আপডেট ফিল্ড
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();

    // রেসপন্স
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update Password
router.put("/update-password", async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = await Admin.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Fetch all wallets of a user
router.get("/wallets/:userId", async (req, res) => {
  try {
    const user = await Admin.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.json({ success: true, data: user.wallets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// POST: Add a new wallet
router.post("/wallets", async (req, res) => {
  try {
    const { userId, methodId, processTab, inputs } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, msg: "userId is required" });
    }

    const user = await Admin.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (user.wallets.length >= 5) {
      return res
        .status(400)
        .json({ success: false, msg: "Maximum 5 wallets allowed" });
    }

    user.wallets.push({
      methodId,
      processTab,
      inputs, // array of { name, value, label, labelBD }
    });

    await user.save();

    res.json({ success: true, data: user.wallets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// PUT: Update an existing wallet by wallet _id
router.put("/wallets/:walletId", async (req, res) => {
  try {
    const { userId, methodId, processTab, inputs } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, msg: "userId is required" });
    }

    const user = await Admin.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const wallet = user.wallets.id(req.params.walletId);
    if (!wallet) {
      return res.status(404).json({ success: false, msg: "Wallet not found" });
    }

    // Update fields if provided
    if (methodId !== undefined) wallet.methodId = methodId;
    if (processTab !== undefined) wallet.processTab = processTab;
    if (inputs !== undefined) wallet.inputs = inputs;

    await user.save();

    res.json({ success: true, data: user.wallets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// DELETE: Delete a wallet by wallet _id
router.delete("/wallets/:walletId", async (req, res) => {
  try {
    const { userId } = req.query; // or req.body.userId

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, msg: "userId is required" });
    }

    const user = await Admin.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const walletIndex = user.wallets.findIndex(
      (w) => w._id.toString() === req.params.walletId,
    );

    if (walletIndex === -1) {
      return res.status(404).json({ success: false, msg: "Wallet not found" });
    }

    user.wallets.splice(walletIndex, 1);
    await user.save();

    res.json({ success: true, data: user.wallets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// 1. POST /api/super-affiliate/bridge/:id
router.post("/super-affiliate/bridge/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const superAff = await Admin.findOne({ _id: id, role: "super-affiliate" });
    if (!superAff) {
      return res
        .status(404)
        .json({ success: false, message: "Super Affiliate not found" });
    }

    let {
      gameWinCommissionBalance = 0,
      gameLossCommissionBalance = 0,
      depositCommissionBalance = 0,
      referCommissionBalance = 0,
    } = superAff;

    // শুধু ৩টা ব্যালেন্সের যোগফল
    const positiveSum =
      gameLossCommissionBalance +
      depositCommissionBalance +
      referCommissionBalance;

    // gameWin বিয়োগ করে result
    const result = positiveSum - gameWinCommissionBalance;

    if (result <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "No positive balance available after subtracting gameWin (result ≤ 0)",
      });
    }

    // result কে ৩ ভাগ করে → নতুন ব্যালেন্স হবে শুধু এই share
    const share = result / 3;

    const updated = await Admin.findByIdAndUpdate(
      id,
      {
        $set: {
          gameWinCommissionBalance: 0,
          gameLossCommissionBalance: share,
          depositCommissionBalance: share,
          referCommissionBalance: share,
        },
      },
      { new: true },
    );

    res.json({
      success: true,
      message: "Bridge completed - balances reset to equal share",
      data: {
        previous: {
          gameWin: gameWinCommissionBalance.toFixed(2),
          gameLoss: gameLossCommissionBalance.toFixed(2),
          deposit: depositCommissionBalance.toFixed(2),
          refer: referCommissionBalance.toFixed(2),
        },
        subtractedFromWin: gameWinCommissionBalance.toFixed(2),
        resultAfterSubtraction: result.toFixed(2),
        sharePerBalance: share.toFixed(2),
        newBalances: {
          gameWin: 0,
          gameLoss: updated.gameLossCommissionBalance.toFixed(2),
          deposit: updated.depositCommissionBalance.toFixed(2),
          refer: updated.referCommissionBalance.toFixed(2),
        },
      },
    });
  } catch (err) {
    console.error("Bridge error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 2. POST /api/super-affiliate/bridge-all (Bulk)
router.post("/super-affiliate/bridge-all", async (req, res) => {
  try {
    const superAffiliates = await Admin.find({ role: "super-affiliate" });
    if (superAffiliates.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No super affiliates found" });
    }

    const results = [];

    for (const aff of superAffiliates) {
      let {
        _id,
        username,
        gameWinCommissionBalance = 0,
        gameLossCommissionBalance = 0,
        depositCommissionBalance = 0,
        referCommissionBalance = 0,
      } = aff;

      const positiveSum =
        gameLossCommissionBalance +
        depositCommissionBalance +
        referCommissionBalance;
      const result = positiveSum - gameWinCommissionBalance;

      if (result <= 0) {
        results.push({
          id: _id,
          username,
          status: "skipped",
          reason: "No positive balance after subtracting gameWin",
        });
        continue;
      }

      const share = result / 3;

      const updated = await Admin.findByIdAndUpdate(
        _id,
        {
          $set: {
            gameWinCommissionBalance: 0,
            gameLossCommissionBalance: share,
            depositCommissionBalance: share,
            referCommissionBalance: share,
          },
        },
        { new: true },
      );

      results.push({
        id: _id,
        username,
        status: "success",
        subtractedFromWin: gameWinCommissionBalance.toFixed(2),
        result: result.toFixed(2),
        sharePerBalance: share.toFixed(2),
        newBalances: {
          gameWin: 0,
          gameLoss: updated.gameLossCommissionBalance.toFixed(2),
          deposit: updated.depositCommissionBalance.toFixed(2),
          refer: updated.referCommissionBalance.toFixed(2),
        },
      });
    }

    res.json({
      success: true,
      message: `Bridge processed for ${results.filter((r) => r.status === "success").length} users`,
      results,
    });
  } catch (err) {
    console.error("Bulk bridge error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during bulk bridge" });
  }
});

// 1. POST /api/master-affiliate/bridge/:id
router.post("/master-affiliate/bridge/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const masterAff = await Admin.findOne({
      _id: id,
      role: "master-affiliate",
    });
    if (!masterAff) {
      return res
        .status(404)
        .json({ success: false, message: "Master Affiliate not found" });
    }

    let {
      gameWinCommissionBalance = 0,
      gameLossCommissionBalance = 0,
      depositCommissionBalance = 0,
      referCommissionBalance = 0,
    } = masterAff;

    const positiveSum =
      gameLossCommissionBalance +
      depositCommissionBalance +
      referCommissionBalance;
    const result = positiveSum - gameWinCommissionBalance;

    if (result <= 0) {
      return res.status(400).json({
        success: false,
        message: "No positive balance after subtracting gameWin (result ≤ 0)",
      });
    }

    const share = result / 3;

    const updated = await Admin.findByIdAndUpdate(
      id,
      {
        $set: {
          gameWinCommissionBalance: 0,
          gameLossCommissionBalance: share,
          depositCommissionBalance: share,
          referCommissionBalance: share,
        },
      },
      { new: true },
    );

    res.json({
      success: true,
      message: "Bridge completed for Master Affiliate",
      data: {
        previous: {
          gameWin: gameWinCommissionBalance.toFixed(2),
          gameLoss: gameLossCommissionBalance.toFixed(2),
          deposit: depositCommissionBalance.toFixed(2),
          refer: referCommissionBalance.toFixed(2),
        },
        result: result.toFixed(2),
        sharePerBalance: share.toFixed(2),
        newBalances: {
          gameWin: 0,
          gameLoss: updated.gameLossCommissionBalance.toFixed(2),
          deposit: updated.depositCommissionBalance.toFixed(2),
          refer: updated.referCommissionBalance.toFixed(2),
        },
      },
    });
  } catch (err) {
    console.error("Master Bridge error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 2. POST /api/master-affiliate/bridge-all
router.post("/master-affiliate/bridge-all", async (req, res) => {
  try {
    const masterAffiliates = await Admin.find({ role: "master-affiliate" });
    if (masterAffiliates.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No master affiliates found" });
    }

    const results = [];

    for (const aff of masterAffiliates) {
      let {
        _id,
        username,
        gameWinCommissionBalance = 0,
        gameLossCommissionBalance = 0,
        depositCommissionBalance = 0,
        referCommissionBalance = 0,
      } = aff;

      const positiveSum =
        gameLossCommissionBalance +
        depositCommissionBalance +
        referCommissionBalance;
      const result = positiveSum - gameWinCommissionBalance;

      if (result <= 0) {
        results.push({
          id: _id,
          username,
          status: "skipped",
          reason: "No positive balance after subtracting gameWin",
        });
        continue;
      }

      const share = result / 3;

      const updated = await Admin.findByIdAndUpdate(
        _id,
        {
          $set: {
            gameWinCommissionBalance: 0,
            gameLossCommissionBalance: share,
            depositCommissionBalance: share,
            referCommissionBalance: share,
          },
        },
        { new: true },
      );

      results.push({
        id: _id,
        username,
        status: "success",
        result: result.toFixed(2),
        sharePerBalance: share.toFixed(2),
        newBalances: {
          gameWin: 0,
          gameLoss: updated.gameLossCommissionBalance.toFixed(2),
          deposit: updated.depositCommissionBalance.toFixed(2),
          refer: updated.referCommissionBalance.toFixed(2),
        },
      });
    }

    res.json({
      success: true,
      message: `Bridge processed for ${results.filter((r) => r.status === "success").length} master affiliates`,
      results,
    });
  } catch (err) {
    console.error("Bulk Master Bridge error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during bulk bridge" });
  }
});

export default router;
