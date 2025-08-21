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

  // ✅ Force download with Cloudinary fl_attachment and custom filename
  const handleDownload = (url, fileName = "notes.pdf") => {
    let safeFileName = fileName.replace(/\s+/g, "_"); // replace spaces with _
    let downloadUrl = url.includes("fl_attachment")
      ? url
      : url.replace("/upload/", `/upload/fl_attachment:${safeFileName}/`);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", safeFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-[50vh] md:h-[64vh] overflow-y-scroll mt-2 pb-6 md:px-2 md:scrollbar">
      <div className="mt-4">
        {sections.map((section, index) => (
          <div className="w-full mb-1" key={index}>
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(
                              lecture.noteURL,
                              lecture.noteTitle || "notes.pdf"
                            );
                          }}
                          className="px-2 py-0.5 border border-blue-400 rounded-sm hover:bg-blue-200 text-sm flex items-center gap-1"
                        >
                          <RiFolderOpenLine className="inline" size={14} />
                          Notes
                        </button>
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
