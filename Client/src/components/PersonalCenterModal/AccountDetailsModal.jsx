import { RxCross1 } from "react-icons/rx";
import { FaChevronLeft } from "react-icons/fa";

import NameTab from "./NameTab";
import PasswordTab from "./PasswordTab";
import BankDetailsTab from "./BankDetailsTab";
import EWalletDetailsTab from "./EWalletDetailsTab";
import TransactionPasswordTab from "./TransactionPasswordTab";
import MobileNumberTab from "./MobileNumberTab";

const AccountDetailsModal = ({
  items,
  handleModalSwitch,
  selectedItem,
  setSelectedItem,
  handleSubmit,
  activeModal,
  language,
  formData,
  setFormData,
  handleInputChange,
}) => {
  return (
    <div className="flex lg:w-auto w-full" onClick={(e) => e.stopPropagation()}>
      <div className="relative hidden lg:flex flex-col justify-center gap-4">
        {items?.map((item, index) => (
          <span
            key={index}
            className={`cursor-pointer bg-bgYellow p-2 rounded-full text-white text-2xl relative group ${
              activeModal === item.action ? "text-black" : ""
            }`}
            onClick={() => {
              handleModalSwitch(item.action);
              const selected = items.find((i) => i.action === item.action);
              if (selected) {
                setSelectedItem(selected);
              }
            }}
          >
            {item.icon}
            {/* Show title for active tab and on hover for other tabs */}
            {(activeModal === item.action || item.title) && (
              <span
                className={`absolute right-12 transform text-xs whitespace-nowrap text-white top-0 bg-accountDetailsTittleHover rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                  activeModal === item.action ? "opacity-100" : ""
                }`}
              >
                {item.title}
              </span>
            )}
          </span>
        ))}
        <div
          className="bg-white w-full p-2 absolute top-0 rounded-l-md"
          // style={{
          //   clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 66%)",
          // }}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="text-white text-sm rounded-full p-1 bg-red-600"
          >
            <RxCross1 />
          </button>
        </div>
      </div>

      {selectedItem && (
        <div
          className=" w-full bg-white shadow-lg"
          // initial={{ x: "100%" }}
          // animate={{ x: 0 }}
          // exit={{ x: "-100%" }}
          // transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex bg-informationBG lg:bg-transparent  justify-between items-center px-4 py-3 border-b">
            <span
              onClick={() => setSelectedItem(null)}
              className="lg:hidden text-white"
            >
              <FaChevronLeft />
            </span>
            <h2 className="text-sm px-2 w-4/5 border-l-4 border-borderGreen text-gray-800">
              {selectedItem.title}
            </h2>

            <div className="hidden lg:block">
              {activeModal === "registerBankAccount" && (
                <h2 className="text-sm whitespace-nowrap px-2 border-l-4 border-textRed text-gray-800">
                  Registered Withdrawal Accounts
                </h2>
              )}
              {activeModal === "bindEwallet" && (
                <h2 className="text-sm whitespace-nowrap px-2 border-l-4 border-textRed text-gray-800">
                  Registered E-wallet Accounts
                </h2>
              )}
            </div>
          </div>
          <div className="p-4 text-gray-700">
            {/* Render action-based form */}
            <form onSubmit={handleSubmit}>
              {activeModal === "changeName" && (
                <NameTab
                  language={language}
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              )}
              {activeModal === "changePassword" && <PasswordTab />}
              {activeModal === "registerBankAccount" && (
                <BankDetailsTab
                  language={language}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  setFormData={setFormData}
                />
              )}
              {activeModal === "bindEwallet" && (
                <EWalletDetailsTab
                  language={language}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  setFormData={setFormData}
                />
              )}
              {activeModal === "changeTransactionPassword" && (
                <TransactionPasswordTab
                  language={language}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  setFormData={setFormData}
                />
              )}
              {activeModal === "verifyPhone" && (
                <MobileNumberTab
                  language={language}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  setFormData={setFormData}
                />
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetailsModal;
