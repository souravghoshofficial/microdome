import { useState, useEffect } from "react";
import { Link } from "react-router";
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
              alt={course.cardTitle}
              className="h-40 w-full object-cover rounded-md"
            />

            <h2 className="text-xl font-semibold text-center mt-4">
              {course.cardTitle}
            </h2>

            <p className="mt-2 text-gray-600">
              Students Enrolled:{" "}
              <span className="font-bold">{course.studentCount}</span>
            </p>

            <Link
              to={`/admin/premium-users/${course._id}`}
              className="mt-4 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 w-full"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumUsers;

