import React, { useEffect } from "react";
import { ResourceTopic } from "../components";

import OperonPart1 from '../assets/pdfs/OperonPart1.pdf';
import OperonPart2 from '../assets/pdfs/OperonPart2.pdf';
import OperonPart3 from '../assets/pdfs/OperonPart3.pdf';
import MolBioNumericals from '../assets/pdfs/MolBioNumericals.pdf';

import AOS from 'aos';
import 'aos/dist/aos.css';

const resources = [
  {
    id: 1,
    topic: "Operon",
    videos: [
      {
        id: 1,
        title: "YouTube video 1",
        url: "https://www.youtube.com/embed/1s1O-uGcgtc?si=BpCIX4X4PAQh96rB",
      },
      {
        id: 2,
        title: "YouTube video 2",
        url: "https://www.youtube.com/embed/pSkYAE1zzVU?si=GmAomvK91zw6tLl_",
      },
      {
        id: 3,
        title: "YouTube video 3",
        url: "https://www.youtube.com/embed/GHSRvvUd38A?si=3QTh5eom7-KfTedD",
      },
      {
        id: 4,
        title: "YouTube video 4",
        url: "https://www.youtube.com/embed/IhYvk-pPDcw?si=Z4tsecPAsQS92JIk",
      },
    ],
    notes: [
      {
        title: "Operon Part 1",
        file: OperonPart1,
      },
      {
        title: "Operon Part 2",
        file: OperonPart2,
      },
      {
        title: "Operon Part 3",
        file: OperonPart3,
      },
      {
        title: "Numerical Discussions and Solving",
        file: MolBioNumericals,
      },
    ],
  },
];

const Resources = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="w-full flex items-center justify-center transition-colors duration-300">
      <div className="my-24 md:my-32 w-[90%]">
        <h2 className='text-3xl md:text-4xl font-bold text-center' data-aos="fade-down">Molecular Biology</h2>
        {resources.map((resource, index) => (
          <div key={resource.id} data-aos="fade-up" data-aos-delay={index * 100}>
            <ResourceTopic topic={resource.topic} videos={resource.videos} notes={resource.notes} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
