import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import userImage from "../../assets/user-img.jpeg";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const QuizResults = () => {
  const { quizId } = useParams();
  const [quizTitle, setQuizTitle] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // frontend pagination states
  const [page, setPage] = useState(1);
  const limit = 10; // students per page

  useEffect(() => {
    axios
      .get(`${ApiUrl}/admin/quiz/${quizId}/results`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setQuizTitle(res.data.data.quizTitle);
          setStudents(res.data.data.students);
        } else {
          toast.error(res.data.message || "Failed to fetch results");
        }
      })
      .catch((err) => {
        console.error("Error fetching quiz results:", err);
        toast.error("Error fetching quiz results");
      })
      .finally(() => setLoading(false));
  }, [quizId]);

  const totalPages = Math.ceil(students.length / limit);
  const startIndex = (page - 1) * limit;
  const currentStudents = students.slice(startIndex, startIndex + limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg animate-pulse">Loading results...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Quiz Results - {quizTitle}</h2>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left text-gray-600 border-b text-sm md:text-base">
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2 text-center">Email</th>
                <th className="px-4 py-2 text-center">Score</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Attempted At
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b hover:bg-gray-50 text-xs md:text-sm"
                  >
                    {/* Student (image + name) */}
                    <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                      <img
                        src={s.profileImage || userImage}
                        alt={s.name}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                      />
                      <span className="font-medium">{s.name}</span>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-center">{s.email}</td>

                    {/* Score */}
                    <td className="px-4 py-3 text-center font-semibold">
                      {s.score}
                    </td>

                    {/* Attempted At */}
                    <td className="px-4 py-3 text-center">
                      {new Date(s.attemptedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No students attempted this quiz yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {students.length > limit && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300 text-sm"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizResults;
