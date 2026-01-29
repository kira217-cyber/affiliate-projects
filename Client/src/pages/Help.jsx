import HelpCenterTabs from "@/components/home/helpCenter/HelpCenterTabs";
import MarqueeSlider from "@/components/home/Marque/MarqueeSlider";

const Help = () => {
  return (
    <div className="px-3 sm:px-4">
      <MarqueeSlider />
      <HelpCenterTabs />
    </div>
  );
};

export default Help;
