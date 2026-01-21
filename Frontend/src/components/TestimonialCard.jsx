import React, { useState } from "react";

const MAX_LENGTH = 210;

const TestimonialCard = ({ name, message, imageUrl, presentCourseOfStudy , instituteName }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => setIsExpanded((prev) => !prev);

  const shouldTruncate = message.length > MAX_LENGTH;
  const displayMessage = isExpanded || !shouldTruncate ? message : message.slice(0, MAX_LENGTH) + "...";

  return (
    <div
      id="testimonial-card"
      className="select-none w-[320px] md:w-[360px] p-6 rounded-xl border cursor-pointer border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] text-black dark:text-white "
    >
      <div className="w-full flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-transparent ring ring-gray-400 dark:ring-white">
<img
          className="w-full h-full object-cover object-center"
          src={imageUrl}
          alt="user"
        />
        </div>
        <div>
          <p className="text-sm font-bold">{name}</p>
          <p className="mt-px opacity-80 text-xs">{presentCourseOfStudy}</p>
          <p className="mt-px opacity-80 text-xs">{instituteName}</p>
        </div>
      </div>

      <h3 className="mt-4 text-wrap text-sm font-light italic">
        {displayMessage}
        {shouldTruncate && (
          <button
            onClick={toggleReadMore}
            className="text-blue-500 ml-1 cursor-pointer"
          >
            {isExpanded ? "See less" : "See more"}
          </button>
        )}
      </h3>
    </div>
  );
};

export default TestimonialCard;



