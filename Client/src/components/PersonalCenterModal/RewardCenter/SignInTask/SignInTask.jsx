import BonusInformation from "./BonusInformation";
import SignBonus from "./SignBonus";


const SignInTask = () => {
    return (
        <div className="lg:flex gap-2 overflow-y-auto lg:h-auto h-[500px] custom-scrollbar-hidden">
            <SignBonus/>
            <BonusInformation/>
        </div>
    );
};

export default SignInTask;