import React from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import axios from "axios";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const result = location.state;

  const handleBtnClick = async () => {
    try {
      const res = await axios.get(`${ApiUrl}/users/current-user`, {
        withCredentials: true,
      });
      dispatch(login(res.data.data));
      navigate("/quiz");
    } catch {
      console.log("Something went wrong");
    } finally {
      navigate("/quiz");
    }
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-950">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          No quiz result available.
        </p>
        <button
          onClick={() => navigate("/quiz")}
          className="ml-3 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 flex flex-col items-center py-10 px-4 text-gray-800 dark:text-gray-200">
      {/* Score Summary */}
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-6 mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Quiz Results</h1>
        <p className="text-lg mb-4">
          You scored{" "}
          <span className="font-semibold text-blue-600">{result.score}</span>{" "}
          out of <span className="font-semibold">{result.total}</span>
        </p>

        <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${(result.score / result.total) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="w-full max-w-3xl space-y-6">
        {result.resultDetails.map((q, index) => {
          const unattempted = q.selectedOption === null;

          return (
            <div
              key={q.questionId}
              className={`p-6 rounded-2xl shadow-md border ${
                unattempted
                  ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600"
                  : q.isCorrect
                  ? "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-600"
                  : "bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-600"
              }`}
            >
              <h2 className="text-lg font-semibold mb-3">
                {index + 1}. {q.question}
              </h2>

              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isSelected = parseInt(q.selectedOption) === i;
                  const isCorrect = q.correctAnswer === i;

                  return (
                    <div
                      key={i}
                      className={`px-4 py-2 rounded-lg border text-sm
                        ${
                          isCorrect
                            ? "bg-green-500 text-white border-green-600"
                            : ""
                        }
                        ${
                          isSelected && !isCorrect
                            ? "bg-red-500 text-white border-red-600"
                            : ""
                        }
                        ${
                          !isCorrect && !isSelected
                            ? "bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200"
                            : ""
                        }`}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>

              {/* Status */}
              <p
                className={`mt-4 font-medium ${
                  unattempted
                    ? "text-yellow-600 dark:text-yellow-400"
                    : q.isCorrect
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {unattempted
                  ? "⚠️ Unattempted"
                  : q.isCorrect
                  ? "✅ Correct"
                  : "❌ Incorrect"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Go Back Button */}
      <button
        onClick={handleBtnClick}
        className="mt-10 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-lg shadow-md"
      >
        Go to Quizzes
      </button>
    </div>
  );
};

export default QuizResult;
