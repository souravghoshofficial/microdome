import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import axios from "axios";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const ProfileUpdateForm = ({ toast }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    instituteName: "",
    presentCourseOfStudy: "",
  });

  // Sync with userData on mount or update
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        mobileNumber: userData.mobileNumber || "",
        instituteName: userData.instituteName || "",
        presentCourseOfStudy: userData.presentCourseOfStudy || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${ApiUrl}/users/update-user-details`,
        formData,
        { withCredentials: true }
      );

      dispatch(login(res.data.data));
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Name + Email Row */}
      <div className="grid md:grid-cols-2 gap-6">

        <FormInput
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Email"
          value={userData?.email}
          disabled
        />

      </div>

      {/* Mobile */}
      <FormInput
        label="Mobile Number"
        name="mobileNumber"
        value={formData.mobileNumber}
        onChange={handleChange}
        pattern="[0-9]{10}"
        placeholder="10 digit number"
      />

      {/* Institute */}
      <FormInput
        label="Institute Name"
        name="instituteName"
        value={formData.instituteName}
        onChange={handleChange}
      />

      {/* Present Course */}
      <FormInput
        label="Present Course of Study"
        name="presentCourseOfStudy"
        value={formData.presentCourseOfStudy}
        onChange={handleChange}
      />

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-highlighted hover:bg-highlighted-hover text-white font-medium rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

/* ================= Reusable Input ================= */

const FormInput = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
  required = false,
  pattern,
  placeholder = "",
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>

    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      required={required}
      pattern={pattern}
      placeholder={placeholder}
      className={`
        w-full rounded-lg border px-4 py-2.5 text-sm
        transition
        ${
          disabled
            ? "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-200 dark:border-zinc-700"
            : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-highlighted focus:border-highlighted"
        }
      `}
    />
  </div>
);

export default ProfileUpdateForm;