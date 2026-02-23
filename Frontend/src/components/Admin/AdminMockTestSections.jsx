import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";
import { Plus, X, Loader2, Trash2, Pencil } from "lucide-react";
import toast, {Toaster} from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MOCK_TEST_TYPE_LABELS = {
  IIT_JAM: "IIT JAM",
  CUET_PG: "CUET PG",
  GAT_B: "GAT-B",
  GATE: "GATE",
};

const AdminMockTestSections = () => {
  const { mockTestId } = useParams();

  const [mockTest, setMockTest] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [creatingSection, setCreatingSection] = useState(false);
  const [updatingSection, setUpdatingSection] = useState(false);

  const [selectedSection, setSelectedSection] = useState(null);

  /* ================= CONFIRM MODAL ================= */
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const openConfirmModal = ({ title, message, onConfirm }) => {
    setConfirmModal({ open: true, title, message, onConfirm });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      open: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const [sectionForm, setSectionForm] = useState({
    title: "",
    questionType: "",
    totalQuestions: "",
    questionsToAttempt: "",
    sectionOrder: "",
  });

  const fetchData = async () => {
    try {
      const [mockTestRes, sectionRes] = await Promise.all([
        axios.get(`${ApiUrl}/admin/mock-tests/${mockTestId}`, {
          withCredentials: true,
        }),
        axios.get(`${ApiUrl}/admin/mock-tests/${mockTestId}/sections`, {
          withCredentials: true,
        }),
      ]);

      setMockTest(mockTestRes.data.data);
      setSections(sectionRes.data.data);
    } catch (error) {
      console.error("Failed to load mock test data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mockTestId]);

  const handleSectionChange = (e) => {
    setSectionForm({ ...sectionForm, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setSectionForm({
      title: "",
      questionType: "",
      totalQuestions: "",
      questionsToAttempt: "",
      sectionOrder: "",
    });
    setSelectedSection(null);
  };

  /* ================= CREATE ================= */
  const handleCreateSection = async (e) => {
    e.preventDefault();
    setCreatingSection(true);

    try {
      await axios.post(
        `${ApiUrl}/admin/mock-tests/${mockTestId}/sections`,
        {
          ...sectionForm,
          totalQuestions: Number(sectionForm.totalQuestions),
          questionsToAttempt:
            sectionForm.questionsToAttempt === ""
              ? null
              : Number(sectionForm.questionsToAttempt),
          sectionOrder: Number(sectionForm.sectionOrder),
        },
        { withCredentials: true },
      );

      setShowSectionModal(false);
      resetForm();
      toast.success("Section created successfully!");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Create section failed");
    } finally {
      setCreatingSection(false);
    }
  };

  /* ================= UPDATE ================= */
  const openEditModal = (section) => {
    setSelectedSection(section);
    setSectionForm({
      title: section.title,
      questionType: section.questionType,
      totalQuestions: section.totalQuestions,
      questionsToAttempt: section.questionsToAttempt ?? "",
      sectionOrder: section.sectionOrder,
    });
    setShowEditModal(true);
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    setUpdatingSection(true);

    try {
      await axios.patch(
        `${ApiUrl}/admin/mock-tests/${mockTestId}/sections/${selectedSection._id}`,
        {
          ...sectionForm,
          totalQuestions: Number(sectionForm.totalQuestions),
          questionsToAttempt:
            sectionForm.questionsToAttempt === ""
              ? null
              : Number(sectionForm.questionsToAttempt),
          sectionOrder: Number(sectionForm.sectionOrder),
        },
        { withCredentials: true },
      );

      setShowEditModal(false);
      resetForm();
      toast.success("Section updated successfully!");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setUpdatingSection(false);
    }
  };

  /* ================= DELETE SINGLE ================= */
  const handleDeleteSection = (sectionId) => {
    openConfirmModal({
      title: "Confirm Action",
      message: "Are you sure you want to delete this section?",
      onConfirm: async () => {
        try {
          await axios.delete(
            `${ApiUrl}/admin/mock-tests/${mockTestId}/sections/${sectionId}`,
            { withCredentials: true },
          );
          toast.success("Section deleted successfully!");
          fetchData();
        } catch (error) {
          toast.error(error?.response?.data?.message || "Delete failed");
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  /* ================= DELETE ALL ================= */
  const handleDeleteAllSections = () => {
    openConfirmModal({
      title: "Confirm Action",
      message: "Are you sure you want to delete ALL sections?",
      onConfirm: async () => {
        try {
          await axios.delete(
            `${ApiUrl}/admin/mock-tests/${mockTestId}/sections`,
            { withCredentials: true },
          );
          toast.success("All sections deleted successfully!");
          fetchData();
        } catch (error) {
          toast.error(error?.response?.data?.message || "Delete failed");
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="min-h-screen w-full px-4">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
          {mockTest.title}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {MOCK_TEST_TYPE_LABELS[mockTest.mockTestType]} •{" "}
          {mockTest.durationMinutes} mins • {mockTest.totalMarks} marks
        </p>

       <div className="flex items-center justify-between">
         <div className="mt-2 flex gap-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              mockTest.accessType === "FREE"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {mockTest.accessType}
          </span>

          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              mockTest.status === "PUBLISHED"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {mockTest.status}
          </span>
        </div>

        {sections.length > 0 && (
          <button
            onClick={handleDeleteAllSections}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded cursor-pointer"
          >
            <Trash2 size={16} /> Delete All
          </button>
        )}
       </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Sections</h2>
          <button
            onClick={() => setShowSectionModal(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded cursor-pointer"
          >
            <Plus size={16} /> Add Section
          </button>
        </div>

        {sections.length === 0 && (
          <p className="text-gray-500 text-sm">No sections added yet.</p>
        )}

        {sections.map((section) => (
          <div
            key={section._id}
            className="border rounded-lg p-3 flex justify-between items-center mb-4 hover:shadow hover:border-blue-600 hover:-translate-y-1 transition-all duration-300"
          >
            <Link
              to={`/admin/mock-tests/${mockTestId}/${section._id}/questions`}
              className="flex-1 cursor-pointer"
            >
              <p className="font-medium">{section.title}</p>
              <p className="text-sm text-gray-600">
                {section.questionType} • {section.totalQuestions} questions • Max attempt {section.questionsToAttempt !== null ? `${section.questionsToAttempt}` : "all"}
              </p>
            </Link>

            <div className="flex gap-2 md:gap-3">
              <button
                onClick={() => openEditModal(section)}
                className="p-2 border border-blue-600 text-blue-700 hover:bg-blue-100 rounded cursor-pointer"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDeleteSection(section._id)}
                className="p-2 border border-red-600 text-red-700 hover:bg-red-100 rounded cursor-pointer"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(showSectionModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={showEditModal ? handleUpdateSection : handleCreateSection}
            className="bg-white rounded-xl w-full max-w-lg p-6 space-y-3"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {showEditModal ? "Edit Section" : "Add Section"}
              </h2>
              <X
                onClick={() => {
                  setShowEditModal(false);
                  setShowSectionModal(false);
                  resetForm();
                }}
                className="cursor-pointer"
              />
            </div>
           <div>
             <label htmlFor="sectionTitle" className="block text-sm font-medium text-gray-700">
              Section Title
            </label>
            <input
              name="title"
              placeholder="Section A"
              value={sectionForm.title}
              onChange={handleSectionChange}
              className="w-full border px-3 py-2 rounded"
              required
              id="sectionTitle"
            />
           </div>

            <div>
              <label htmlFor="questionType" className="block text-sm font-medium text-gray-700 mt-2">
              Question Type
            </label>
            <select
              name="questionType"
              value={sectionForm.questionType}
              onChange={handleSectionChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Question Type</option>
              <option value="MCQ">MCQ</option>
              <option value="MSQ">MSQ</option>
              <option value="NAT">NAT</option>
            </select>
            </div>

           <div>
             <label htmlFor="totalQuestions" className="block text-sm font-medium text-gray-700 mt-2">
              Total Questions
            </label>  
            <input
              type="number"
              name="totalQuestions"
              placeholder="50"
              value={sectionForm.totalQuestions}
              onChange={handleSectionChange}
              className="w-full border px-3 py-2 rounded"
              required
              id="totalQuestions"
            />
           </div>
           <div>
  <label
    htmlFor="questionsToAttempt"
    className="block text-sm font-medium text-gray-700 mt-2"
  >
    Questions to Attempt (optional)
  </label>

  <input
    type="number"
    id="questionsToAttempt"
    name="questionsToAttempt"
    placeholder="Max questions a student can attempt from this section"
    value={sectionForm.questionsToAttempt ?? ""}
    onChange={handleSectionChange}
    className="w-full border px-3 py-2 rounded"
    min={1}
    max={
      sectionForm.totalQuestions
        ? Number(sectionForm.totalQuestions)
        : undefined
    }
  />

  <p className="text-xs text-gray-500 mt-1">
    Leave empty if all questions must be attempted.
  </p>
</div>


            <div>
              <label htmlFor="sectionOrder" className="block text-sm font-medium text-gray-700 mt-2">
              Section Order
            </label>
            <input
              type="number"
              name="sectionOrder"
              placeholder="Section Order"
              value={sectionForm.sectionOrder}
              onChange={handleSectionChange}
              className="w-full border px-3 py-2 rounded"
              required
              min={1}
              id="sectionOrder"
            />
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded cursor-pointer ${creatingSection || updatingSection ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={creatingSection || updatingSection}
            >
              {(creatingSection || updatingSection) && (
                <Loader2 className="inline animate-spin mr-2" />
              )}
              {showEditModal ? "Update Section" : "Create Section"}
            </button>
          </form>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              ⚠️ {confirmModal.title}
            </h3>

            <p className="text-gray-600 mb-6">
              {confirmModal.message}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 border rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMockTestSections;

