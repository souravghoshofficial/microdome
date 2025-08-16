import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const PremiumUserDetails = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [confirmUser, setConfirmUser] = useState(null); // store user to confirm

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // change this to show more/less per page

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
      .catch((err) => {
        console.error("Error fetching user details:", err);
        toast.error("Failed to load user details");
      });
  }, [id]);

  // Call API for toggling access
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

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center px-4 md:px-6 py-4 border-b">
        <h2 className="text-base md:text-lg font-semibold">
          Account Registration Requests
        </h2>
      </div>

      {/* Scrollable + Responsive Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left text-gray-600 border-b text-sm md:text-base">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2 whitespace-nowrap">Date Joined</th>
                <th className="px-4 py-2 whitespace-nowrap">Mobile No.</th>
                <th className="px-4 py-2">University</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 text-xs md:text-sm"
                >
                  {/* Name + Email */}
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

                  {/* Date Joined */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {user.dateJoined}
                  </td>

                  {/* Mobile */}
                  <td className="px-4 py-3 whitespace-nowrap">{user.mobile}</td>

                  {/* University */}
                  <td className="px-4 py-3">{user.university}</td>

                  {/* Toggle Button */}
                  <td className="px-4 py-3 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={user.access}
                        onChange={() => setConfirmUser(user)} // open confirm modal
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
      </div>

      {/* Pagination Controls */}
      {users.length > usersPerPage && (
        <div className="flex justify-center items-center gap-2 py-4 border-t">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setConfirmUser(null)}
              >
                No
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${
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
