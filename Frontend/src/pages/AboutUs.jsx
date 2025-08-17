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
    <section className="py-1 px-6 md:px-16 lg:px-2 transition-all duration-500">
      <div className="max-w-7xl mx-auto space-y-24 my-24 md:my-32">
        {/* Heading */}
        <div className="text-center space-y-4" data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black dark:text-white">
            About Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Learn about{" "}
            <span className="font-semibold text-highlighted">Microdome</span>, a
            coaching institute dedicated to shaping future biologists with
            expert mentorship, innovative learning methods, and proven success
            strategies.
          </p>
        </div>

        {/* Image + Content */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Image */}
          <div
            className="w-full md:w-1/2 flex justify-center items-center"
            data-aos="zoom-in"
          >
            <img
              src={Microdome}
              alt="Microdome Biology Coaching"
              className="rounded-2xl shadow-xl object-cover transition duration-300 transform hover:scale-105
                         w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80"
            />
          </div>

          {/* About Box */}
          <div
            className=" border w-full bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg p-8 sm:p-10 md:p-12 space-y-6  border-zinc-900/20 dark:border-gray-700/25"
            data-aos="fade-left"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
              Who We Are
            </h3>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              <span className="font-semibold text-highlighted">Microdome</span>{" "}
              is a premier biology coaching institute nurturing future
              scientists with a strong foundation in life sciences. Our mission
              is to make biology learning engaging, conceptual, and
              career-focused.
            </p>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              We guide students for{" "}
              <span className="font-semibold">IIT JAM, GAT-B, CUET-PG</span> and
              provide specialized academic support for{" "}
              <span className="font-semibold">B.Sc Microbiology (Hons.)</span>.
            </p>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              With expert mentors, interactive learning, and student-first
              strategies, we help learners achieve their academic and career
              aspirations.
            </p>
          </div>
        </div>

        {/* Why Join Section */}
        <div
          className="border bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl p-10 md:p-14 space-y-12 border-zinc-900/20 dark:border-gray-700/25"
          data-aos="fade-up"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-center text-black dark:text-white ">
            Why Join Microdome?
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                title: "Expert Mentorship",
                points: [
                  "Guidance from top-qualified mentors in biology & microbiology.",
                ],
              },
              {
                title: "Proven Success",
                points: [
                  "Trainers who’ve cracked IIT JAM, GAT-B, and CUET-PG.",
                ],
              },
              {
                title: "Interactive Learning",
                points: [
                  "Engaging sessions where students present & collaborate.",
                ],
              },
              {
                title: "Structured Classes",
                points: [
                  "3 weekly Biology classes",
                  "Extra PCM support for clarity.",
                ],
              },
              {
                title: "Flexible Learning",
                points: ["Recorded sessions", "Access via Telegram & YouTube."],
              },
              {
                title: "Online Convenience",
                points: ["Live online classes via Google Meet."],
              },
              {
                title: "Affordable Fees",
                points: [
                  "First class FREE",
                  "₹500 first month",
                  "₹1200/month.",
                ],
              },
              {
                title: "Financial Support",
                points: ["Scholarships & support for deserving students."],
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="border bg-gray-50 dark:bg-[#0f172a] rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1  border-zinc-900/10 dark:border-gray-700/25"
                data-aos="fade-up"
                data-aos-delay={idx * 120}
              >
                <h4 className="text-xl font-semibold text-highlighted mb-3">
                  {item.title}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  {item.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center" data-aos="zoom-in-up">
          <Link
            className="inline-block bg-gradient-to-r from-[#3eb5a2] to-[#db3b7e] hover:from-[#34a08f] hover:to-[#c83270] text-white font-semibold text-lg md:text-xl px-10 py-4 md:px-12 md:py-5 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
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
