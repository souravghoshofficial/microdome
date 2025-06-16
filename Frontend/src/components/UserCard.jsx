import React from "react";
import UserIcon from "./UserIcon";
import { RiUserLine, RiLogoutBoxRLine, RiCloseLine } from "@remixicon/react";
import { Link , useNavigate } from "react-router";
import axios from "axios";
const ApiUrl = import.meta.env.VITE_BACKEND_URL;

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice.js";
import { hideCard } from "../features/profileCard/profileCardSlice.js";

const UserCard = ({ className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showProfileCard = useSelector((state) => state.profileCard.show);
  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  const logoutUser = () => {
    axios.post(`${ApiUrl}/users/logout`,{}, {
      withCredentials: true
    })
    .then((res) => {
      if(res.data.statusCode === 200){
        dispatch(logout());
        navigate("/");
      }
    })
  }

  return (
    <div
      className={`${showProfileCard ? "block" : "hidden"}  ${
        isLoggedIn ? "block" : "hidden"
      } ${className} w-60  border border-gray-200 dark:border-gray-50/[.1] rounded-sm bg-white dark:bg-zinc-900 text-black dark:text-white`}
    >
      <div className="relative px-4 py-6 flex flex-col items-center">
        <UserIcon className="w-16 h-16" />
        <h3 className="text-lg font-bold mt-3">Hi , {userData?.name}</h3>
        <Link
          to="/profile"
          onClick={() => dispatch(hideCard())}
          className="mt-4 px-3 py-1.5 rounded-md flex items-center gap-2 w-full hover:bg-gray-100 dark:hover:bg-zinc-800 "
        >
          <RiUserLine size={16} className="border rounded-full" />
          <p>Profile</p>
        </Link>
        <div
          onClick={logoutUser}
          className="px-3 py-1.5 mt-2 rounded-md flex items-center gap-2 w-full hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <RiLogoutBoxRLine size={16} />
          <p>Sign Out</p>
        </div>
        <RiCloseLine
          onClick={() => dispatch(hideCard())}
          size={20}
          className="absolute top-3 right-3 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default UserCard;
