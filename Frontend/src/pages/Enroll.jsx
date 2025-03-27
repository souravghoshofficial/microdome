import React from "react";
import boxIcon from "../assets/cube-solid.svg";

const Enroll = () => {
  return (
    <div className="mt-8 w-full h-screen flex items-center justify-center">
      <div className="w-[90%]">
        <h4 className="text-center text-sm font-bold">Enroll</h4>
        <h2 className="mt-2 text-4xl text-center font-bold">
          Join Our Learning Journey
        </h2>
        <p className="mt-4 text-center">
          Follow these simple steps to start your learning.
        </p>
        <div className="mt-16 w-full flex flex-col md:flex-row md:items-center gap-4 ">
          <div className="w-full md:w-[45%] p-8 border border-black">
            <img className="w-8" src={boxIcon} alt="box icon" />
            <h2 className="mt-2 text-2xl font-bold">Get Started Now</h2>
            <p>
              Register on our platform to access a wealth of resources and
              courses tailored for you.
            </p>
            <div className="mt-2 w-full flex gap-4">
                <button className="px-3 py-1.5 border">Signup</button>
                <button className="px-3 py-1.5 border border-black bg-black text-white">Enroll</button>
            </div>
          </div>
          <div className="w-full md:w-[25%] p-8 border border-black">
            <img className="w-8" src={boxIcon} alt="box icon" />
            <h2 className="mt-2 text-2xl font-bold">Access Courses and Materials</h2>
            <p>Start learning with our expert-led 
            courses today!</p>
          </div>
          <div className="w-full md:w-[25%] p-8 border border-black">
            <img className="w-8" src={boxIcon} alt="box icon" />
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
