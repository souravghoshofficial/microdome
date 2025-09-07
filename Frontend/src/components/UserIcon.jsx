import React from "react";
import userImage from "../assets/user-img.jpeg";
import { useSelector } from "react-redux";


const UserIcon = ({ className = "" }) => {
  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  return (
    <div className={`${isLoggedIn ? "block" : "hidden"} ${className} border-2 border-transparent ring-1 ring-black dark:ring-white  rounded-full overflow-hidden`} >
      <img className="w-full object-center object-cover" src={userData?.profileImage || userImage} alt="user image" />
    </div>
  );
};

export default UserIcon;