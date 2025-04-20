import brainImg from "../assets/brain-img.jpeg";
import { Link } from "react-router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCube} from '@fortawesome/free-solid-svg-icons'


const About = () => {
  return (
    <div id="about" className="pt-16 w-full h-screen flex justify-center md:items-center md:justify-center">
      <div className="w-[90%] flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-[48%]">
          <div>
            <FontAwesomeIcon icon={faCube} className="text-3xl md:text-4xl" />
          </div>
          <div className="mt-4">
            <h2 className="text-3xl md:text-4xl font-bold">Empowering Your Journey to Success in <span className="highlighted-text">Biology</span></h2>
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
            <Link className="px-4 py-2 border rounded-sm">Learn More</Link>
            <Link to="signup" className="px-4 py-2 border rounded-sm border-highlighted bg-highlighted text-white">Join Us</Link>
          </div>
        </div>
        <div className="w-full md:w-[36%] overflow-hidden">
          <img className="w-full rounded-xl" src={brainImg} alt="Brain Image" />
        </div>
      </div>
    </div>
  );
};

export default About;
