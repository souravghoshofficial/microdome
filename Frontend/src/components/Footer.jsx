import React from "react";
import { Link } from "react-router";
import {RiFacebookCircleFill , RiInstagramFill , RiTwitterXFill , RiLinkedinBoxFill , RiYoutubeFill} from "@remixicon/react"
import Logo from "./Logo";

const Footer = () => {
  return (
    <div className="w-full mt-8 pb-8 md:pb-16 flex items-center justify-center">
      <div className="w-[90%]">
        <hr className="w-full" />
        <div className="my-8 md:my-16 w-full px-2 md:px-8 flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-[40%] flex flex-col justify-center">
            <Logo className="w-20 md:w-24" />
            <p className="mt-2">Let's connect with our socials</p>
            <div className="mt-4 w-full flex items-center gap-4">
              <a className="" href="https://facebook.com">
                <RiFacebookCircleFill size={24} className="hover:text-blue-500"/>
              </a>
              <a href="https://instagram.com">
                <RiInstagramFill size={24} className="hover:text-pink-500" />
              </a>
              <a href="https://x.com">
                <RiTwitterXFill size={24} className="" />
              </a>
              <a href="https://linkedin.com">
                <RiLinkedinBoxFill size={24} className="hover:text-blue-500" />
              </a>
              <a href="https://youtube.com">
                <RiYoutubeFill size={24} className="hover:text-red-500" />
              </a>
       
            </div>
          </div>
          <div className="w-full md:w-[20%] mt-8 md:mt-0 px-0 md:px-8">
            <h3 className="text-xl font-bold">Company</h3>
            <ul className="mt-2">
              <li>About Us</li>
              <li>Support</li>
              <li>Privacy Policy</li>
              <li>Terms and Conditions</li>
              <li>Pricing and Refund</li>
            </ul>
          </div>
          <div className="w-full md:w-[20%] mt-4 md:mt-0 px-o md:px-8">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="mt-2 flex flex-col">
              <Link to="courses">Courses</Link>
              <a href="#">Testimonials</a>
              <li>Our Facultites</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div className="w-full md:w-[20%] mt-4 md:mt-0 px-0 md:px-8">
            <h3 className="text-xl font-bold">Community</h3>
            <ul className="mt-2">
              <li>Telegram</li>
              <li>Discord</li>
            </ul>
          </div>
        </div>
        <hr className="w-full" />
        <p className="mt-1 text-sm text-center">
          Copyright &copy; {new Date().getFullYear()} Microdome Classes.
        </p>
        <p className="text-sm text-center">All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
