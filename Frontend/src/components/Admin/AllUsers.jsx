import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import userImage from "../../assets/user-img.jpeg";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(12);

  function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
  }


  useEffect(() => {
    axios
      .get(`${ApiUrl}/admin/get-all-users`, { withCredentials: true })
      .then((res) => {
        if (res.data.users && Array.isArray(res.data.users)) {
          setUsers(
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
              mobile: u?.mobileNumber || "---",
              instituteName: u?.instituteName || "---",
              role: u.role,
              isPremium: u.isPremiumMember ? "Yes" : "No",
              presentCourseOfStudy: u?.presentCourseOfStudy || "---",
            }))
          );
          toast.success(res.data.message || "Users fetched successfully");
        } else {
          toast.error("No users found from backend");
        }
      })
      .catch((err) => {
        console.error("Error fetching all users:", err);
        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Failed to load users");
        }
      });
  }, []);

  // Filter users by search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="h-[90vh] flex flex-col bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />

      {/* Header with search */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-4 border-b gap-3">
        <h2 className="text-base md:text-lg font-semibold">All Users</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto scrollbar-none">
        <div className="overflow-x-auto scrollbar-none ">
          <table className="min-w-[800px] w-full border-collapse ">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left text-gray-600 border-b text-sm md:text-base">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2 text-center">Role</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Mobile No.
                </th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Date Joined
                </th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Is Premium
                </th>
                <th className="px-4 py-2 text-center whitespace-nowrap">Institute Name</th>
                <th className="px-4 py-2 text-center">Present Course of Study</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 text-xs md:text-sm"
                  >
                    {/* Name + Email + Image */}
                    <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                      />
                      <div className="min-w-[150px]">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-[11px] md:text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3 text-center">{capitalizeFirst(user.role)}</td>

                    {/* Mobile */}
                    <td className="px-4 py-3 text-center">{user.mobile}</td>

                    {/* Date Joined */}
                    <td className="px-4 py-3 text-center">{user.dateJoined}</td>

                    {/* Is Premium */}
                    <td className="px-4 py-3 text-center">{user.isPremium}</td>

                    {/* Institute */}
                    <td className="px-4 py-3 text-center text-wrap max-w-md">
                      {user.instituteName}
                    </td>
                    {/* Present Course of Study */}
                    <td className="px-4 py-3 text-center">
                      {user.presentCourseOfStudy}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex justify-center items-center gap-2 py-4 border-t">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded cursor-pointer ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
