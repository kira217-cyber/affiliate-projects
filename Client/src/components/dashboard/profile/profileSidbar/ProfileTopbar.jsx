import { Link } from "react-router-dom";

const ProfileTopbar = ({ item, isActive, onClick }) => {
  return (
    <div>
      <Link to={item.route} onClick={onClick}>
        <div
          className={`py-2 px-5 text-base font-medium lg:text-lg whitespace-nowrap duration-300 rounded-full cursor-pointer 
            ${
              isActive
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:bg-slate-200 text-gray-700"
            }`}
        >
          {item.label}
        </div>
      </Link>
    </div>
  );
};

export default ProfileTopbar;
