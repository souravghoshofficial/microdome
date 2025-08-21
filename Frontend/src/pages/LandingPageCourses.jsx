import { useSelector } from "react-redux";
import { CourseCard } from "../components";
import bscCourseImg from "../assets/bscCard.png";
import { Link } from "react-router";
import {ChevronRight} from "lucide-react"

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/bundle";

const LandingPageCourses = () => {
  const courses = useSelector((state) => state.courses.courses);

  if (!courses) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Filter entrance courses
  const entranceCourses = courses.filter(
    (course) => course.courseTag.toLowerCase() === "m.sc entrance"
  );

  // Local semester course
  const SemesterCourse = [
    {
      _id: "local-bsc-1",
      cardTitle: "B.Sc Hons. Microbiology",
      subTitle: "Ultimate guide to excel in the Microbiology",
      courseTag: "B.Sc Hons.",
      mode: "live",
      language: "hinglish",
      courseImage: bscCourseImg,
      actualPrice: 1200,
      discountedPrice: 999,
      linkAddress: "bsc-hons-batch",
    },
  ];

  const allCourses = [...entranceCourses, ...SemesterCourse];

  if (allCourses.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        No courses available yet.
      </div>
    );
  }

  return (
    <div className="my-16 w-full flex items-center justify-center">
      <div className="w-[90%]">
        {/* Section Heading */}
        <h4 className="text-center text-sm font-semibold text-gray-400 dark:text-gray-500">
          Courses
        </h4>
        <h2 className="mt-2 text-3xl md:text-4xl text-center font-bold">
          Explore our<span className="text-highlighted"> Courses</span>
        </h2>

        {/* Courses Slider */}
        <Swiper
          modules={[Autoplay, Navigation]}
          speed={1000}
          spaceBetween={16}
          slidesPerView={1.1}
          centeredSlides={false}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1100: { slidesPerView: 3, spaceBetween: 40 },
          }}
          className="mt-8 w-full lg:w-[90%] mx-auto"
        >
          {allCourses.map((course) => (
            <SwiperSlide key={course._id} className="py-6">
              <CourseCard
                imageHeight="h-64"
                className="w-full shadow-none border border-transparent hover:border-blue-500 transition-all duration-300"
                courseTitle={course.cardTitle}
                subTitle={course.subTitle}
                type={course.mode.toUpperCase()}
                language={course.language.toUpperCase()}
                courseImg={course.courseImage}
                courseTag={course.courseTag.toUpperCase()}
                actualPrice={course.actualPrice}
                discountedPrice={course.discountedPrice}
                linkAddress={`/courses/${course.linkAddress}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="w-full flex justify-center">
          <Link
            to="/courses"
            className="bg-highlighted hover:bg-highlighted-hover text-gray-200 dark:text-white font-semibold px-5 py-2 rounded-md mt-2 text-base md:text-lg flex items-center gap-1"
          >
            View All Courses
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPageCourses;
