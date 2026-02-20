import UserIcon from "./UserIcon";

import { CircleUserRound, ShieldUser, LogOut, X }  from "lucide-react"

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
      } ${className} w-60  border border-gray-200 dark:border-gray-50/[.1] rounded-md bg-white dark:bg-zinc-900 text-black dark:text-white`}
    >
      <div className="relative px-4 py-6 flex flex-col items-center">
        <UserIcon className="w-16 h-16" />
        <h3 className="text-xl font-bold mt-4">{userData?.name}</h3>
        <Link
          to="/profile"
          onClick={() => dispatch(hideCard())}
          className="mt-4 px-3 py-1.5 rounded-md flex items-center gap-2 w-full hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-highlighted cursor-pointer  transition-all duration-300"
        >
          <CircleUserRound size={20} strokeWidth={1} />
          <p>Profile</p>
        </Link>
        <Link
          to="/admin/dashboard"
          onClick={() => dispatch(hideCard())}
          className={`${userData?.role === "admin" || userData?.role === "instructor" ? "flex" : "hidden"} mt-2 px-3 py-1.5 rounded-md items-center gap-2 w-full hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-highlighted cursor-pointer  transition-all duration-300`}
        >
          <ShieldUser size={20} strokeWidth={1} />
          <p>Admin Dashboard</p>
        </Link>
        <div
          onClick={logoutUser}
          className="px-3 py-1.5 mt-2 rounded-md flex items-center gap-2 w-full hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-highlighted cursor-pointer  transition-all duration-300"
        >
          <LogOut size={20} strokeWidth={1} />
          <p>Sign Out</p>
        </div>
        <X
          onClick={() => dispatch(hideCard())}
          size={20}
          className="absolute top-3 right-3 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default UserCard;
