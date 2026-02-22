import { useParams, useNavigate } from "react-router";
import { PlayCircle } from "lucide-react";
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

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "start" or "cancel"

  useEffect(() => {
    const fetchMockTestInstructions = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${ApiUrl}/user/mock-tests/${testId}`,
          { withCredentials: true }
        );

        setMockTestDetails(res.data.data);
      } catch (error) {
        console.error(error);

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

    if (testId) {
      fetchMockTestInstructions();
    }
  }, [testId]);

  // 🔵 Open Modal
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  // 🔴 Close Modal
  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  // ✅ Confirm Action
  const handleConfirm = () => {
    if (modalType === "cancel") {
      navigate(-1); // Go back to previous page
    }

    if (modalType === "start") {
      navigate(`/mock-tests/${testId}/start`);
    }
  };

  return (
    <div
      className={`w-full min-h-screen flex justify-center bg-white dark:bg-gray-950 text-black dark:text-white ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      <div className="my-24 md:my-32 w-[90%] max-w-4xl">

        {/* 🔵 Loading */}
        {loading && (
          <div className="text-center text-lg font-semibold">
            Loading instructions...
          </div>
        )}

        {/* 🔴 Error */}
        {!loading && error && (
          <div className="text-center text-red-500 font-semibold">
            {error}
          </div>
        )}

        {/* 🟢 Success */}
        {!loading && !error && mockTestDetails && (
          <>
            <h1 className="text-3xl font-bold">
              {mockTestDetails.title}
            </h1>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Duration: {mockTestDetails.durationMinutes} Minutes</p>
              <p>Total Marks: {mockTestDetails.totalMarks}</p>
            </div>

            <div className="mt-6 space-y-3 text-gray-700 dark:text-gray-300">
              {mockTestDetails.instructions &&
              mockTestDetails.instructions.length > 0 ? (
                mockTestDetails.instructions.map((instruction, index) => (
                  <p key={index}>• {instruction}</p>
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
                onClick={() => openModal("cancel")}
                className="px-6 py-3 rounded-lg font-semibold border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
              >
                Cancel Test
              </button>

              <button
                onClick={() => openModal("start")}
                disabled={!isEnrolled}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white cursor-pointer ${
                  isEnrolled
                    ? "bg-blue-600 hover:bg-blue-700"
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

      {/* 🔥 Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "start"
                ? "Start Mock Test?"
                : "Cancel Mock Test?"}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {modalType === "start"
                ? "Once started, the timer will begin immediately and cannot be paused. Are you sure you want to proceed?"
                : "Are you sure you want to cancel and go back?"}
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
              >
                No
              </button>

              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
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

export default MockTestInstructions;