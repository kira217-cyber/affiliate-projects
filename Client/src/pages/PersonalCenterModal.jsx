import { useNavigate } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import PersonalInformation from "@/components/PersonalCenterModal/PersonalInformation";

const PersonalCenterModal = ({ isOpen, onClose, tab, name }) => {
  console.log(isOpen, onClose, tab, name);

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-[9999]">
      <div className="w-full max-w-7xl rounded-lg shadow-lg relative">
        {/* Close Button */}
        <div className="hidden lg:flex">
          <button
            onClick={handleClose}
            className="absolute top-12 right-0 bg-yellow-500 p-1 rounded-full flex items-center justify-center"
          >
            <RxCross1 />
          </button>
        </div>

        <div className="lg:hidden ">
          <button
            onClick={handleClose}
            className="absolute top-2 left-2 text-white text-xl font-bold"
          >
            <FaArrowLeft />
          </button>
        </div>

        <PersonalInformation tab={tab} />
      </div>
    </div>
  );
};

export default PersonalCenterModal;
