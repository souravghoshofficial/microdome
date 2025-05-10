import React from "react";
import { UserIcon } from "../components";
import { RiEditBoxLine } from "@remixicon/react";
import { useSelector } from "react-redux";
import {
  RiGraduationCapLine,
  RiMailLine,
  RiMapPinLine,
} from "@remixicon/react";
const ProfileDashboard = () => {
  const userData = useSelector((state) => state.auth.userData);

  return (
    <div className="w-full pt-24 flex items-center justify-center">
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
            <div className="p-1">
              <RiEditBoxLine size={20} />
            </div>
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
              <RiMapPinLine size={16} />
              <p className="text-sm">{userData?.location || "-"}</p>
            </div>
          </div>
          <hr className="w-full h-0.5 my-5 text-gray-950/[.1] dark:text-gray-50/[.1]" />
        </div>
        <div className="w-full lg:w-[75%] h-screen px-4 py-6 border border-gray-950/[.1] dark:border-gray-50/[.1]  lg:border-l-0">
          {" "}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
