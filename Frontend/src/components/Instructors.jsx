import React, { useRef, useEffect } from "react";
import InstructorsCard from "./InstructorsCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import { RiArrowRightSLine, RiArrowLeftSLine } from "@remixicon/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/bundle";

// Import AOS
import AOS from "aos";
import "aos/dist/aos.css";

import { mentors } from "../constants/mentors.js";

const Instructors = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: true,     // only animate once
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section className="w-[90%] mx-auto my-8 md:my-16">
      {/* Heading Section */}
      <p className="dark:text-white text-center" data-aos="fade-up">
        Meet
      </p>
      <h1
        className="text-3xl md:text-4xl text-black dark:text-white text-center font-bold"
        data-aos="fade-up"
        data-aos-delay="150"
      >
        Your <span className="text-button">Instructors</span>
      </h1>
      <p
        className="text-center mt-4"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        Learning becomes limitless when you have the right mentors.
      </p>

      {/* Swiper Carousel */}
      <div data-aos="zoom-in" data-aos-delay="400">
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
            <SwiperSlide key={index}>
              <InstructorsCard
                image={mentor.image}
                name={mentor.name}
                subject={mentor.subject}
                description={mentor.description}
                bgColor={mentor.backgroundColor}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Navigation Buttons */}
      <div
        className="mt-4 mx-auto w-full md:w-[90%] flex items-center gap-5 justify-center md:justify-end text-white"
        data-aos="fade-up"
        data-aos-delay="600"
      >
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
