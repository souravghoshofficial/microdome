import { useEffect, useState } from "react";
import axios from "axios";
import { BuyNowCard, CourseSyllabus } from "../components";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router";
import { syllabus } from "../constants/syllabus.js";

import BrochureTopic from "../components/BrochureTopic.jsx";
import GateInformationBrochure from '../assets/pdfs/GATE2025InformationBrochure.pdf';
import CuetPgInformationBrochure from '../assets/pdfs/InformationBrochureCUET-PG2025.pdf';
import GatBInformationBrochure from '../assets/pdfs/InformationBulletinGAT-B2025.pdf';
import JamInformationBrochure from '../assets/pdfs/JAM2025InformationBrochure.pdf';

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const liveBatch = {
  courseFeatures: [
    "Live interactive classes led by top educators.",
    "Unlimited access to recorded lectures after each live session.",
    "Dedicated doubt-clearing sessions and personalized mentoring.",
    "Detailed, well-structured notes provided for every topic.",
    "Practice with previous year questions and full-length mock tests.",
  ],
};

const recordedBatch = {
  courseFeatures: [
    "High-quality recorded lectures by top educators.",
    "Access videos anytime, anywhere at your own pace.",
    "Comprehensive coverage from basics to advance.",
    "Detailed, well-structured notes provided for every topic.",
    "Includes previous year questions and mock tests.",
  ],
};

const brochures = [
  {
    id: 1,
    topic: "Brochures",
    pdfs: [
      { title: "IIT JAM", 
        file: JamInformationBrochure
      },
      { title: "GATE", 
      file: GateInformationBrochure
      },
      { title: "GAT-B", 
      file: GatBInformationBrochure
      },
      { title: "CUET-PG",
        file: CuetPgInformationBrochure
      },
    ],
  },
];

const EntranceBatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    axios
      .post(
        `${ApiUrl}/courses/get-course-details`,
        { linkAddress: id },
        { withCredentials: true }
      )
      .then((res) => {
        setCourseDetails(res.data.courseDetails);
      })
      .catch(() => console.log("Error fetching course details"));
  }, [id]);

  const isEnrolled = userData?.enrolledCourses.includes(courseDetails?._id);

  const handleEnrollClick = () => {
    if (!isLoggedIn) {
      toast.warn("Login to enroll");
      return;
    }
    if (isEnrolled) {
      navigate(`/my-courses/${courseDetails?._id}`);
      return;
    }
    navigate(`/checkout/${id}`);
  };

  return (
    <>
      <div className="w-full flex items-center justify-center">
        <div className="mt-8 w-full lg:w-[92%] flex flex-col-reverse lg:flex-row justify-center lg:gap-10 lg:px-12 lg:py-6 mb-16">
          <ToastContainer />
          <div className="w-[90%] mx-auto lg:w-[60%] z-20 mt-16">
            <h3 className="mt-2 leading-10 text-2xl md:text-3xl font-bold">
              {courseDetails?.courseTitle}
            </h3>
            <h5 className="mt-2 w-[95%] text-[17px]">
              {courseDetails?.courseDescription}
            </h5>
            <div className="w-full mt-4">
              <CourseSyllabus syllabus={syllabus} />
            </div>
             {/* ✅ Entrance Exam Brochures Section */}
      <div className="w-full mt-4 flex items-center ">
        <div className="mt-2 w-full md:w-[90%]">
          <h2 className="text-xl font-semibold">
            Entrance Exam Brochures
          </h2>

          {brochures.map((section) => (
            <div key={section.id}>
              <BrochureTopic topic={section.topic} brochures={section.pdfs} />
            </div>
          ))}
        </div>
      </div>
          </div>

          <div className="mt-16 lg:sticky h-fit top-32 w-[90%] mx-auto md:w-[50%] lg:w-[36%] z-20">
            <BuyNowCard
              courseFeatures={
                id === "msc-entrance-batch-live"
                  ? liveBatch.courseFeatures
                  : recordedBatch.courseFeatures
              }
              actualPrice={courseDetails?.actualPrice}
              discountedPrice={courseDetails?.discountedPrice}
              imageUrl={courseDetails?.courseImage}
              handlePayment={handleEnrollClick}
              isEnrolled={isEnrolled}
              mode={courseDetails?.mode.toUpperCase()}
            />
          </div>
        </div>
      </div>

     
    </>
  );
};

export default EntranceBatch;
