import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const PremiumUserDetails = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);

  // Fetch user details on load
  useEffect(() => {
    axios
      .get(`${ApiUrl}/admin/get-user-details/${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data.success && res.data.users) {
          setUsers(
            res.data.users.map((u) => ({
              id: u.userId,
              name: u.name,
              email: u.email,
              profilePic: u.profileImage,
              dateJoined: new Date(u.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              mobile: u.mobileNumber,
              university: u.instituteName,
              access: u.isActive,
            }))
          );
        }
      })
      .catch((err) => console.error("Error fetching user details:", err));
  }, [id]);

  // Toggle access (grant or revoke)
  const toggleAccess = async (userId, currentAccess) => {
    try {
      const endpoint = currentAccess
        ? "/admin/revoke-access"
        : "/admin/grant-access";

      const { data } = await axios.post(
        `${ApiUrl}${endpoint}`,
        { userId, courseId: id },
        { withCredentials: true }
      );

      if (data.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, access: !currentAccess } : user
          )
        );
        toast.success(data.message);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error updating access:", error);
      toast.error("Failed to update access");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Toaster position="top-right"/>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Account Registration Requests</h2>
        <button className="flex items-center text-sm text-gray-500">
          Oldest to Recent
          <span className="ml-1">⇅</span>
        </button>
      </div>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="pb-2">Name</th>
            <th className="pb-2">Date Joined</th>
            <th className="pb-2">Mobile No.</th>
            <th className="pb-2">University</th>
            <th className="pb-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="py-3 flex items-center gap-3">
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </td>
              <td className="py-3">{user.dateJoined}</td>
              <td className="py-3">{user.mobile}</td>
              <td className="py-3">{user.university}</td>
              <td className="py-3">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={user.access}
                    onChange={() => toggleAccess(user.id, user.access)}
                  />
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ${
                      user.access ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                        user.access ? "translate-x-5" : ""
                      }`}
                    ></div>
                  </div>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PremiumUserDetails;
