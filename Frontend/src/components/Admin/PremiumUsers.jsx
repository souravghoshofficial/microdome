import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Users } from 'lucide-react'
import axios from "axios";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const PremiumUsers = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get(`${ApiUrl}/admin/courses-with-user-counts`, {
        withCredentials: true,
      })
      .then((res) => setCourses(res.data.courses))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen w-full">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-800">All Courses</h1>
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
              className="h-56 w-full object-cover rounded-md"
            />

           <div className="w-full my-1">
             <h2 className="text-xl font-semibold text-left mt-4">
              {course.courseTitle}
            </h2>
           </div>

              <div className="ml-auto flex items-center gap-1 text-blue-700 py-1 px-3 rounded bg-blue-50">
                <Users className="w-4 h-4" />
              <span className="font-semibold text-sm">{course.studentCount}</span>
              </div>
          

            <Link
              to={`/admin/premium-users/${course._id}`}
              className="mt-4 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 w-full flex items-center justify-center gap-2"

            >
              <Users className="w-4 h-4" />
              <span className="font-semibold">View Students</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumUsers;

