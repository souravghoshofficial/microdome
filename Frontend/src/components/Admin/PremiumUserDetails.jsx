import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import userImage from "../../assets/user-img.jpeg";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const PremiumUserDetails = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [courseName, setCourseName] = useState("Course Name");
  const [confirmUser, setConfirmUser] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    axios
      .get(`${ApiUrl}/admin/get-user-details/${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data.success && res.data.users) {
          setUsers(
            res.data.users.map((u) => ({
              id: u.userId,
              name: u.name || "---",
              email: u.email || "---",
              profilePic: u?.profileImage || userImage,
              dateJoined: u.createdAt
                ? new Date(u.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "---",
              mobile: u?.mobileNumber || "---",
              university: u?.instituteName || "---",
              access: u.isActive,
            }))
          );
          setCourseName(res.data.courseName || "---");
        }
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
        toast.error("Failed to load user details");
      });
  }, [id]);

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

  // Filter users by search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations (apply on filtered list)
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />

      {/* Header with search */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-4 border-b gap-3">
        <h2 className="text-base md:text-lg font-semibold">{courseName}</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // reset to first page on search
          }}
          className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Scrollable + Responsive Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left text-gray-600 border-b text-sm md:text-base">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Date Joined
                </th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Mobile No.
                </th>
                <th className="px-4 py-2 text-center">Institute Name</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 text-xs md:text-sm"
                  >
                    {/* Name + Email (left aligned) */}
                    <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                      />
                      <div className="min-w-[150px]">
                        <p className="font-medium">{user.name || "---"}</p>
                        <p className="text-[11px] md:text-xs text-gray-500 truncate">
                          {user.email || "---"}
                        </p>
                      </div>
                    </td>

                    {/* Centered fields */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {user.dateJoined || "---"}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {user.mobile || "---"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {user.university || "---"}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={user.access}
                          onChange={() => setConfirmUser(user)}
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
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
            className="px-3 py-1 bg-gray-200 rounded cursor-pointer disabled:opacity-50"
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
            className="px-3 py-1 bg-gray-200 rounded cursor-pointer disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to{" "}
              {confirmUser.access ? (
                <span className="text-red-600 font-semibold">revoke</span>
              ) : (
                <span className="text-green-600 font-semibold">grant</span>
              )}{" "}
              access for <span className="font-medium">{confirmUser.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
                onClick={() => setConfirmUser(null)}
              >
                No
              </button>
              <button
                className={`cursor-pointer px-4 py-2 rounded text-white ${
                  confirmUser.access
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={() => {
                  toggleAccess(confirmUser.id, confirmUser.access);
                  setConfirmUser(null);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumUserDetails;
