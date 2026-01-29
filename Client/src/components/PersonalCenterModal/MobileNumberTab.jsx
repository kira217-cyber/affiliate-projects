const MobileNumberTab = ({ language, formData, handleInputChange }) => {
  return (
    <div className="flex flex-col gap-4 whitespace-nowrap">
      {/* Mobile Number Input Section */}
      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor="phoneNumber"
          className="block w-full text-left text-sm text-textRed font-semibold"
        >
          {language === "bn"
            ? "আপনার ফোন নম্বর পুনরায় প্রবেশ করুন"
            : "Re-enter your phone number"}{" "}
          :
        </label>

        {/* Country Code Selection and Phone Number Input */}
        <div className="flex items-center gap-2 w-full">
          <h3 className="text-black mt-1">
            {language === "bn" ? "ফোন নম্বর" : "phone number"}
          </h3>
          <select
            name="countryCode"
            id="countryCode"
            value={formData.countryCode}
            onChange={handleInputChange}
            className="w-[30%] p-2 border border-black rounded mt-2"
          >
            {/* Add more country codes as needed */}
            <option value="+1">+1 (USA)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+91">+91 (India)</option>
            <option value="+880">+880 (Bangladesh)</option>
          </select>

          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-[70%] p-2 border border-black rounded mt-2"
            placeholder={language === "bn" ? "০১৬৮**" : "0168**"}
          />
          {/* Send Button */}
          <div className="flex justify-start w-full mt-4">
            <button
              type="button"
              onClick={() => alert("Verification code sent!")}
              className="px-6 py-2 text-white bg-bgRed rounded-full"
            >
              {language === "bn" ? "পাঠান" : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* Verification Code Input Section */}
      <div className="flex flex-col gap-2 w-full mt-4">
        <div className="flex gap-10 items-center ">
          <label
            htmlFor="phoneVerificationCode"
            className="block w-[20%] text-left text-sm text-black"
          >
            {language === "bn" ? "ভেরিফিকেশন কোড" : "Verification Code"} :
          </label>
          <input
            type="text"
            id="phoneVerificationCode"
            name="phoneVerificationCode"
            value={formData.phoneVerificationCode}
            onChange={handleInputChange}
            className="w-full p-2 border border-black rounded mt-2"
            placeholder={
              language === "bn"
                ? "ভেরিফিকেশন কোড প্রবেশ করুন"
                : "Enter verification code"
            }
          />
        </div>
        {/* Verification Code Message */}
        <small className="text-textRed mt-1">
          {language === "bn"
            ? "ভেরিফিকেশন কোড আসতে কিছু সময় লাগতে পারে"
            : "It may take a few moments for the verification code to arrive"}
        </small>
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

export default MobileNumberTab;
