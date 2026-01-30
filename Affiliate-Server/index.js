import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import withdrawRoutes from "./routes/withdrawRoutes.js";
import sliderRoutes from "./routes/sliderRoutes.js";
import navbarRoutes from "./routes/navbarRoutes.js";
import whyChooseUsRoutes from "./routes/whyChooseUsRoutes.js";
import howToProcessRoutes from "./routes/howToProcessRoutes.js";
import commissionRoutes from "./routes/commissionRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import trickerRoutes from "./routes/trickerRoutes.js";
import lastPartRoutes from "./routes/lastPartRoutes.js";
import footerRoutes from "./routes/footerRoutes.js";
import siteSettingsRoutes from "./routes/siteSettingsRoutes.js";
import AdminSiteSettingsRoutes from "./routes/adminSiteSettingsRoutes.js";
import superAffiliateVideoRoutes from "./routes/superAffiliateVideoRoutes.js";
import masterAffiliateVideoRoutes from "./routes/masterAffiliateVideoRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import socialLinksRoutes from "./routes/socialLinksRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import callBackRoutes from "./routes/callBackRoutes.js";
import balanceTransferRoutes from "./routes/balanceTransferRoutes.js";
import adminWithdrawRoutes from "./routes/adminWithdrawRoutes.js";
import withdrawPaymentMethodRoutes from "./routes/withdrawPaymentMethodRoutes.js";
import withdrawTransactionRoutes from "./routes/withdrawTransactionRoutes.js";
import depositPaymentMethodRoutes from "./routes/depositPaymentMethodRoutes.js";
import depositPaymentTransactionRoutes from "./routes/depositPaymentTransactionRoutes.js";
import depositBonusRoutes from "./routes/depositBonusRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";

dotenv.config();
const app = express();

// __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", adminRoutes);
app.use("/api/withdraw", withdrawRoutes);
app.use("/api/sliders", sliderRoutes);
app.use("/api/navbar", navbarRoutes);
app.use("/api/why-choose-us", whyChooseUsRoutes);
app.use("/api/how-to-process", howToProcessRoutes);
app.use("/api/commission", commissionRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/tricker", trickerRoutes);
app.use("/api/lastpart", lastPartRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/admin-site-settings", AdminSiteSettingsRoutes);
app.use("/api/super-affiliate-video", superAffiliateVideoRoutes);
app.use("/api/master-affiliate-video", masterAffiliateVideoRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/social-links", socialLinksRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/callback-data-game", callBackRoutes); // এই লাইনটা থাকলেই হবে
app.use("/api/refund-balance", refundRoutes); // এই লাইনটা থাকলেই হবে
app.use("/api/balance-transfer", balanceTransferRoutes);
app.use("/api/admin-withdraw", adminWithdrawRoutes);
app.use("/api/withdraw-payment-methods", withdrawPaymentMethodRoutes);
app.use("/api/withdraw-transaction", withdrawTransactionRoutes);
app.use("/api/deposit-payment-method", depositPaymentMethodRoutes);
app.use("/api/deposit", depositPaymentTransactionRoutes);
app.use("/api/deposit-bonus", depositBonusRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
