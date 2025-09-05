import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [category, setCategory] = useState("free");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctOption: "" },
  ]);

  // AI Modal state
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiForm, setAiForm] = useState({
    title: "",
    description: "",
    category: "free",
    subject: "",
    topic: "",
    numQuestions: 5,
    timeLimit: 10,
    difficulty: "medium",
  });
  const [loadingAI, setLoadingAI] = useState(false);

  // Handlers for manual form
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectOptionChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctOption = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctOption: "" },
    ]);
  };

  // Save quiz to DB
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      category,
      timeLimit: Number(timeLimit),
      questions: questions.map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctOption: Number(q.correctOption) - 1, // UI 1-4 → DB 0-3
      })),
    };

    try {
      const res = await axios.post(`${ApiUrl}/admin/create-quiz`, payload, {
        withCredentials: true,
      });

      toast.success("Quiz created successfully!");
      console.log(res.data);

      // Reset
      setTitle("");
      setDescription("");
      setTimeLimit("");
      setCategory("free");
      setQuestions([
        { questionText: "", options: ["", "", "", ""], correctOption: "" },
      ]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating quiz");
    }
  };

  // Generate with AI
  const generateWithAI = async () => {
    setLoadingAI(true);
    try {
      const res = await axios.post(`${ApiUrl}/admin/generate-quiz`, aiForm, {
        withCredentials: true,
      });

      const quiz = res?.data?.quiz;
      if (!quiz) throw new Error("No quiz data returned");

      // Prefill main form
      setTitle(quiz.title);
      setDescription(quiz.description);
      setCategory(quiz.category);
      setTimeLimit(quiz.timeLimit);

      setQuestions(
        quiz.questions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
          correctOption: q.correctOption + 1, // DB 0-3 → UI 1-4
        }))
      );

      toast.success("AI generated quiz!");
      setShowAIModal(false);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Error generating quiz"
      );
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-4 bg-white shadow-lg rounded-xl">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4">Create New Quiz</h2>

      {/* === MAIN FORM === */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 h-[82vh] overflow-y-scroll scrollbar-none"
      >
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          placeholder="Quiz Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        <input
          type="number"
          placeholder="Time Limit (in minutes)"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 border rounded space-y-2">
            {/* Changed from input to textarea */}
            <textarea
              placeholder={`Question ${qIndex + 1}`}
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full p-2 border rounded resize-y min-h-[60px]"
              required
            />

            {q.options.map((opt, optIndex) => (
              <input
                key={optIndex}
                type="text"
                placeholder={`Option ${optIndex + 1}`}
                value={opt}
                onChange={(e) =>
                  handleOptionChange(qIndex, optIndex, e.target.value)
                }
                className="w-full p-2 border rounded"
                required
              />
            ))}

            <input
              type="number"
              placeholder="Correct Option (1-4)"
              min="1"
              max="4"
              value={q.correctOption}
              onChange={(e) =>
                handleCorrectOptionChange(qIndex, e.target.value)
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
        >
          Add Question
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-4 cursor-pointer"
        >
          Create Quiz
        </button>

        <button
          type="button"
          onClick={() => setShowAIModal(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 ml-4 cursor-pointer"
        >
          Generate with AI
        </button>
      </form>

      {/* === AI MODAL === */}
      {showAIModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-3">
            <h3 className="text-lg font-bold">Generate Quiz with AI</h3>

            {[
              { name: "title", type: "text", placeholder: "Quiz Title" },
              { name: "description", type: "text", placeholder: "Description" },
              { name: "subject", type: "text", placeholder: "Subject" },
              { name: "topic", type: "text", placeholder: "Topic/Chapter" },
              {
                name: "numQuestions",
                type: "number",
                placeholder: "No. of Questions",
              },
              {
                name: "timeLimit",
                type: "number",
                placeholder: "Time Limit (minutes)",
              },
            ].map((f, idx) => (
              <input
                key={idx}
                type={f.type}
                placeholder={f.placeholder}
                value={aiForm[f.name]}
                onChange={(e) =>
                  setAiForm({ ...aiForm, [f.name]: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            ))}

            <select
              value={aiForm.category}
              onChange={(e) =>
                setAiForm({ ...aiForm, category: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>

            <select
              value={aiForm.difficulty}
              onChange={(e) =>
                setAiForm({ ...aiForm, difficulty: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAIModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={generateWithAI}
                disabled={loadingAI}
                className={`px-4 py-2 flex items-center justify-center gap-2 rounded transition-colors 
    ${
      loadingAI
        ? "bg-gray-400 text-white cursor-not-allowed"
        : "bg-purple-500 text-white hover:bg-purple-600 cursor-pointer"
    }`}
              >
                {loadingAI ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
