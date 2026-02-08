import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Loader2,
  ImagePlus,
  Pencil,
  AlertTriangle,
  Layers,
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AdminMockTestBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [confirmBundle, setConfirmBundle] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    actualPrice: "",
    discountedPrice: "",
    thumbnailImage: null,
    isActive: true,
  });

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      const res = await axios.get(`${ApiUrl}/admin/mock-test-bundles`, {
        withCredentials: true,
      });
      setBundles(res.data.data || []);
    } catch {
      toast.error("Failed to load bundles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= FORM ================= */

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      actualPrice: "",
      discountedPrice: "",
      thumbnailImage: null,
      isActive: true,
    });
    setThumbnailPreview(null);
    setEditingBundle(null);
  };

  const openEditModal = (bundle) => {
    setEditingBundle(bundle);
    setForm({
      title: bundle.title,
      description: bundle.description,
      actualPrice: bundle.actualPrice,
      discountedPrice: bundle.discountedPrice,
      thumbnailImage: null,
      isActive: bundle.isActive,
    });
    setThumbnailPreview(bundle.thumbnail);
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleThumbnailChange = (file) => {
    if (!file) return;
    setForm({ ...form, thumbnailImage: file });
    setThumbnailPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (+form.discountedPrice > +form.actualPrice) {
      toast.error("Discounted price cannot exceed actual price");
      return;
    }

    setCreating(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null) fd.append(k, v);
      });

      if (editingBundle) {
        await axios.patch(
          `${ApiUrl}/admin/mock-test-bundles/${editingBundle._id}`,
          fd,
          { withCredentials: true },
        );
        toast.success("Bundle updated successfully");
      } else {
        await axios.post(`${ApiUrl}/admin/mock-test-bundles`, fd, {
          withCredentials: true,
        });
        toast.success("Bundle created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchData();
    } catch {
      toast.error("Operation failed");
    } finally {
      setCreating(false);
    }
  };

  /* ================= STATUS ================= */

  const confirmStatusChange = async () => {
    if (!confirmBundle) return;

    setStatusLoading(true);
    try {
      await axios.patch(
        `${ApiUrl}/admin/mock-test-bundles/${confirmBundle._id}/status`,
        { isActive: !confirmBundle.isActive },
        { withCredentials: true },
      );

      toast.success("Bundle status updated");
      setConfirmBundle(null);
      fetchData();
    } catch {
      toast.error("Failed to update bundle status");
    } finally {
      setStatusLoading(false);
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
    <div className="min-h-screen w-full p-4">
      <Toaster position="top-right" />

      {/* HEADER */}
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800">Mock Test Bundles</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded
                     hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus className="inline w-4 h-4 mr-1" />
          Create Bundle
        </button>
      </header>

      {/* EMPTY STATE */}
      {bundles.length === 0 ? (
        <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <Layers className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            No Mock Test Bundles Yet
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            Bundles let you group multiple paid mock tests and sell them
            together at a discounted price.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Your First Bundle
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-[80vh] overflow-y-auto py-4 scrollbar-none">
          {bundles.map((bundle) => (
            <div
              key={bundle._id}
              className="bg-white rounded-xl shadow p-4 flex flex-col"
            >
              <img
                src={bundle.thumbnail}
                className="h-48 rounded object-cover"
              />

              <h2 className="mt-2 text-xl font-semibold text-left">
                {bundle.title}
              </h2>

              <p className="text-sm text-gray-600 text-left line-clamp-2">
                {bundle.description}
              </p>

              <div className="mt-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-green-700">
                    ₹{bundle.discountedPrice}
                  </span>
                  <span className="ml-2 line-through text-gray-500 text-sm">
                    ₹{bundle.actualPrice}
                  </span>
                </div>

                <div className="flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      bundle.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {bundle.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>

                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold">
                    {bundle.mockTestIds.length} TESTS
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/admin/mock-test-bundles/${bundle._id}`}
                  className="flex-1 bg-blue-600 text-white py-2 rounded text-center
                             hover:bg-blue-700 transition cursor-pointer"
                >
                  Manage
                </Link>

                <button
                  onClick={() => openEditModal(bundle)}
                  className="p-2 border rounded text-blue-600
                             hover:bg-blue-50 transition cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setConfirmBundle(bundle)}
                className={`mt-2 py-2 rounded border transition cursor-pointer
                  ${
                    bundle.isActive
                      ? "border-red-500 text-red-600 hover:bg-red-50"
                      : "border-green-500 text-green-600 hover:bg-green-50"
                  }`}
              >
                {bundle.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmBundle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-500" />
              <h3 className="text-lg font-semibold">Confirm Action</h3>
            </div>

            <p className="text-sm text-gray-600">
              Are you sure you want to{" "}
              <b>{confirmBundle.isActive ? "deactivate" : "activate"}</b> this
              bundle?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmBundle(null)}
                className="px-4 py-2 border rounded
                           hover:bg-gray-100 transition cursor-pointer"
                disabled={statusLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                disabled={statusLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded
                           hover:bg-blue-700 transition cursor-pointer"
              >
                {statusLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-h-[90vh] w-full max-w-xl p-6 relative overflow-y-scroll scrollbar-none">
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="absolute top-4 right-4 hover:bg-gray-100 p-1 rounded cursor-pointer"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editingBundle ? "Edit Bundle" : "Create Bundle"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="IIT JAM Biotechnology Mock Test Bundle"
                  className="w-full border rounded px-3 py-2 mt-1
                             focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Complete mock test bundle for IIT JAM Biotechnology aspirants"
                  className="w-full border rounded px-3 py-2 mt-1
                             focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <label className="text-sm font-medium mb-1 block">
                Thumbnail Image
              </label>
              <label
                className="flex flex-col items-center justify-center h-40
                                border-2 border-dashed rounded-lg
                                border-gray-300 bg-gray-50
                                hover:bg-gray-100 transition cursor-pointer"
              >
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    className="h-full object-contain"
                  />
                ) : (
                  <>
                    <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or browse image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleThumbnailChange(e.target.files[0])}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Actual Price</label>
                  <input
                    type="number"
                    name="actualPrice"
                    value={form.actualPrice}
                    onChange={handleChange}
                    placeholder="1999"
                    className="border rounded px-3 py-2 mt-1 w-full
                               focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={form.discountedPrice}
                    onChange={handleChange}
                    placeholder="999"
                    className="border rounded px-3 py-2 mt-1 w-full
                               focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-600 text-white py-2 rounded
                           hover:bg-blue-700 transition
                           disabled:opacity-60 cursor-pointer"
              >
                {creating ? "Saving..." : "Save Bundle"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMockTestBundles;
