import React from "react";
import { UserIcon } from "../components";
import { RiEditBoxLine } from "@remixicon/react";
import { useSelector , useDispatch } from "react-redux";
import { login, logout } from "../features/auth/authSlice";
import axios from "axios";
import {
  RiGraduationCapLine,
  RiMailLine,
  RiMapPinLine,
  RiCloseCircleFill,
} from "@remixicon/react";
import { useState } from "react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const ProfileDashboard = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.auth.userData);

  const [showPopUp, setShowPopUp] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileImage) return alert("Please select an image");

    const formData = new FormData();
    formData.append("profileImage", profileImage);

    axios
      .post(`${ApiUrl}/api/v1/users/update-user-profile-image`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        dispatch(logout());
        dispatch(login(res.data.data));
        alert("Image uploaded successfully!");
        setShowPopUp(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full pt-24 flex items-center justify-center relative">
      {showPopUp && (
        <div className="w-80 bg-gray-300 absolute top-[50%] left-[50%] h-80 translate-x-[-50%] translate-y-[-50%] rounded-xl">
          <div
            className="absolute top-4 right-4 cursor-pointer"
            onClick={() => {
              setShowPopUp(false);
            }}
          >
            <RiCloseCircleFill size={20} />
          </div>
          <div className="flex items-center justify-center h-full">
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={(e) => {
                  setProfileImage(e.target.files[0]);
                }}
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-500 text-white rounded-lg"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
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
            <div
              className="p-1 cursor-pointer"
              onClick={() => {
                setShowPopUp(true);
              }}
            >
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
              <RiGraduationCapLine size={16} />
              <p className="text-sm">{userData?.presentCourseOfStudy || "-"}</p>
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
