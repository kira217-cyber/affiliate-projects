import OverviewIncome from "./OverviewIncome";
import LastPart from "./OverviewLastPart/LastPart";
import OverviewRules from "./OverviewRules";
import ReceivedReword from "./ReceivedReword";

const Overview = () => {
  return (
    <div className=" pb-32 lg:pb-0 lg:overflow-hidden overflow-y-auto custom-scrollbar-hidden lg:h-full h-[500px] ">
      <div className="lg:flex gap-4  ">
        <OverviewIncome />
        <OverviewRules />
      </div>
      <div className="mt-3">
        <ReceivedReword></ReceivedReword>
      </div>
      <div className="mt-3">
        <LastPart />
      </div>
    </div>
  );
};

export default Overview;
