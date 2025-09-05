import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const EditQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [category, setCategory] = useState("free");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch quiz details
  useEffect(() => {
    axios
      .get(`${ApiUrl}/admin/quiz/${quizId}`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          const quiz = res.data.data;
          setTitle(quiz.title);
          setDescription(quiz.description);
          setTimeLimit(quiz.timeLimit);
          setCategory(quiz.category);
          setQuestions(
            quiz.questions.map((q) => ({
              questionText: q.questionText,
              options: q.options,
              correctOption: q.correctOption + 1, // convert back to 1-based for UI
            }))
          );
        } else {
          toast.error("Quiz not found");
        }
      })
      .catch(() => toast.error("Error loading quiz"))
      .finally(() => setLoading(false));
  }, [quizId]);

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
        correctOption: Number(q.correctOption) - 1, // UI → DB
      })),
    };

    try {
      await axios.put(`${ApiUrl}/admin/quiz/${quizId}`, payload, {
        withCredentials: true,
      });

      toast.success("Quiz updated successfully!");
      navigate("/admin/quizzes");
    } catch (err) {
      console.error(err);
      toast.error("Error updating quiz");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg animate-pulse">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-4 bg-white shadow-lg rounded-xl">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4">Edit Quiz</h2>
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
              onChange={(e) => handleCorrectOptionChange(qIndex, e.target.value)}
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
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditQuiz;
