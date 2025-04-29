import React from "react";

const ResourceVideo = () => {
  return (
    <div className="w-full lg:w-[50%] flex items-center justify-center bg-blue-600">
      <iframe className="w-full h-auto rounded-md"
        src="https://www.youtube.com/embed/5JX01VGRVa8?si=VvxlE5NVGdYtp-vB&amp;controls=0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  );
};

export default ResourceVideo;
