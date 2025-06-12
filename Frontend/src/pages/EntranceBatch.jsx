import { useEffect, useState } from "react";
import axios from "axios";
import { BuyNowCard, CourseSyllabus } from "../components";
import { loadRazorpayScript } from "../utils/razorpay";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router";

const syllabus = [
  {
    subject: "Biology",
    topics: [
      "Cell Biology",
      "Biochemistry",
      "Genetics",
      "Molecular Biology",
      "Evolution",
      "Microbiology",
      "Plant Biology",
      "Animal Biology",
      "Ecology",
      "Biotechnology",
      "Methods in Biology",
      "Molecular biology techniques",
    ],
  },
  {
    subject: "Chemistry",
    topics: [
      "Structure and properties of Atoms",
      "Chemical kinetics, thermodynamics, and equilibrium",
      "Chemistry of organic compounds",
      "Instrumental techniques",
    ],
  },
  {
    subject: "Mathematics",
    topics: [
      "Sets, Relations and Functions",
      "Mathematical Induction",
      "Complex numbers",
      "Linear and Quadratic equations",
      "Sequences and Series",
      "Cartesian System of Rectangular Coordinates",
      "Three-Dimensional Geometry",
      "Permutations and Combinations",
      "Binomial Theorem",
      "Matrices and Determinants",
      "Limits and Continuity",
      "Differentiation and Integration",
      "Probability and Statistics",
    ],
  },
  {
    subject: "Physics",
    topics: [
      "Motion in one and two dimensions",
      "Laws of motion",
      "Conservation of energy",
      "System of particles and rotational motion",
      "Thermal properties of matter",
      "Heat and laws of thermodynamics",
      "Kinetic theory of gases",
    ],
  },
];

const liveBatch = {
  title: "M.Sc Entrance Examination Batch - Crack IIT JAM , CUET PG and More",
  description:
    "The most updated comprehensive course covering from basics to advanced levels for M.Sc. entrances including IIT JAM, CUET PG, and more. Perfect for students and aspirants aiming to crack top exams and secure admission to leading institutes.",
};

const recordedBatch = {
  title: "M.Sc. Entrance Mastery",
  description:
    " The most updated comprehensive recorded course covering everything from basics to advanced strategies for cracking IIT JAM, CUET PG, and other M.Sc. entrance exams — perfect for self-paced preparation.",
};

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const EntranceBatch = () => {
  const { id } = useParams();
  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    axios
      .post(
        `/api/v1/courses/get-course-details`,
        { linkAddress: id },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data.courseDetails);
        setCourseDetails(res.data.courseDetails);
      })
      .catch(() => console.log("Error fetching course details"));
  }, []);

  const isEnrolled = userData?.enrolledCourses.includes(courseDetails?._id);

  const handlePayment = async () => {
    if (isEnrolled) {
      return;
    }
    if (!isLoggedIn) {
      toast.warn("Login to enroll");
      return;
    }
    try {
      const res = await axios.post(
        `${ApiUrl}/api/v1/orders/create-order`,
        {
          courseId: courseDetails?._id,
          amount: courseDetails?.discountedPrice,
        },
        {
          withCredentials: true,
        }
      );

      // console.log(res.data);

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Please try again later.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: 100 * courseDetails?.discountedPrice,
        currency: "INR",
        name: "Microdome Classes",
        description: "Payment for M.Sc Entrance Batch",
        image:
          "http://res.cloudinary.com/deljukiyr/image/upload/v1748880241/qi2txlfzapvqkqle8baa.jpg",
        order_id: res.data.order.id,
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mt-8 w-full lg:w-[90%] flex flex-col-reverse lg:flex-row justify-center lg:gap-10 lg:px-12 lg:py-6 mb-16">
        <ToastContainer />
        <div className="w-[90%] mx-auto lg:w-[60%] z-20 mt-16">
          <h3 className="mt-2 leading-10 text-2xl md:text-3xl font-bold">
            {id === "m.sc-entrance-batch-live"
              ? liveBatch.title
              : recordedBatch.title}
          </h3>
          <h5 className="mt-2 w-[95%] text-[17px]">
            {id === "m.sc-entrance-batch-live"
              ? liveBatch.description
              : recordedBatch.description}
          </h5>
          <div className="w-full mt-4">
            <CourseSyllabus syllabus={syllabus} />
          </div>
        </div>
        <div className="mt-16 lg:sticky h-fit top-32 w-[90%] mx-auto md:w-[50%] lg:w-[30%] z-20">
          <BuyNowCard
            actualPrice={courseDetails?.actualPrice}
            discountedPrice={courseDetails?.discountedPrice}
            imageUrl={courseDetails?.courseImage}
            handlePayment={handlePayment}
            isEnrolled={isEnrolled}
          />
        </div>
      </div>
    </div>
  );
};

export default EntranceBatch;
