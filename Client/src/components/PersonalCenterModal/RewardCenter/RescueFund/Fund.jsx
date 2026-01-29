import ReceiveFund from "./ReceiveFund";
import RescueFund from "./RescueFund";


const Fund = () => {
    return (
        <div className="flex gap-2">
            <RescueFund/>
            <div className="hidden lg:block">
             
            <ReceiveFund/>
               
            </div>
        </div>
    );
};

export default Fund;