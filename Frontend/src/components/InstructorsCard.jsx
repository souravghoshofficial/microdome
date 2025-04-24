import React from "react";
import parse from 'html-react-parser';

export default function InstructorsCard({ image, name, subject, description1 , description2 }) {
  return (
    <div className="w-[100%] flex flex-col-reverse lg:flex-row  justify-between shrink-0 overflow-hidden h-[70vh] md:h-auto">
    <div className="w-[100%] lg:w-[50%] flex justify-center pt-4 relative">
    <div className="absolute bottom-0 w-40 h-40 md:h-60 md:w-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
    <img 
        src={image}
        alt={name}
        className="w-full h-full object-cover"
      />
    </div>
      <div className="w-[70%] sm:w-[50%] md:w-[50%] lg:w-[75%] h-32 md:h-60 lg:h-80  flex items-end">
        <div className="h-[150px] md:h-[240px] w-full  rounded-t-full p-[25px] md:p-[40px] md:pb-0 pb-0 border border-blue-500 mb-[-20px] md:mb-[-36px]">
            <div className="h-full w-full bg-blue-500 rounded-t-full">
            </div>
        </div>
      </div>
    </div>
 <div className="w-[100%] lg:w-[50%] p-6 md:p-4 lg:pr-8"> 
 <h3 className=" dark:text-white text-xl md:text-2xl font-bold text-gray-800 lg:mt-4 mt-1">{name}</h3>
      <p className="dark:text-white text-indigo-600 font-semibold">{subject}</p>
      <p className="mt-4 dark:text-white text-black text-sm leading-5">{parse(description1)}</p>
      <p className="mt-4 dark:text-white text-black text-sm leading-5">{parse(description2)}</p>
 </div>
    </div>
  );
}
