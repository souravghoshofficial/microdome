import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Crown, Book } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router";
import userImage from "../../assets/user-img.jpeg";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalCourses: 0,
  });

  const [latestUsers, setLatestUsers] = useState([]);

  useEffect(() => {
    // Fetch total users
    axios
      .get(`${ApiUrl}/admin/stats/users`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setStats((prev) => ({
            ...prev,
            totalUsers: res.data.totalUsers ?? 0,
          }));
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching total users");
      });

    // Fetch premium users
    axios
      .get(`${ApiUrl}/admin/stats/premium-users`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setStats((prev) => ({
            ...prev,
            premiumUsers: res.data.premiumUsers ?? 0,
          }));
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching premium users");
      });

    // Fetch total courses
    axios
      .get(`${ApiUrl}/admin/stats/courses`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setStats((prev) => ({ ...prev, totalCourses: res.data.count ?? 0 }));
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching total courses");
      });

    // Fetch latest 5 users
    axios
      .get(`${ApiUrl}/admin/get-all-users?limit=5`, { withCredentials: true })
      .then((res) => {
        if (res.data.users) {
          setLatestUsers(
            res.data.users.map((u) => ({
              id: u._id,
              name: u.name,
              email: u.email,
              profilePic: u?.profileImage || userImage,
              dateJoined: new Date(u.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              role: u.role,
              mobile: u?.mobileNumber || "---",
              isPremium: u.isPremiumMember ? "Yes" : "No",
              instituteName: u?.instituteName || "---"
            }))
          );
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching latest users");
      });
  }, []);

  function capitalizeFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }

  return (
    <div className="min-h-screen w-full p-6">
      <Toaster position="top-right" />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Total Users Card */}
        <div className="bg-gradient-to-r from-pink-500 to-red-400 text-white rounded-xl shadow-md p-6 flex flex-col justify-between relative overflow-hidden">
          <div>
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-3xl font-bold mt-2">{stats.totalUsers || 0}</p>
          </div>
          <div className="absolute bottom-4 right-4 opacity-40">
            <Users size={40} />
          </div>
        </div>

        {/* Premium Users Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-xl shadow-md p-6 flex flex-col justify-between relative overflow-hidden">
          <div>
            <h2 className="text-lg font-semibold">Premium Users</h2>
            <p className="text-3xl font-bold mt-2">{stats.premiumUsers || 0}</p>
          </div>
          <div className="absolute bottom-4 right-4 opacity-40">
            <Crown size={40} />
          </div>
        </div>

        {/* Total Courses Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-xl shadow-md p-6 flex flex-col justify-between relative overflow-hidden">
          <div>
            <h2 className="text-lg font-semibold">Total Courses</h2>
            <p className="text-3xl font-bold mt-2">{stats.totalCourses || 0}</p>
          </div>
          <div className="absolute bottom-4 right-4 opacity-40">
            <Book size={40} />
          </div>
        </div>
      </div>

      {/* Latest Users Table */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Latest Registered Users</h2>
          <Link
            to="/admin/all-users"
            className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded text-sm font-medium"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-left text-gray-600 border-b text-sm">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2 text-center">Role</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">Mobile No.</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">Date Joined</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">Is Premium</th>
                <th className="px-4 py-2 text-center">Institute Name</th>
              </tr>
            </thead>
            <tbody>
              {latestUsers.length > 0 ? (
                latestUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{capitalizeFirst(user.role)}</td>
                    <td className="px-4 py-3 text-center">{user.mobile}</td>
                    <td className="px-4 py-3 text-center">{user.dateJoined}</td>
                    <td className="px-4 py-3 text-center">{user.isPremium}</td>
                    <td className="px-4 py-3 text-center">{user.instituteName}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No recent users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
