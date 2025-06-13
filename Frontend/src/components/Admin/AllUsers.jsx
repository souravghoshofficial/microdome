import { useState, useEffect } from "react";
import userImage from "../../assets/user-img.jpeg";
import axios from "axios";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;


export default function AllUsers() {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    axios.get(`${ApiUrl}/api/v1/admin/get-all-users`, { withCredentials: true })
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.log(err));
  }, []);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleCloseModal = () => setSelectedUser(null);

  return (
    <div className="relative min-h-screen w-full bg-gray-50">
      
      {/* Blur wrapper */}
      <div className={`${selectedUser ? "blur-sm pointer-events-none select-none" : ""}`}>
        <header className="mb-8 px-6 pt-6">
          <h1 className="text-3xl font-bold text-blue-800">All Users</h1>
        </header>

        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          {paginatedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between border p-4 rounded-lg mb-4 flex-wrap gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.profileImage || userImage}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(user)}
                className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition cursor-pointer"
              >
                Get All Details
              </button>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100 cursor-pointer"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded hover:bg-blue-100 cursor-pointer ${
                  currentPage === page ? "bg-blue-500 text-white" : ""
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center animate-fadeIn">
            <img
              src={selectedUser.profileImage}
              alt={selectedUser.name}
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{selectedUser.name}</h2>
            <p className="text-sm text-gray-600 mb-1">{selectedUser.email}</p>
            <p className="text-sm mb-1">
              Premium Member: {selectedUser.isPremiumMember ? "Yes" : "No"}
            </p>
            <p className="text-sm mb-4">
              Enrolled Courses: {selectedUser.enrolledCourses.join(", ")}
            </p>
            <button
              onClick={handleCloseModal}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
