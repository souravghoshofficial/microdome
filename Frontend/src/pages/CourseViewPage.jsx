import { useState , useEffect } from "react";
import { Logo, CourseSection } from "../components";
import axios from "axios";
import { useParams } from "react-router";

// const course = {
//   _id: "6839c2db6a602d469a28c55e",
//   name: "Fullstack Mastery",
//   price: 999,
//   __v: 0,
//   sections: [
//     {
//       _id: "6839c2db6a602d469a28c556",
//       title: "Frontend Basics",
//       lectures: [
//         {
//           _id: "6839c2db6a602d469a28c550",
//           title: "HTML One Shot",
//           videoURL:
//             "https://www.youtube.com/embed/HcOc7P5BMi4?si=iEOBbQUtb9LkgEwx",
//           noteTitle: "HTML Notes",
//           noteURL: note,
//           __v: 0,
//         },
//         {
//           _id: "6839c2db6a602d469a28c552",
//           title: "CSS One Shot",
//           videoURL:
//             "https://www.youtube.com/embed/ESnrn1kAD4E?si=XLFbmJ5tpqMD53zV",
//           __v: 0,
//         },
//         {
//           _id: "6839c2db6a602d469a28c554",
//           title: "JavaScript One Shot",
//           videoURL:
//             "https://www.youtube.com/embed/VlPiVmYuoqw?si=-s2NZpV-eHO1RlsO",
//           noteTitle: "JavaScript Notes",
//           noteURL: note,
//           __v: 0,
//         },
//       ],
//       __v: 0,
//     },
//     {
//       _id: "6839c2db6a602d469a28c55c",
//       title: "Backend Basics",
//       lectures: [
//         {
//           _id: "6839c2db6a602d469a28c558",
//           title: "Node.js One Shot",
//           videoURL:
//             "https://www.youtube.com/embed/TlB_eWDSMt4?si=BO2UNY_WDZby-cbK",
//           noteTitle: "Node Js Notes",
//           noteURL: note,
//           __v: 0,
//         },
//         {
//           _id: "6839c2db6a602d469a28c55a",
//           title: "MongoDB One Shot",
//           videoURL:
//             "https://www.youtube.com/embed/c2M-rlkkT5o?si=D4kUmwourKAxcdb_",
//           noteTitle: "MongoDB Notes",
//           noteURL: note,
//           __v: 0,
//         },
//         {
//           _id: "6839cb31f936983c2d6da19f",
//           title: "DevOps One Shot",
//           videoURL:
//             "https://www.youtube.com/embed/sSRaakd95Nk?si=JoPIIf1JV1IdhRU6",
//           noteTitle: "DevOps Notes",
//           noteURL: note,
//           __v: 0,
//         },
//       ],
//       __v: 0,
//     },
//   ],
// };

const ApiUrl = import.meta.env.VITE_BACKEND_URL;


const CourseViewPage = () => {
   const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [videoURL, setVideoURL] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
      `${ApiUrl}/api/v1/courses/get-full-course/${id}`,
      {},
      { withCredentials: true }
    );
        setCourse(res.data.course);
        setVideoURL(res.data.course.sections[0].lectures[0].videoURL);
      } catch (err) {
        console.error("Failed to fetch course", err);
      }
    };

    fetchCourse();
  }, [id]);

  
  if (!course) return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;

  

  return (
    <div className="w-full min-h-screen ">
      <div className="w-full px-8 py-3 flex items-center gap-4">
        <Logo className={"w-12 h-12"} />
        <h1 className="text-xl font-bold">{course?.name}</h1>
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
            <h2 className="text-lg font-bold">Course Content</h2>
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
