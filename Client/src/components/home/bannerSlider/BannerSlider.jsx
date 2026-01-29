import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  EffectCoverflow,
} from "swiper/modules";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import { baseURL_For_IMG_UPLOAD } from "@/utils/baseURL";
import { getCarouselImages } from "@/features/carousel/carouselControlThunks";

const BannerSlider = () => {
  const dispatch = useDispatch();
  const {
    images,
    isLoading,
    isError,
    errorMessage,
    interval,
    infiniteLoop,
    autoPlay,
  } = useSelector((state) => state.homePageCarousel);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    dispatch(getCarouselImages());

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <Skeleton height={180} borderRadius={12} />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">{errorMessage}</p>;
  }

  if (!images || images.length === 0) {
    return <p className="text-center">No images available</p>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto relative">
      <Swiper
        modules={[Autoplay, Pagination, EffectCoverflow]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        loop={infiniteLoop}
        speed={900}
        autoplay={
          autoPlay
            ? { delay: interval || 3000, disableOnInteraction: false }
            : false
        }
        coverflowEffect={{
          rotate: 0,
          stretch: isMobile ? 30 : 80,
          depth: isMobile ? 70 : 200,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        className="coverflowSwiper"
      >
        {images.map((slide, index) => (
          <SwiperSlide key={index} className="coverflow-slide">
            <img
              src={`${baseURL_For_IMG_UPLOAD}s/${
                isMobile ? slide.mobile : slide.desktop
              }`}
              alt={`Slide ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🎨 Styling */}
      <style>
        {`
          .coverflowSwiper {
            width: 100%;
            padding-top: 20px;
            padding-bottom: 40px;
          }

          /* Desktop */
          .coverflow-slide {
            width: 850px;
          }

          .coverflow-slide img {
            width: 100%;
            height: 280px;
            object-fit: cover;
            border-radius: 8px;
            display: block;
          }

          /* Mobile */
          @media (max-width: 768px) {
            .coverflowSwiper {
              padding-top: 8px;
              padding-bottom: 40px;
            }

            .coverflow-slide {
              width: 80%;
            }

            .coverflow-slide img {
              height: 150px;   /* ✅ MOBILE HEIGHT REDUCED */
              border-radius: 8px;
            }
          }

          /* Pagination */
          .coverflowSwiper .swiper-pagination-bullet {
            background: #000;
            opacity: 0.3;
          }

          .coverflowSwiper .swiper-pagination-bullet-active {
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
};

export default BannerSlider;
