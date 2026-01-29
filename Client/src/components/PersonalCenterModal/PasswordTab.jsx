import { useContext, useState } from "react";
import { AuthContext } from "@/Context/AuthContext";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";

const PasswordTab = () => {
  const { user, language } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const [loading, setLoading] = useState(false);

  // ---------------- Input Handler ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- Toggle Password Visibility ----------------
  const togglePassword = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // ---------------- Submit Handler ----------------
  const handleSubmitPassword = async () => {
    // Validate new password match
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error(
        language === "bn"
          ? "নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!"
          : "Passwords do not match!"
      );
    }

    setLoading(true);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update-password`,
        {
          userId: user?._id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      );

      toast.success(
        language === "bn"
          ? "পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!"
          : "Password updated successfully!"
      );

      console.log("API Response:", res.data);

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });
    } catch (err) {
      console.error("Error:", err);
      toast.error(
        language === "bn"
          ? err?.response?.data?.message || "কিছু সমস্যা হয়েছে!"
          : err?.response?.data?.message || "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 whitespace-nowrap">
      {/* Current Password */}
      <div className="flex items-center gap-20 w-full">
        <label className="block w-[20%] text-right text-sm font-semibold">
          {language === "bn" ? "বর্তমান পাসওয়ার্ড" : "Current Password"} :
        </label>
        <div className="w-full flex flex-col relative">
          <input
            type={formData.showCurrentPassword ? "text" : "password"}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="w-full p-2 border border-black rounded mt-2"
            placeholder={
              language === "bn"
                ? "আপনার বর্তমান পাসওয়ার্ড"
                : "Enter your current password"
            }
            required
          />
          <button
            type="button"
            onClick={() => togglePassword("showCurrentPassword")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {formData.showCurrentPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div className="flex items-center gap-20 w-full">
        <label className="block w-[20%] text-right text-sm font-semibold">
          {language === "bn" ? "নতুন পাসওয়ার্ড" : "New Password"} :
        </label>
        <div className="w-full flex flex-col relative">
          <input
            type={formData.showNewPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="w-full p-2 border border-black rounded mt-2"
            placeholder={
              language === "bn"
                ? "আপনার নতুন পাসওয়ার্ড"
                : "Enter your new password"
            }
            required
          />
          <button
            type="button"
            onClick={() => togglePassword("showNewPassword")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {formData.showNewPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex items-center gap-20 w-full">
        <label className="block w-[20%] text-right text-sm font-semibold">
          {language === "bn" ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"} :
        </label>
        <div className="w-full flex flex-col relative">
          <input
            type={formData.showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full p-2 border border-black rounded mt-2"
            placeholder={
              language === "bn"
                ? "নতুন পাসওয়ার্ড নিশ্চিত করুন"
                : "Confirm your new password"
            }
            required
          />
          <button
            type="button"
            onClick={() => togglePassword("showConfirmPassword")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {formData.showConfirmPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="w-full flex justify-center mt-6">
        <button
          type="button"
          onClick={handleSubmitPassword}
          disabled={loading}
          className="px-6 py-2 rounded-full bg-bgRed text-white disabled:opacity-50"
        >
          {loading
            ? language === "bn"
              ? "লোড হচ্ছে..."
              : "Processing..."
            : language === "bn"
            ? "জমা দিন"
            : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default PasswordTab;
