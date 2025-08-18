import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

const Landing = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration (in ms)
      once: true, // animation happens only once
      easing: "ease-in-out", 
    });
  }, []);

  return (
    <div
      id="home"
      className="w-full flex items-center justify-center relative"
    >
      <div className="w-[90%] flex flex-col items-center justify-center">
        {/* Heading */}
        <div
          className="md:mt-40 mt-32 mb-5 w-full md:w-[70%]"
          data-aos="fade-up"
        >
          <h1 className="text-center text-4xl md:text-6xl lg:text-7xl font-bold leading-10 md:leading-14 lg:leading-20">
            Unlock Your Potential With{" "}
            <span className="gradiant-text">Microdome</span> Classes
          </h1>
        </div>

        {/* Subtext */}
        <div className="mt-1 w-full md:w-[56%]" data-aos="fade-up" data-aos-delay="200">
          <p className="text-center text-base md:text-lg">
            At Microdome Classes, we specialize in online coaching for M.Sc and
            M.Tech entrance exams, including IIT JAM, GATE and CUET PG. Our
            comprehensive courses provide students with the tools they need to
            excel in their biology studies and achieve their academic goals.
          </p>
        </div>

        {/* Buttons */}
        <div
          className="mt-5 w-full md:w-[50%] flex items-center justify-center gap-5"
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          <Link
            to="courses"
            className="px-4 py-2.5 font-semibold bg-highlighted border rounded-md border-highlighted hover:bg-highlighted-hover hover:border-highlighted-hover text-white"
          >
            Enroll Now
          </Link>
          <Link
            to="/about-us"
            className="px-4 py-2.5 font-semibold border rounded-md flex items-center hover:text-highlighted"
          >
            Learn More
            <ChevronRight size={20} />
          </Link>
        </div>

        {/* YouTube video */}
        <div className="w-full mt-16" data-aos="fade-up" data-aos-delay="600">
          <iframe
            className="mx-auto w-full h-[55vw] md:w-[70%] md:h-[36vw] rounded-xl"
            src="https://www.youtube.com/embed/rYvVQlKzIbA?si=XB_QI-UaNcVpTlUe"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen="1"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Landing;
