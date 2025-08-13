import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    cardTitle: "",
    subTitle: "",
    courseTag: "",
    mode: "",
    language: "",
    actualPrice: "",
    discountedPrice: "",
    courseTitle: "",
    courseDescription: "",
    courseImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      await axios.post(`${ApiUrl}/courses/create-course`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course created successfully!");
    } catch (err) {
      toast.error("Failed to create course.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl px-4 md:px-6 py-6 my-8">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4">Create Course</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 h-[70vh] overflow-y-scroll scrollbar-none p-1"
        encType="multipart/form-data"
      >
        {/* Card Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Card Title</label>
          <input
            type="text"
            name="cardTitle"
            placeholder="e.g. M.Sc Entrance Batch Recorded"
            value={formData.cardTitle}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <input
            type="text"
            name="subTitle"
            placeholder="e.g. Ace IIT JAM, CUET PG & Beyond"
            value={formData.subTitle}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Course Tag */}
        <div>
          <label className="block text-sm font-medium mb-1">Course Tag</label>
          <input
            type="text"
            name="courseTag"
            placeholder="e.g. M.Sc Entrance or B.Sc Hons."
            value={formData.courseTag}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Mode */}
        <div>
          <label className="block text-sm font-medium mb-1">Mode</label>
          <input
            type="text"
            name="mode"
            placeholder="e.g. Live or Recorded"
            value={formData.mode}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <input
            type="text"
            name="language"
            placeholder="e.g. Hinglish"
            value={formData.language}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actual Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Actual Price</label>
          <input
            type="number"
            name="actualPrice"
            placeholder="Actual price in rupees"
            value={formData.actualPrice}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Discounted Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Discounted Price</label>
          <input
            type="number"
            name="discountedPrice"
            placeholder="Discounted price in rupees"
            value={formData.discountedPrice}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Course Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Course Title</label>
          <input
            type="text"
            name="courseTitle"
            placeholder="Full course title"
            value={formData.courseTitle}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Course Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Course Description</label>
          <textarea
            name="courseDescription"
            placeholder="Write a short description about the course..."
            value={formData.courseDescription}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        {/* Course Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Course Image</label>
          <input
            type="file"
            name="courseImage"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 file:bg-blue-500 hover:file:bg-blue-600 file:cursor-pointer  file:px-2 file:py-1 file:text-white file:rounded"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
