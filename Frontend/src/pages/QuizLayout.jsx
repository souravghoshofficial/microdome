import React, { useState, useEffect } from "react";
import { QuestionNavigation, Question, Button, StatusBandage } from "../components/quiz";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const QuizLayout = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/quiz/${quizId}`);
        if (res.data?.success) {
          setQuiz(res.data.data);
          setTimeLeft(res.data.data.timeLimit * 60); // convert mins → seconds
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) return <p className="text-white">Loading quiz...</p>;

  if (!quiz) return <p className="text-white">Quiz not found!</p>;

  // Instruction Page
  if (!quizStarted) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center">
        <div className="bg-zinc-900 p-6 rounded-md w-[90%] md:w-[60%] text-center">
          <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
          <p className="mb-4">{quiz.description}</p>
          <p className="mb-6">Time Limit: {quiz.timeLimit} minutes</p>
          <div className="flex justify-center gap-4">
            <Button
              btnText="Start Quiz"
              className="bg-green-500 text-white"
              onClick={() => setQuizStarted(true)}
            />
            <Button
              btnText="Cancel"
              className="bg-red-500 text-white"
              onClick={() => navigate("/quiz")}
            />
          </div>
        </div>
      </div>
    );
  }

  // Quiz Page
  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white py-16">
      <div className="w-[90%] mx-auto bg-zinc-900 px-4 py-6 rounded-md">
        {/* Status Bandages */}
        <div className="flex flex-col md:flex-row items-start mb-4 md:items-center gap-2 md:gap-5">
          <StatusBandage className="bg-purple-500" statusName="Attempted" status={1} />
          <StatusBandage className="bg-blue-500" statusName="Question Left" status={quiz.questions.length - 1} />
          <StatusBandage className="bg-yellow-500" statusName="Marked For Review" status={0} />
        </div>

        <QuestionNavigation />

        <div className="mt-8 text-lg">
          <h2>Test Name: {quiz.title}</h2>
          <h2>Time Left: {formatTime(timeLeft)}</h2>
        </div>

        <hr className="mt-4" />

        <div>
          <Question question={quiz.questions[currentQuestion]} />
        </div>

        <hr className="mt-4" />

        <div className="mt-4 flex flex-col md:flex-row items-start mb-4 md:items-center gap-4">
          <Button btnText="Clear Response" className="bg-red-500 text-white" />
          <div onClick={() => setCurrentQuestion((prev) => prev + 1)}>
            <Button
              btnText="Save & Next"
              className={`bg-green-500 text-white ${currentQuestion === quiz.questions.length - 1 ? "hidden" : "block"}`}
            />
          </div>
          <Button
            btnText="Save & Previous"
            className={`bg-green-500 text-white ${currentQuestion === 0 ? "hidden" : "block"}`}
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
          />
          <Button btnText="Mark For Review" className="bg-yellow-500 text-white" />
          <Button btnText="Submit The Test" className="bg-blue-500 text-white" />
        </div>
      </div>
    </div>
  );
};

export default QuizLayout;
