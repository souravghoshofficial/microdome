import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Plus, X, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AdminMockTestQuestions = () => {
  const { mockTestId, mockTestSectionId } = useParams();

  const [section, setSection] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    questionText: "",
    options: [
      { label: "A", text: "" },
      { label: "B", text: "" },
      { label: "C", text: "" },
      { label: "D", text: "" }
    ],
    correctAnswer: [],
    numericAnswer: "",
    tolerance: "",
    marks: "",
    negativeMarks: 0,
    questionOrder: "",
    questionImage: null
  });

  /* ================= FETCH ================= */

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `${ApiUrl}/admin/mock-tests/${mockTestId}/${mockTestSectionId}/questions`,
        { withCredentials: true }
      );

      setSection(res.data.data.section);
      setQuestions(res.data.data.questions);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [mockTestId, mockTestSectionId]);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (label, value) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((o) =>
        o.label === label ? { ...o, text: value } : o
      )
    }));
  };

  const toggleCorrectAnswer = (label) => {
    setForm((prev) => {
      if (section.questionType === "MCQ") {
        return { ...prev, correctAnswer: [label] };
      }
      return {
        ...prev,
        correctAnswer: prev.correctAnswer.includes(label)
          ? prev.correctAnswer.filter((a) => a !== label)
          : [...prev.correctAnswer, label]
      };
    });
  };

  const handleImageChange = (file) => {
    if (!file) return;
    setForm({ ...form, questionImage: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const fd = new FormData();

      fd.append("questionType", section.questionType);
      fd.append("questionText", form.questionText);
      fd.append("marks", form.marks);
      fd.append("negativeMarks", form.negativeMarks);
      fd.append("questionOrder", form.questionOrder);

      if (form.questionImage) {
        fd.append("questionImage", form.questionImage);
      }

      if (section.questionType === "NAT") {
        fd.append("numericAnswer", form.numericAnswer);
        if (form.tolerance) fd.append("tolerance", form.tolerance);
      } else {
        fd.append(
          "options",
          JSON.stringify(form.options.filter((o) => o.text.trim()))
        );
        fd.append("correctAnswer", JSON.stringify(form.correctAnswer));
      }

      await axios.post(
        `${ApiUrl}/admin/mock-tests/${mockTestId}/${mockTestSectionId}/questions`,
        fd,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      toast.success("Question added successfully");
      setShowModal(false);
      fetchQuestions();

      setForm({
        questionText: "",
        options: [
          { label: "A", text: "" },
          { label: "B", text: "" },
          { label: "C", text: "" },
          { label: "D", text: "" }
        ],
        correctAnswer: [],
        numericAnswer: "",
        tolerance: "",
        marks: "",
        negativeMarks: 0,
        questionOrder: "",
        questionImage: null
      });
      setImagePreview(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add question");
    } finally {
      setCreating(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 overflow-y-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">{section.title}</h1>
        <p className="text-sm text-gray-600">
          {section.questionType} • {questions.length}/{section.totalQuestions}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Questions</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {/* ================= QUESTIONS LIST ================= */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          No questions added yet
        </div>
      ) : (
        <div className="space-y-4 h-[72vh] overflow-y-scroll scrollbar-none pb-4">
          {questions.map((q) => (
            <div
              key={q._id}
              className="bg-white rounded-xl shadow p-4"
            >
              <p className="font-semibold">
                Q{q.questionOrder}. {q.questionText}
              </p>

              {q.questionImageUrl && (
                <img
                  src={q.questionImageUrl}
                  alt="question"
                  className="mt-2 h-40 object-contain border rounded"
                />
              )}

              {q.questionType !== "NAT" && (
                <ul className="mt-2 space-y-1 text-sm">
                  {q.options.map((o) => (
                    <li key={o.label}>
                      <strong>{o.label}.</strong> {o.text}
                      {q.correctAnswer.includes(o.label) && (
                        <span className="ml-2 text-green-600 font-semibold">
                          ✓
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {q.questionType === "NAT" && (
                <p className="mt-2 text-sm text-gray-600">
                  Answer: {q.numericAnswer}
                  {q.tolerance !== null && ` ± ${q.tolerance}`}
                </p>
              )}

              <p className="mt-2 text-sm text-gray-500">
                Marks: {q.marks}
                {q.negativeMarks > 0 && ` | Negative: -${q.negativeMarks}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto scrollbar-none">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 cursor-pointer"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Add Question ({section.questionType})
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Question</label>
                <textarea
                  name="questionText"
                  value={form.questionText}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  placeholder="Enter question text"
                  required
                />
              </div>

             {/* Question Image */}
<div>
  <label className="text-sm font-medium block mb-1">
    Question Image (optional)
  </label>

  <label
    htmlFor="questionImage"
    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer
               border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
  >
    {!imagePreview ? (
      <>
        <svg
          className="w-10 h-10 text-gray-400 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12M5 20h14a2 2 0 002-2v-2H3v2a2 2 0 002 2z"
          />
        </svg>

        <p className="text-sm text-gray-600">
          Click to upload or browse image
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PNG, JPG, JPEG
        </p>
      </>
    ) : (
      <img
        src={imagePreview}
        alt="Preview"
        className="h-full object-contain rounded"
      />
    )}
  </label>

  <input
    id="questionImage"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => handleImageChange(e.target.files[0])}
  />

  {imagePreview && (
    <button
      type="button"
      onClick={() => {
        setImagePreview(null);
        setForm({ ...form, questionImage: null });
      }}
      className="mt-2 text-sm text-red-600 hover:underline cursor-pointer"
    >
      Remove image
    </button>
  )}
</div>


              {/* Options */}
              {section.questionType !== "NAT" &&
                form.options.map((opt) => (
                  <div key={opt.label}>
                    <label className="text-sm font-medium">
                      Option {opt.label}
                    </label>
                    <div className="flex gap-2 items-center mt-1">
                        <input
                        type={
                          section.questionType === "MCQ" ? "radio" : "checkbox"
                        }
                        name="correctOption"
                        disabled={!opt.text.trim()}
                        checked={form.correctAnswer.includes(opt.label)}
                        onChange={() => toggleCorrectAnswer(opt.label)}
                        className="cursor-pointer disabled:opacity-50"
                      />
                      <input
                        className="flex-1 border rounded px-3 py-2"
                        value={opt.text}
                        onChange={(e) =>
                          handleOptionChange(opt.label, e.target.value)
                        }
                        placeholder={`Option ${opt.label}`}
                      />
                    </div>
                  </div>
                ))}

              {/* NAT */}
              {section.questionType === "NAT" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Numeric Answer</label>
                    <input
                      type="number"
                      value={form.numericAnswer}
                      onChange={(e) =>
                        setForm({ ...form, numericAnswer: e.target.value })
                      }
                      className="border rounded px-3 py-2 mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tolerance</label>
                    <input
                      type="number"
                      value={form.tolerance}
                      onChange={(e) =>
                        setForm({ ...form, tolerance: e.target.value })
                      }
                      className="border rounded px-3 py-2 mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium">Marks</label>
                  <input
                    type="number"
                    name="marks"
                    value={form.marks}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Negative Marks</label>
                  <input
                    type="number"
                    name="negativeMarks"
                    value={form.negativeMarks}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Question Order</label>
                  <input
                    type="number"
                    name="questionOrder"
                    value={form.questionOrder}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                {creating ? "Adding..." : "Add Question"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMockTestQuestions;
