import { Link } from "react-router";
import { Rocket, BookOpen, Video } from "lucide-react";
import { useSelector } from "react-redux";
import { CourseCard } from "../components";
import demo_pic from "../assets/demo_pic.jpg";
const LandingPageCourses = () => {


  const courses = useSelector((state) => state.courses.courses);
  
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
        courseImage: demo_pic,
        actualPrice: 1200,
        discountedPrice: 999,
        linkAddress: "bsc-hons-batch",
      },
    ];



  return (
    <div className="my-16 w-full flex items-center justify-center">
      <div className="w-[90%]">
        <h4 className="text-center text-sm font-semibold text-gray-400 dark:text-gray-500">Courses</h4>
        <h2 className="mt-2 text-3xl md:text-4xl text-center font-bold">
          Explore our<span className="text-highlighted"> Courses</span>
        </h2>


        <div className="mt-8 w-full lg:w-[90%] mx-auto flex overflow-x-scroll gap-16 lg:gap-8 scrollbar-none">
          {entranceCourses.map((course) => (
            <CourseCard
              key={course.id}
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
          ))}
          {SemesterCourse.map((course) => (
            <CourseCard
              key={course.id}
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
          ))}
        </div>

      </div>
    </div>
  );
};

export default LandingPageCourses;
