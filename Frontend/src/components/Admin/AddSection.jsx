import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AddSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFormFor, setShowFormFor] = useState(null);
  const [formData, setFormData] = useState({
    sectionTitle: "",
    lectureTitle: "",
    videoURL: "",
    noteTitle: "",
    noteURL: null,
  });

  // Fetch all courses on mount
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${ApiUrl}/courses/get-all-courses`, { withCredentials: true })
      .then((res) => setCourses(res.data.courses))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch courses");
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      sectionTitle: "",
      lectureTitle: "",
      videoURL: "",
      noteTitle: "",
      noteURL: null,
    });
    setShowFormFor(null);
  };

  // Handle form submit
  const handleSubmit = async (e, courseId) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("courseId", courseId);
    data.append("sectionTitle", formData.sectionTitle);
    data.append("lectureTitle", formData.lectureTitle);
    data.append("videoURL", formData.videoURL);
    data.append("noteTitle", formData.noteTitle);

    if (formData.noteURL) {
      data.append("noteURL", formData.noteURL);
    }

    try {
      await axios.post(`${ApiUrl}/courses/add-section`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Section added successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Add Section</h1>

      {loading && !courses.length ? (
        <p className="text-center text-gray-600">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-600">No courses found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[80vh] overflow-y-auto scrollbar-none">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center"
            >
              <img
                src={course.courseImage}
                alt={course.courseTitle}
                className="h-40 w-full object-cover rounded-md"
              />
              <h2 className="text-xl font-semibold text-center mt-4">
                {course.courseTitle}
              </h2>

              <button
                onClick={() => setShowFormFor(course._id)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer w-full"
              >
                Add Section
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popup Form */}
      {showFormFor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
              Add Section
            </h2>
            <form
              onSubmit={(e) => handleSubmit(e, showFormFor)}
              className="space-y-4"
            >
              <input
                type="text"
                name="sectionTitle"
                placeholder="Section Title"
                value={formData.sectionTitle}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="lectureTitle"
                placeholder="Lecture Title"
                value={formData.lectureTitle}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="url"
                name="videoURL"
                placeholder="Video URL"
                value={formData.videoURL}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="noteTitle"
                placeholder="Note Title"
                value={formData.noteTitle}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                name="noteURL"
                accept=".pdf,.docx,.pptx"
                onChange={handleChange}
                className="w-full p-2 border rounded file:px-2 file:py-1 file:bg-blue-500"
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                >
                  Cancel
                </button>
                   <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white cursor-pointer ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSection;
