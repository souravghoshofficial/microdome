import { useState, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router";


const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AdminMockTests = () => {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const user = useSelector((state) => state.auth?.userData);


  const MOCK_TEST_TYPE_LABELS = {
    IIT_JAM: "IIT JAM",
    CUET_PG: "CUET PG",
    GAT_B: "GAT-B",
    GATE: "GATE"
  };


  const [formData, setFormData] = useState({
    title: "",
    mockTestType: "",
    description: "",
    durationMinutes: "",
    totalMarks: "",
    accessType: "FREE",
    instructions: ""
  });

  const fetchMockTests = async () => {
    try {
      const res = await axios.get(`${ApiUrl}/admin/mock-tests`, {
        withCredentials: true,
      });
      setMockTests(res.data.mockTests);
    } catch (error) {
      console.error("Failed to fetch mock tests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockTests();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateMockTest = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await axios.post(
        `${ApiUrl}/admin/mock-tests`,
        {
          ...formData,
          durationMinutes: Number(formData.durationMinutes),
          totalMarks: Number(formData.totalMarks),
          instructions: formData.instructions
            .split("\n")
            .map((i) => i.trim())
            .filter(Boolean),
        },
        { withCredentials: true }
      );

      setShowModal(false);
      setFormData({
        title: "",
        mockTestType: "",
        description: "",
        durationMinutes: "",
        totalMarks: "",
        accessType: "FREE",
        instructions: ""
      });

      fetchMockTests();
    } catch (error) {
      console.error("Create mock test failed", error);
      alert("Failed to create mock test");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading mock tests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="mb-4 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
            All Mock Tests
          </h1>

          {user?.role === "admin" && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Mock Test
            </button>
          )}
        </div>
      </header>

      {/* Grid */}
      {mockTests.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-gray-500">No mock tests created yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[80vh] overflow-y-auto p-4 scrollbar-none">
          {mockTests.map((test) => (
            <div
              key={test._id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col"
            >
              <h2 className="text-xl font-semibold text-center">
                {test.title}
              </h2>

              <p className="text-sm text-gray-600 text-center mt-1">
                {MOCK_TEST_TYPE_LABELS[test.mockTestType]} • {test.durationMinutes} mins • {test.totalMarks} marks
              </p>

              <div className="mt-3 flex justify-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  test.accessType === "FREE"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {test.accessType}
                </span>

                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  test.status === "PUBLISHED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {test.status}
                </span>
              </div>

              <Link
              to={`/admin/mock-tests/${test._id}`}
              className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-center cursor-pointer"
              >
                Manage Mock Test
              </Link>

            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 cursor-pointer"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Create Mock Test
            </h2>

            <form onSubmit={handleCreateMockTest} className="space-y-3">
              {/* Title */}
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  name="title"
                  placeholder="IIT JAM Biology Mock Test - I"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              {/* Exam Type */}
              <div>
                <label className="text-sm font-medium">Exam Type</label>
                <select
                  name="mockTestType"
                  value={formData.mockTestType}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                >
                  <option value="">Select exam type</option>
                  <option value="IIT_JAM">IIT JAM</option>
                  <option value="CUET_PG">CUET PG</option>
                  <option value="GAT_B">GAT-B</option>
                  <option value="GATE">GATE</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  placeholder="Full length mock test based on latest IIT JAM pattern"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              {/* Duration & Marks */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Duration (mins)</label>
                  <input
                    type="number"
                    name="durationMinutes"
                    placeholder="180"
                    value={formData.durationMinutes}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Total Marks</label>
                  <input
                    type="number"
                    name="totalMarks"
                    placeholder="100"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
              </div>

              {/* Access Type */}
              <div>
                <label className="text-sm font-medium">Access Type</label>
                <select
                  name="accessType"
                  value={formData.accessType}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                >
                  <option value="FREE">FREE</option>
                  <option value="PAID">PAID</option>
                </select>
              </div>

              {/* Instructions */}
              <div>
                <label className="text-sm font-medium">Instructions</label>
                <textarea
                  name="instructions"
                  placeholder={`Each question has only one correct answer\nNo negative marking for NAT`}
                  value={formData.instructions}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                {creating ? "Creating..." : "Create Mock Test"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMockTests;
