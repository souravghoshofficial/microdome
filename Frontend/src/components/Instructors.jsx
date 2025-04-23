import React from 'react';
import InstructorsCard from "./InstructorsCard";
import Sayan from '../assets/sayanpic.png';
import Rupayan from '../assets/Rupayan_pic.png';
import Subhadeep from '../assets/subhadip_pic.png';
import Akash from '../assets/Akash_pic.jpg';




const mentors = [
  {
    name: "Sayan Ganguly",
    subject: "Founder of Microdome Classes",
    description:
      "<strong className='text-blue-500'>Qualifications:–</strong> 1. B.Sc. Microbiology (Hons), Kalyani Mahavidyalaya, Kalyani. 2. M.Sc. Virology, ICMR-National Institute of Virology, Pune. <strong className='text-blue-500'>Achievement:–</strong>1. IIT-JAM, GATE, GAT-B, CUET-PG, SPPU OEE qualified. 2. Got selected for admission into Pondicherry University, BHU, SPPU, ICMR-NIV.",
    image: Sayan,
  },
  {
    name: "Rupayan Bhattacharjee",
    subject: "Actogen batch mentor",
    description:
      "<strong className='text-blue-500'>Qualifications:–</strong> 1. B.Sc. Biochemistry (Hons), Gurudas College, Kolkata.  2. M.Sc. Virology, ICMR-National Institute of Virology,Pune.  <strong className='text-blue-500'>Achievement:–</strong> 1. CUET-PG, AIIMS, SPPU OEE qualified.  2. Got selected for admission into Pondicherry University, BHU, AIIMS, ICMR-NIV.",
    image: Rupayan,
  },
  {
    name: "Subhadeep Podder",
    subject: "Actogen batch mentor",
    description:
      "<strong className='text-blue-500'>Qualifications:–</strong>  1. B.Sc. Mirobiology (Hons), St. Xavier’s College, Kolkata.  2. M.Sc. Virology, ICMR-National Institute of Virology, Pune. <strong className='text-blue-500'>Achievement:–</strong> 1. DST INSPIRE Scholar.",
    image: Subhadeep,
  },

  {
    name: "Akash Biswas",
    subject: "Semester Batch mentor",
    description:
      "<strong className='text-blue-500'>Qualifications:–</strong> 1. B.Sc. Microbiology (Hons), Kalyani Mahavidyalaya, Kalyani.  2. Gujarat Biotechnology University, Gujarat. <strong className='text-blue-500'>Achievement:–</strong>1. TIFR, IIT-JAM, GATE, GAT-B, CUET-PG, SPPU OEE qualified.  2. Got selected for admission into BHU, SPPU, GBU, ICMR-NIV, IBAB.",
    image: Akash,
  },
];

const Instructors=()=>{
return (
  <section>
  <h1 className="text-5xl text-black dark:text-white text-center font-bold">Our <span className='text-button'>Instructors</span></h1>
  <p className='text-1xl text-center py-3.5'>Learning becomes limitless when you have the right mentors.</p>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-15">
          {mentors.map((mentor, index) => (
            <InstructorsCard
              key={index}
              image={mentor.image}
              name={mentor.name}
              subject={mentor.subject}
              description={mentor.description}
            />
          ))}
        </div>
  </section>
);
};

export default Instructors;