import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Users } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

/* ================= DATE FORMAT ================= */

function formatIST(dateStr) {
  if (!dateStr) return "---";

  return new Date(dateStr).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const AdminBundleStudents = () => {
  const { bundleId } = useParams();

  const [students, setStudents] = useState([]);
  const [bundleTitle, setBundleTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${ApiUrl}/admin/mock-test-bundles/${bundleId}/students`,
          { withCredentials: true }
        );

        setStudents(res.data.students || []);
        setBundleTitle(res.data.bundle?.title || "Bundle");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [bundleId]);

  /* ================= SEARCH ================= */

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / studentsPerPage);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (students.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <Users className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          No Students Enrolled
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          No students have enrolled in this bundle yet.
        </p>
      </div>
    );
  }

  /* ================= PAGE ================= */

  return (
    <div className="h-[90vh] flex flex-col bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-4 border-b gap-3">
        <h2 className="text-lg font-semibold">
          {bundleTitle} — Students ({students.length})
        </h2>

        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-md px-3 py-1.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="min-w-[750px] w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left text-gray-600 border-b text-sm">
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2 text-center">Enrolled At</th>
                <th className="px-4 py-2 text-center">Institute</th>
                <th className="px-4 py-2 text-center">Course</th>
              </tr>
            </thead>

            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map((s) => (
                  <tr
                    key={s.userId}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    {/* STUDENT */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            s.profileImage ||
                            "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(s.name)
                          }
                          alt={s.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />

                        <div className="flex flex-col">
                          <span className="font-medium">
                            {s.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {s.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ENROLLED AT */}
                    <td className="px-4 py-3 text-center">
                      {formatIST(s.enrolledAt)}
                    </td>

                    {/* INSTITUTE */}
                    <td className="px-4 py-3 text-center">
                      {s.instituteName || "---"}
                    </td>

                    {/* COURSE */}
                    <td className="px-4 py-3 text-center">
                      {s.presentCourseOfStudy || "---"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {filtered.length > studentsPerPage && (
        <div className="flex justify-center items-center gap-2 py-4 border-t">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
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
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBundleStudents;