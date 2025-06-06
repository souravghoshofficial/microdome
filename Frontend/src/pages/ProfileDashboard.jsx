import React from "react";
import { UserIcon } from "../components";
import { RiEditBoxLine } from "@remixicon/react";
import { useSelector} from "react-redux";
import { Link } from "react-router";

import {
  RiGraduationCapLine,
  RiMailLine,
} from "@remixicon/react";

import { Link } from "react-router";


const ProfileDashboard = () => {
  const userData = useSelector((state) => state.auth.userData);
  return (
    <div className="w-full pt-24 flex items-center justify-center relative">
      <div className="w-[90%] flex flex-col md:flex-row gap-8 lg:gap-0">
        <div className="w-full lg:w-[25%] h-screen px-4 py-6 border border-gray-950/[.1] dark:border-gray-50/[.1]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserIcon className="w-16 h-16" />
              <div className="flex flex-col">
                <h3 className="text-xl">{userData?.name || "User Name"}</h3>
                <p className="text-sm font-light mt-1">
                  {userData?.email || "user email"}
                </p>
              </div>
            </div>
            <Link to ="edit"
              className="p-1 cursor-pointer"
            >
              <RiEditBoxLine size={20} />
            </Link>
          </div>
          <hr className="w-full h-0.5 my-5 text-gray-950/[.1] dark:text-gray-50/[.1]" />
          <div>
            <h3 className="font-semibold">Personal Information</h3>
            <div className="mt-6 flex items-center gap-2">
              <RiMailLine size={16} />
              <p className="text-sm">{userData?.email || "user email"}</p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <RiGraduationCapLine size={16} />
              <p className="text-sm">{userData?.instituteName || "-"}</p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <RiGraduationCapLine size={16} />
              <p className="text-sm">{userData?.presentCourseOfStudy || "-"}</p>
            </div>
          </div>
          <hr className="w-full h-0.5 my-5 text-gray-950/[.1] dark:text-gray-50/[.1]" />
          <div>
            <h3 className="font-semibold">Enrolled Courses</h3>
            <div className="mt-6 flex items-center gap-2">
              <div className="text-sm">{userData?.enrolledCourses.length > 0 ? userData?.enrolledCourses.map((item) => (<Link to="/my-course" key={item}>{item}</Link>)) : <p>You haven't enrolled in  any course</p>}</div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[75%] h-screen px-4 py-6 border border-gray-950/[.1] dark:border-gray-50/[.1]  lg:border-l-0">
          {" "}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
