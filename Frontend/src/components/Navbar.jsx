import React from "react";
import { useState , useEffect } from "react";
import { NavLink } from "react-router";
import { RiMenuFill , RiCloseLine } from "@remixicon/react";
import Logo from "./Logo";
import ThemeBtn from "./ThemeBtn";
import UserCard from "./UserCard";
import UserIcon from "./UserIcon";
import { useSelector , useDispatch } from "react-redux";
import { toogleCard } from "../features/profileCard/profileCardSlice"

const Navbar = () => {

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.status);
  const [showSideNav, setShowSideNav] = useState(false);

  
  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-center z-50 backdrop-blur-2xl text-black dark:text-white">
      <div className="w-[90%] py-4 flex items-center justify-between relative">
      <div>
        <a className="flex items-center gap-2" href="/">
        <Logo className="w-7 md:w-9" />
          <p className="text-lg font-bold gradiant-text">MicroDome</p>
        </a>
      </div>
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={({isActive}) => `${isActive ? "text-highlighted font-semibold" : ""} hover:underline underline-offset-4 decoration-gray-800 dark:decoration-white`}>Home</NavLink>
          <NavLink to="/courses" className={({isActive}) => `${isActive ? "text-highlighted font-semibold" : ""} hover:underline underline-offset-4 decoration-gray-800 dark:decoration-white`}>Courses</NavLink>
          <NavLink to="/about-us" className={({isActive}) => `${isActive ? "text-highlighted font-semibold" : ""} hover:underline underline-offset-4 decoration-gray-800 dark:decoration-white`}>About Us</NavLink>
          <NavLink to="/resources" className={({isActive}) => `${isActive ? "text-highlighted font-semibold" : ""} hover:underline underline-offset-4 decoration-gray-800 dark:decoration-white`}>Resources</NavLink>
          <div className="px-4 border-l border-r border-gray-400/50">
            <ThemeBtn />
          </div>
          {isLoggedIn && <div onClick={() => dispatch(toogleCard())}><UserIcon className="w-8 h-8 cursor-pointer" /></div>} 
            {!isLoggedIn && 
            <NavLink to="/login" className="px-4 py-1.5 bg-button text-white font-semibold rounded-sm">
              Login
            </NavLink>
          }
        </div>
        <div className=" md:hidden">
          <RiMenuFill size={24} onClick={() => setShowSideNav(true)} />
        </div>
        <UserCard className="absolute top-16 right-0" />
      </div>
      <div
        className={`md:hidden ${
          showSideNav ? "block" : "hidden"
        } absolute top-0 w-full h-screen z-50 flex items-start justify-items-start bg-white dark:bg-gray-950`}
      >
        <div className="w-[90%] absolute top-0 left-[50%] translate-x-[-50%] flex items-center justify-between py-4">
        <a className="flex items-center gap-2" href="/">
        <Logo className="w-7" />
          <p className="text-lg font-bold"><span className="gradiant-text">MicroDome</span></p>
        </a>
          <div className="">
          <RiCloseLine size={24} onClick={() => setShowSideNav(false)} />
          </div>
        </div>
        <div className="w-[90%] relative mx-auto mt-32 flex flex-col gap-4">
          <NavLink onClick={() => setShowSideNav(false)} to="/" className="text-lg">Home</NavLink>
          <NavLink onClick={() => setShowSideNav(false)} to="/courses" className="text-lg">Courses</NavLink>
          <NavLink onClick={() => setShowSideNav(false)} to="/about-us" className="text-lg">About Us</NavLink>
          <NavLink onClick={() => setShowSideNav(false)} className="text-lg">Resources</NavLink>
          <div className="flex items-center gap-4"> 
            <span>Theme : </span>
          <ThemeBtn />
          </div>
         {!isLoggedIn &&   
            <NavLink onClick={() => setShowSideNav(false)}
            to="/login"
            className=" w-full py-2 text-center text-lg bg-highlighted text-white font-semibold rounded-sm"
          >
            Login
          </NavLink>
          }
            {isLoggedIn && <div onClick={() => dispatch(toogleCard())}> <UserIcon className="w-10 h-10" /> </div>
            }
            
              <UserCard className="absolute bottom-[-125%] left-1"/>
            
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
