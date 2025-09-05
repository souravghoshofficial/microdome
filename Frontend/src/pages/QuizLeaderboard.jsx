import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

import dummyImg from "../assets/user-img.jpeg";

const QuizLeaderboard = () => {
  const { quizId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          `${ApiUrl}/quiz/${quizId}/leaderboard`,
          { withCredentials: true }
        );
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [quizId]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950">
        <p className="text-lg animate-pulse">Loading Leaderboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950">
        <p className="text-lg">Leaderboard not found.</p>
      </div>
    );
  }

  const { quiz, topThree, others } = data;

  // ✅ Handle case: no participants at all
  if (topThree.length === 0 && others.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 text-gray-800 dark:text-white py-10">
        <div className="w-[90%] lg:w-[80%] mx-auto bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Total Questions: <strong>{quiz.totalQuestions}</strong> | Total Marks:{" "}
            <strong>{quiz.totalMarks}</strong>
          </p>
          <div className="mt-12">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              No participants yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 text-gray-800 dark:text-white py-10">
      <div className="mt-8 md:mt-10 w-[95%] lg:w-[80%] mx-auto bg-white dark:bg-zinc-900 py-6 px-4 md:p-6 rounded-xl shadow-lg">
        {/* Quiz Info */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Total Questions: <strong>{quiz.totalQuestions}</strong> | Total Marks:{" "}
            <strong>{quiz.totalMarks}</strong>
          </p>
        </div>

        {/* Podium (Top 3) */}
        {topThree.length > 0 && (
          <div className="flex justify-center items-end gap-6 mb-12">
            {/* 2nd */}
            {topThree[1] && (
              <div className="flex flex-col items-center">
                <img
                  src={topThree[1].user.profileImage || dummyImg}
                  alt={topThree[1].user.name}
                  className="w-20 h-20 object-center object-cover rounded-full border-4 border-gray-400"
                />
                <p className="mt-2 font-semibold text-center">{topThree[1].user.name}</p>
                <span className="text-sm font-semibold">
                  Score: {topThree[1].score}
                </span>
                <div className="bg-gray-400 w-16 h-24 mt-2 rounded-t-lg flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
            )}

            {/* 1st */}
            {topThree[0] && (
              <div className="flex flex-col items-center">
                <img
                  src={topThree[0].user.profileImage || dummyImg}
                  alt={topThree[0].user.name}
                  className="w-24 h-24 object-center object-cover rounded-full border-4 border-yellow-500"
                />
                <p className="mt-2 font-semibold text-center">{topThree[0].user.name}</p>
                <span className="text-sm font-semibold">
                  Score: {topThree[0].score}
                </span>
                <div className="bg-yellow-500 w-16 h-32 mt-2 rounded-t-lg flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
            )}

            {/* 3rd */}
            {topThree[2] && (
              <div className="flex flex-col items-center">
                <img
                  src={topThree[2].user.profileImage || dummyImg}
                  alt={topThree[2].user.name}
                  className="w-20 h-20 object-center object-cover rounded-full border-4 border-orange-500"
                />
                <p className="mt-2 font-semibold text-center">{topThree[2].user.name}</p>
                <span className="text-sm font-semibold">
                  Score: {topThree[2].score}
                </span>
                <div className="bg-orange-500 w-16 h-20 mt-2 rounded-t-lg flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
            )}
          </div>
        )}


        {others.length > 0 && (
          <div className="mt-6">
              {others.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex items-center gap-2 py-3 px-4 md:px-8 mt-2"
                >
                  <span className="font-bold w-4">{index + 4}</span>
                  <img
                    src={item.user.profileImage || dummyImg}
                    alt={item.user.name}
                    className="w-10 h-10 rounded-full object-center object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.user.name}</p>
                  </div>
                  <span className="font-semibold text-sm">Score: {item.score}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizLeaderboard;
