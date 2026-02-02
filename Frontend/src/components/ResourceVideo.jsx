import React from "react";

const ResourceVideo = ({ title, url }) => {
  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-black aspect-video">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={url}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default ResourceVideo;
