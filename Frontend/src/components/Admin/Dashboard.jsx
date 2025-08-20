import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Crown } from "lucide-react"; // icons
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, premiumUsers: 0 });

  useEffect(() => {
    // Fetch total users
    axios
      .get(`${ApiUrl}/admin/stats/users`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setStats((prev) => ({
            ...prev,
            totalUsers: res.data.count ?? 0, // fallback to 0
          }));
        } else {
          toast.error("Failed to fetch total users");
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
            premiumUsers: res.data.count ?? 0, // fallback to 0
          }));
        } else {
          toast.error("Failed to fetch premium users");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching premium users");
      });
  }, []);

  return (
    <div className="min-h-screen w-full p-6">
      <Toaster position="top-right" />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Total Users Card */}
        <div className="bg-gradient-to-r from-pink-500 to-red-400 text-white rounded-xl shadow-md p-6 flex flex-col justify-between relative overflow-hidden">
          <div>
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-3xl font-bold mt-2">
              {stats.totalUsers || 0}
            </p>
          </div>
          <div className="absolute bottom-4 right-4 opacity-40">
            <Users size={40} />
          </div>
        </div>

        {/* Premium Users Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-xl shadow-md p-6 flex flex-col justify-between relative overflow-hidden">
          <div>
            <h2 className="text-lg font-semibold">Premium Users</h2>
            <p className="text-3xl font-bold mt-2">
              {stats.premiumUsers || 0}
            </p>
          </div>
          <div className="absolute bottom-4 right-4 opacity-40">
            <Crown size={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
