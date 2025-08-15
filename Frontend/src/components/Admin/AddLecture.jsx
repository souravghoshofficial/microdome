import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AddLecture = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    videoURL: "",
    noteTitle: "",
    noteURL: null,
  });

  useEffect(() => {
    axios
      .get(`${ApiUrl}/courses/get-all-courses`, {
        withCredentials: true,
      })
      .then((res) => setCourses(res.data.courses))
      .catch((err) => console.error(err));
  }, []);

  const fetchSections = (courseId) => {
    setSelectedCourse(courseId);
    axios
      .get(`${ApiUrl}/courses/get-all-sections/${courseId}`, {
        withCredentials: true,
      })
      .then((res) => setSections(res.data.sections))
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("sectionId", selectedSection);
    data.append("title", formData.title);
    data.append("videoURL", formData.videoURL);
    data.append("noteTitle", formData.noteTitle);
    data.append("noteURL", formData.noteURL);

    axios
      .post(`${ApiUrl}/courses/add-lecture`, data, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Lecture added!");
        setSelectedCourse(null);
        setSelectedSection(null);
        setFormData({ title: "", videoURL: "", noteTitle: "", noteURL: null });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add lecture");
      });
  };

  return (
    <div className="bg-gray-100 relative">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Add Lecture</h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[80vh] p-6 overflow-y-scroll scrollbar-none">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-md p-4 text-center"
          >
            <img
              src={course.courseImage}
              alt={course.courseTitle}
              className="h-40 w-full object-cover rounded-md"
            />
            <h2 className="text-xl font-semibold mt-4">{course.courseTitle}</h2>
            <button
              onClick={() => fetchSections(course._id)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 w-full"
            >
              Add Lecture
            </button>
          </div>
        ))}
      </div>

      {/* Section List Popup */}
      {selectedCourse && !selectedSection && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-center mb-4 text-blue-700">
              Select Section
            </h2>
            <ul className="space-y-3">
              {sections.map((section) => (
                <li
                  key={section._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>{section.title}</span>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
                    onClick={() => setSelectedSection(section._id)}
                  >
                    Add Lecture
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedCourse(null)}
              className="mt-4 text-sm text-red-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Lecture Form Popup */}
      {selectedSection && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
              Add Lecture
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Lecture Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="url"
                name="videoURL"
                placeholder="Video URL"
                value={formData.videoURL}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="noteTitle"
                placeholder="Note Title"
                value={formData.noteTitle}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="file"
                name="noteURL"
                accept=".pdf,.docx,.pptx"
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSection(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
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

export default AddLecture;
