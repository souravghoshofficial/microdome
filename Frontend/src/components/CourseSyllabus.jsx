import { useState } from "react";
import { RiArrowDownSLine } from "@remixicon/react";

const CourseSyllabus = ({ syllabus }) => {
  const [showMenu, setshowMenu] = useState(
    new Array(syllabus.length).fill(false)
  );
  const openMenu = (index) => {
    const newMenu = [...showMenu];
    newMenu[index] = !newMenu[index];
    setshowMenu(newMenu);
  };
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold">Course Syllabus</h2>
      <div className="mt-4">
        {syllabus.map((item, index) => (
          <div className="w-full md:w-[90%] mb-4">
            <div
              key={index}
              onClick={() => openMenu(index)}
              className="p-3 border cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`${
                    showMenu[index] ? "rotate-180" : "rotate-0"
                  } transition-all duration-300 `}
                >
                  <RiArrowDownSLine size={24} />
                </div>
                <h3 className="text-lg font-semibold ">{item.subject}</h3>
              </div>
            </div>
            <div
              className={`p-3 border border-t-0 ${
                showMenu[index] ? "block" : "hidden"
              }`}
            >
              <ul>
                {item.topics.map((topic) => (
                  <li key={topic} className="mt-0.5 px-5">
                    <span className="mr-2">•</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSyllabus;
