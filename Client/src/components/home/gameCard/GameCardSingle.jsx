import { Link } from "react-router-dom";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";
import { FaPlay } from "react-icons/fa";

const GameCardSingle = ({ title = "Hot Game", games = [] }) => {
  const swiperRef = useRef();

  const scrollToSlider = () => {
    document
      .getElementById("game-slider-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="py-3 lg:py-4 w-full max-w-5xl mx-auto rounded-xl">
      <div className="flex justify-between items-center gap-2 mb-2 lg:mb-3">
        <h2 className="text-base lg:text-xl font-bold text-[#10f3c8] uppercase">
          {title}
        </h2>
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={scrollToSlider}
            className="py-0.5 lg:py-1 px-2 text-xs font-bold rounded-md text-yellow-600 hover:text-yellow-700 bg-[#025659] hover:bg-yellow-400"
          >
            More
          </button>
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="py-0.5 lg:py-1 px-2 rounded-md text-white bg-[#025659]"
          >
            <RxCaretLeft />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="py-0.5 lg:py-1 px-2 rounded-md text-white bg-[#025659]"
          >
            <RxCaretRight />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={20}
        slidesPerView={5.3}
        slidesPerGroup={5}
        breakpoints={{
          0: {
            slidesPerView: 3.3,
            spaceBetween: 8,
          },
          767: {
            slidesPerView: 4.3,
            spaceBetween: 10,
          },
          1280: {
            slidesPerView: 5.3,
            spaceBetween: 15,
          },
        }}
      >
        {games.map((game, index) => (
          <SwiperSlide key={`${game.id}-${index}`}>
            <div className="relative group overflow-hidden rounded-lg">
              <img
                className="rounded-lg w-full h-auto transition-transform duration-300 group-hover:scale-105"
                src={game.image}
                alt={game?.apiData?.name}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link to={`/liveGame/${game._id}`}>
                  <div className="flex items-center justify-center w-10 h-10 font-bold text-[#b64100] bg-[#ffd900] rounded-full mb-2">
                    <FaPlay size={16} />
                  </div>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GameCardSingle;
