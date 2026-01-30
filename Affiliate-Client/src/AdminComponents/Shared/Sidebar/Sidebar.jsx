import React, { useContext, useState, useMemo } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { FaChevronDown, FaMicrophone } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { TbLogout } from "react-icons/tb";
import { AuthContext } from "../../../Context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);
  const location = useLocation();
  const { logout, user, refreshBalance, balance ,reloadUser} = useContext(AuthContext);

  const handleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
    setActiveSubDropdown(null);
  };

  const handleSubDropdown = (submenu) => {
    setActiveSubDropdown(activeSubDropdown === submenu ? null : submenu);
  };

  const navItems = [
    { name: "Dashboard", path: `/affiliate/dashboard` },
    { name: "My Downline", path: `/affiliate/my-downline` },
    { name: "My Account", path: `/affiliate/my-account` },
    { name: "My Report", path: `/affiliate/my-report` },
    { name: "Management", path: `/affiliate/management` },
    { name: "My Refer Link", path: `/affiliate/my-refer-link` },
    ...(user?.role === "super-affiliate"
      ? [{ name: "Add Withdraw Method", path: `/affiliate/withdraw` }]
      : []),
      ...(user?.role === "master-affiliate"
      ? [{ name: "Withdraw Balance", path: `/affiliate/withdraw` }]
      : []),
      ...(user?.role === "super-affiliate"
      ? [{ name: "Withdraw Balance", path: `/affiliate/super-withdraw` }]
      : []),
    { name: "Profile", path: `/affiliate/profile` },
    { name: "Transaction History", path: `/affiliate/transaction-history` },
    ...(user?.role === "super-affiliate"
      ? [{ name: "Withdraw Request", path: `/affiliate/withdraw-request` }]
      : []),
    ...(user?.role === "super-affiliate"
      ? [{ name: "Banking", path: `/affiliate/banking` }]
      : []),
       ...(user?.role === "super-affiliate"
      ? [{ name: "Withdraw History", path: `/affiliate/withdraw-history` }]
      : []),
  ];

  const activeNavItemName = useMemo(() => {
    const currentPath = location.pathname;
    const allNavItems = navItems.flatMap((item) =>
      item.dropdown
        ? item.dropdown.map((drop) => ({ name: drop.name, path: drop.path }))
        : [{ name: item.name, path: item.path }]
    );
    const activeItem = allNavItems.find((item) =>
      currentPath.startsWith(item.path)
    );
    return activeItem ? activeItem.name : "Downline List";
  }, [location.pathname, navItems]);

  // ✅ এখানে hook এর আগে return করা হয়নি
  return (
    <div className="flex h-screen">
      <aside className="bg-black w-72 text-white fixed h-full transition-all duration-300 overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-gray-700">
          <h1 className="text-xl font-bold text-primary">Affiliate</h1>
        </div>

        {/* 🛡️ এখানে conditional render */}
        {!user ? (
          <p className="text-center py-10 text-gray-400 text-sm">
            Loading user...
          </p>
        ) : (
          <nav className="mt-1">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-3 border-b border-gray-700 text-[12px] ${
                    isActive ? "bg-primary/80" : "hover:bg-gray-700"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        )}

        <button
          onClick={() => logout()}
          className="w-full text-left px-4 py-4 text-[12px] cursor-pointer hover:bg-primary/80 flex items-center gap-4"
        >
          Logout <TbLogout size={18} />
        </button>
      </aside>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "ml-72" : "ml-0"
        }`}
      >
        <header className="bg-primary/80 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl">
              {user?.role === "super-affiliate"
                ? "SUPER-AFFILIATE"
                : user?.role === "master-affiliate"
                ? "MASTER-AFFILIATE"
                : "UNAUTHORIZED"}
            </h1>
          </div>
          <div className="px-4 py-1 rounded text-sm flex items-center gap-2">
            {" "}
            <div className="flex items-center justify-center gap-2">
              {" "}
              <span className="text-yellow-400 py-1 px-2 bg-gray-700 text-[12px] font-bold">
                {" "}
                WL{" "}
              </span>{" "}
              <span className="font-bold">{user?.username}</span>{" "}
            </div>{" "}
            <div className="flex items-center justify-center gap-2">
              {" "}
              <span className="font-bold py-1 px-2 bg-gray-700 text-[12px]">
                {" "}
                Main{" "}
              </span>{" "}
              <span className="">{balance}</span>{" "}
            </div>{" "}
            <button
              onClick={reloadUser}
              className="flex items-center justify-center gap-2 hover:cursor-pointer"
            >
              {" "}
              <span className="font-bold py-2 px-4 bg-gray-700 text-[12px]">
                {" "}
                <TfiReload size={20} />{" "}
              </span>{" "}
            </button>{" "}
          </div>
        </header>

        <div className="bg-[#1f2937] p-2 flex items-center gap-2">
          <FaMicrophone className="text-white" />
          <p className="text-white text-sm">News</p>
        </div>

        <div className="mt-4 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
