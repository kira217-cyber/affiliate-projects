import noBankImage from "../../assets/no-bank-small.9562e3bb.png";

const EWalletDetailsTab = ({ language, formData, handleInputChange }) => {
  return (
    <div className="lg:flex overflow-y-auto h-[450px] custom-scrollbar-hidden pb-20 lg:pb-0  ">
      <div className=" flex flex-col    lg:border-r border-black border-opacity-50 pr-4 gap-4 whitespace-nowrap  ">
        {/* E-Wallet Selection */}
        <div className="lg:flex items-center gap-20 w-full">
          <label
            htmlFor="eWalletService"
            className="block w-[20%] text-right text-sm font-semibold"
          >
            {language === "bn" ? "ই-ওয়ালেট নির্বাচন করুন" : "Select E-Wallet"}{" "}
            :
          </label>
          <select
            id="eWalletService"
            name="eWalletService"
            value={formData.eWalletService}
            onChange={handleInputChange}
            className="w-full p-2 border border-black border-opacity-50  rounded-md mt-2"
          >
            <option value="">
              {language === "bn" ? "ওয়ালেট নির্বাচন করুন" : "Choose a wallet"}
            </option>
            <option value="Bkash">Bkash</option>
            <option value="Nagad">Nagad</option>
            <option value="Rocket">Rocket</option>
            <option value="Upay">Upay</option>
          </select>
        </div>

        {/* Name on E-Wallet */}
        <div className="lg:flex items-baseline gap-20 w-full">
          <label
            htmlFor="eWalletCardName"
            className="block w-[20%] lg:text-right text-sm font-semibold"
          >
            {language === "bn" ? "ওয়ালেটে নাম" : "Name on Wallet"} :
          </label>
          <div className="flex flex-col">
            <input
              type="text"
              id="eWalletCardName"
              name="eWalletCardName"
              value={formData.eWalletCardName}
              onChange={handleInputChange}
              className="w-full p-2 border border-black border-opacity-50  rounded-md mt-2"
              placeholder={
                language === "bn"
                  ? "ওয়ালেটের নাম লিখুন"
                  : "Enter name on wallet"
              }
            />
            <p className="text-textRed pt-1 text-sm whitespace-normal lg:whitespace-nowrap">
              {language === "bn"
                ? "নাম অবশ্যই ওয়ালেটের রেজিস্টারকৃত  নামের সাথে মিলতে হবে।"
                : "The name must match the one registered with your wallet service."}
            </p>
          </div>
        </div>

        <div className="border border-black border-opacity-50 p-2  rounded-md">
          {/* E-Wallet Type (4 Tabs as Flex Col) */}
          <div className="lg:flex gap-2 w-full ">
            <label className="block w-full  text-sm font-semibold">
              {language === "bn" ? "ওয়ালেট টাইপ" : "Wallet Type"} :
            </label>
            <div className="flex lg:text-base text-sm lg:flex-col gap-2   lg:w-full">
              {["Bkash", "Nagad", "Rocket", "Upay"].map((type) => (
                <div
                  key={type}
                  className={`w-full p-2 text-center cursor-pointer  rounded-md-md border border-black transition-all 
          ${
            formData.eWalletType === type
              ? "bg-bgRed bg-opacity-20 text-textRed border border-black-textRed"
              : "bg-white text-black border border-black-gray-300"
          }
        `}
                  onClick={() =>
                    handleInputChange({
                      target: { name: "eWalletType", value: type },
                    })
                  }
                >
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* E-Wallet Account Number */}
          <div className="lg:flex items-center  gap-20  p-2   w-full">
            <label
              htmlFor="eWalletAccountNumber"
              className="block w-[20%] text-right text-sm font-semibold"
            >
              {language === "bn" ? "অ্যাকাউন্ট নম্বর" : "Account Number"} :
            </label>
            <input
              type="text"
              id="eWalletAccountNumber"
              name="eWalletAccountNumber"
              value={formData.eWalletAccountNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-black border-opacity-50  rounded-md mt-2"
              placeholder={
                language === "bn"
                  ? "আপনার ওয়ালেট নম্বর"
                  : "Enter wallet number"
              }
            />
          </div>
        </div>

        {/* Verification Code */}
        <div className="lg:flex items-baseline gap-20 w-full">
          <label
            htmlFor="eWalletVerificationCode"
            className="block w-[20%] text-right text-sm font-semibold"
          >
            {language === "bn" ? "ভেরিফিকেশন কোড" : "Verification Code"} :
          </label>
          <div className="w-full flex items-baseline lg:gap-2 mt-2">
            <div className="flex flex-col">
              <input
                type="text"
                id="eWalletVerificationCode"
                name="eWalletVerificationCode"
                value={formData.eWalletVerificationCode}
                onChange={handleInputChange}
                className="w-[90%] lg:w-full p-2 border border-black border-opacity-50  rounded-md"
                placeholder={language === "bn" ? "কোড লিখুন" : "Enter code"}
              />
              <p className="text-textRed text-sm whitespace-normal lg:whitespace-nowrap pt-2">
                {language === "bn" ? (
                  <>*কোডটি মোবাইলে স্বয়ংক্রিয়ভাবে পাঠানো হবে।</>
                ) : (
                  <>*Code will be automatically sent to your phone.</>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert("Verification code sent!")}
              className="bg-bgRed text-white px-6 py-2  rounded-full transition-all"
            >
              {language === "bn" ? "সেন্ড করুন" : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* Side Image */}
      <div className="hidden lg:block">
        <div className="flex items-center  px-6 justify-center h-full">
          <div className="flex flex-col items-center">
            <img src={noBankImage} alt="No Wallet" className="" />
            <p>{language === "bn" ? "ই-ওয়ালেট খালি" : "Empty E-Wallet"}</p>
          </div>
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

export default EWalletDetailsTab;
