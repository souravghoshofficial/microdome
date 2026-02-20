import React from "react";
import userImage from "../assets/user-img.jpeg";
import { useSelector } from "react-redux";


const UserIcon = ({ className = "" }) => {
  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  return (
    <div className={`${isLoggedIn ? "block" : "hidden"} ${className}  ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-950 ring-highlighted  rounded-full overflow-hidden`} >
      <img className="w-full object-center object-cover" src={userData?.profileImage || userImage} alt="user image" />
    </div>
  );
};

export default UserIcon;