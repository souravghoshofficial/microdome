import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Plus, X, Loader2, Check, ImagePlus, Trash2, Edit, Trash, AlertTriangle } from "lucide-react";
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

  const [editMode, setEditMode] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

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
    questionImage: null,
    answerExplanation: ""
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
      fd.append("answerExplanation", form.answerExplanation);

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
        questionImage: null,
        answerExplanation: ""
      });
      setImagePreview(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add question");
    } finally {
      setCreating(false);
    }
  };

  /* ================= DELETE SINGLE QUESTION ================= */
  const handleDeleteQuestion = async (questionId) => {
    setDeleteTarget(questionId);
    setDeleteType("single");
    setShowDeleteConfirm(true);
  };

  const confirmDeleteQuestion = async () => {
    setDeleting(deleteTarget);
    setShowDeleteConfirm(false);
    
    try {
      await axios.delete(
        `${ApiUrl}/admin/mock-tests/${mockTestId}/sections/${mockTestSectionId}/${deleteTarget}`,
        { withCredentials: true }
      );

      toast.success("Question deleted successfully");
      fetchQuestions();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete question");
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
      setDeleteType(null);
    }
  };

  /* ================= DELETE ALL QUESTIONS ================= */
  const handleDeleteAllQuestions = async () => {
    setDeleteType("all");
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAllQuestions = async () => {
    setDeletingAll(true);
    setShowDeleteConfirm(false);
    
    try {
      await axios.delete(
        `${ApiUrl}/admin/mock-tests/${mockTestId}/${mockTestSectionId}/questions`,
        { withCredentials: true }
      );

      toast.success("All questions deleted successfully");
      fetchQuestions();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete all questions");
    } finally {
      setDeletingAll(false);
      setDeleteType(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteType === "single") {
      confirmDeleteQuestion();
    } else if (deleteType === "all") {
      confirmDeleteAllQuestions();
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    setDeleteType(null);
  };

  /* ================= EDIT QUESTION ================= */
  const handleEditQuestion = (question) => {
    setEditMode(true);
    setEditingQuestionId(question._id);
    setShowModal(true);

    setForm({
      questionText: question.questionText,
      options: question.options.length > 0 
        ? question.options 
        : [
            { label: "A", text: "" },
            { label: "B", text: "" },
            { label: "C", text: "" },
            { label: "D", text: "" }
          ],
      correctAnswer: question.correctAnswer || [],
      numericAnswer: question.numericAnswer || "",
      tolerance: question.tolerance || "",
      marks: question.marks,
      negativeMarks: question.negativeMarks,
      questionOrder: question.questionOrder,
      questionImage: null,
      answerExplanation: question.answerExplanation || ""
    });

    if (question.questionImageUrl) {
      setImagePreview(question.questionImageUrl);
    }
  };

  /* ================= UPDATE QUESTION ================= */
  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const fd = new FormData();
      fd.append("questionType", section.questionType);
      fd.append("questionText", form.questionText);
      fd.append("marks", form.marks);
      fd.append("negativeMarks", form.negativeMarks);
      fd.append("questionOrder", form.questionOrder);
      fd.append("answerExplanation", form.answerExplanation);

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

      await axios.patch(
        `${ApiUrl}/admin/mock-tests/${mockTestId}/${mockTestSectionId}/${editingQuestionId}`,
        fd,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      toast.success("Question updated successfully");
      setShowModal(false);
      setEditMode(false);
      setEditingQuestionId(null);
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
        questionImage: null,
        answerExplanation: ""
      });
      setImagePreview(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update question");
    } finally {
      setUpdating(false);
    }
  };

  /* ================= CANCEL EDIT ================= */
  const handleCancelEdit = () => {
    setShowModal(false);
    setEditMode(false);
    setEditingQuestionId(null);
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
      questionImage: null,
      answerExplanation: ""
    });
    setImagePreview(null);
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
        <div className="flex gap-2">
          {questions.length > 0 && (
            <button
              onClick={handleDeleteAllQuestions}
              disabled={deletingAll}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer disabled:opacity-50"
            >
              {deletingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash className="w-4 h-4" />
              )}
              Delete All
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>
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
              <div className="flex justify-between items-start">
                <p className="font-semibold flex-1">
                  Q{q.questionOrder}. {q.questionText}
                </p>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditQuestion(q)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                    title="Edit question"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q._id)}
                    disabled={deleting === q._id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer disabled:opacity-50"
                    title="Delete question"
                  >
                    {deleting === q._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

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
                        <Check className="inline-block w-4 h-4 ml-2 text-green-600" />
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
              {q.answerExplanation && (
              <div className="mt-2 p-3 bg-gray-50 border-l-4 border-blue-600">
                <h3 className="font-semibold text-sm mb-1">Answer Explanation:</h3>
                <p className="text-sm text-gray-700">{q.answerExplanation}</p>
              </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold">Confirm Action</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              {deleteType === "single" 
                ? "Are you sure you want to delete this question?"
                : "Are you sure you want to delete all questions from this section?"}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto scrollbar-none">
            <button
              onClick={handleCancelEdit}
              className="absolute top-4 right-4 cursor-pointer"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Question" : `Add Question (${section.questionType})`}
            </h2>

            <form onSubmit={editMode ? handleUpdateQuestion : handleSubmit} className="space-y-4">
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
     <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />

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
      className="mt-2 text-sm text-red-600 hover:underline cursor-pointer float-right"
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
                    min={0}
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
                    max={section.totalQuestions}
                    min={1}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium" htmlFor="answerExplanation">Answer Explanation (optional)</label>
                <textarea
                  id="answerExplanation"
                  name="answerExplanation"
                  value={form.answerExplanation}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  rows="3"
                />
              </div>

              <button
                type="submit"
                disabled={editMode ? updating : creating}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                {(editMode ? updating : creating) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editMode 
                  ? (updating ? "Updating..." : "Update Question")
                  : (creating ? "Adding..." : "Add Question")
                }
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMockTestQuestions;