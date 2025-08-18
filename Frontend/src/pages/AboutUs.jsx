import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Microdome from "../assets/microdome.jpg";
import { Link } from "react-router";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 120 });
  }, []);

  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-[#0f172a] transition-all duration-500">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Heading */}
        <div className="text-center space-y-3" data-aos="fade-down">
          <h2 className="text-sm uppercase tracking-wide text-green-600 font-semibold">
            About
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
            About <span className="text-green-600">Microdome</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            We are a premier coaching institute dedicated to shaping{" "}
            <span className="font-semibold">future biologists</span> through
            expert mentorship, interactive learning, and proven success
            strategies.
          </p>
        </div>

        {/* Who We Are */}
        <div
          className="grid md:grid-cols-2 gap-10 items-center"
          data-aos="fade-up"
        >
          <div className="flex justify-center">
            <img
              src={Microdome}
              alt="Microdome Biology Coaching"
              className="w-60 h-60 object-cover rounded-full shadow-md border-4 border-green-600 
              transition-transform duration-500 ease-in-out hover:scale-105"
            />
          </div>
          <div
            className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 
          rounded-xl shadow-lg p-8 space-y-4 transition-all duration-500 ease-in-out transform 
          hover:scale-[1.02] hover:shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-black dark:text-white">
              Who We Are
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold text-green-600">Microdome</span> is
              a premier biology coaching institute nurturing students in{" "}
              <span className="font-semibold">Life Sciences</span>. We focus on
              conceptual clarity, career readiness, and interactive learning.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We prepare students for <b>IIT JAM, GAT-B, CUET-PG</b> and offer
              specialized guidance for <b>B.Sc Microbiology (Hons.)</b>.
            </p>
          </div>
        </div>

        {/* Why Join Section */}
        <div data-aos="fade-up" className="space-y-12">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-black dark:text-white">
            Why Join <span className="text-green-600">Microdome?</span>
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Mentorship",
                desc: "Guidance from top-qualified mentors in biology & microbiology.",
              },
              {
                title: "Proven Success",
                desc: "Trainers who’ve cracked IIT JAM, GAT-B, and CUET-PG.",
              },
              {
                title: "Interactive Learning",
                desc: "Engaging sessions where students present & collaborate.",
              },
              {
                title: "Structured Classes",
                desc: "3 weekly Biology classes with PCM support for clarity.",
              },
              {
                title: "Flexible Learning",
                desc: "Recorded sessions with access via Telegram & YouTube.",
              },
              {
                title: "Online Convenience",
                desc: "Live Online classes via Google Meet",
              },
              {
                title: "Affordable Fees",
                desc: "First class FREE, ₹500 first month, then ₹1200/month.",
              },
              {
                title: "Financial Support",
                desc: "Scholarships & support for deserving students.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 
                rounded-xl shadow-md p-6 transition-transform duration-500 ease-in-out transform 
                hover:scale-105 hover:shadow-2xl"
                data-aos="fade-up"
                data-aos-delay={idx * 120}
              >
                <h4 className="text-xl font-semibold text-green-600 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center" data-aos="zoom-in-up">
          <Link
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold 
            text-lg md:text-xl px-10 py-4 md:px-12 md:py-5 rounded-full shadow-lg transition 
            duration-500 ease-in-out transform hover:scale-110"
            to="/login"
          >
            Join Microdome Today!
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;


// import React, { useEffect } from 'react';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import Microdome from '../assets/microdome.jpg';
// import { Link } from "react-router";

// const AboutUs = () => {
//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true });
//   }, []);

//   return (
//     <section className="py-20 px-6 md:px-20 bg-white dark:bg-black transition-all duration-500">
//       <div className="max-w-7xl mx-auto text-center space-y-20">

//         <h2 className="text-5xl font-extrabold text-[#0f766e] dark:text-white tracking-wide" data-aos="fade-up">
//           About Us
//         </h2>

//         <div className="flex flex-col md:flex-row items-center gap-16 md:gap-20" data-aos="fade-up">
//           <div className="w-full md:w-1/2 flex justify-center" data-aos="zoom-in">
//             <img
//               src={Microdome}
//               alt="Microdome Biology Coaching"
//               className="rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.2)] w-80 md:w-96 object-contain hover:scale-105 transform transition duration-300 border-4 border-pink-200 dark:border-pink-700"
//             />
//           </div>

//           {/* About Microdome Box */}
//           <div className="w-full md:w-1/2 bg-white dark:bg-[#111827] rounded-[2rem] shadow-2xl p-10 md:p-12 text-left space-y-6 border-l-4 border-[#0f766e]" data-aos="fade-left">
//             <h3 className="text-3xl font-extrabold text-[#0f766e] dark:text-white mb-4">
//               About Microdome
//             </h3>
//             <p className="text-black dark:text-white text-lg leading-relaxed">
//               <span className="font-semibold text-pink-600">Microdome</span> is a premier biology coaching institute dedicated to nurturing future biologists and curious minds passionate about life sciences. We believe learning biology should be exciting, insightful, and deeply conceptual.
//             </p>
//             <p className="text-black dark:text-white text-lg leading-relaxed">
//               We prepare students for M.Sc entrance exams like IIT JAM, GAT-B, CUET-PG and offer academic support for BSc Microbiology (Hons.) from Kalyani and Calcutta University.
//             </p>
//             <p className="text-black dark:text-white text-lg leading-relaxed">
//               With expert mentors, structured content, and a student-centric approach, Microdome is the perfect ecosystem for serious learners.
//             </p>
//             <p className="text-black dark:text-white text-lg leading-relaxed">
//               Join the Microdome family — where science meets mentorship, and dreams find direction.
//             </p>
//           </div>
//         </div>

//         {/* Why Join Box */}
//         <div className="bg-white dark:bg-[#111827] rounded-[2rem] shadow-2xl p-10 md:p-14 text-left space-y-10 border-t-4 border-[#0f766e]" data-aos="fade-up">
//           <h3 className="text-4xl font-bold text-center text-[#0f766e] dark:text-white">
//             Why Should You Join Microdome?
//           </h3>

//           <div className="grid md:grid-cols-2 gap-10 text-black dark:text-white text-lg">
//             {[
//               {
//                 title: "Expert Mentorship",
//                 points: ["Highly qualified mentors guide B.Sc students in biology and microbiology."]
//               },
//               {
//                 title: "Proven Success",
//                 points: ["Mentors who’ve cracked top exams like IIT JAM, GAT-B, and CUET-PG."]
//               },
//               {
//                 title: "Interactive Learning",
//                 points: ["Students present topics for deeper understanding and engagement."]
//               },
//               {
//                 title: "Structured Classes",
//                 points: ["3 Biology classes weekly", "Additional PCM support for academic clarity"]
//               },
//               {
//                 title: "Flexible Learning",
//                 points: ["Recorded sessions on Telegram", "YouTube & Microdome website access"]
//               },
//               {
//                 title: "Online Convenience",
//                 points: ["Live online classes via Google Meet—learn from home or hostel!"]
//               },
//               {
//                 title: "Affordable Fees",
//                 points: ["First class is FREE!", "₹500 for first month", "₹1200/month afterwards"]
//               },
//               {
//                 title: "Financial Support",
//                 points: ["We offer help to students in need. Just reach out—we care!"]
//               }
//             ].map((item, idx) => (
//               <div 
//                 key={idx} 
//                 className="space-y-2 bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300" 
//                 data-aos="fade-up" 
//                 data-aos-delay={idx * 100}
//               >
//                 <h4 className="text-2xl font-semibold text-pink-600 dark:text-pink-400">{item.title}</h4>
//                 <ul className="list-disc list-inside space-y-1 ml-4">
//                   {item.points.map((point, i) => (
//                     <li key={i}>{point}</li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-10" data-aos="zoom-in-up">
//           <Link  
//             className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer" 
//             to="/login"
//           >
//             Join Microdome Today!
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutUs;