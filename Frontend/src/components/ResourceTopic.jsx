import React from "react";
import ResourceVideo from "./ResourceVideo.jsx";
import ResourceNote from "./ResourceNote.jsx";

const ResourceTopic = ({resource}) => {
  return (
    <div className="w-full flex justify-center items-center my-8 ">
      <div className="w-full">
        <h3 className="text-2xl md:text-3xl font-semibold">
          Topic : {resource.topic}
        </h3>
        <div className="demo-videos w-full mt-4">
          <h4 className="text-xl md:text-2xl lg:w-[95%] mx-auto">Videos :</h4>
          {/* Resource Videos Container */}
          <div className="w-full mt-2 md:mt-4 lg:mt-6 gap-y-8 lg:gap-y-16 grid grid-cols-1 lg:grid-cols-2">
            {resource.videos.map((video) => (<ResourceVideo key={video.videoTitle} videoTitle={video.videoTitle} videoUrl={video.videoUrl} />))}
          </div>
        </div>
        <div className="notes w-full mt-8">
          <h4 className="text-xl md:text-2xl lg:w-[95%] mx-auto">Notes :</h4>
          {/* Resource Notes Container */}
          <div className="w-full mt-2 md:mt-4 lg:mt-6">
            {resource.notes.map((note) => (<ResourceNote key={note.noteTitle} noteTitle={note.noteTitle} noteUrl={note.noteUrl} />))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceTopic;
