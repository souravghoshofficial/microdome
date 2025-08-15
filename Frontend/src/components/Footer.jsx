import React from "react";
import { Link } from "react-router";
import {
  RiFacebookCircleFill,
  RiInstagramFill,
  RiTwitterXFill,
  RiLinkedinBoxFill,
  RiYoutubeFill,
} from "@remixicon/react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <div className="w-full mt-8 pb-8 md:pb-16 flex items-center justify-center">
      <div className="w-[90%]">
        <hr className="w-full" />
        <div className="my-8 md:my-16 w-full px-2 md:px-8 flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-[40%] flex flex-col justify-center">
            <span>
              <a className="flex items-center gap-2" href="/">
                <Logo className="w-16 md:w-18 cursor-pointer" />
              </a>
            </span>
            <p className="mt-2">Let's connect with our socials</p>
            <div className="mt-4 w-full flex items-center gap-4">
              <a
                target="_blank"
                href="https://www.facebook.com/profile.php?id=100014111567971&ref=ig_profile_ac"
              >
                <RiFacebookCircleFill
                  size={24}
                  className="hover:text-blue-500"
                />
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/say_an_02?igsh=c2JocGhiODIxeDR4"
              >
                <RiInstagramFill size={24} className="hover:text-pink-500" />
              </a>
              <a target="_blank" href="https://x.com">
                <RiTwitterXFill size={24} className="" />
              </a>
              <a
                target="_blank"
                href="https://linkedin.com/in/sayan-ganguly-5883831bb"
              >
                <RiLinkedinBoxFill size={24} className="hover:text-blue-500" />
              </a>
              <a
                target="_blank"
                href="https://youtube.com/@microdomeclasses?si=P625Gx-bxJa69Q4I"
              >
                <RiYoutubeFill size={24} className="hover:text-red-500" />
              </a>
            </div>
          </div>
          <div className="w-full md:w-[20%] mt-8 md:mt-0 px-0 md:px-8">
            <h3 className="text-xl font-bold">Company</h3>
            <ul className="mt-2">
              <li>
                <Link to="/about-us" className="hover:text-highlighted">
                  About Us
                </Link>
              </li>
              <li>Support</li>
              <li>Privacy Policy</li>
              <li>Terms and Conditions</li>
              <li>Pricing and Refund</li>
            </ul>
          </div>
          <div className="w-full md:w-[20%] mt-4 md:mt-0 px-o md:px-8">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="mt-2 flex flex-col">
              <Link to="/courses" className="hover:text-highlighted">
                Courses
              </Link>
              <Link to="/#testimonials">Testimonials</Link>
              <Link to="/faculties" className="hover:text-highlighted">
                Our Facultites
              </Link>
              <Link to="/resources" className="hover:text-highlighted">
                Resources
              </Link>
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
