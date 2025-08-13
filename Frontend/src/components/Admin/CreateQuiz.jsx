import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctOption: "" }
  ]);

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
    updated[qIndex].correctOption = value; // keep 1-based in UI
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctOption: "" }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      timeLimit: Number(timeLimit),
      questions: questions.map(q => ({
        question: q.questionText,
        options: q.options,
        correctOption: Number(q.correctOption) - 1 // convert to 0-based before saving
      }))
    };

    try {
      const res = await axios.post(`${ApiUrl}/admin/create-quiz`, payload, {
      withCredentials: true
    });
      toast.success("Quiz created successfully!")
      console.log(res.data);

      // reset
      setTitle("");
      setDescription("");
      setTimeLimit("");
      setQuestions([{ questionText: "", options: ["", "", "", ""], correctOption: "" }]);
    } catch (err) {
      console.error(err);
      toast.error("Error creating quiz");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-4 bg-white shadow-lg rounded-xl">
      <Toaster position="top-right"/>
      <h2 className="text-2xl font-bold mb-4">Create New Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4 h-[82vh] overflow-y-scroll scrollbar-none">

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

        <input
          type="number"
          placeholder="Time Limit (in minutes)"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 border rounded space-y-2">
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            {q.options.map((opt, optIndex) => (
              <input
                key={optIndex}
                type="text"
                placeholder={`Option ${optIndex + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
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
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
