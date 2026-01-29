import { useContext, useEffect, useState } from "react";
import image from "../../assets/0.png";
import { AuthContext } from "@/Context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const NameTab = ({ formData, handleInputChange }) => {
  const { user,language } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // ================================
  // Auto-fill database user data
  // ================================
  useEffect(() => {
    if (user) {
      handleInputChange({
        target: {
          name: "nickName",
          value: user.username || "",
        },
      });

      handleInputChange({
        target: {
          name: "email",
          value: user.email || "",
        },
      });

      const fullName = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(" ");

      handleInputChange({
        target: {
          name: "fullName",
          value: fullName || "",
        },
      });
    }
  }, [user]);

  // ==================================
  // Submit handler
  // ==================================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const full = formData.fullName.trim().split(" ");
      const firstName = full[0] || "";
      const lastName = full.slice(1).join(" ") || "";

      const payload = {
        userId: user?._id,
        username: formData.nickName,
        email: formData.email,
        firstName,
        lastName,
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update-name`,
        payload
      );

      toast.success(
        language === "bn"
          ? "নাম সফলভাবে আপডেট হয়েছে!"
          : "Name updated successfully!"
      );

      console.log("Updated User:", data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Update failed!");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-2 lg:px-0 gap-4">
      {/* User Image + Name */}
      <div className="flex items-center mt-2 gap-2 w-full">
        <div className="w-[20%]">
          <img src={image} alt="" className="rounded-full w-[80%]" />
        </div>
        <p>{user?.username}</p>
      </div>

      {/* Nickname Input */}
      <div className="flex items-center gap-6 w-full">
        <label
          htmlFor="nickName"
          className="block text-sm font-semibold w-[20%] text-right "
        >
          {language === "bn" ? "উপনাম:" : "Nickname:"}
        </label>
        <input
          type="text"
          id="nickName"
          name="nickName"
          value={formData.nickName}
          onChange={handleInputChange}
          className="w-full p-2 border border-black rounded mt-2"
          placeholder={
            language === "bn" ? "আপনার উপনাম" : "Enter your nickname"
          }
        />
      </div>

      {/* Email Input */}
      <div className="flex items-center gap-6 w-full">
        <label
          htmlFor="email"
          className="block w-[20%] text-right text-sm font-semibold"
        >
          {language === "bn" ? "ইমেইল:" : "Email:"}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border border-black rounded mt-2"
          placeholder={language === "bn" ? "আপনার ইমেইল" : "Enter your email"}
        />
      </div>

      {/* Full Name Input */}
      <div className="flex items-center gap-6 w-full">
        <label
          htmlFor="fullName"
          className="block w-[20%] text-right text-sm font-semibold"
        >
          {language === "bn" ? "পুরো নাম:" : "Full Name:"}
        </label>

        <div className="w-full flex flex-col">
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full p-2 border border-black rounded mt-2"
            placeholder={
              language === "bn" ? "আপনার পুরো নাম" : "Enter your full name"
            }
          />

          <p className="text-textRed text-sm">
            {language === "bn"
              ? "দয়া করে আপনার নামটি উত্তোলন তথ্যের সাথে মেলে কিনা তা নিশ্চিত করুন।"
              : "Please ensure your full name matches the details."}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-center w-full">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-10 py-2 rounded-full bg-bgRed text-white"
        >
          {loading
            ? language === "bn"
              ? "লোড হচ্ছে..."
              : "Loading..."
            : language === "bn"
            ? "জমা দিন"
            : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default NameTab;
