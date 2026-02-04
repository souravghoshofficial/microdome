import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Plus, AlertTriangle } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AdminManageMockTestBundle = () => {
  const { bundleId } = useParams();

  const [bundle, setBundle] = useState(null);
  const [paidTests, setPaidTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const [confirmRemove, setConfirmRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  /* ================= FETCH ================= */

  const fetchBundle = async () => {
    const res = await axios.get(
      `${ApiUrl}/admin/mock-test-bundles/${bundleId}`,
      { withCredentials: true }
    );
    setBundle(res.data.data);
  };

  const fetchPaidTests = async () => {
    const res = await axios.get(
      `${ApiUrl}/admin/mock-tests`,
      {
        params: { accessType: "PAID" },
        withCredentials: true
      }
    );
    setPaidTests(res.data.mockTests);
  };

  useEffect(() => {
    Promise.all([fetchBundle(), fetchPaidTests()])
      .finally(() => setLoading(false));
  }, []);

  if (loading || !bundle) {
    return <div className="p-6">Loading bundle...</div>;
  }

  const existingIds = bundle.mockTestIds.map(t => t._id);
  const availableTests = paidTests.filter(
    t => !existingIds.includes(t._id)
  );

  /* ================= ADD ================= */

  const addMockTests = async () => {
    if (selectedTests.length === 0) {
      toast.error("Select at least one mock test");
      return;
    }

    await axios.patch(
      `${ApiUrl}/admin/mock-test-bundles/${bundleId}/mock-tests`,
      { mockTestIds: selectedTests },
      { withCredentials: true }
    );

    toast.success("Mock tests added");
    setSelectedTests([]);
    setShowAdd(false);
    fetchBundle();
  };

  /* ================= REMOVE ================= */

  const confirmRemoveTest = async () => {
    if (!confirmRemove) return;

    setRemoving(true);
    try {
      await axios.delete(
        `${ApiUrl}/admin/mock-test-bundles/${bundleId}/mock-tests/${confirmRemove._id}`,
        { withCredentials: true }
      );

      toast.success("Mock test removed from bundle");
      setConfirmRemove(null);
      fetchBundle();
    } catch {
      toast.error("Failed to remove mock test");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-bold mb-4">
        Manage Bundle: {bundle.title}
      </h1>

      {/* ADD BUTTON */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Mock Tests
      </button>

      {/* ADD FORM */}
      {showAdd && (
        <div className="mt-4 border rounded p-4 bg-white shadow-sm">
          <label className="block text-sm font-medium mb-2">
            Select PAID Mock Tests
          </label>

          <select
            multiple
            className="w-full border rounded p-2 h-40 cursor-pointer"
            onChange={(e) =>
              setSelectedTests(
                Array.from(e.target.selectedOptions, o => o.value)
              )
            }
          >
            {availableTests.map(test => (
              <option key={test._id} value={test._id}>
                {test.title} — {test.totalMarks} marks
              </option>
            ))}
          </select>

          <button
            onClick={addMockTests}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Add Selected
          </button>
        </div>
      )}

      {/* MOCK TEST LIST */}
      <div className="mt-6 space-y-3">
        {bundle.mockTestIds.length === 0 ? (
          <p className="text-gray-500">No mock tests in this bundle.</p>
        ) : (
          bundle.mockTestIds.map(test => (
            <div
              key={test._id}
              className="flex justify-between items-center border rounded p-4 bg-white shadow-sm"
            >
              <div>
                <p className="font-semibold">{test.title}</p>
                <p className="text-xs text-gray-500">
                  {test.durationMinutes} mins · {test.totalMarks} marks
                </p>
              </div>

              <button
                onClick={() => setConfirmRemove(test)}
                className="flex items-center gap-1 text-red-600 border border-red-500 px-3 py-1.5 rounded hover:bg-red-50 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* CONFIRM DELETE MODAL */}
      {confirmRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-600" />
              <h3 className="text-lg font-semibold">Confirm Removal</h3>
            </div>

            <p className="text-sm text-gray-600">
              Are you sure you want to remove
              <b> {confirmRemove.title}</b> from this bundle?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmRemove(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
                disabled={removing}
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveTest}
                disabled={removing}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
              >
                {removing ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageMockTestBundle;
