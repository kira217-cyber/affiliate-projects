import { PiWarningCircleBold } from "react-icons/pi";

const LogoutTab = ({setIsOpenLogout,language}) => {
    return (
        <div
                  className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                  onClick={() => setIsOpenLogout(false)} // backdrop click => close
                >
                  <div
                    className="bg-informationBG text-white pt-6  rounded-lg shadow-lg text-center max-w-sm w-full"
                    onClick={(e) => e.stopPropagation()} 
                  >
                   <span className="flex items-center justify-center py-2">
  <PiWarningCircleBold className="text-4xl text-warnIcon"/>
</span>

                    <h2 className="text-lg font-semibold mb-4">
                      {language === "bn"
                        ? "আপনি কি লগআউট করতে চান?"
                        : "Are you sure you want to log out?"}
                    </h2>
                    <div className="flex  ">
                      <button
                        type="button"
                        className="px-4 w-full py-2 bg-logOutButton   "
                        onClick={() => setIsOpenLogout(null)}
                      >
                        {language === "bn" ? "বাতিল" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-yellow text-white  w-full "
                        onClick={() => {
                          // logout logic here
                          console.log("User confirmed logout");
                          
                        }}
                      >
                        {language === "bn" ? "নিশ্চিত করুন" : "Confirm"}
                      </button>
                    </div>
                  </div>
                </div>
    );
};

export default LogoutTab;