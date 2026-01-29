import { useContext, useState } from "react";
import { LanguageContext } from "../../../Context/LanguageContext";
import MessageEditImage from "../../../assets/MessageEdit (9).png";
import deleteImage from "../../../assets/messageDelete.png";
import { FaChevronUp } from "react-icons/fa";
import { AuthContext } from "@/Context/AuthContext";

const Message = () => {
  const { language } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("inbox");
  const [isRotated, setIsRotated] = useState(false);

  const handleToggle = () => {
    setIsRotated(!isRotated);
  };

  const inboxData = [
    { id: 1, title: language === "bn" ? "ইনবক্স বার্তা ১" : "Inbox Message 1" },
    { id: 2, title: language === "bn" ? "ইনবক্স বার্তা ২" : "Inbox Message 2" },
  ];
  const outboxData = [
    { id: 3, title: language === "bn" ? "আউটবক্স বার্তা A" : "Outbox Message A" },
    { id: 4, title: language === "bn" ? "আউটবক্স বার্তা B" : "Outbox Message B" },
  ];

  const dataToShow = activeTab === "inbox" ? inboxData : outboxData;

  return (
    <div className="lg:p-4 lg:flex min-h-screen md:min-h-0">
      <div className="">
        <div className="lg:flex border-b items-center">
          <div className="lg:flex hidden gap-4 items-center">
            <img
              src={MessageEditImage}
              alt=""
              className="w-[10%] bg-gray-400 p-1 rounded-full"
            />
            {language === "bn" ? "বার্তা লিখুন" : "Compose Message"}
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center lg:justify-normal gap-4 text-xs lg:text-base ">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`px-4 py-2 w-full lg:w-auto ${
                activeTab === "inbox"
                  ? "border-b-2 border-textRed text-textRed"
                  : ""
              }`}
            >
              {language === "bn" ? "ইনবক্স" : "Inbox"}
            </button>
            <button
              onClick={() => setActiveTab("outbox")}
              className={`px-4 py-2 w-full lg:w-auto ${
                activeTab === "outbox"
                  ? "border-b-2 border-textRed text-textRed"
                  : ""
              }`}
            >
              {language === "bn" ? "আউটবক্স" : "Outbox"}
            </button>
          </div>
        </div>

        <div className="bg-gray-100">
          {/* Common Header */}
          <div className="lg:flex hidden my-2 justify-between items-center p-2 rounded">
            <div className="flex gap-4">
              <input type="checkbox" className="w-5 h-5" />
              <p>{language === "bn" ? "সব সিলেক্ট করুন" : "All select"}</p>
            </div>
            <div>
              <img
                src={deleteImage}
                alt="Delete"
                className="hover:bg-bgRed p-1 rounded-full w-6 h-6"
              />
            </div>
            <div className="flex items-center text-sm gap-3">
              <p>{language === "bn" ? "সময় অনুযায়ী সাজান" : "Sort by time"}</p>
              <FaChevronUp
                onClick={handleToggle}
                className={`w-5 h-5 hover:text-red-500 rounded-full p-1 text-white bg-gray-500 transition-transform duration-300 cursor-pointer ${
                  isRotated ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {/* Dynamic Data */}
          <div className="mt-4 space-y-2 lg:px-0 px-4">
            {dataToShow.map((item) => (
              <div
                key={item.id}
                className="border p-3 rounded shadow hover:bg-gray-50"
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
