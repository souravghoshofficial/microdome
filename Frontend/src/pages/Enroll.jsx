import React from "react";
import boxIcon from "../assets/cube-solid.svg";
import { Link } from "react-router";

const Enroll = () => {
  return (
    <div className="mt-8 w-full h-screen flex items-center justify-center">
      <div className="w-[90%]">
        <h4 className="text-center text-sm font-bold">Enroll</h4>
        <h2 className="mt-2 text-3xl md:text-4xl text-center font-bold">
          Join Our Learning Journey
        </h2>
        <p className="mt-4 text-center">
          Follow these simple steps to start your learning.
        </p>
        <div className="mt-16 w-full flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-[45%] px-4 py-8 md:px-8 border border-black">
            <img className="w-6 md:w-8" src={boxIcon} alt="box icon" />
            <h2 className="mt-2 text-2xl font-bold">Get Started Now</h2>
            <p>
              Register on our platform to access a wealth of resources and
              courses tailored for you.
            </p>
            <div className="mt-2 w-full flex gap-4">
                <Link to="/signup" className="px-3 py-1.5 border">Signup</Link>
                <Link to ="/courses" className="px-3 py-1.5 border border-black bg-black text-white">Enroll</Link>
            </div>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-[25%] px-4 py-8 md:px-8 border border-black">
            <img className="w-6 md:w-8" src={boxIcon} alt="box icon" />
            <h2 className="mt-2 text-2xl font-bold">Access Courses and Materials</h2>
            <p>Start learning with our expert-led 
            courses today!</p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-[25%] px-4 py-8 md:px-8 border border-black">
            <img className="w-6 md:w-8" src={boxIcon} alt="box icon" />
            <h2 className="mt-2 text-2xl font-bold">Join Live Classes Anytime</h2>
            <p>Engage with instructors and peers 
            in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enroll;
