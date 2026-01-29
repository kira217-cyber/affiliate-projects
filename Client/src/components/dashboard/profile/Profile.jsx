import { useState } from "react";
import ProfileSidbar from "./profileSidbar/ProfileSidbar";
import ProfileTopbar from "./profileSidbar/ProfileTopbar";
import { Outlet } from "react-router-dom";

const topbarData = [
  { label: "আমানত", route: "/profile/deposit" },
  { label: "উত্তোলন", route: "/profile/withdrawal" },
  { label: "ভাউচার", route: "/profile/voucher" },
  { label: "বাজি ইতিহাস", route: "" },
  { label: "ইতিহাস", route: "" },
  { label: "টার্নওভার ইতিহাস", route: "" },
  { label: "আমার প্রোফাইল", route: "" },
  { label: "ব্যাংক বিবরণ", route: "" },
  { label: "গোপন নম্বর", route: "" },
  { label: "ইনবক্স", route: "/profile/inbox" },
  { label: "সুপারিশ", route: "" },
  { label: "বেটিং পাস", route: "" },
  { label: "হুইল অফ ফরচুন", route: "" },
  { label: "পুরস্কার", route: "/profile/rewards" },
];

const Profile = () => {
  const [active, setActive] = useState("আমার প্রোফাইল");

  return (
    <div className="bg-gray-200">
      <div className="container mx-auto px-4 py-2">
        {/* Topbar */}
        <div className="md:flex gap-2 flex-wrap p-4 my-4 bg-white rounded-lg hidden">
          {topbarData.map((item, index) => (
            <ProfileTopbar
              key={index}
              item={item}
              isActive={active === item}
              onClick={() => setActive(item)}
            />
          ))}
        </div>

        {/* Content Section */}
        <div className="flex gap-4">
          {/* Sidebar */}
          <div className="w-[24%] rounded hidden lg:block">
            <ProfileSidbar />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-[76%] rounded">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
