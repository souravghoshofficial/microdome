import { useState, useEffect } from "react";
import axios from "axios";
import { CourseCard } from "../components";
import demo_pic from "../assets/demo_pic.jpg";
const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const Courses = () => {
  const [Loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get(`${ApiUrl}/courses/get-all-courses`)
      .then((res) => {
        console.log(res.data);
        setCourses(res.data.courses);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const entranceCourses = courses.filter(
    (course) => course.courseTag.toLowerCase() === "m.sc entrance"
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

  if (Loading) return <div className="w-full h-screen ">Loading...</div>;

  return (
    <div className="w-full flex items-center justify-center transition-colors duration-300">
      <div className="my-24 md:my-32 w-[90%]">
        <h4 className="text-center text-sm font-bold">Courses</h4>
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Courses Offered
        </h2>
        <div className="mt-8 w-full lg:w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-8">
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

export default Courses;
