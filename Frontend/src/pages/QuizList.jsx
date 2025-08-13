import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/quiz`);
        setQuizzes(res.data.data); // assuming backend sends [{_id, title, description, timeLimit}]
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="max-w-6xl min-h-screen mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>
      {quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white shadow-lg rounded-lg p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-black">{quiz.title}</h2>
                <p className="text-gray-600 mt-2">{quiz.description}</p>
                {quiz.timeLimit > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Time Limit: {quiz.timeLimit} minutes
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate(`/quiz/${quiz._id}`)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
