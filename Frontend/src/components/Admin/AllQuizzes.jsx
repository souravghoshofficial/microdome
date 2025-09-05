import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Pencil } from "lucide-react";
import { Link } from "react-router";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AllQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(8);

  useEffect(() => {
    axios
      .get(`${ApiUrl}/admin/quizzes`, { withCredentials: true })
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setQuizzes(res.data.data);
          toast.success("Quizzes fetched successfully");
        } else {
          toast.error("No quizzes found");
        }
      })
      .catch((err) => {
        console.error("Error fetching quizzes:", err);
        toast.error("Failed to load quizzes");
      });
  }, []);

  // Pagination calculations
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />

      {/* Header with Create button */}
      <div className="flex flex-row justify-between items-center px-4 md:px-6 py-4 border-b gap-3">
        <h2 className="text-base md:text-lg font-semibold">All Quizzes</h2>
        <Link
          to="/admin/create-quiz"
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow text-sm md:text-base cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Quiz
        </Link>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left text-gray-600 border-b text-sm md:text-base">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2 text-center">Category</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  No. of Questions
                </th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Time (mins)
                </th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Attempted By
                </th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentQuizzes.length > 0 ? (
                currentQuizzes.map((quiz) => (
                  <tr
                    key={quiz._id}
                    className="border-b hover:bg-gray-50 text-xs md:text-sm"
                  >
                    {/* Title */}
                    <td className="px-4 py-3 font-medium">{quiz.title}</td>

                    {/* Category */}
                    <td className="px-4 py-3 text-center capitalize">
                      {quiz.category}
                    </td>

                    {/* No. of Questions */}
                    <td className="px-4 py-3 text-center">
                      {quiz.noOfQuestions}
                    </td>

                    {/* Time */}
                    <td className="px-4 py-3 text-center">{quiz.time} min</td>

                    {/* Attempted By */}
                    <td className="px-4 py-3 text-center">
                      {quiz.attemptedBy}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center flex justify-center gap-2">
                       <Link
                        className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs md:text-sm"
                        to={`/admin/edit-quiz/${quiz._id}`}
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </Link>
                      <Link
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs md:text-sm"
                        to={`/admin/quiz-result/${quiz._id}`}
                      >
                        View Results
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No quizzes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {quizzes.length > quizzesPerPage && (
        <div className="flex justify-center items-center gap-2 py-4 border-t">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded cursor-pointer ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllQuizzes;
