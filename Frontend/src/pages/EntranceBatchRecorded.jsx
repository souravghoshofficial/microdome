import React from "react";

import { Link } from "react-router";

import { RiArrowDropRightLine } from "@remixicon/react";

import { CourseCard } from "../components";

const courseDetails = {
    id: 3,
    courseTitle: "M.Sc Entrance Batch",
    subTitle: "Ace IIT JAM, CUET PG & Beyond",
    courseTag: "M.Sc Entrance",
    type: "recorded",
    language: "hinglish",
    courseImg: "https://i.pinimg.com/736x/cf/e3/32/cfe332e963458f410c8cb6157a14e92e.jpg",
    actualPrice: 3600,
    discountedPrice: 3000,
    linkAddress: "entrance-batch-recorded"
};

const EntranceBatchRecorded = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="mt-8 w-[90%] relative flex justify-center gap-10 px-12 py-6">
        <div className="w-[100vw] h-96 absolute bg-slate-200/50 dark:bg-gray-800 z-10"></div>
        <div className="w-[60%] z-20 mt-16">
          <div className="flex items-center gap-2">
            <Link to="/">Home</Link>
            <RiArrowDropRightLine size={30} fontWeight={100} color="gray" />
            <Link to="/courses">Courses</Link>
            <RiArrowDropRightLine size={30} fontWeight={100} color="gray" />
            <Link to="#">M.Sc Entrance Batch (Recorded)</Link>
          </div>
          <h3 className="mt-2 leading-10 text-2xl md:text-3xl font-bold">
            M.Sc. Entrance Mastery
          </h3>
          <h5 className="mt-2 w-[95%] text-[17px]">
            The most updated comprehensive recorded course covering everything
            from basics to advanced strategies for cracking IIT JAM, CUET PG,
            and other M.Sc. entrance exams — perfect for self-paced preparation.
          </h5>
        </div>
        <div className="mt-16 sticky h-fit top-32 w-[28%] z-20">
          <CourseCard
            courseTitle={courseDetails.courseTitle}
            subTitle={courseDetails.subTitle}
            courseImg={courseDetails.courseImg}
            courseTag={courseDetails.courseTag.toUpperCase()}
            actualPrice={courseDetails.actualPrice}
            discountedPrice={courseDetails.discountedPrice}
            type={courseDetails.type.toUpperCase()}
            language={courseDetails.language.toUpperCase()}
            btnText="Buy Now"
          />
        </div>
      </div>
    </div>
  );
};

export default EntranceBatchRecorded;
