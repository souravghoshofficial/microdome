import React from "react";

const ResourceVideo = ({title,url}) => {
  return (
    <div className="w-[100%] gap-6 grid grid-cols-1 lg:grid-cols-2 mb-16">
        <iframe
          className="w-64 h-auto rounded-2xl lg:w-[560px] lg:h-80"
          src={url}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
    </div>
  );
};

export default ResourceVideo;