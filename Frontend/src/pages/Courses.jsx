import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { useSelector } from "react-redux";
import { CourseCard } from "../components";
import bscCourseImg from "../assets/bscCard.png"
import Microdome from "../assets/microdome.jpg";
import { Helmet } from "react-helmet-async";

const Courses = () => {
  const courses = useSelector((state) => state.courses.courses);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-in-out" });
  }, []);

  if (!courses) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const entranceCourses = courses.filter(
    (course) => course.courseTag.toLowerCase() !== "b.sc hons."
  );

  const SemesterCourse = [
    {
      id: 3,
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

  return (
    <>
      <Helmet>
        <title>Courses | Microdome Classes</title>
        <meta
          name="description"
          content="Explore our diverse range of courses designed to empower students in their academic journey. From entrance exams to specialized subjects, find the perfect course for your needs."
        />
        <meta
          name="keywords"
          content="Microdome, Courses, Biology Coaching, Entrance Exams, B.Sc Hons., IIT JAM, GAT-B, CUET-PG"
        />
        <meta name="author" content="Microdome" />
        <meta property="og:title" content="Courses | Microdome Classes" />
        <meta
          property="og:description"
          content="Discover our comprehensive courses tailored for aspiring biologists. Join us to excel in your academic pursuits."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://microdomeclasses.in/courses" />
        <meta property="og:image" content={Microdome} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Courses | Microdome Classes" />
        <meta
          name="twitter:description"
          content="Explore our courses designed to help you succeed in biology and related fields. Enroll now!"
        />
        <meta name="twitter:image" content={Microdome} />
        <link rel="canonical" href="https://microdomeclasses.in/courses" />
        <link rel="icon" href="/microdomeLogo.png" />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="application-name" content="Microdome Classes" />
        <meta name="apple-mobile-web-app-title" content="Microdome Classes" />
      </Helmet>

      <div className="w-full flex items-center justify-center bg-white dark:bg-gray-950 text-black dark:text-white transition-colors duration-300">
        <div className="my-24 md:my-32 w-[90%]">
          <h2
            className="text-3xl md:text-4xl font-bold text-center"
            data-aos="fade-up"
          >
            Courses <span className="text-highlighted">Offered</span>
          </h2>

          <div
            className="mt-10 w-full lg:w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {entranceCourses.map((course, index) => (
              <div
                key={course.id}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <CourseCard
                  imageHeight="h-65"
                  courseTitle={course.cardTitle}
                  subTitle={course.subTitle}
                  type={course.mode.toUpperCase()}
                  language={course.language.toUpperCase()}
                  courseImg={course.courseImage}
                  courseTag={course.courseTag.toUpperCase()}
                  actualPrice={course.actualPrice}
                  discountedPrice={course.discountedPrice}
                  linkAddress={course.linkAddress}
                />
              </div>
            ))}

            {SemesterCourse.map((course, index) => (
              <div
                key={course.id}
                data-aos="zoom-in"
                data-aos-delay={(entranceCourses.length + index) * 100}
              >
                <CourseCard
                  imageHeight="h-65"
                  courseTitle={course.cardTitle}
                  subTitle={course.subTitle}
                  type={course.mode.toUpperCase()}
                  language={course.language.toUpperCase()}
                  courseImg={course.courseImage}
                  courseTag={course.courseTag.toUpperCase()}
                  actualPrice={course.actualPrice}
                  discountedPrice={course.discountedPrice}
                  linkAddress={course.linkAddress}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
