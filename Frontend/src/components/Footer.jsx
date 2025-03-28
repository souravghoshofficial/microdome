import React from "react";
import { useEffect } from "react";
import facebookIcon from "../assets/facebook.svg";
import instagramIcon from "../assets/instagram.svg";
import xIcon from "../assets/twitter.svg";
import linkedInIcon from "../assets/linkedin.svg";
import youtubeIcon from "../assets/youtube.svg";

import ImageAnchor from "./ImageAnchor.jsx";
import { Link } from "react-router";

const Footer = () => {
  return (
    <div className="w-full mt-8 mb-8 md:mb-16 flex items-center justify-center">
      <div className="w-[90%]">
        <hr className="w-full" />
        <div className="my-8 md:my-16 w-full px-2 md:px-8 flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-[40%] flex flex-col justify-center">
            <h3 className="text-2xl font-bold">MicroDome</h3>
            <p className="mt-2">Let's connect with our socials</p>
            <div className="mt-4 w-full flex items-center gap-4">
              <ImageAnchor
                imageUrl={facebookIcon}
                altText="facebook icon"
                aHref="https://facebook.com/"
                width="6"
                height="6"
              />
              <ImageAnchor
                imageUrl={instagramIcon}
                altText="instagram icon"
                aHref="https://instagram.com/"
                width="6"
                height="6"
              />
              <ImageAnchor
                imageUrl={xIcon}
                altText="twitter icon"
                aHref="https://x.com/"
                width="6"
                height="6"
              />
              <ImageAnchor
                imageUrl={linkedInIcon}
                altText="linkedin icon"
                aHref="https://linkedin.com/"
                width="6"
                height="6"
              />
              <ImageAnchor
                imageUrl={youtubeIcon}
                altText="facebook icon"
                aHref="https://youtube.com/"
                width="6"
                height="6"
              />
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
              <Link to="/courses">Courses</Link>
              <a href="#testimonial">Testimonials</a>
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
        <p className="text-sm text-center">
          Copyright &copy; {new Date().getFullYear()} Microdome Classes.
        </p>
        <p className="text-sm text-center">All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
