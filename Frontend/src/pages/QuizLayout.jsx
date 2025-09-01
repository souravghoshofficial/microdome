import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

import {
  QuestionNavigation,
  Question,
  Button,
  StatusBandage,
} from "../components/quiz";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const QuizLayout = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/quiz/${quizId}`);
        if (res.data?.success) {
          setQuiz(res.data.data);
          setTimeLeft(res.data.data.timeLimit * 60);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && quizStarted) {
      handleSubmit();
    }
  }, [quizStarted, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSaveAnswer = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    setSubmitting(true);
    try {
      // convert answers object -> array
      const formattedAnswers = Object.keys(answers).map((qIdx) => ({
        questionId: quiz.questions[qIdx]._id,
        selectedOption: answers[qIdx],
      }));

      const res = await axios.post(`${ApiUrl}/quiz/submit`, {
        quizId,
        answers: formattedAnswers,
      });

      if (res.data?.success) {
        navigate(`/quiz/result/${quizId}`, { state: res.data });
      } else {
        console.error("Submit failed:", res.data);
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950 text-gray-800 dark:text-white">
        <p className="text-lg animate-pulse">Loading quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950 text-gray-800 dark:text-white">
        <p className="text-lg">Quiz not found!</p>
      </div>
    );
  }

  // Instruction Page
  if (!quizStarted) {
    return (
      <div className="w-full min-h-screen bg-gray-100 dark:bg-zinc-950 text-gray-800 dark:text-white flex flex-col justify-center items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 p-8 rounded-2xl w-full max-w-2xl text-center shadow-lg"
        >
          <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{quiz.description}</p>
          <p className="mb-6 text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <Clock size={18} /> Time Limit:{" "}
            <span className="font-semibold">{quiz.timeLimit} minutes</span>
          </p>
          <div className="flex justify-center gap-4">
            <Button
              btnText="Start Quiz"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => setQuizStarted(true)}
            />
            <Button
              btnText="Cancel"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => navigate("/quiz")}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz Page
  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-zinc-950 text-gray-800 dark:text-white py-10">
      <div className="w-[95%] lg:w-[85%] mx-auto bg-white dark:bg-zinc-900 px-6 py-6 rounded-2xl shadow-lg">
        {/* Status Bandages */}
        <div className="flex flex-wrap gap-3 mb-6">
          <StatusBandage
            className="bg-purple-500 text-white"
            statusName="Attempted"
            status={Object.keys(answers).length}
          />
          <StatusBandage
            className="bg-blue-500 text-white"
            statusName="Remaining"
            status={quiz.questions.length - Object.keys(answers).length}
          />
        </div>

        {/* Navigation & Timer */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <QuestionNavigation
            total={quiz.questions.length}
            current={currentQuestion}
            onJump={(idx) => setCurrentQuestion(idx)}
            answers={answers}
          />

          <div className="bg-gray-200 dark:bg-zinc-800 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
            <Clock size={18} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Area */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">
            Question No. {currentQuestion + 1}
          </h2>
          <Question
            question={quiz.questions[currentQuestion]}
            selected={answers[currentQuestion]}
            onSelect={handleSaveAnswer}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            btnText="Clear Response"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() =>
              setAnswers((prev) => {
                const updated = { ...prev };
                delete updated[currentQuestion];
                return updated;
              })
            }
          />
          {currentQuestion > 0 && (
            <Button
              btnText="Previous"
              className="bg-gray-500 hover:bg-gray-600 text-white"
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
            />
          )}
          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              btnText="Save & Next"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
            />
          ) : (
            <Button
              btnText={submitting ? "Submitting..." : "Submit Test"}
              className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
              onClick={handleSubmit}
              disabled={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizLayout;
