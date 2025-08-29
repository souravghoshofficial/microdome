import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/quiz`);
        setQuizzes(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-32">
      <div className="w-[90%] max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Available
          {" "} 
          <span className="text-highlighted">Quizzes</span>
        </h1>

        {quizzes.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
            No quizzes found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-zinc-900 shadow-md hover:shadow-2xl rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 border border-gray-200 dark:border-zinc-800"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {quiz.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                    {quiz.description}
                  </p>
                  {quiz.timeLimit > 0 && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                      <Clock size={16} className="mr-2" />
                      Time Limit: {quiz.timeLimit} min
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/quiz/${quiz._id}`)}
                  className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 
                             text-white font-medium rounded-xl shadow-md hover:scale-105 
                             hover:shadow-lg transition-transform duration-200 cursor-pointer"
                >
                  Start Quiz
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
