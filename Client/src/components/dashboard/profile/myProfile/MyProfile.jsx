import { useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const MyProfile = () => {
  // প্রোফাইল ডেটা
  const profileFields = [
    { id: 1, label: "ব্যবহারকারীর নাম", type: "text", placeholder: "" },
    { id: 2, label: "জন্ম তারিখ", type: "date", placeholder: "" },
    { id: 3, label: "পুরো নাম", type: "text", placeholder: "" },
    { id: 4, label: "মুদ্রা", type: "text", placeholder: "BDT" },
  ];

  const addressFields = [
    { id: 1, label: "বাড়ি / রাস্তা", type: "text", placeholder: "" },
    { id: 2, label: "শহর", type: "text", placeholder: "" },
    { id: 3, label: "থানা / উপজেলা", type: "text", placeholder: "" },
    { id: 4, label: "জেলা", type: "text", placeholder: "" },
    { id: 5, label: "পোস্ট কোড", type: "text", placeholder: "" },
  ];

  const contactFields = [
    { id: 1, label: "ইমেল ঠিকানা", type: "email", placeholder: "" },
    { id: 2, label: "প্রাইমারি নম্বর", type: "number", placeholder: "" },
  ];

  // পপআপ
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupFields, setPopupFields] = useState([]);

  // পপআপ ওপেন হ্যান্ডলার
  const handlePopupOpen = (type, fields) => {
    setPopupType(type);
    setPopupFields(fields);
    setIsPopupOpen(true);
  };

  // পপআপ ক্লোজ হ্যান্ডলার
  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setPopupType("");
    setPopupFields([]);
  };

  return (
    <div className="p-4 lg:p-6 bg-white rounded-lg">
      <form action="" className="space-y-4 w-full lg:w-[500px]">
        {/* প্রোফাইল তথ্য */}
        <div className="flex items-center gap-6">
          <h1 className="text-base font-semibold">আমার প্রোফাইল</h1>
          <Link onClick={() => handlePopupOpen("প্রোফাইল এডিট", profileFields)}>
            <FaEdit className="text-xl hover:text-blue-500 duration-300 cursor-pointer" />
          </Link>
        </div>
        {profileFields.map((field) => (
          <div key={field.id} className="flex flex-col space-y-2">
            <label className="text-sm" htmlFor={field.label}>
              {field.label}
            </label>
            <input
              type={field.type}
              className="py-1.5 px-4 rounded-lg border border-gray-300 outline-none"
              placeholder={field.placeholder}
            />
          </div>
        ))}

        {/* ঠিকানার তথ্য */}
        <div className="flex items-center gap-6 pt-4">
          <h1 className="text-base font-semibold">যোগাযোগের ঠিকানা</h1>
          <Link onClick={() => handlePopupOpen("ঠিকানা এডিট", addressFields)}>
            <FaEdit className="text-xl hover:text-blue-500 duration-300 cursor-pointer" />
          </Link>
        </div>
        {addressFields.map((field) => (
          <div key={field.id} className="flex flex-col space-y-2">
            <label className="text-sm" htmlFor={field.label}>
              {field.label}
            </label>
            <input
              type={field.type}
              className="py-1.5 px-4 rounded-lg border border-gray-300 outline-none"
              placeholder={field.placeholder}
            />
          </div>
        ))}

        {/* যোগাযোগের তথ্য */}
        <h1 className="text-base font-semibold pt-4">যোগাযোগের তথ্য</h1>
        {contactFields.map((field) => (
          <div key={field.id} className="flex flex-col space-y-2">
            <label className="text-sm" htmlFor={field.label}>
              {field.label}
            </label>
            <input
              type={field.type}
              className="py-1.5 px-4 rounded-lg border border-gray-300 outline-none"
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <button className="py-3 px-10 text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 duration-300 rounded-full border">
          সেকেন্ডারি নম্বর যোগ করুন
        </button>
      </form>

      <p className="text-right mt-6 hidden lg:block">
        আপনার গোপনীয়তা রক্ষা করতে, আপনার প্রোফাইলের বিবরণ পরিবর্তন করতে আমাদের
        গ্রাহক পরিষেবার সাথে যোগাযোগ করুন
      </p>

      {/* পপআপ */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4 relative">
            {/* হেডার */}
            <div className="flex justify-between items-center border-b-2 border-gray-300 pb-3">
              <h2 className="text-lg font-semibold">{popupType}</h2>
              <FaTimes
                className="text-xl cursor-pointer hover:text-yellow-400"
                onClick={handlePopupClose}
              />
            </div>
            {/* ইনপুট */}
            <form className="space-y-4">
              {popupFields.map((field) => (
                <div key={field.id} className="flex flex-col space-y-2">
                  <label className="text-sm" htmlFor={field.label}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    className="py-1.5 px-4 rounded-lg border border-gray-300 outline-none"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <button
                type="button"
                className="py-2 px-6 w-full text-base font-semibold bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg duration-300"
                onClick={handlePopupClose}
              >
                জমা দিন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
