import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import Logo from "./Logo";
import ThemeBtn from "./ThemeBtn";
import UserCard from "./UserCard";
import UserIcon from "./UserIcon";
import { useSelector, useDispatch } from "react-redux";
import { toogleCard } from "../features/profileCard/profileCardSlice";
import { logout } from "../features/auth/authSlice";
import axios from "axios";
import { removeBundles } from "../features/enrolledMockTestBundles/enrolledMockTestBundlesSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.status);
  const role = useSelector((state) => state.auth?.userData?.role);
  const theme = useSelector((state) => state.theme.theme);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  /* ===== MODIFIED: state for mobile More dropdown ===== */
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  /* ===================================================== */

  const lastScrollY = useRef(0);
  const ApiUrl = import.meta.env.VITE_BACKEND_URL;

  /* Scroll Hide / Show */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScrollY.current && current > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutUser = async () => {
    await axios.post(`${ApiUrl}/users/logout`, {}, { withCredentials: true });
    dispatch(logout());
    dispatch(removeBundles());
    navigate("/");
  };

  return (
    <nav
      className={`${theme} fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl transition-all duration-300 ${
        showNavbar ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
      } z-50`}
    >
      <div
        className={`rounded-2xl text-black dark:text-white
        bg-white/80 dark:bg-zinc-900/70
        backdrop-blur-xl
        border border-gray-200/60 dark:border-zinc-700/60
        shadow-md transition-all duration-300`}
      >
        {/* Top Row */}
        <div className="px-6 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <Logo className="w-8" />
            <span className="text-lg font-bold gradiant-text">MicroDome</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/courses">Courses</NavItem>
            <NavItem to="/mock-tests">Mock Tests</NavItem>
            <NavItem to="/quizzes">Quizzes</NavItem>
            <NavItem to="/about-us">About Us</NavItem>

            {/* More Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1 cursor-pointer relative">
                More
                <ChevronDown
                  size={16}
                  className="transition-transform duration-200 group-hover:rotate-180"
                />
                <Underline />
              </div>

              <div
                className="absolute top-10 left-0 w-48 rounded-xl
    bg-white dark:bg-zinc-900
    border border-gray-200 dark:border-zinc-700
    shadow-md
    opacity-0 invisible translate-y-2
    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
    transition-all duration-200 overflow-hidden "
              >
                <DropdownItem to="/faculties">Our Faculties</DropdownItem>
                <DropdownItem to="/exams-and-institutes">
                  Exams & Institutes
                </DropdownItem>
                <DropdownItem to="/resources">Resources</DropdownItem>
              </div>
            </div>

            <ThemeBtn />

            {isLoggedIn ? (
              <div onClick={() => dispatch(toogleCard())}>
                <UserIcon className="w-9 h-9 cursor-pointer" />
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-1.5 bg-highlighted hover:bg-highlighted-hover text-white rounded-lg font-semibold transition"
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-3 text-base">
            <ThemeBtn />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex items-center justify-center
             rounded-full
             bg-white/60 dark:bg-zinc-800/70
             border border-gray-200 dark:border-zinc-700
             backdrop-blur-md
             hover:bg-white dark:hover:bg-zinc-700
             active:scale-95
             transition-all duration-200 cursor-pointer"
            >
              {menuOpen ? (
                <X size={20} className="text-black dark:text-gray-200" />
              ) : (
                <Menu size={20} className="text-black dark:text-gray-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Expand Section */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-[90vh] py-4 px-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2 text-base">
            <MobileItem to="/" close={setMenuOpen}>
              Home
            </MobileItem>
            <MobileItem to="/courses" close={setMenuOpen}>
              Courses
            </MobileItem>
            <MobileItem to="/mock-tests" close={setMenuOpen}>
              Mock Tests
            </MobileItem>
            <MobileItem to="/about-us" close={setMenuOpen}>
              About Us
            </MobileItem>
            <MobileItem to="/quizzes" close={setMenuOpen}>
              Quizzes
            </MobileItem>

            {/* ===== MODIFIED: Mobile More Dropdown Added ===== */}
            <div className="flex flex-col">
              <button
                onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                className="flex items-center justify-between py-2 px-3 rounded-lg text-gray-700 dark:text-gray-300"
              >
                <span>More</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    mobileMoreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  mobileMoreOpen ? "max-h-40 mt-1" : "max-h-0"
                }`}
              >
                <MobileItem to="/faculties" close={setMenuOpen}>
                  Our Faculties
                </MobileItem>
                <MobileItem to="/exams-and-institutes" close={setMenuOpen}>
                  Exams & Institutes
                </MobileItem>
                <MobileItem to="/resources" close={setMenuOpen}>
                  Resources
                </MobileItem>
              </div>
            </div>
            {/* ================================================= */}

            {isLoggedIn && (
              <>
                <MobileItem to="/profile" close={setMenuOpen}>
                  Profile
                </MobileItem>

                {role === "admin" && (
                  <MobileItem to="/admin/dashboard" close={setMenuOpen}>
                    Admin Dashboard
                  </MobileItem>
                )}

                {role === "instructor" && (
                  <MobileItem to="/admin/dashboard" close={setMenuOpen}>
                    Instructor Dashboard
                  </MobileItem>
                )}

                <button
                  onClick={() => {
                    logoutUser();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-500 cursor-pointer px-3 py-2 rounded-lg"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}

            {!isLoggedIn && (
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 bg-highlighted text-white rounded-lg text-center font-semibold"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      <UserCard className="absolute top-20 right-6" />
    </nav>
  );
};

/* Components */

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative group ${isActive ? "text-highlighted font-semibold" : ""}`
    }
  >
    {children}
    <Underline />
  </NavLink>
);

const Underline = () => (
  <span className="absolute left-0 -bottom-1 h-[1.5px] w-full scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
);

const DropdownItem = ({ to, children }) => (
  <NavLink
    to={to}
    className="block px-4 py-2 hover:bg-gray-100 hover:text-highlighted dark:hover:bg-zinc-800 transition"
  >
    {children}
  </NavLink>
);

const MobileItem = ({ to, children, close }) => (
  <NavLink
    to={to}
    onClick={() => close(false)}
    className={({ isActive }) =>
      `block py-2 px-3 rounded-lg transition
       ${
         isActive
           ? "text-highlighted bg-gray-100 dark:bg-zinc-800 font-semibold"
           : "text-gray-700 dark:text-gray-300"
       }`
    }
  >
    {children}
  </NavLink>
);

export default Navbar;