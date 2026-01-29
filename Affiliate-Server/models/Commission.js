// models/Commission.js
import mongoose from "mongoose";

const tableRowSchema = new mongoose.Schema({
  member: String,
  win: Number,
  operation: Number,
  bonus: Number
});

const calcItemSchema = new mongoose.Schema({
  icon: String,
  text: String
});

const commissionSchema = new mongoose.Schema({
  title: { type: String, default: "সেরা কমিশন রেট, শুধু আপনার জন্য!" },
  subtitle: { type: String, default: "কোন লুকানো ফি নেই, কোন লুকানো কৌশল নেই, শুধু যোগদান করুন এবং উপার্জন শুরু করুন!" },
  leftImage: { type: String, default: "https://cdn-icons-png.flaticon.com/512/608/608197.png" },
  leftTitle: { type: String, default: "প্রতিনতুন অ্যাফিলিয়েট পার্টনারের জন্য রাজস্বের ভাগ সর্বোচ্চ ৫০% পর্যন্ত!" },
  leftDesc: { type: String, default: "শুরু মাত্র রেফারালটি থেকেই আপনি পেতে পারেন সর্বোচ্চ ৫০% আয়।\nপ্রতি মাসে কমিশন — কোন প্রশ্ন ছাড়াই। এখনই যোগ দিন RAJABAJI Affiliates এর অংশ হয়ে উঠুন!" },
  buttonText: { type: String, default: "যোগাযোগ করুন" },

  calcTitle: { type: String, default: "কমিশন হার কীভাবে গণনা করবেন" },
  calcItems: { type: [calcItemSchema], default: () => [
    { icon: "%", text: "কমিশন: (কোম্পানির লাভ/ক্ষতি - বোনাস - অপারেশন ফি) × ৫০%" },
    { icon: "gift", text: "বোনাস: অনুমোদিত সদস্যদের দেওয়া আর্থিক বোনাস, রিবেট, ক্যাশব্যাক ইত্যাদি।" },
    { icon: "money", text: "অপারেশন ফি: মোট লাভ/ক্ষতির উপর ভিত্তি করে ২০% প্রযোজ্য।" }
  ]},

  tierTitle: { type: String, default: "অংশীদার" },
  tierNetLoss: { type: String, default: "১ লাখ টাকার উপরে" },
  tierPlayers: { type: String, default: "১০+ সদস্য" },
  tierRate: { type: String, default: "৫০%" },

  formulaTitle: { type: String, default: "অ্যাফিলিয়েট মোট নেট লাভের" },
  formulaPercent: { type: String, default: "৪০ - ৫০%" },
  formulaSubtitle: { type: String, default: "উপার্জন করবে" },

  tableData: { type: [tableRowSchema], default: () => [
    { member: "সদস্য ১", win: 2400000, operation: 480000, bonus: 40000 },
    { member: "সদস্য ২", win: 1800000, operation: 360000, bonus: 20000 },
    { member: "সদস্য ৩", win: -900000, operation: 0, bonus: 0 },
    { member: "সদস্য ৪", win: 2900000, operation: 580000, bonus: 50000 },
    { member: "সদস্য ৫", win: -600000, operation: 0, bonus: 0 }
  ]},
  totalCommission: { type: Number, default: 2035000 }
}, { timestamps: true });

export default mongoose.models.Commission || mongoose.model("Commission", commissionSchema);