import React from "react";
import { ResourceTopic } from "../components";
const Resources = () => {
  return (
    <div className="w-full flex items-center justify-center transition-colors duration-300">
      <div className="my-24 md:my-32 w-[90%]">
      <h4 className='text-center text-sm font-bold'>Resources</h4>
      <h2 className='text-3xl md:text-4xl font-bold text-center'>View Resources</h2>
      <ResourceTopic/>
      </div>
    </div>
  );
};

export default Resources;
