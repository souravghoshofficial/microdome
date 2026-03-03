import { useSelector } from "react-redux";
import { Link } from "react-router";
import {
  Pencil,
  BookOpen,
  User,
  ClipboardList,
  ExternalLink,
  FileQuestionMark,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import userImg from "../assets/user-img.jpeg";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const ProfileDashboard = () => {
  const userData = useSelector((state) => state.auth.userData);
  const enrolledMockTestBundles = useSelector(
    (state) => state.enrolledMockTestBundles.MockTestBundleDetails
  );

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseIds = userData?.enrolledCourses || [];
        if (!courseIds.length) return;

        const { data } = await axios.post(
          `${ApiUrl}/courses/get-enrolled-courses`,
          { courseIds }
        );

        setCourses(data?.courses || []);
      } catch (error) {
        console.error("Failed to fetch course titles", error);
      }
    };

    fetchCourseDetails();
  }, [userData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-28">

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-10">

          {/* ================= LEFT PROFILE CARD ================= */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-md p-8 text-center relative">

              <Link
                to="edit"
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
              >
                <Pencil size={18} />
              </Link>

              <img
                src={userData?.profileImage || userImg}
                alt="Profile"
                className="w-28 h-28 mx-auto rounded-full ring-3 ring-highlighted ring-offset-3 ring-offset-white dark:ring-offset-zinc-800 object-cover"
              />

              <h2 className="mt-5 text-xl font-semibold">
                {userData?.name || "User Name"}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Member since{" "}
                {userData?.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <Stat label="Courses" value={courses.length} />
                <Stat
                  label="Test Series"
                  value={enrolledMockTestBundles?.length || 0}
                />
              </div>
            </div>
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="md:col-span-2 space-y-4">

            {/* Personal Info */}
            <Card title="Personal Information" icon={<User size={18} />}>
              <InfoRow label="Full Name" value={userData?.name} />
              <InfoRow label="Email" value={userData?.email} />
              <InfoRow label="Mobile" value={userData?.mobileNumber} />
              <InfoRow label="Institute Name" value={userData?.instituteName} />
              <InfoRow
                label="Present Course"
                value={userData?.presentCourseOfStudy}
              />
            </Card>

            {/* Enrolled Courses */}
            <Card title="Enrolled Courses" icon={<BookOpen size={18} />}>
              {courses.length ? (
                courses.map((course) => (
                  <DashboardLink
                    key={course._id}
                    to={`/my-courses/${course._id}`}
                  >
                    {course.courseTitle}
                  </DashboardLink>
                ))
              ) : (
                <EmptyState text="You haven't enrolled in any course yet." />
              )}
            </Card>

            {/* Test Series */}
            {enrolledMockTestBundles?.length > 0 && (
              <Card title="Test Series" icon={<ClipboardList size={18} />}>
                {enrolledMockTestBundles.map((bundle) => (
                  <DashboardLink
                    key={bundle._id}
                    to={`/my-bundles/${bundle._id}`}
                  >
                    {bundle.title}
                  </DashboardLink>
                ))}
              </Card>
            )}

            {/* Quizzes */}
            {userData?.hasAccessToQuizzes && (
              <Card title="Quizzes" icon={<FileQuestionMark size={18} />}>
                <DashboardLink to="/quizzes">
                  Go to Quizzes
                </DashboardLink>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Card = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-md p-6">
    <div className="flex items-center gap-2 mb-4 font-semibold text-highlighted">
      {icon}
      {title}
    </div>
    <div className="space-y-3 text-sm">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-gray-700 dark:text-gray-300">
    <span className="font-medium">{label}</span>
    <span>{value || "-"}</span>
  </div>
);

const DashboardLink = ({ to, children }) => (
  <Link
    to={to}
    className="flex items-center justify-between text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
  >
    {children}
    <ExternalLink size={14} />
  </Link>
);

const EmptyState = ({ text }) => (
  <p className="text-gray-500 dark:text-gray-400 text-sm">{text}</p>
);

const Stat = ({ label, value }) => (
  <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl py-3">
    <p className="text-lg font-semibold">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

export default ProfileDashboard;