import { RxCross1 } from "react-icons/rx";
import { FaChevronLeft } from "react-icons/fa";
// import { motion } from "framer-motion";

const ReferModal = ({ setIsReferOpen }) => {
  return (
    <div
      className="fixed  inset-0 z-50 flex justify-end bg-black bg-opacity-50  overflow-hidden"
      onClick={() => setIsReferOpen(false)}
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
              onClick={() => setIsReferOpen(false)}
              className="text-white text-sm rounded-full p-1 bg-red-600"
            >
              <RxCross1 />
            </button>
          </div>
          <h3 className="text-transparent">view</h3>
        </div>
        <div
          className=" w-full h-full bg-white shadow-lg"
          // initial={{ x: "100%" }}
          // animate={{ x: 0 }}
          // exit={{ x: "-100%" }}
          // transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex lg:hidden bg-informationBG lg:bg-transparent  justify-between items-center px-4 py-3 border-b">
            <span
              onClick={() => setIsReferOpen(false)}
              className="lg:hidden text-white"
            >
              <FaChevronLeft />
            </span>
            <h2 className="text-sm   px-2 w-full lg:w-4/5 lg:border-l-4 border-borderGreen text-white text-center lg:text-gray-800">
              Refer Friend
            </h2>
          </div>
          <div className="bg-white mx-auto p-6 rounded-lg w-[90%] max-w-md ">
            <h2 className="text-xl text-center font-bold mb-4">
              এখন বন্ধুদের উল্লেখ করুন!
            </h2>
            <p className="text-center ">আনলিমিটেড রেফার বোনাস উপভোগ করুন!🎁</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferModal;
