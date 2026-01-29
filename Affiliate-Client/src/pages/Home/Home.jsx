import React from 'react';
import Slider from '../../Components/Slider/Slider';
import WhyChooseUs from '../../Components/WhyChooseUs/WhyChooseUs';
import HowToProcess from '../../Components/HowToProcess/HowToProcess';
import Commission from '../../Components/Commission/Commission';
import Partner from '../../Components/Partner/Partner';
import LastPart from '../../Components/LastPart/LastPart';

const Home = () => {
    return (
        <div>
            <Slider></Slider>
            <WhyChooseUs></WhyChooseUs>
            <HowToProcess></HowToProcess>
            <Commission></Commission>
            <Partner></Partner>
            <LastPart></LastPart>
        </div>
    );
};

export default Home;