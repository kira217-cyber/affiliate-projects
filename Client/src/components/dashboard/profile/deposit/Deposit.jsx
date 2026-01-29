import { FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import RightItem from "./RightItem";
import walletNumber from "../../../../assets/walletNumber.png";

const Deposit = () => {
  // Options data
  const options = [
    { id: 1, label: "স্পোর্টস 100% প্রথম ডিপোজিট বোনাস - 100.00%" },
    { id: 2, label: "100% স্লট প্রথম ডিপোজিট বোনাস - 100.00%" },
    { id: 3, label: "ক্র্যাশ গেম 50% প্রথম ডিপোজিট বোনাস - 50.00%" },
    { id: 4, label: "50% লাইভ ক্যাসিনো প্রথম আমানত বোনাস - 50.00%" },
    {
      id: 5,
      label: "সক্রিয় জুয়া খেলার ঘর থেকে সাপ্তাহিক ২০% আমানত বোনাস - 20.00%",
    },
    { id: 6, label: "সাপ্তাহিক স্লট ২০% আমানত বোনাস - 20.00%" },
    { id: 7, label: "আনলিমিটেড 5% রিলোড বোনাস (স্লট) - 5.00%" },
    { id: 8, label: "আনলিমিটেড 5% রিলোড বোনাস (ক্র্যাশ) - 3.00%" },
  ];

  const [selectedOption, setSelectedOption] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  return (
    <div className="flex gap-4">
      <div className="w-full p-3 sm:p-4 lg:p-6 bg-white rounded-lg space-y-4">
        <h1 className="text-lg font-semibold hidden md:block">আমানত</h1>
        <div className="grid grid-cols-2 bg-gray-700 rounded-t-xl md:hidden">
          <Link to={"/profile/deposit"}>
            <div className="w-full p-2 text-yellow-300 text-center border-b-4 border-yellow-400">
              আমানত
            </div>
          </Link>
          <Link to={"/profile/withdrawal"}>
            <div className="w-full p-2 text-yellow-300 text-center">
              উত্তোলন
            </div>
          </Link>
        </div>

        <div className="space-y-2">
          <h2 className="text-base">
            আমানত বিকল্প <span className="text-red-500">*</span>
          </h2>
          <div className="flex gap-4">
            <Link className="relative">
              <div className="p-4 px-4 w-full sm:w-24 h-16 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-2xl border-2 border-yellow-400">
                <img
                  src="https://www.babu88h.com/static/svg/deposit-ewallet-nagad.svg"
                  alt=""
                />
              </div>
              <div className="p-1 absolute -top-1 -right-1 flex justify-center items-center text-[9px] text-white bg-blue-500 rounded-full">
                +3%
              </div>
            </Link>
            <Link className="relative">
              <div className="p-4 w-full sm:w-24 h-16 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-2xl border-2 border-gray-300">
                <img
                  src="https://www.babu88h.com/static/svg/deposit-ewallet-bkash.svg"
                  alt=""
                />
              </div>
              <div className="p-1 absolute -top-1 -right-1 flex justify-center items-center text-[9px] text-white bg-blue-500 rounded-full">
                +3%
              </div>
            </Link>
            <Link className="relative">
              <div className="p-4 w-20 sm:w-24 h-16 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-2xl border-2 border-gray-300">
                <img
                  src="https://www.babu88h.com/static/svg/deposit-ewallet-upay.svg"
                  alt=""
                />
              </div>
              <div className="p-1 absolute -top-1 -right-1 flex justify-center items-center text-[9px] text-white bg-blue-500 rounded-full">
                +3%
              </div>
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-base">
            আমানত চ্যানেল <span className="text-red-500">*</span>
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Link>
              <div className="py-1.5 px-4 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-lg border-2 border-yellow-400">
                SPEEDPAY
              </div>
            </Link>
            <Link>
              <div className="py-1.5 px-4 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-lg border-2 border-gray-400">
                PAYTAKA
              </div>
            </Link>
            <Link>
              <div className="py-1.5 px-4 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-lg border-2 border-gray-400">
                DPAY
              </div>
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 justify-between w-full sm:w-80">
            <h2 className="text-base">
              আমানত পরিমাণ <span className="text-red-500">*</span>
            </h2>
            <FaQuestionCircle />
          </div>
          <form action="">
            <input
              type="text"
              className="w-full sm:w-80 py-1.5 px-4 border-2 border-gray-300 outline-none rounded-xl"
              placeholder="200"
            />
          </form>
          <p className="text-xs font-mibold">
            ৳ 400.00 এর নিচে ডিপজিটে কোন বোনাস পাবেন না
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Link>
              <div className="py-1.5 px-4 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-lg border-2 border-yellow-400">
                200
              </div>
            </Link>
            <Link className="relative">
              <div className="py-1.5 px-4 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-lg bg-gray-200">
                500
              </div>
              <div className="p-1 absolute -top-1 -right-1 flex justify-center items-center text-[9px] text-white bg-blue-500 rounded-full">
                +3%
              </div>
            </Link>
            <Link className="relative">
              <div className="py-1.5 px-4 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-lg bg-gray-200">
                2000
              </div>
              <div className="p-1 absolute -top-1 -right-1 flex justify-center items-center text-[9px] text-white bg-blue-500 rounded-full">
                +3%
              </div>
            </Link>
            <Link className="relative">
              <div className="py-1.5 px-4 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-lg bg-gray-200">
                5000
              </div>
              <div className="p-1 absolute -top-1 -right-1 flex justify-center items-center text-[9px] text-white bg-blue-500 rounded-full">
                +3%
              </div>
            </Link>
            <Link className="relative">
              <div className="py-1.5 px-4 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-lg bg-gray-200">
                10000
              </div>
              <div className="p-1 absolute -top-1 -right-1 flex justify-center items-center text-[9px] text-white bg-blue-500 rounded-full">
                +3%
              </div>
            </Link>
            <Link className="relative">
              <div className="py-1.5 px-4 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-lg bg-gray-200">
                20000
              </div>
              <div className="p-1 absolute -top-1 -right-1 flex justify-center items-center text-[9px] text-white bg-blue-500 rounded-full">
                +3%
              </div>
            </Link>
          </div>
          <h2 className="text-base">
            আমানত বিকল্প <span className="text-red-500">*</span>
          </h2>
          <div className="space-y-4 w-full sm:w-80">
            <select
              id="options"
              value={selectedOption}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">নো বোনাস সিলেক্ট করুন</option>
              {options.map((option) => (
                <option key={option.id} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={openModal}
            className="py-3 px-10 w-full sm:w-80 text-sm text-white bg-blue-500 hover:bg-blue-600 duration-300 rounded-full border"
          >
            আমানত
          </button>
        </div>
      </div>
      <RightItem />

      {/* Modal */}
      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white px-4 py-6 md:p-6 rounded-lg shadow-lg w-[90%] md:w-[80%] lg:w-[60%] xl:w-[54%] relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="flex gap-2 items-center pb-4 text-xl font-bold border-b-2 border-gray-300">
              <img
                className="w-12 h-12"
                src="https://ialb.pg23bkk12123.com/images/thirdparty/bankType_2048.png"
                alt=""
              />
              <p>bKash Payment</p>
            </div>

            <div className="xl:flex justify-between items-center gap-2 py-2 text-2xl xl:text-base text-gray-500 border-b-2 border-gray-300">
              <p>Transaction ID: D735617982</p>
              <p>Transaction Create Time: 2025/01/29 13:38:04 (GMT+6)</p>
            </div>

            <div className="text-base text-gray-500 text-center m-auto w-full lg:w-[80%]">
              <p className="mt-4">
                Please ensure amount to deposit is the same as transferred
                amount. We will not be liable for missing funds due to incorrect
                information.
              </p>

              <p>
                Please use phone number registered on our site for cash out,
                deposits with 3rd party phone numbers are restricted.
              </p>

              <p className="font-semibold border-b-2 border-gray-300">
                Please cash out to the account below within 06 :
              </p>
              <p className="font-semibold">
                minutes after submitting the deposit form
              </p>
            </div>

            <div className="w-full xl:w-[86%] m-auto mt-5 flex justify-evenly items-center flex-col xl:flex-row gap-3 p-4 pb-6 bg-gray-200 rounded-xl">
              <img className="w-60 h-60" src={walletNumber} alt="" />
              <div className="w-full xl:w-[50%]">
                <p className="text-4xl text-center text-red-500">1886999229</p>
                <p className="text-lg text-center">
                  Amount :{" "}
                  <span className="text-red-500 font-bold">2000.00</span>
                </p>
                <label htmlFor="" className="text-red-500 mt-3">
                  Phone Number / Cash Out No.
                </label>

                <div className="flex flex-col xl:flex-row gap-2 mb-2">
                  <div className="w-full xl:w-1/2">
                    <select
                      id="options"
                      value={selectedOption}
                      onChange={handleChange}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                    >
                      <option value=""></option>
                      {options.map((option) => (
                        <option key={option.id} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <input
                      type="text"
                      className="w-full py-1.5 px-3 outline-none rounded-sm uppercase"
                      placeholder="Please input data"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="" className="text-black mb-2">
                    Upload receipt{" "}
                    <button className="px-1 border border-red-500 text-red-500 rounded-md">
                      Reset Receipt
                    </button>
                  </label>
                  <input
                    type="file"
                    className="py-1 px-2 bg-white rounded-sm"
                  />
                </div>

                <p className="pt-10 pb-4 text-2xl font-semibold text-center">
                  Drop file here
                </p>

                <div className="w-full sm:w-60 m-auto">
                  <button
                    onClick={closeModal}
                    className="mt-6 w-full p-2 text-base font-semibold bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;
