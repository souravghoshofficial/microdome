import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router";
import { RiMenuFill, RiCloseLine , RiLogoutBoxRLine } from "@remixicon/react";
import Logo from "./Logo";
import ThemeBtn from "./ThemeBtn";
import UserCard from "./UserCard";
import UserIcon from "./UserIcon";
import { useSelector, useDispatch } from "react-redux";
import { toogleCard } from "../features/profileCard/profileCardSlice";
import { logout } from "../features/auth/authSlice.js";
import axios from "axios";

const navItems = [
  {
    navItemName: "Home",
    linkAddress: "/",
  },
  {
    navItemName: "Courses",
    linkAddress: "/courses",
  },
  {
    navItemName: "About Us",
    linkAddress: "/about-us",
  },
  {
    navItemName: "Our Faculties",
    linkAddress: "/faculties",
  },
  {
    navItemName: "Resources",
    linkAddress: "/resources",
  },
];



const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.status);
  const [showSideNav, setShowSideNav] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollYRef.current) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


   const logoutUser = () => {
    axios.post(`${ApiUrl}/api/v1/users/logout`,{}, {
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
    <nav className={`fixed top-0 left-0 w-full transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"} flex items-center justify-center z-50 backdrop-blur-2xl text-black dark:text-white`}>
      <div className="w-[90%] py-4 flex items-center justify-between relative">
        <div>
          <a className="flex items-center gap-2" href="/">
            <Logo className="w-7 md:w-9" />
            <p className="text-lg font-bold gradiant-text">MicroDome</p>
          </a>
        </div>
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.linkAddress} className="relative group">
              <NavLink
                to={item.linkAddress}
                className={({ isActive }) =>
                  `${
                    isActive ? "text-highlighted font-semibold" : ""
                  } relative inline-block transition-colors duration-300`
                }
              >
                {item.navItemName}
                <span className="absolute left-0 bottom-0 h-[1.5px] w-full scale-x-0 bg-black dark:bg-white transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
              </NavLink>
            </li>
          ))}
          <div className="px-4 border-l border-r border-gray-400/50">
            <ThemeBtn />
          </div>
          {isLoggedIn && (
            <div onClick={() => dispatch(toogleCard())}>
              <UserIcon className="w-8 h-8 cursor-pointer" />
            </div>
          )}
          {!isLoggedIn && (
            <NavLink
              to="/login"
              className="px-5 py-1.5 bg-button text-white font-semibold rounded-sm"
            >
              Login
            </NavLink>
          )}
        </ul>
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
            <p className="text-lg font-bold">
              <span className="gradiant-text">MicroDome</span>
            </p>
          </a>
          <div className="">
            <RiCloseLine size={24} onClick={() => setShowSideNav(false)} />
          </div>
        </div>
        <div className="w-[90%] relative mx-auto mt-32 flex flex-col gap-4">
          <NavLink
            onClick={() => setShowSideNav(false)}
            to="/"
            className={({ isActive }) =>
              `${isActive ? "text-highlighted font-semibold" : ""} text-lg`
            }
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setShowSideNav(false)}
            to="/courses"
            className={({ isActive }) =>
              `${isActive ? "text-highlighted font-semibold" : ""} text-lg`
            }
          >
            Courses
          </NavLink>
          <NavLink
            onClick={() => setShowSideNav(false)}
            to="/about-us"
            className={({ isActive }) =>
              `${isActive ? "text-highlighted font-semibold" : ""} text-lg`
            }
          >
            About Us
          </NavLink>
          <NavLink
            onClick={() => setShowSideNav(false)}
            to="/faculties"
            className={({ isActive }) =>
              `${isActive ? "text-highlighted font-semibold" : ""} text-lg`
            }
          >
            Our Faculties
          </NavLink>
          <NavLink
            onClick={() => setShowSideNav(false)}
            to="/resources"
            className={({ isActive }) =>
              `${isActive ? "text-highlighted font-semibold" : ""} text-lg`
            }
          >
            Resources
          </NavLink>
          <div className="flex items-center gap-4">
            <span>Theme : </span>
            <ThemeBtn />
          </div>
          {!isLoggedIn && (
            <NavLink
              onClick={() => setShowSideNav(false)}
              to="/login"
              className=" w-full py-2 text-center text-lg bg-highlighted text-white font-semibold rounded-sm"
            >
              Login
            </NavLink>
          )}
          {isLoggedIn && (
            <div>
               <NavLink
            onClick={() => setShowSideNav(false)}
            to="/profile"
            className={({ isActive }) =>
              `${isActive ? "text-highlighted font-semibold" : ""} text-lg block`
            }
          >
            Profile
          </NavLink>
            <div
          onClick={() => {
            logoutUser()
            setShowSideNav(false)
          }}
          className="px-3 py-1.5 mt-2 rounded-md flex items-center gap-2 w-full cursor-pointer"
        >
          <RiLogoutBoxRLine size={16} />
          <p>Sign Out</p>
        </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
