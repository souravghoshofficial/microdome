import { useSelector } from "react-redux";
import { Link } from "react-router";
import { VerifiedBadge } from "../components";
import {
  RiShieldUserLine,
  RiEditBoxLine,
  RiBookOpenLine,
  RiExternalLinkLine,
  RiQuestionAnswerLine
} from "@remixicon/react";
import { Pencil } from "lucide-react"
import { useEffect, useState } from "react";
import axios from "axios";

import userImg from "../assets/user-img.jpeg";
const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const ProfileDashboard = () => {
  const userData = useSelector((state) => state.auth.userData);
  const enrolledMockTestBundles = useSelector((state) => state.enrolledMockTestBundles.MockTestBundleDetails)
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseIds = userData?.enrolledCourses || [];
        if (courseIds.length === 0) return;

        const { data } = await axios.post(`${ApiUrl}/courses/get-enrolled-courses`, {
          courseIds,
        });

        setCourses(data?.courses || []);
      } catch (error) {
        console.error("Failed to fetch course titles", error);
      }
    };

    fetchCourseDetails();
  }, [userData]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex justify-center items-center px-4 py-12 text-black dark:text-white transition-colors duration-300">
      <div className="w-full max-w-5xl mt-8 md:mt-4 bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* Left: Profile Section */}
          <div className="relative md:w-1/3 p-10 
          bg-gradient-to-br from-slate-800 via-slate-900 to-black
          text-white
          flex flex-col items-center justify-center
          rounded-l-3xl
          shadow-xl">
          <img
            src={userData?.profileImage || userImg}
            alt="Profile"
            className="w-36 h-36 rounded-full border-3 border-highlighted p-1 object-center object-cover"
          />
         <div className="mt-6 flex items-center justify-center gap-2" >
           <h2 className="text-2xl font-semibold">{userData?.name || "User Name"}</h2>
          {userData?.isPremiumMember && <VerifiedBadge />}
         </div>
          <p className="text-sm opacity-80 mt-2">
            Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : "N/A"}
          </p>
          <Link
            to="edit"
            className="absolute top-4 right-4 bg-white text-blue-600 p-2 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Pencil size={20} />
          </Link>
        </div>

        {/* Right: Info Cards */}
        <div className="flex-1 p-6 md:p-8 grid grid-cols-1 gap-6">

          {/* Personal Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4 text-blue-600 font-semibold">
              <RiShieldUserLine size={20} />
              Personal Information
            </div>
            <div className="text-sm space-y-2">
              <p><span className="font-medium">Full Name:</span> {userData?.name || "-"}</p>
              <p><span className="font-medium">Email:</span> {userData?.email || "-"}</p>
              <p><span className="font-medium">Mobile:</span> {userData?.mobileNumber || "-"}</p>
              <p><span className="font-medium">Institute Name:</span> {userData?.instituteName || "-"}</p>
              <p><span className="font-medium">Present Course of Study:</span> {userData?.presentCourseOfStudy || "-"}</p>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4 text-green-600 font-semibold">
              <RiBookOpenLine size={20} />
              Enrolled Courses
            </div>
            <div className="text-sm space-y-2">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <p key={course._id}>
                    <Link
                      to={`/my-courses/${course._id}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <RiExternalLinkLine size={14} />
                      {course.courseTitle}
                    </Link>
                  </p>
                ))
              ) : (
                <p className="text-gray-500">You haven't enrolled in any course</p>
              )}
              
            </div>
          </div>

          {/* Mock Test Series */}

          {
            enrolledMockTestBundles?.length>0 && 
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4 text-green-600 font-semibold">
              <RiQuestionAnswerLine size={20} />
              Test Series
            </div>
            <div className="text-sm space-y-2">    
                    {enrolledMockTestBundles?.map(bundle=>(
                      <Link key={bundle._id}
                      to={`/my-bundles/${bundle._id}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <RiExternalLinkLine size={14} />
                      {bundle.title}
                    </Link>
                    ))}
            </div>
          </div>
          }

          {/* Quizzes */}
           {
            userData?.hasAccessToQuizzes && <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4 text-green-600 font-semibold">
              <RiQuestionAnswerLine size={20} />
              Purchased Quizzes
            </div>
            <div className="text-sm space-y-2">    
                    <Link
                      to={`/quizzes`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <RiExternalLinkLine size={14} />
                      {"Go to Quizzes"}
                    </Link>
            </div>
          </div>
           }

        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;