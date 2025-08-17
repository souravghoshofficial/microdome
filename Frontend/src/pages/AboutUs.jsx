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
