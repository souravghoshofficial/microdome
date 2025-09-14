import { useState, useEffect } from "react";
import { Logo, CourseSection } from "../components";
import axios from "axios";
import { useParams, Link } from "react-router";
import { TriangleAlert } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const CourseViewPage = () => {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    // Cleanup when the component is unmounted
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [loadingText, setLoadingText] = useState("Loading...");
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/courses/get-full-course/${id}`, {
          withCredentials: true,
        });
        setCourse(res.data.course);
        setVideoURL(res.data.course.sections[0].lectures[0].videoURL);
      } catch (err) {
        console.error("Failed to fetch course", err);
        if (err.status == 401) {
          setLoadingText(err.response.data.message);
        }
      }
    };

    fetchCourse();
  }, [id]);

  if (!course)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white flex-col md:flex-row p-6">
        {loadingText !== "Loading..." ? (
          <TriangleAlert className="text-yellow-600 h-15 w-15 mr-1" />
        ) : (
          " "
        )}

        <h1 className="text-lg md:text-2xl">{loadingText}</h1>
      </div>
    );

  return (
    <div className="w-full h-screen overflow-hidden bg-white dark:bg-zinc-900 text-black dark:text-gray-100">
      <div className="w-full px-4 md:px-8 py-3 flex items-center gap-3">
        <Link to="/">
          <Logo className={"w-7 md:w-9"} />
        </Link>
        <h1 className="text-xl font-bold gradiant-text">{course?.courseTitle}</h1>
      </div>
      <div className="w-full mt-2 flex flex-col md:flex-row">
        <div className="w-full md:w-[60%] p-4 md:pl-8 flex-col items-center justify-center">
          <div className="relative w-full h-[55vw] md:w-[90%] md:h-[30vw]">
            {/* The YouTube Iframe */}
            <iframe
              className="w-full h-full"
              src={videoURL}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen="1"
            ></iframe>

            {/* The Overlay to hide top-right buttons */}
            {/* <div className="absolute top-0 right-0 w-full h-[100px] bg-transparent hidden md:block"></div>
            <div className="absolute bottom-0 right-12 w-[70px] h-[40px] bg-transparent hidden md:block"></div>
            <div className="absolute bottom-0 left-0 w-[200px] h-[60px] bg-transparent hidden md:block"></div> */}

            {/* <div className="absolute top-0 right-0 w-full h-[50px] bg-transparent block md:hidden"></div>
            <div className="absolute bottom-0 left-0 w-full h-[40px] bg-transparent block md:hidden"></div> */}
          </div>
        </div>
        <div className="w-full md:w-[40%]">
          <div className="w-full md:w-[90%] mx-auto p-4">
            <h2 className="text-lg font-bold pb-1 border-b-2 border-b-highlighted inline-block">
              Course Content
            </h2>
            <CourseSection
              videoURL={videoURL}
              setVideoURL={setVideoURL}
              sections={course?.sections}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewPage;
