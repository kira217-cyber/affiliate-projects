// models/Navbar.js
import mongoose from "mongoose";

const navbarSchema = new mongoose.Schema({
  logo: { type: String, required: true },
  links: [
    {
      name: { type: String, required: true },
      sectionId: { type: String, required: true }, // যেমন: "why-us"
    }
  ],
  registerButton: {
    text: { type: String, default: "সদস্য সাইন ইন" },
    link: { type: String, default: "/register" },
    bgColor: { type: String, default: "#99FF47" },
    textColor: { type: String, default: "#000000" }
  },
  loginButton: {
    text: { type: String, default: "এখন আবেদন করুন!" },
    link: { type: String, default: "/login" },
    bgColor: { type: String, default: "#ffffff" },
    textColor: { type: String, default: "#000000" },
    arrow: { type: String, default: ">" }
  }
}, { timestamps: true });

// শুধু একটা ডেটা থাকবে
export default mongoose.model("Navbar", navbarSchema);