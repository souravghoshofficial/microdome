import React from "react";

const ResourceVideo = ({videoTitle , videoUrl}) => {
  return (
    <div className="w-full flex items-center justify-center">
      <iframe className="w-full h-[53vw] lg:w-[40vw] lg:h-[22.5vw] rounded-xl"
        src={videoUrl}
        title={videoTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default ResourceVideo;
