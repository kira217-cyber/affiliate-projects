import { useContext } from "react";
import TabsWrapper from "./TabsWrapper";
import { AuthContext } from "@/Context/AuthContext";


const Deposit = () => {

    const {language} = useContext(AuthContext)

    
      
    return (
        <div>
           <TabsWrapper language={language} />
        </div>
    );
};

export default Deposit;