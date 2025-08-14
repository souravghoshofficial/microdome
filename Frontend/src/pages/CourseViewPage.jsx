import { useState , useEffect } from "react";
import { Logo, CourseSection } from "../components";
import axios from "axios";
import { useParams , Link } from "react-router";
import { TriangleAlert } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;


const CourseViewPage = () => {
   const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [loadingText,setLoadingText] = useState("Loading...");
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
      `${ApiUrl}/courses/get-full-course/${id}`,
      { withCredentials: true }
    );
        setCourse(res.data.course);
        setVideoURL(res.data.course.sections[0].lectures[0].videoURL);
      } catch (err) {
        console.error("Failed to fetch course",err);
        if(err.status==401){
          setLoadingText("Unauthorized to access the course");
        }
      }
    };

    fetchCourse();
  }, [id]);

  
  if (!course) return <div className="w-full h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white">
    {
      loadingText !== "Loading..." ? (<TriangleAlert className="text-yellow-600 h-15 w-15 mr-1"/>):" "
    }

    <h1 className="text-lg">{loadingText}</h1>
    </div>;

  return (
    <div className="w-full h-screen overflow-hidden bg-white dark:bg-zinc-900 text-black dark:text-gray-100">
      <div className="w-full px-8 py-3 flex items-center gap-4">
        <Link to="/">
         <Logo className={"w-12 h-12"} />
        </Link>
        <h1 className="text-xl font-bold">{course?.courseTitle}</h1>
      </div>
      <div className="w-full mt-2 flex flex-col md:flex-row">
        <div className="w-full md:w-[60%] p-4 flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center">
            <iframe
              className="w-full h-[55vw] md:w-[90%] md:h-[30vw]"
              src={videoURL}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div className="w-full md:w-[40%]">
          <div className="w-full md:w-[90%] mx-auto p-4">
            <h2 className="text-lg font-bold pb-1 border-b-2 border-b-highlighted inline-block">Course Content</h2>
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
