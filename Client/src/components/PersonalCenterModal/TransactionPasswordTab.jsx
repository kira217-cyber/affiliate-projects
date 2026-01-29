import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Importing icons

const TransactionPasswordTab = ({
  language,
  formData,
  handleInputChange,
  setFormData,
}) => {
  return (
    <div className="flex flex-col gap-4 whitespace-nowrap">
      {/* Transaction Password Input */}
      <div className="flex items-center gap-20 w-full">
        <label
          htmlFor="transactionPassword"
          className="block w-[20%] text-right text-sm font-semibold"
        >
          {language === "bn"
            ? "ট্রানজ্যাকশন পাসওয়ার্ড"
            : "Transaction Password"}{" "}
          :
        </label>
        <div className="w-full flex flex-col relative">
          <input
            type={formData.showTransactionPassword ? "text" : "password"}
            id="transactionPassword"
            name="transactionPassword"
            value={formData.transactionPassword}
            onChange={handleInputChange}
            className="w-full p-2 border border-black rounded mt-2"
            placeholder={
              language === "bn" ? "আপনার পাসওয়ার্ড" : "Enter your password"
            }
          />
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                showTransactionPassword: !formData.showTransactionPassword,
              })
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
          >
            {formData.showTransactionPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Transaction Password Input */}
      <div className="flex items-center gap-20 w-full">
        <label
          htmlFor="confirmTransactionPassword"
          className="block w-[20%] text-right text-sm font-semibold"
        >
          {language === "bn" ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"} :
        </label>
        <div className="w-full flex flex-col relative">
          <input
            type={formData.showConfirmTransactionPassword ? "text" : "password"}
            id="confirmTransactionPassword"
            name="confirmTransactionPassword"
            value={formData.confirmTransactionPassword}
            onChange={handleInputChange}
            className="w-full p-2 border border-black rounded mt-2"
            placeholder={
              language === "bn"
                ? "পাসওয়ার্ড নিশ্চিত করুন"
                : "Confirm your password"
            }
          />
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                showConfirmTransactionPassword:
                  !formData.showConfirmTransactionPassword,
              })
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
          >
            {formData.showConfirmTransactionPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </button>
        </div>
      </div>
      {/* Additional conditional rendering for other modals */}
      <div className="absolute  bottom-10">
        <button
          type="submit"
          className="w-full px-6 py-2 rounded-full  bg-bgRed text-white  mt-4"
        >
          {language === "bn" ? "জমা দিন" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default TransactionPasswordTab;
