import React from "react";
import { ResourceTopic } from "../components";

import OperonPart1 from '../assets/pdfs/OperonPart1.pdf'
import OperonPart2 from '../assets/pdfs/OperonPart2.pdf'
import OperonPart3 from '../assets/pdfs/OperonPart3.pdf'
import MolBioNumericals from '../assets/pdfs/MolBioNumericals.pdf'

const resources=[
  {
    id:1,
    topic: "Operon",
    videos:[{
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
      id: 3,
      title: "YouTube video 3",
      url: "https://www.youtube.com/embed/IhYvk-pPDcw?si=Z4tsecPAsQS92JIk",
    },],
    notes:[  {
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
    },],
  },
];

const Resources = () => {
  return (
    <div className="w-full flex items-center justify-center transition-colors duration-300">
      <div className="my-24 md:my-32 w-[90%]">
      <h4 className='text-center text-sm font-bold'>Resources</h4>
      <h2 className='text-3xl md:text-4xl font-bold text-center'>Molecular Biology</h2>
      {resources.map((resource)=>(
         <ResourceTopic key={resource.id} topic={resource.topic} videos={resource.videos} notes={resource.notes}/>
      ))}
      </div>
    </div>
  );
};

export default Resources;