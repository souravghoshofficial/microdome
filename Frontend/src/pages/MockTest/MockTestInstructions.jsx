import { useParams, useNavigate } from "react-router";
import { PlayCircle, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MockTestInstructions = () => {
  const { testId } = useParams();
  const theme = useSelector((state) => state.theme.theme);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mockTestDetails, setMockTestDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(true);

  const [showStartModal, setShowStartModal] = useState(false);

  useEffect(() => {
    const fetchMockTestInstructions = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${ApiUrl}/user/mock-tests/${testId}`, {
          withCredentials: true,
        });

        setMockTestDetails(res.data.data);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 403) {
            setIsEnrolled(false);
            setError("You are not enrolled in this mock test.");
          } else if (error.response.status === 404) {
            setError("Mock test not found.");
          } else {
            setError("Something went wrong. Please try again.");
          }
        } else {
          setError("Server not responding. Please try later.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (testId) fetchMockTestInstructions();
  }, [testId]);

  const startTest = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
    navigate(`/mock-tests/${testId}/start`);
  };

  return (
    <div
      className={`w-full min-h-screen flex justify-center bg-white dark:bg-gray-950 text-black dark:text-white ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      <div className="my-16 w-[90%] max-w-4xl">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-screen">
            <div className="w-9 h-9 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center text-red-500 font-semibold">{error}</div>
        )}

        {/* Content */}
        {!loading && !error && mockTestDetails && (
          <>
            <h1 className="text-3xl font-bold">{mockTestDetails.title}</h1>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Duration: {mockTestDetails.durationMinutes} Minutes</p>
              <p>Total Marks: {mockTestDetails.totalMarks}</p>
            </div>

            <div className="mt-6 space-y-3 text-gray-700 dark:text-gray-300">
              {mockTestDetails.instructions?.length ? (
                mockTestDetails.instructions.map((inst, i) => (
                  <p key={i}>• {inst}</p>
                ))
              ) : (
                <>
                  <p>• Read all questions carefully</p>
                  <p>• Do not refresh during test</p>
                  <p>• Timer cannot be paused</p>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-lg font-semibold border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowStartModal(true)}
                disabled={!isEnrolled}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition ${
                  isEnrolled
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <PlayCircle className="w-5 h-5" />
                Start Test
              </button>
            </div>
          </>
        )}
      </div>

      {/* START CONFIRM MODAL */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-[92%] max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-gray-200 dark:border-zinc-700 p-6">
            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
              Start Mock Test
            </h2>

            {/* Message */}
            <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
              The test will open in full-screen mode and the timer will start
              immediately. You cannot pause once started.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowStartModal(false)}
                className="flex-1 py-2 cursor-pointer rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                Cancel
              </button>

              <button
                onClick={startTest}
                className="flex-1 py-2 cursor-pointer rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTestInstructions;