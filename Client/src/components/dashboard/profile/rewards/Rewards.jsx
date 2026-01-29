import { FaStarOfDavid } from "react-icons/fa";
import { IoGiftOutline } from "react-icons/io5";
import { RiClapperboardLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { BsSafe2Fill } from "react-icons/bs";
import { useState } from "react";

const links = [
  {
    id: 1,
    text: "রিওয়ার্ড স্টোর",
    icon: <IoGiftOutline />,
    url: "/reward-store",
  },
  {
    id: 2,
    text: "অফার স্টোর",
    icon: <RiClapperboardLine />,
    url: "/offer-store",
  },
  { id: 3, text: "গিফট স্টোর", icon: <BsSafe2Fill />, url: "/gift-store" },
];

const Rewards = () => {
  // Options data
  const options = [
    { id: 1, label: "শীর্ষ রিডিম" },
    { id: 2, label: "ইলেকট্রনিক্স" },
    { id: 3, label: "হোম এন্ড লিভিং" },
    { id: 4, label: "আনুষঙ্গিক উপকরণ" },
    {
      id: 5,
      label: "তথ্য পরিকল্পনা",
    },
  ];
  // State for selected option
  const [selectedOption, setSelectedOption] = useState("");
  // Handle change
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    console.log("Selected Option:", event.target.value);
  };

  const items = [
    {
      id: 1,
      image: "https://jiliwin.9terawolf.com/cms/h8/image/677b8e1dc0c65.jpg",
      amount: 10,
      description: "Mobile Recharge ৳1,000",
      badge: "https://www.babu88h.com/static/svg/game-icon-hot.svg",
    },
    {
      id: 2,
      image: "https://jiliwin.9terawolf.com/cms/h8/image/66bee0298879f.jpg",
      amount: 2000,
      description: "Mobile Recharge ৳2,000",
      badge: "https://www.babu88h.com/static/svg/game-icon-hot.svg",
    },
    {
      id: 3,
      image: "https://jiliwin.9terawolf.com/cms/h8/image/66bee0a454915.jpg",
      amount: 500,
      description: "Mobile Recharge ৳3,000",
      badge: "https://www.babu88h.com/static/svg/game-icon-hot.svg",
    },
    {
      id: 3,
      image: "https://jiliwin.9terawolf.com/cms/h8/image/66bedfa2715bc.jpg",
      amount: 500,
      description: "Mobile Recharge ৳5,000",
      badge: "https://www.babu88h.com/static/svg/game-icon-hot.svg",
    },
    {
      id: 3,
      image: "https://jiliwin.9terawolf.com/cms/h8/image/66bdc35a943bb.jpg",
      amount: 500,
      description: "Samsung 75 inch Neo QLED 8K Smart TV",
      badge: "https://www.babu88h.com/static/svg/game-icon-hot.svg",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="p-4 lg:p-6 bg-white rounded-lg space-y-4">
        <div className="relative hidden md:block">
          <img
            className="w-full h-40 object-cover rounded-xl"
            src="https://www.babu88h.com/static/image/referral/reward_banner_desktop.jpg"
            alt=""
          />
          <div className="absolute top-2 left-3 text-white w-[90%] md:w-[60%]">
            <h2 className="text-2xl font-semibold">Rewards</h2>
            <p className="text-sm">
              প্রতিবার জমা করার সময় পুরস্কারের কয়েন সংগ্রহ করুন! আপনি
              রিওয়ার্ড স্টোর থেকে আশ্চর্যজনক পুরষ্কার রিডিম বা আপনার ভাগ্য ধরার
              চেষ্টা করতে পারেন এবং জ্যাকপট পুরস্কার জেতার সুযোগের জন্য ভাগ্যের
              চাকা ঘুরাতে পারেন!
            </p>
          </div>
        </div>

        <form
          action=""
          className="flex flex-wrap gap-2 justify-between items-center"
        >
          <div className="flex items-center">
            <div className="text-2xl py-2 px-4 text-black bg-yellow-300 border border-gray-300 rounded-l-lg">
              <FaStarOfDavid />
            </div>

            <input
              type="text"
              className="w-full md:w-52 py-2 px-4 border border-gray-300 outline-none rounded-r-lg"
              placeholder="0"
            />
          </div>
          <p className="text-base text-blue-500 cursor-pointer">
            পুরস্কারের ইতিহাস {">"}
          </p>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {links.map((link) => (
            <Link key={link.id} href={link.url}>
              <div className="py-1.5 px-4 flex items-center gap-2 bg-gray-100 hover:bg-yellow-300 duration-300 rounded-full">
                {link.icon}
                <p>{link.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="sm:flex gap-2 items-center mt-4">
        <p className="text-base text-gray-600">ক্রমানুসার :</p>
        <div className="space-y-4 text-sm w-full sm:w-72">
          <select
            id="options"
            value={selectedOption}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-none"
          >
            <option value="">All</option>
            {options.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col justify-between px-3 pb-3 bg-white rounded-md space-y-2"
          >
            <div>
              <div className="px-4">
                <img src={item.image} alt={`Item ${item.id}`} />
              </div>
              <h2 className="text-xl font-semibold text-blue-500">
                {item.amount}
              </h2>
              <p className="text-xs text-gray-600 uppercase">
                {item.description}
              </p>
            </div>
            <button className="py-2 px-4 w-full text-sm font-bold text-black bg-yellow-300 rounded-lg">
              দাবি করুন
            </button>
            <img
              className="absolute -top-2 left-0 w-7 h-7"
              src={item.badge}
              alt="badge"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
