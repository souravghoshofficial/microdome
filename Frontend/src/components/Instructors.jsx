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
    description1:
    "Sayan Ganguly is a dedicated educator with a strong academic and research background in microbiology. He completed his <strong> B.Sc. in Microbiology (Hons.)</strong> from <strong>Kalyani Mahavidyalaya, Kalyani</strong> and went on to pursue an <strong>M.Sc. in Virology</strong> from the renowned <strong>ICMR-National Institute of Virology, Pune.</strong>",
    description2: "Throughout his academic journey, Sayan has demonstrated excellence by qualifying several national-level competitive exams including <strong>IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE.</strong> His consistent performance earned him admission offers from prestigious institutions such as <strong>Pondicherry University, BHU, SPPU, and ICMR-NIV.</strong>",
    image: Sayan,
  },
  {
    name: "Rupayan Bhattacharjee",
    subject: "Actogen Batch Mentor",
    description1:
      "Rupayan Bhattacharya is a passionate and knowledgeable mentor in the field of life sciences. He earned his <strong>B.Sc. in Biochemistry (Hons.)</strong> from <strong>Gurudas College, Kolkata</strong> and went on to complete his <strong>M.Sc. in Virology</strong> from the esteemed <strong>ICMR-National Institute of Virology, Pune.</strong>",
    description2:
      "Rupayan has qualified several national-level entrance exams including <strong>CUET-PG, AIIMS, and SPPU OEE,</strong> and received admission offers from reputed institutes such as <strong>Pondicherry University, BHU, AIIMS, and ICMR-NIV.</strong> His academic achievements and commitment to teaching make him an excellent guide for students aspiring to excel in competitive biology exams.",
    image: Rupayan,
  },
  {
    name: "Subhadeep Podder",
    subject: "Actogen Batch Mentor",
    description1:
      "Subhadeep Podder is an enthusiastic mentor with a solid academic foundation in microbiology and virology. He completed his <strong>B.Sc. in Microbiology (Hons.)</strong> from <strong>St. Xavier’s College, Kolkata</strong> and pursued an <strong>M.Sc. in Virology</strong> at the prestigious <strong>ICMR-National Institute of Virology, Pune.</strong>",
    description2:
      "Recognized for his academic excellence, Subhadeep is a proud recipient of the <strong>DST INSPIRE Scholarship,</strong> one of the most competitive and prestigious awards for young scientists in India. His passion for the subject and commitment to mentoring make him a valuable guide for students preparing for higher studies in life sciences.",
    image: Subhadeep,
  },

  {
    name: "Akash Biswas",
    subject: "Semester Batch Mentor",
    description1:
      "Akash Biswas is a dedicated and driven mentor with a strong background in microbiology and biotechnology. He completed his <strong>B.Sc. in Microbiology (Hons.)</strong> from <strong>Kalyani Mahavidyalaya, Kalyani</strong> and is currently pursuing higher studies at <strong>Gujarat Biotechnology University, Gujarat.</strong>",
    description2:
      "Akash has an impressive record of qualifying top national exams including <strong>TIFR, IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE.</strong> He has also secured admission offers from prestigious institutions like <strong>BHU, SPPU, GBU, ICMR-NIV, and IBAB.</strong> With his strong academic credentials and commitment to student success, he brings valuable insight and support to aspiring life science candidates.",
    image: Akash,
  },
];

const Instructors=()=>{
  const swiperRef = useRef(null);
return (
  <section className='w-[90%] mx-auto my-8 md:my-16'>
  <h1 className="text-3xl md:text-4xl text-black dark:text-white text-center font-bold">Our <span className='text-button'>Instructors</span></h1>
  <p className='text-center mt-4'>Learning becomes limitless when you have the right mentors.</p>
  <Swiper modules={[Autoplay , Navigation]} navigation={false} onBeforeInit={(swiper) => swiperRef.current = swiper} spaceBetween={0} speed={1000} slidesPerView={1} loop={true}  autoplay={{pauseOnMouseEnter: true}}  className="w-[100%] md:w-[90%] mt-8 flex shrink-0 mx-auto dark:bg-gray-50/[.10] rounded-2xl shadow-2xl transition-shadow">
       
            {mentors.map((mentor, index) => (
                <SwiperSlide> <InstructorsCard
                key={index}
                image={mentor.image}
                name={mentor.name}
                subject={mentor.subject}
                description1={mentor.description1}
                description2={mentor.description2}
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