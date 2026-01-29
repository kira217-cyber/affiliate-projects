import RewardBalance from "./RewardBalance";
import RewardTicket from "./RewardTicket/RewardTicket";
import RewardView from "./RewardView";

const Reward = () => {
  return (
    <div className="lg:flex lg:gap-4 min-h-screen md:min-h-0 overflow-y-auto custom-scrollbar-hidden lg:h-auto h-[500px] ">
      <div className="lg:p-4 lg:pt-6">
        <RewardBalance />
        <div className="mt-8 lg:mt-0">
         
        <RewardView />
         
        </div>
      </div>
      <div className="hidden lg:block">
        <RewardTicket />
      </div>
    </div>
  );
};

export default Reward;
