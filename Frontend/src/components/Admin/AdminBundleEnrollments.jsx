import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Users, Layers } from "lucide-react";
import { Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AdminBundleEnrollments = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${ApiUrl}/admin/mock-test-bundles/enrollments`,
        { withCredentials: true }
      );

      setBundles(res.data.bundles || []);
    } catch (e) {
      toast.error("Failed to load bundle stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (bundles.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Layers className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          No Bundle Enrollments Yet
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-md">
          No students have enrolled in any mock test bundle yet.
        </p>
      </div>
    );
  }

  /* ================= PAGE ================= */

  return (
    <div className="min-h-screen w-full p-4">
      <Toaster position="top-right" />

      {/* HEADER */}
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800">
          Bundle Enrollments
        </h1>

        <div className="text-sm text-gray-500">
          Total Bundles: {bundles.length}
        </div>
      </header>

      {/* GRID */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {bundles.map((b) => (
          <div
            key={b.bundleId}
            className="bg-white rounded-xl shadow p-4 flex flex-col
                       hover:shadow-lg transition"
          >
            {/* THUMB */}
            <img
              src={b.thumbnail}
              className="h-44 w-full object-cover rounded-lg"
            />

            {/* TITLE */}
            <h2 className="mt-3 text-lg font-semibold">
              {b.title}
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              {b.description}
            </p>

            {/* STATUS + COUNT */}
            <div className="mt-2 flex justify-between items-center">
              <span
                className={`text-xs px-2 py-1 rounded font-semibold ${
                  b.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {b.isActive ? "ACTIVE" : "INACTIVE"}
              </span>

              <span className="flex items-center gap-1 text-sm font-semibold text-blue-700">
                <Users className="w-4 h-4" />
                {b.enrolledCount}
              </span>
            </div>

            {/* CTA */}
            <Link
              to={`/admin/bundles/${b.bundleId}/students`}
              className="mt-4 flex items-center justify-center gap-2
                         bg-blue-600 hover:bg-blue-700
                         text-white py-2 rounded-lg
                         font-semibold transition"
            >
              <Users className="w-4 h-4" />
              View Students
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBundleEnrollments;