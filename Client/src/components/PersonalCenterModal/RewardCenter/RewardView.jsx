import { useContext, useState } from "react";
import { LanguageContext } from "../../../Context/LanguageContext";
import { GrTask } from "react-icons/gr";
import { AiFillFund } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
// import { motion } from "framer-motion";
import { FaChevronLeft } from "react-icons/fa";
import SignInTask from "./SignInTask/SignInTask";
import Fund from "./RescueFund/Fund";
import giftIconImage from "../../../assets/gift_icon.f6429730.png";
import giftBgImage from "../../../assets/gift_bg.e5aebbb5.png";
import taskIconImage from "../../../assets/task_icon.7b721102.png";
import taskBgImage from "../../../assets/task_bg.3fa1608c.png";
import moneyIconImage from "../../../assets/money_icon.578db6fe.png";
import moneyBgImage from "../../../assets/money_bg.31139bae.png";
import inviteIconImage from "../../../assets/invite_icon.bad8d6b3.png";
import inviteBgImage from "../../../assets/invite_bg.8cef5c32.png";
import Claim from "./Claim/Claim";
import { Link } from "react-router-dom";
import Invite from "../InviteFriends/Invite";
import { AuthContext } from "@/Context/AuthContext";

const RewardView = () => {
  const { language } = useContext(AuthContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const items = [
    {
      icon: <GrTask />,
      imageIcon: giftIconImage,
      imageBg: giftBgImage,
      title: language === "bn" ? "দাবি করা" : "Claim",
      text:
        language === "bn"
          ? "একটি টাস্ক প্রক্রিয়াধীন রয়েছে।"
          : "A task is in progress",
      action: "Claim",
      button: language === "bn" ? "দেখুন" : "View",
    },
    {
      icon: <GrTask />,
      imageIcon: taskIconImage,
      imageBg: taskBgImage,
      title: language === "bn" ? "সাইন ইন " : "Sign In ",
      text:
        language === "bn"
          ? "একটি টাস্ক প্রক্রিয়াধীন রয়েছে।"
          : "A task is in progress",
      action: "SignIn",
      button: language === "bn" ? "দেখুন" : "View",
    },
    {
      icon: <AiFillFund />,
      imageIcon: moneyIconImage,
      imageBg: moneyBgImage,
      title: language === "bn" ? "উদ্ধার তহবিল" : "Rescue part",
      text: language === "bn" ? "পুনর্জীবনের জন্য সহায়তা।" : "Help to reborn",
      action: "RescueFund",
      button: language === "bn" ? "দেখুন" : "View",
    },
    {
      icon: <AiFillFund />,
      imageIcon: inviteIconImage,
      imageBg: inviteBgImage,
      title: language === "bn" ? "বন্ধুদের আমন্ত্রণ জানান" : "Invite Friend",
      text: language === "bn" ? "পুনর্জীবনের জন্য সহায়তা।" : "Help to reborn",
      action: "Invite",
      button: language === "bn" ? "দেখুন" : "View",
    },
  ];

  return (
    <div className="">
      <div className="hidden lg:block">
        {items
          .filter((_, index) => index === 1 || index === 2)
          .map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 cursor-pointer  p-2 rounded"
            >
              <span className="text-3xl text-white bg-bgYellow rounded-full p-2 ">
                {item.icon}
              </span>
              <div className="flex flex-col w-[40%]">
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setActiveModal(item.action);
                }}
                className="bg-white text-black hover:text-opacity-50 hover:bg-blue-50 px-4 rounded-full"
              >
                {item.button}
              </button>
            </div>
          ))}
      </div>

      <div className="lg:hidden grid grid-cols-2 gap-2 px-2">
        {items.map((item, index) => (
          <div
            className="relative"
            key={index}
            onClick={() => {
              setSelectedItem(item);
              setActiveModal(item.action);
            }}
          >
            <img src={item.imageBg} alt="" className="w-full" />
            <div className="absolute -translate-x-1/2 w-full -translate-y-1/2 top-1/2 left-1/2 flex flex-col items-center gap-2">
              <div className="bg-white rounded-full md:w-20 md:h-20   w-10 h-10 flex items-center justify-center">
                <img
                  src={item.imageIcon}
                  alt=""
                  className="md:w-[60%] w-[50%]"
                />
              </div>

              <p className="text-xs md:text-base text-white">{item.title}</p>
            </div>
          </div>
        ))}
        <img src="" alt="" />
      </div>

      {/* Modal */}

      {selectedItem && (
        <div
          className={`fixed  inset-0 z-50 flex justify-end bg-black bg-opacity-50  overflow-hidden`}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="flex lg:w-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative hidden lg:flex flex-col justify-center gap-4">
              <div
                className="bg-white w-full p-2 absolute top-0"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 66%)",
                }}
              >
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-white text-sm rounded-full p-1 bg-red-600"
                >
                  <RxCross1 />
                </button>
              </div>
              <h3>view</h3>
            </div>

            {selectedItem && (
              <div
                className=" w-full h-full bg-white shadow-lg"
                // initial={{ x: "100%" }}
                // animate={{ x: 0 }}
                // exit={{ x: "-100%" }}
                // transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex lg:hidden bg-informationBG lg:bg-transparent  justify-between items-center px-4 py-3 border-b">
                  <span
                    onClick={() => setSelectedItem(null)}
                    className="lg:hidden text-white"
                  >
                    <FaChevronLeft />
                  </span>
                  <h2 className="text-sm   px-2 w-full lg:w-4/5 lg:border-l-4 border-borderGreen text-white text-center lg:text-gray-800">
                    {selectedItem.title}
                  </h2>
                </div>
                <div className=" min-h-screen text-gray-700">
                  {/* Render action-based form */}
                  <div>
                    {activeModal === "Claim" && (
                      <div>
                        <Claim />
                      </div>
                    )}
                    {activeModal === "SignIn" && (
                      <div>
                        <SignInTask />
                      </div>
                    )}
                    {activeModal === "RescueFund" && (
                      <div>
                        <Fund />
                      </div>
                    )}
                    {activeModal === "Invite" && (
                      <Link to="/information#tab7">
                        <div>
                          <Invite />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardView;
