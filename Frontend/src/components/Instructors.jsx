import React , { useRef } from 'react';
import InstructorsCard from "./InstructorsCard";
import Sayan from '../assets/sayan.png';
import Rupayan from '../assets/Rupayan.png';
import Subhadeep from '../assets/subhadip.png';
import Akash from '../assets/Akash.png';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay , Navigation } from 'swiper/modules';

import{ RiArrowRightSLine , RiArrowLeftSLine } from "@remixicon/react"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/bundle';


const mentors = [
  {
    name: "Sayan Ganguly",
    subject: "Founder of Microdome Classes",
    description:
    "<strong>M.Sc.</strong> in <strong>Virology</strong> from <strong>ICMR-National Institute of Virology,</strong> Pune.",
    image: Sayan,
  },
  {
    name: "Rupayan Bhattacharjee",
    subject: "Actogen Batch Mentor",
    description:
      "<strong>M.Sc.</strong> in <strong>Virology</strong> from <strong>ICMR-National Institute of Virology,</strong> Pune.",
    image: Rupayan,
  },
  {
    name: "Subhadeep Podder",
    subject: "Actogen Batch Mentor",
    description:
      "<strong>M.Sc.</strong> in <strong>Virology</strong> from <strong>ICMR-National Institute of Virology,</strong> Pune.",
    image: Subhadeep,
  },

  {
    name: "Akash Biswas",
    subject: "Semester Batch Mentor",
    description:
      "<strong>M.Sc.</strong> in <strong>Biotechnology</strong> from <strong>Gujrat Biotechnology University,</strong> Gandhinagar.",
    image: Akash,
  },
];

const Instructors=()=>{
  const swiperRef = useRef(null);
return (
  <section className='w-[90%] mx-auto my-8 md:my-16'>
    <p className="dark:text-white text-center">Meet</p>
  <h1 className="text-3xl md:text-4xl text-black dark:text-white text-center font-bold">Your <span className='text-button'>Instructors</span></h1>
  <p className='text-center mt-4'>Learning becomes limitless when you have the right mentors.</p>
  
  <Swiper modules={[Autoplay , Navigation]} navigation={false} onBeforeInit={(swiper) => swiperRef.current = swiper} spaceBetween={0} speed={1000} slidesPerView={1} loop={true}  autoplay={{pauseOnMouseEnter: true}}  className="w-[100%] md:w-[90%] mt-8 flex shrink-0 mx-auto dark:bg-gray-50/[.10] rounded-2xl shadow-2xl transition-shadow">
       
            {mentors.map((mentor, index) => (
                <SwiperSlide> <InstructorsCard
                key={index}
                image={mentor.image}
                name={mentor.name}
                subject={mentor.subject}
                description={mentor.description}
              /></SwiperSlide>
       
          ))}
        </Swiper>
        <div className='mt-4 mx-auto w-full md:w-[90%] flex items-center gap-5 justify-center md:justify-end text-white'>
          <button className='w-12 h-12 bg-highlighted rounded-full flex items-center justify-center cursor-pointer' onClick={() => swiperRef.current?.slidePrev()}>
            <RiArrowLeftSLine size={28} />
          </button>
          <button className='w-12 h-12 bg-highlighted rounded-full flex items-center justify-center cursor-pointer' onClick={() => swiperRef.current?.slideNext()}>
            <RiArrowRightSLine size={28} />
          </button>
        </div>
  </section>
);
};

export default Instructors;