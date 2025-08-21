import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AddSection = () => {
  const [courses, setCourses] = useState([]);
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
    axios
      .get(`${ApiUrl}/courses/get-all-courses`, {
        withCredentials: true,
      })
      .then((res) => setCourses(res.data.courses))
      .catch((err) => console.error(err));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e, courseId) => {
    e.preventDefault();

    const data = new FormData();
    data.append("courseId", courseId);
    data.append("sectionTitle", formData.sectionTitle);
    data.append("lectureTitle", formData.lectureTitle);
    data.append("videoURL", formData.videoURL);
    data.append("noteTitle", formData.noteTitle);
    data.append("noteURL", formData.noteURL);

    axios
      .post(`${ApiUrl}/courses/add-section`, data, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Section added successfully!");
        setFormData({
          sectionTitle: "",
          lectureTitle: "",
          videoURL: "",
          noteTitle: "",
          noteURL: null,
        });
        setShowFormFor(null);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add section");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Add Section</h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 h-[80vh] overflow-y-scroll scrollbar-none">
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
                className="w-full p-2 border rounded"
           
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowFormFor(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
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
