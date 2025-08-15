import React, { useRef } from "react";
import InstructorsCard from "./InstructorsCard";


import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import { RiArrowRightSLine, RiArrowLeftSLine } from "@remixicon/react";


// Import Swiper styles
import "swiper/css";
import "swiper/css/bundle";

import { mentors } from "../constants/mentors.js";


const Instructors = () => {

  const swiperRef = useRef(null);
  return (
    <section className="w-[90%] mx-auto my-8 md:my-16">
      <p className="dark:text-white text-center">Meet</p>
      <h1 className="text-3xl md:text-4xl text-black dark:text-white text-center font-bold">
        Your <span className="text-button">Instructors</span>
      </h1>
      <p className="text-center mt-4">
        Learning becomes limitless when you have the right mentors.
      </p>

      <Swiper
        modules={[Autoplay, Navigation]}
        navigation={false}
        onBeforeInit={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={10}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1100: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        speed={1000}
        loop={true}
        autoplay={{ pauseOnMouseEnter: true }}
        className="w-[100%] md:w-[90%] mt-8"
      >
        {mentors.map((mentor, index) => (
          <SwiperSlide>
            <InstructorsCard
              key={index}
              image={mentor.image}
              name={mentor.name}
              subject={mentor.subject}
              description={mentor.description}
              bgColor={mentor.backgroundColor}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-4 mx-auto w-full md:w-[90%] flex items-center gap-5 justify-center md:justify-end text-white">
        <button
          className="w-12 h-12 bg-highlighted rounded-full flex items-center justify-center cursor-pointer hover:bg-highlighted-hover"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <RiArrowLeftSLine size={28} />
        </button>
        <button
          className="w-12 h-12 bg-highlighted rounded-full flex items-center justify-center cursor-pointer hover:bg-highlighted-hover"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <RiArrowRightSLine size={28} />
        </button>
      </div>
    </section>
  );
};

export default Instructors;
