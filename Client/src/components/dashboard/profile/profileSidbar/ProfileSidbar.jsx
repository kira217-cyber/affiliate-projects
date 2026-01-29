import { CiShare2, CiUser } from "react-icons/ci";

const ProfileSidbar = () => {
  return (
    <div className="p-4 bg-white rounded-lg space-y-2">
      <p className="text-lg font-semibold">স্বাগতম!</p>
      <div className="flex gap-2 items-center p-3 bg-slate-100 rounded-lg">
        <div className="p-2 bg-white rounded-full">
          <CiUser />
        </div>
        <p className="text-base font-semibold text-blue-600">vismo</p>
      </div>

      <div className="p-3 bg-slate-100 space-y-2 rounded-lg">
        <div className="flex justify-between gap-2 items-center">
          <div className="p-2 bg-white rounded-full">
            <CiUser />
          </div>
          <div className="flex gap-1">
            <p className="text-base text-black">বেটিং পাস</p>
            <span className="text-base text-blue-600">স্তর</span>
          </div>
        </div>
        <div className="bg-slate-300 border border-slate-300 w-full h-1"></div>
        <p className="text-base font-semibold text-blue-600">0/800.00</p>
      </div>

      <div className="p-3 bg-slate-100 space-y-2 rounded-lg">
        <div className="flex justify-between gap-2 items-center">
          <div className="">
            <img
              className="w-8"
              src="https://www.babu88h.com/static/image/viptier/bronze.png"
              alt=""
            />
          </div>
          <div className="flex gap-1">
            <p className="text-base text-black">VIP</p>
            <span className="text-base text-blue-600">MEMBER</span>
          </div>
        </div>
        <div className="bg-slate-300 border border-slate-300 w-full h-1"></div>
        <p className="text-base font-semibold text-blue-600">0/60000</p>
      </div>

      <div className="p-3 bg-slate-100 rounded-lg">
        <p className="text-base font-semibold text-gray-500">
          পুরস্কারের কয়েন
        </p>
        <p className="text-base font-semibold text-blue-600">0</p>
        <button className="mt-3 py-3 px-4 w-full text-xs font-bold bg-yellow-500 hover:bg-yellow-400 duration-300 rounded-full">
          পুরস্কার-এ যান
        </button>
      </div>

      <div className="p-3 bg-slate-100 rounded-lg">
        <p className="text-base font-semibold text-gray-500">রেফারেল ওয়ালেট</p>
        <p className="text-base font-semibold text-blue-600">৳ 0.00</p>
        <button className="mt-3 py-3 px-4 w-full text-xs font-bold bg-yellow-500 hover:bg-yellow-400 duration-300 rounded-full">
          রিডিম
        </button>
        <p className="mt-2 text-sm text-gray-600">
          আপনার রেফারেল কোড ব্যবহার করে সাইন আপ করার জন্য আপনার বন্ধুদের
          আমন্ত্রণ জানিয়ে আমাদের একচেটিয়া রেফারেল প্রোগ্রামের সাথে অতিরিক্ত
          নগদ উপার্জন করুন
        </p>
        <p className="mt-6 py-2 px-3 w-full text-base font-bold text-gray-500 bg-slate-300 duration-300 rounded-lg">
          GMJ5EX1342
        </p>
        <button className="flex items-center justify-center mt-3 py-2 px-4 w-full text-white bg-blue-500 hover:bg-blue-600 duration-300 rounded-full">
          <CiShare2 size={25} />
        </button>
      </div>
    </div>
  );
};

export default ProfileSidbar;
