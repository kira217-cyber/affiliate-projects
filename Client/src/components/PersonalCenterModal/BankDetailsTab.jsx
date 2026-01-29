import noBankImage from "../../assets/no-bank-small.9562e3bb.png";

const BankDetailsTab = ({ language, formData, handleInputChange }) => {
  return (
    <div className="lg:flex overflow-y-auto h-[450px] lg:h-auto custom-scrollbar-hidden pb-20 lg:pb-0 ">
      <div className="flex  flex-col border-black border-opacity-50 lg:border-r  pr-4 gap-4 whitespace-nowrap ">
        {/* Bank Selection */}
        <div className="lg:flex items-center gap-20 w-full">
          <label
            htmlFor="bank"
            className="block w-[20%] text-right text-sm font-semibold"
          >
            {language === "bn" ? "ব্যাংক নির্বাচন করুন" : "Select Bank"} :
          </label>
          <select
            id="bank"
            name="bank"
            value={formData.bank}
            onChange={handleInputChange}
            className="w-full p-2 border  rounded-md border-opacity-50   border-black mt-2"
          >
            <option value="">
              {language === "bn" ? "ব্যাংক নির্বাচন করুন" : "Choose a bank"}
            </option>
            <option value="DBBL">Dutch-Bangla Bank</option>
            <option value="BRAC">BRAC Bank</option>
            <option value="IBBL">Islami Bank Bangladesh</option>
            <option value="SCB">Standard Chartered</option>
            <option value="HSBC">HSBC</option>
          </select>
        </div>

        {/* Name on Card */}
        <div className="lg:flex items-baseline gap-20 w-full">
          <label
            htmlFor="cardName"
            className="block w-[20%] lg:text-right text-sm font-semibold"
          >
            {language === "bn" ? "কার্ডে নাম" : "Name on Card"} :
          </label>
          <div className="flex flex-col">
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={formData.cardName}
              onChange={handleInputChange}
              className="w-full p-2 border   rounded-md border-opacity-50   border-black  mt-2"
              placeholder={
                language === "bn"
                  ? "কার্ডে থাকা নাম লিখুন"
                  : "Enter name on card"
              }
            />
            <p className="text-textRed text-sm pt-2">
              {language === "bn" ? (
                <>
                  ব্যর্থতা এড়াতে প্রদত্ত নামটি অবশ্যই <br />
                  আপনার আর্থিক প্রতিষ্ঠানে নিবন্ধিত
                  <br /> নামের সাথে মিলতে হবে।
                </>
              ) : (
                <>
                  Please ensure the name you provide <br /> matches exactly with
                  the name registered <br /> with your financial provider to
                  avoid failure.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Account Number */}
        <div className="lg:flex items-center gap-20 border   rounded-md border-opacity-50   border-black p-2          w-full">
          <label
            htmlFor="accountNumber"
            className="block w-[20%] text-right text-sm font-semibold"
          >
            {language === "bn" ? "অ্যাকাউন্ট নম্বর" : "Account Number"} :
          </label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            className="w-full p-2 border border-opacity-80   rounded-md border-black mt-2"
            placeholder={
              language === "bn"
                ? "আপনার অ্যাকাউন্ট নম্বর"
                : "Enter account number"
            }
          />
        </div>

        {/* Verification Code with Send Button */}
        <div className="lg:flex items-baseline gap-20 w-full">
          <label
            htmlFor="verificationCode"
            className="block w-[20%] lg:text-right text-sm font-semibold"
          >
            {language === "bn" ? "ভেরিফিকেশন কোড" : "Verification Code"} :
          </label>
          <div className="w-full flex items-baseline gap-2 mt-2">
            <div className="flex w-[60%] lg:w-auto flex-col">
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                className=" lg:w-full p-2 border border-opacity-80  rounded-md  border-black "
                placeholder={language === "bn" ? "কোড লিখুন" : "Enter code"}
              />

              <p className="text-textRed text-sm pt-2">
                {language === "bn" ? (
                  <>
                    *ভেরিফিকেশন কোডটি সংযুক্ত মোবাইল নম্বরে <br />
                    স্বয়ংক্রিয়ভাবে পাঠানো হবে
                  </>
                ) : (
                  <>
                    *Verification code will be <br />
                    automatically sent to <br /> the bound mobile number
                  </>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert("Code sent!")} // You can replace this with actual send logic
              className="bg-bgRed text-white px-6 py-2 rounded-full  transition-all"
            >
              {language === "bn" ? "সেন্ড করুন" : "Send"}
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className=" lg:flex hidden  items-center px-6 justify-center h-full  ">
          <div className="flex flex-col items-center">
            <img src={noBankImage} alt="" />
            <p>Empty Bank Account</p>
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

export default BankDetailsTab;
