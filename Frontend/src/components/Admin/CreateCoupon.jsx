import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const CreateCoupon = () => {

  const user = useSelector((state) => state.auth?.userData);
  const role = user?.role;

  const [formData, setFormData] = useState({
    couponCode: "",
    discount: "",
    courseId: "",
  });

  const [courses, setCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch all courses for dropdown
  useEffect(() => {
    axios
      .get(`${ApiUrl}/courses/get-all-courses`, { withCredentials: true })
      .then((res) => {
        if (res.data.courses) {
          setCourses(res.data.courses);
        }
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        toast.error("Failed to load courses");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await axios.post(
        `${ApiUrl}/admin/create-coupon`,
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Coupon created successfully!");

        // Reset form
        setFormData({
          couponCode: "",
          discount: "",
          courseId: "",
        });

        // ✅ Navigate after 1.5s
        setTimeout(() => {
          navigate("/admin/coupons");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to create coupon");
      }
    } catch (err) {
      console.error("Error creating coupon:", err);
      toast.error("Failed to create coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  if(role !== "admin"){
    navigate("/admin/dashboard")
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl px-4 md:px-6 py-6 my-8">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4">Create Coupon</h2>

      <form onSubmit={handleSubmit} className="space-y-4 p-1">
        {/* Coupon Code */}
        <div>
          <label className="block text-sm font-medium mb-1">Coupon Code</label>
          <input
            type="text"
            name="couponCode"
            value={formData.couponCode}
            onChange={handleChange}
            placeholder="e.g. SAVE20"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="1"
            max="100"
            placeholder="Enter discount percentage"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Course Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Course</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center items-center gap-2 ${
            isSubmitting
              ? "bg-blue-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-medium py-2 rounded-lg transition-colors`}
        >
          {isSubmitting && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {isSubmitting ? "Submitting..." : "Create Coupon"}
        </button>
      </form>
    </div>
  );
};

export default CreateCoupon;
