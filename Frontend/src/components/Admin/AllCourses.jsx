import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux"

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const user = useSelector((state) => state.auth?.userData)
  useEffect(() => {
    axios
      .get(`${ApiUrl}/courses/get-all-courses`, {
        withCredentials: true,
      })
      .then((res) => setCourses(res.data.courses))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="min-h-screen w-full ">
      <header className="mb-4 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">All Courses</h1>
          {user?.role === "admin" && <Link
            to="/admin/create-course"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow text-sm md:text-base"
          >
            <Plus className="w-4 h-4" />
            Create Course
          </Link>}
        </div>
      </header>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[80vh] overflow-y-scroll p-4 scrollbar-none">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center"
          >
            <img
              src={course.courseImage}
              alt={course.courseTitle}
              className="h-40 w-full object-cover rounded-md"
            />
            <h2 className="text-xl font-semibold text-center mt-4">
              {course.courseTitle}
            </h2>

            <Link
              to={`/my-courses/${course._id}`}
              className="mt-4 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 w-full"
            >
              View Course
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCourses;
