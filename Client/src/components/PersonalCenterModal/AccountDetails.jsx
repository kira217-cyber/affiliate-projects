import { FaSignOutAlt } from "react-icons/fa";
import AccountDetailsModal from "./AccountDetailsModal";
import LogoutTab from "./LogoutTab";
import { useState } from "react";

const AccountDetails = ({
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
  const [isOpenLogout, setIsOpenLogout] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 bg-gradient-to-r from-cyan-400 to-blue-100 rounded-xl shadow p-5">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedItem(item);
              setActiveModal(item.action);
            }}
            className="flex items-start gap-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-all"
          >
            {/* ICON ROUND */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl 
              bg-gradient-to-br ${item.bgColor}`}
            >
              {item.icon}
            </div>

            {/* TEXTS */}
            <div className="flex flex-col flex-1">
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                {item.title}
                {item.status === "error" && (
                  <span className="text-red-500 text-lg">❗</span>
                )}
                {item.status === "success" && (
                  <span className="text-green-500 text-lg">✔</span>
                )}
              </p>

              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          </div>
        ))}

        {/* LOGOUT ITEM */}
        <div
          onClick={() => setIsOpenLogout(true)}
          className="flex items-start gap-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-all"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl bg-red-500">
            <FaSignOutAlt />
          </div>

          <div className="flex flex-col flex-1">
            <p className="font-semibold text-gray-900">
              {language === "bn" ? "লগআউট" : "Logout"}
            </p>

            <p className="text-sm text-gray-600">
              {language === "bn" ? "নিরাপদে লগআউট করুন।" : "Logout safely"}
            </p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50"
          onClick={() => setSelectedItem(null)}
        >
          <AccountDetailsModal
            items={items}
            handleModalSwitch={handleModalSwitch}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            handleSubmit={handleSubmit}
            activeModal={activeModal}
            language={language}
            formData={formData}
            handleInputChange={handleInputChange}
            setFormData={setFormData}
            setActiveModal={setActiveModal}
          />
        </div>
      )}

      {isOpenLogout && (
        <LogoutTab setIsOpenLogout={setIsOpenLogout} language={language} />
      )}
    </div>
  );
};

export default AccountDetails;
