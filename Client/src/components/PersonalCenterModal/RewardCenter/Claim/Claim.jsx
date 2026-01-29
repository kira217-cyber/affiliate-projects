import userImage from "../../../../assets/0.png";
import claimImage from "../../../../assets/claim-bg.5d092411.jpg";

const Claim = () => {
  return (
    <div className="">
      <div className="relative">
        <img src={claimImage} alt="" className="w-full md:h-[200px]" />
        <div className="flex items-center gap-2 absolute rounded-md lg:bottom-0 top-4 left-1/2 lg:left-0  lg:-translate-x-0  -translate-x-1/2 w-[80%] lg:w-auto   lg:static ">
          <img src={userImage} alt="User" className="w-16 h-16 rounded-full" />
          <div className="flex flex-col lg:leading-normal leading-tight">
            {/* Username & Edit */}

            <div className="flex flex-col   items-center text-white font-semibold  lg:text-white bg-opacity-80  ">
              <p className="font-medium">rohankh</p>
              <p>৳ 0.00</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-10">
      
      <p className="text-[#ccc] text-lg ">এখনও কোনও প্রচার নেই</p>
        
      </div>
    </div>
  );
};

export default Claim;
