import { useEffect, useRef, useState } from "react";
import RescueFundInformation from "./RescueFundInformation";


const RescueFundModal = () => {
    const [isOpen, setIsOpen] = useState(true); // Auto open
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      // only activate if screen width is small
      if (window.innerWidth < 1024) {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end items-end z-50 ">
        <div
          ref={modalRef}
          className="bg-white w-full  p-4 rounded-lg shadow-lg border border-gray-400"
        >
          <RescueFundInformation />
        </div>
      </div>
    );
};

export default RescueFundModal;