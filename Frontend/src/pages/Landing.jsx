import React from "react";
import { Link } from "react-router";

const Landing = () => {
  return (
    <div id="home" className="md:pt-48 pt-32 pb-5 w-full flex items-center justify-center">
      <div className="w-[90%] flex flex-col items-center justify-center">
        <div className="mt-4 w-full md:w-[60%]">
          <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold">Unlock Your Potential With <span className="gradiant-text">Microdome Classes</span></h1>
        </div>
        <div className="mt-4 w-full md:w-[50%]">
          <p className="text-center ">
            At Microdome Classes, we specialize in online coaching for M.Sc
            entrance exams, including IIT JAM and CUET PG. Our comprehensive
            courses provide students with the tools they need to excel in their
            biology studies and achieve their academic goals.
          </p>
        </div>
        <div className="mt-4 w-full md:w-[50%] flex items-center justify-center gap-4">
          <Link to="courses" className="px-4 py-2 bg-black border border-black dark:border-white dark:bg-white dark:text-black text-white">Enroll</Link>
          <Link  className="px-4 py-2 border">Learn More</Link>
        </div>
        <div className="w-full mt-16">
        <iframe className="mx-auto w-full h-[55vw] md:w-[70%] md:h-[36vw]" src="https://www.youtube.com/embed/P-gZSzOaPp0?si=MLOFdd-KtMnCud-i&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  );
};

export default Landing;
