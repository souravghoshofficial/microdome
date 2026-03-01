import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Star, MessageSquare } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AdminMockTestFeedback = () => {
  const { mockTestId } = useParams();

  const [loading, setLoading] = useState(true);
  const [mockTest, setMockTest] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  /* ================= FETCH ================= */
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(
        `${ApiUrl}/admin/mock-tests/${mockTestId}/feedbacks`,
        { withCredentials: true }
      );

      setMockTest(res.data.mockTest);
      setFeedbacks(res.data.feedbacks || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [mockTestId]);

  /* ================= DATE FORMAT ================= */
  const formatIST = (date) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!feedbacks.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          No Feedback Yet
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          No student has submitted feedback for this test.
        </p>
      </div>
    );
  }

  /* ================= PAGE ================= */
  return (
    <div className="h-[90vh] bg-white p-6 rounded-lg shadow">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {mockTest?.title}
        </h1>

        <div className="mt-2 text-sm text-gray-600">
          Total Feedbacks: {feedbacks.length}
        </div>
      </div>

      {/* FEEDBACK LIST */}
      <div className="space-y-4 overflow-y-auto h-[70vh] pr-2">
        {feedbacks.map((f) => (
          <div
            key={f._id}
            className="border rounded-lg p-4 hover:shadow-sm transition"
          >
            {/* USER INFO */}
            <div className="flex items-center gap-3">
              <img
                src={
                  f.userId?.profileImage ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(f.userId?.name || "User")
                }
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <div className="font-medium text-gray-800">
                  {f.userId?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {f.userId?.email}
                </div>
              </div>

              <div className="ml-auto text-xs text-gray-500">
                {formatIST(f.createdAt)}
              </div>
            </div>

            {/* RATING */}
            <div className="flex items-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= f.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}

              <span className="ml-2 text-sm text-gray-600">
                ({f.rating}/5)
              </span>
            </div>

            {/* REVIEW */}
            {f.review && (
              <p className="mt-3 text-sm text-gray-700">
                {f.review}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMockTestFeedback;