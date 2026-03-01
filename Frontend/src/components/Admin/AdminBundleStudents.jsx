import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Users,Trash2, Download } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const [showModal,setShowModal] = useState(false);
  /* ================= FETCH ================= */

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
  useEffect(() =>{
    fetchStudents();
  }, [bundleId]);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(
        `${ApiUrl}/admin/mock-test-bundles/delete-bundle-data/${bundleId}`,
        { withCredentials: true }
      );

      setShowModal(false);
      toast.success("Enrollments deleted successfully");
      fetchStudents();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

    const downloadEnrollmentsExcel = async (bundleId, title = "enrollments") => {
    try {
      const res = await axios.get(
        `${ApiUrl}/admin/mock-test-bundles/${bundleId}/students/export`,
        {
          responseType: "blob", // IMPORTANT
          withCredentials: true,
        }
      );
  
      // create blob link
      const url = window.URL.createObjectURL(new Blob([res.data]));
  
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "_")}_enrollments.xlsx`;
  
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      toast.error("Failed to download enrollments");
    }
  };

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

        <div className="flex items-center gap-2">
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

        <button onClick={() => downloadEnrollmentsExcel(bundleId, bundleTitle)}
                 className="py-2 px-4 flex bg-blue-500 text-white items-center gap-1 rounded cursor-pointer hover:bg-blue-600">
                  <Download className="h-4 w-4"/>
                  <span>Download Enrollments</span>
        </button>


        <button onClick={() => setShowModal(true)}
         className="py-2 px-4 flex bg-red-500 text-white items-center gap-1 rounded cursor-pointer hover:bg-red-600">
          <Trash2 className="h-4 w-4"/>
          <span>Delete Enrollments</span>
        </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="min-w-[750px] w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left text-gray-600 border-b text-sm">
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2 text-center">Mobile Number</th>
                <th className="px-4 py-2 text-center">Enrolled At</th>
                <th className="px-4 py-2 text-center">Institute Name</th>
                <th className="px-4 py-2 text-center">Present Course</th>
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

                    <td className="px-4 py-3 text-center">
                      {s.mobileNumber || "---"}
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
    {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="p-6 bg-white rounded-lg shadow-lg w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-800 mb-6">
              Are you sure you want to delete enrollments in this Mock Test Bundle ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBundleStudents;