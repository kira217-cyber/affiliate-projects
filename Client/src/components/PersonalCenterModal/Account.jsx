import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBalanceThunk,
  updateUsernameThunk,
} from "@/features/auth/authSlice";
import userImage from "../../assets/0.png";
import signInImage from "../../assets/signin.534111d5.png";
import { RiVipCrown2Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import AccountBalance from "./AccountBalance";
import levelBg from "../../assets/MyAccount (2).png";
import AccountProcess from "./AccountProcess";
import AccountPercentage from "./AccountPercentage";
import AccountDetails from "./AccountDetails";
import { AuthContext } from "@/Context/AuthContext";

const Account = ({
  language,
  formData,
  setFormData,
  handleInputChange,
  selectedItem,
  setSelectedItem,
  activeModal,
  setActiveModal,
  items,
  handleModalSwitch,
  handleSubmit,
}) => {
  const dispatch = useDispatch();
  const { balanceLoading, balanceError } = useSelector(
    (state) => state.auth
  );
  const { user, balance, refreshBalance } = useContext(AuthContext)
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "rohankh");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?._id) {
      dispatch(getBalanceThunk());
    }
  }, [dispatch, user]);

  const handleEditUsername = () => {
    setIsEditing(true);
  };

  const handleSaveUsername = async () => {
    if (!newUsername) {
      setError("Username is required");
      return;
    }
    try {
      await dispatch(
        updateUsernameThunk({ userId: user._id, name: newUsername })
      ).unwrap();
      setError(null);
      setIsEditing(false);
    } catch (err) {
      setError(err || "Failed to update username");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewUsername(user?.username || "rohankh");
    setError(null);
  };

  const reloadBalance = () => {
    if (user?._id) {
      dispatch(getBalanceThunk());
    }
  };

  const toggleBalanceVisibility = () => {
    setShowBalance((prev) => !prev);
  };

  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-2 p-6">
      <div className="bg-bgAccount py-2 rounded-xl shadow-md mt-6 h-[600px] bg-gradient-to-r from-red-100 via-yellow-100 to-blue-100">
        {/* TOP PROFILE CARD */}
        <div
          className="flex flex-row gap-3 bg-cover bg-center p-4 "
          style={{
            backgroundImage: `url(${levelBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <img
            src={userImage}
            alt=""
            className="w-20 h-20 rounded-full border-2 border-white"
          />

          <div className="text-black flex flex-col gap-2">
            {/* VIP Row */}
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-md">
                <RiVipCrown2Line className="text-yellow-300" />
                <p className="text-sm font-semibold">VIP0</p>
              </div>

              <img src={signInImage} alt="" className="w-6 h-6" />
            </div>

            {/* Username edit */}
            <div className="flex gap-2 text-black items-center">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="bg-[#002632] text-white px-4 py-1 rounded-xl outline-none"
                    placeholder="Enter username"
                  />
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveUsername}
                      className="text-sm bg-yellow-400 text-[#b64100] px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-sm bg-gray-400 text-black px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-medium text-black text-sm">
                    {user?.username || "rohankh"}
                  </p>
                  <FaRegEdit
                    className="cursor-pointer text-black"
                    onClick={handleEditUsername}
                  />
                </>
              )}
            </div>

            {/* Joined Date */}
            <div className="flex gap-1 items-center text-xs text-black text-opacity-70">
              <p>
                Joined{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toISOString().split("T")[0]
                  : "2025-04-05"}
              </p>
            </div>
          </div>
        </div>

        {/* BALANCE CARD */}
        <AccountBalance
          reloadBalance={reloadBalance}
          loading={balanceLoading}
          toggleBalanceVisibility={toggleBalanceVisibility}
          showBalance={showBalance}
          balance={balance}
          language={language}
        />

        {/* PROCESS LIST */}
        <AccountProcess />
      </div>

      <AccountPercentage />

      <AccountDetails
        language={language}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        items={items}
        handleModalSwitch={handleModalSwitch}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Account;
