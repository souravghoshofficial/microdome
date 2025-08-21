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
          <div className="w-full md:w-[45%]" data-aos="fade-up">
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
          <div className="w-full md:w-[50%] overflow-hidden" data-aos="fade-up">
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
