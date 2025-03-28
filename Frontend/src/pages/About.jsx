import React from "react";
import brainImg from "../assets/brain-img.jpeg";
import boxImg from "../assets/cube-solid.svg";

const About = () => {
  return (
    <div id="about" className="mt-16 w-full h-screen flex justify-center md:items-center md:justify-center">
      <div className="w-[90%] flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-[45%]">
          <div>
            <img className="w-8 md:w-10" src={boxImg} alt="Box Image" />
          </div>
          <div className="mt-4">
            <h2 className="text-3xl md:text-4xl font-bold">Empowering Your Journey to Success in Biology</h2>
          </div>
          <div className="mt-4">
            <p>
              At Microdome Classes, we are dedicated to providing top-notch
              coaching for M.Sc entrance examinations, focusing on biology. Our
              mission is to equip students with the knowledge and skills they
              need to excel in their academic pursuits and achieve their career
              goals.
            </p>
          </div>
          <div className="flex mt-4 gap-4">
            <button className="px-4 py-2 border border-black">Learn More</button>
            <button className="px-4 py-2 border border-black bg-black text-white">Join Us</button>
          </div>
        </div>
        <div className="w-full md:w-[45%]">
          <img className="w-full" src={brainImg} alt="Brain Image" />
        </div>
      </div>
    </div>
  );
};

export default About;
