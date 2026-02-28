import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, ChevronDown, ChevronUp, Trophy } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AdminMockTestResults = () => {
  const { mockTestId } = useParams();

  const [loading, setLoading] = useState(true);
  const [mockTest, setMockTest] = useState(null);
  const [students, setStudents] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${ApiUrl}/admin/mock-tests/${mockTestId}/results`,
          { withCredentials: true }
        );

        setMockTest(res.data.mockTest);
        setStudents(res.data.students || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [mockTestId]);

  /* ================= IST FORMAT ================= */
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
  if (!students.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <Trophy className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          No Results Yet
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          No student has attempted this test yet.
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
          {mockTest.title}
        </h1>

        <div className="mt-2 flex gap-4 text-sm text-gray-600">
          <span>Type: {mockTest.mockTestType}</span>
          <span>Marks: {mockTest.totalMarks}</span>
          <span>Duration: {mockTest.durationMinutes} min</span>
          <span>Attempts: {mockTest.allowedAttempts}</span>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-[900px] w-full">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-center">Institute</th>
              <th className="px-4 py-3 text-center">Course</th>
              <th className="px-4 py-3 text-center">Latest</th>
              <th className="px-4 py-3 text-center">Best</th>
              <th className="px-4 py-3 text-center">Attempts</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => {
              const expanded = expandedUser === s.userId;

              return (
                <>
                  {/* ROW */}
                  <tr
                    key={s.userId}
                    className="border-t hover:bg-gray-50"
                  >
                    {/* STUDENT */}
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={
                          s.profileImage ||
                          "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(s.name)
                        }
                        className="w-9 h-9 rounded-full object-cover"
                      />

                      <div>
                        <div className="font-medium text-gray-800">
                          {s.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {s.email}
                        </div>
                      </div>
                    </td>

                    {/* INSTITUTE */}
                    <td className="px-4 py-3 text-center">
                      {s.instituteName || "---"}
                    </td>

                    {/* COURSE */}
                    <td className="px-4 py-3 text-center">
                      {s.presentCourseOfStudy || "---"}
                    </td>

                    {/* LATEST */}
                    <td className="px-4 py-3 text-center font-semibold text-blue-600">
                      {s.latestScore}
                    </td>

                    {/* BEST */}
                    <td className="px-4 py-3 text-center font-semibold text-green-600">
                      {s.bestScore}
                    </td>

                    {/* COUNT */}
                    <td className="px-4 py-3 text-center">
                      {s.attempts.length}
                    </td>

                    {/* EXPAND */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          setExpandedUser(
                            expanded ? null : s.userId
                          )
                        }
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        {expanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* EXPANDED ATTEMPTS */}
                  {expanded && (
                    <tr>
                      <td colSpan="7" className="bg-gray-50">
                        <div className="p-4">
                          <div className="text-sm font-semibold mb-2 text-gray-700">
                            Attempts
                          </div>

                          <table className="w-full text-sm">
                            <thead className="text-gray-500">
                              <tr>
                                <th className="text-left py-2">
                                  Attempt
                                </th>
                                <th className="text-center">
                                  Score
                                </th>
                                <th className="text-center">
                                  Correct
                                </th>
                                <th className="text-center">
                                  Incorrect
                                </th>
                                <th className="text-center">
                                  Unattempted
                                </th>
                                <th className="text-center">
                                  Time
                                </th>
                                <th className="text-right">
                                  Date
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {s.attempts.map((a) => (
                                <tr
                                  key={a.attemptNumber}
                                  className="border-t"
                                >
                                  <td className="py-2">
                                    #{a.attemptNumber}
                                  </td>

                                  <td className="text-center font-medium">
                                    {a.score}
                                  </td>

                                  <td className="text-center text-green-600">
                                    {a.correctCount}
                                  </td>

                                  <td className="text-center text-red-600">
                                    {a.incorrectCount}
                                  </td>

                                  <td className="text-center">
                                    {a.unattemptedCount}
                                  </td>

                                  <td className="text-center">
                                    {Math.floor(
                                      a.timeTakenSeconds / 60
                                    )}m{" "}
                                    {a.timeTakenSeconds % 60}s
                                  </td>

                                  <td className="text-right text-gray-500">
                                    {formatIST(a.createdAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMockTestResults;