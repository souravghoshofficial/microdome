import { Link, NavLink, Outlet } from "react-router";
import {
  Home,
  Users,
  Star,
  Layers,
  Video,
  BookOpen,
  Plus,
  Tickets,
  FileQuestion
} from "lucide-react";

import { useSelector } from "react-redux";

import { Logo } from '../components'

const adminMenuItems = [
  { name: "Dashboard", icon: <Home size={20} />, href: "/admin/dashboard" },
  { name: "All Users", icon: <Users size={20} />, href: "/admin/all-users" },
  { name: "Premium Users", icon: <Star size={20} />, href: "/admin/premium-users" },
  { name: "All Courses", icon: <BookOpen size={20} />, href: "/admin/all-courses" },
  { name: "All Quizzes", icon: <FileQuestion size={20} />, href: "/admin/quizzes" },
  { name: "Add Section", icon: <Layers size={20} />, href: "/admin/add-section" },
  { name: "Add Lecture", icon: <Video size={20} />, href: "/admin/add-lecture" },
  { name: "Create Course", icon: <Plus size={20} />, href: "/admin/create-course" },
  { name: "Coupons", icon: <Tickets size={20} />, href: "/admin/coupons" },
];
const instructorMenuItems = [
  { name: "Dashboard", icon: <Home size={20} />, href: "/admin/dashboard" },
  { name: "All Users", icon: <Users size={20} />, href: "/admin/all-users" },
  { name: "Premium Users", icon: <Star size={20} />, href: "/admin/premium-users" },
  { name: "All Courses", icon: <BookOpen size={20} />, href: "/admin/all-courses" },
  { name: "All Quizzes", icon: <FileQuestion size={20} />, href: "/admin/quizzes" },
  { name: "Add Section", icon: <Layers size={20} />, href: "/admin/add-section" },
  { name: "Add Lecture", icon: <Video size={20} />, href: "/admin/add-lecture" },
];

export default function Admin() {
  const user = useSelector((state) => state.auth?.userData);
  const menuItems = user?.role === "admin" ? adminMenuItems : instructorMenuItems;
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl hidden md:flex flex-col"> 
         <Link to="/" className="px-6 py-5 flex items-center gap-2 border-b border-gray-200">
         <Logo className={"w-7 md:w-9"} />
         <p className="text-lg font-bold gradiant-text">MicroDome</p>
        </Link>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}

             className={({ isActive }) =>`flex items-center gap-3 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 hover:text-blue-700 transition ${
             isActive ? "text-blue-700 bg-blue-100" : "text-gray-700"
            }`
            }

            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 shadow-md z-50">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}

             className={({ isActive }) =>
                  `${
                    isActive ? "text-blue-600" : "text-gray-600"
                  } flex flex-col items-center text-sm hover:text-blue-600`
                }
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name.split(" ")[0]}</span>
          </NavLink>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 h-screen overflow-hidden p-6 mb-24 md:mb-2 bg-gray-100">
        <div className="w-full">
            <Outlet />
        </div>
      </main>
    </div>
  );
}
