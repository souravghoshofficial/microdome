// import cellVideo from "../assets/cell.mp4";
// import { Link } from "react-router";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCube } from "@fortawesome/free-solid-svg-icons";

// const About = () => {
//   return (
//     <>
//       <div
//         id="about"
//         className="pt-16 w-full lg:h-screen flex justify-center md:items-center md:justify-center"
//       >
//         <div className="w-[90%] flex flex-col md:flex-row items-center md:justify-between gap-10 md:gap-4">
//           <div className="w-full md:w-[45%]">
//             <div>
//               <FontAwesomeIcon icon={faCube} className="text-3xl md:text-4xl" />
//             </div>
//             <div className="mt-4">
//               <h2 className="text-3xl md:text-4xl font-bold">
//                 Empowering Your Journey to Success in{" "}
//                 <span className="highlighted-text">Biology</span>
//               </h2>
//             </div>
//             <div className="mt-4">
//               <p className="text-base">
//                 At Microdome Classes, we are dedicated to providing top-notch
//                 coaching for M.Sc entrance examinations, focusing on biology.
//                 Our mission is to equip students with the knowledge and skills
//                 they need to excel in their academic pursuits and achieve their
//                 career goals.
//               </p>
//             </div>
//             <div className="flex mt-4 gap-4">
//               <Link
//                 to="/about-us"
//                 className="px-4 py-2 border rounded-sm font-semibold hover:text-highlighted"
//               >
//                 Learn More
//               </Link>
//               <Link
//                 to="signup"
//                 className="px-4 py-2 border rounded-sm border-highlighted bg-highlighted hover:bg-highlighted-hover hover:border-highlighted-hover text-white font-semibold"
//               >
//                 Join Us
//               </Link>
//             </div>
//           </div>
//           <div className="w-full md:w-[50%] overflow-hidden">
//             {/* <img className="w-full rounded-xl" src={brainImg} alt="Brain Image" /> */}
//             <video autoPlay muted loop className="w-full h-auto rounded-xl">
//               <source src={cellVideo} />
//             </video>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default About;

// // import { Link } from "react-router"; // Fixed import for React Router
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { faCube } from "@fortawesome/free-solid-svg-icons";

// // // Example image path or placeholder
// // let cellImg = "https://via.placeholder.com/500";

// // const About = () => {
// //   return (
// //     <section
// //       className="w-full min-h-screen flex items-center bg-gradient-to-r from-gray-100 via-white to-gray-100 text-gray-900
// //                  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white transition-colors duration-500"
// //     >
// //       <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
// //         {/* Left Content */}
// //         <div className="flex-1">
// //           <FontAwesomeIcon
// //             icon={faCube}
// //             className="text-4xl text-teal-500 dark:text-teal-400"
// //           />
// //           <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight">
// //             Empowering Your Journey to Success in{" "}
// //             <span className="text-teal-500 dark:text-teal-400">Biology</span>
// //           </h2>
// //           <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
// //             At Microdome Classes, we are dedicated to providing top-notch
// //             coaching for M.Sc entrance examinations, focusing on biology. Our
// //             mission is to equip students with the knowledge and skills they need
// //             to excel in their academic pursuits and achieve their career goals.
// //           </p>
// //           <div className="mt-8 flex gap-4">
// //             <Link
// //               to="/about-us"
// //               className="px-6 py-3 border-2 border-teal-500 text-teal-500 rounded-lg font-semibold
// //                          hover:bg-teal-500 hover:text-white transition duration-300
// //                          dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-400 dark:hover:text-gray-900"
// //             >
// //               Learn More
// //             </Link>
// //             <Link
// //               to="/signup"
// //               className="px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold
// //                          hover:bg-teal-600 transition duration-300
// //                          dark:bg-teal-400 dark:text-gray-900 dark:hover:bg-teal-300"
// //             >
// //               Join Us
// //             </Link>
// //           </div>
// //         </div>

// //         {/* Right Image */}
// //         <div className="flex-1 flex justify-center">
// //           <img
// //             src={cellImg}
// //             alt="Cell Biology"
// //             className="rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500"
// //           />
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default About;


import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import cellVideo from "../assets/cell.mp4";
import { Link } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // initialize AOS
  }, []);

  return (
    <>
      <div
        id="about"
        className="pt-16 w-full lg:h-screen flex justify-center md:items-center md:justify-center"
      >
        <div className="w-[90%] flex flex-col md:flex-row items-center md:justify-between gap-10 md:gap-4">
          {/* Left Content */}
          <div className="w-full md:w-[45%]" data-aos="fade-right">
            <div>
              <FontAwesomeIcon icon={faCube} className="text-3xl md:text-4xl" />
            </div>
            <div className="mt-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Empowering Your Journey to Success in{" "}
                <span className="highlighted-text">Biology</span>
              </h2>
            </div>
            <div className="mt-4">
              <p className="text-base">
                At Microdome Classes, we are dedicated to providing top-notch
                coaching for M.Sc entrance examinations, focusing on biology.
                Our mission is to equip students with the knowledge and skills
                they need to excel in their academic pursuits and achieve their
                career goals.
              </p>
            </div>
            <div className="flex mt-4 gap-4">
              <Link
                to="/about-us"
                className="px-4 py-2 border rounded-sm font-semibold hover:text-highlighted"
              >
                Learn More
              </Link>
              <Link
                to="signup"
                className="px-4 py-2 border rounded-sm border-highlighted bg-highlighted hover:bg-highlighted-hover hover:border-highlighted-hover text-white font-semibold"
              >
                Join Us
              </Link>
            </div>
          </div>

          {/* Right Video */}
          <div className="w-full md:w-[50%] overflow-hidden" data-aos="fade-left">
            <video autoPlay muted loop className="w-full h-auto rounded-xl">
              <source src={cellVideo} />
            </video>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
