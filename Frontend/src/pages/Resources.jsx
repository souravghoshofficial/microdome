import React from "react";
import { ResourceTopic } from "../components";

import BT_Syllabus from "../assets/pdfs/BT_Syllabus.pdf"

const resources = [
  {
    topic: "Translation",
    videos: [
      {
        videoTitle: "Translation Part 1",
        videoUrl: "https://youtube.com/embed/iyfxjqj6V9I?si=yuH7USvbRXFQgLf7",
      },
      {
        videoTitle: "Translation Part 2",
        videoUrl: "https://youtube.com/embed/f7BGjK6dqTA?si=xPc4CfLBJcWYzspF",
      },
    ],
    notes: [
      {
        noteTitle: "Translation Part 1",
        noteUrl: BT_Syllabus,
      },
      {
        noteTitle: "Translation Part 2",
        noteUrl: BT_Syllabus,
      },
    ]
  },
]

const Resources = () => {
  return (
    <div className="w-full flex items-center justify-center transition-colors duration-300">
      <div className="my-24 md:my-32 w-[90%]">
      <h4 className='text-center text-sm font-bold'>Resources</h4>
      <h2 className='text-3xl md:text-4xl font-bold text-center'>View Resources</h2>
        <div className="w-full mt-8">
        {resources.map((resource) => (<ResourceTopic key={resource.topic} resource={resource} />))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
