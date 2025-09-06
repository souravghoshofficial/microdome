import { useState } from "react";
import { RiArrowDownSLine, RiFolderOpenLine } from "@remixicon/react";

const CourseSection = ({ sections, videoURL, setVideoURL }) => {
  const [showMenu, setshowMenu] = useState(
    new Array(sections.length).fill(false)
  );

  const openMenu = (index) => {
    const newMenu = [...showMenu];
    newMenu[index] = !newMenu[index];
    setshowMenu(newMenu);
  };

  // ✅ Generate safe Cloudinary download URL
  const getDownloadUrl = ({ url, fileName }) => {
  if (!url) return "#";

  // ensure HTTPS
  let safeUrl = url.startsWith("http://")
    ? url.replace("http://", "https://")
    : url;

  const safeFileName = (fileName || "notes")
    .replace(/\s+/g, "_") // replace spaces
    .replace(/[^a-zA-Z0-9._-]/g, ""); // remove special chars

  return safeUrl.includes("/upload/")
    ? safeUrl.replace("/upload/", `/upload/fl_attachment:${safeFileName}/`)
    : safeUrl;
};


  return (
    <div className="w-full h-[50vh] md:h-[64vh] overflow-y-scroll mt-2 pb-6 md:px-2 md:scrollbar">
      <div className="mt-4">
        {sections.map((section, index) => (
          <div className="w-full mb-4" key={index}>
            <div
              onClick={() => openMenu(index)}
              className="p-3 border cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold ">
                  <span>{`Section ${index + 1}: `}</span>
                  {section.title}
                </h3>
                <div
                  className={`${
                    showMenu[index] ? "-rotate-180" : "rotate-0"
                  } transition-all duration-300 `}
                >
                  <RiArrowDownSLine size={24} />
                </div>
              </div>
            </div>
            <div
              className={`border border-t-0 ${
                showMenu[index] ? "block" : "hidden"
              }`}
            >
              <ul>
                {section.lectures.map((lecture, idx) => (
                  <div
                    key={lecture._id || idx}
                    onClick={() => setVideoURL(lecture.videoURL)}
                    className={`${
                      lecture.videoURL === videoURL
                        ? "bg-gray-200 dark:bg-zinc-800"
                        : ""
                    } p-4 hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer`}
                  >
                    <li>
                      <span className="mr-1">{idx + 1}.</span>
                      {lecture.title}
                    </li>
                    {lecture?.noteURL && (
                      <div className="w-full flex justify-end">
                        <a
                          href={getDownloadUrl({
                            url: lecture.noteURL,
                            fileName: lecture.noteTitle,
                          })}
                          download
                          onClick={(e) => e.stopPropagation()} // ✅ don’t trigger video play
                          className="px-2 py-0.5 border border-blue-400 rounded-sm hover:bg-blue-200 text-sm flex items-center gap-1"
                        >
                          <RiFolderOpenLine className="inline" size={14} />
                          Notes
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSection;
