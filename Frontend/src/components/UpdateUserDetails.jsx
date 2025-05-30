import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../features/auth/authSlice";
import axios from "axios";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const ProfileUpdateForm = ({toast}) => {
  const dispatch =  useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    mobileNumber: userData?.mobileNumber || "",
    instituteName: userData?.instituteName || "",
    presentCourseOfStudy: userData?.presentCourseOfStudy || "",
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    axios
      .post(${ApiUrl}/api/v1/users/update-user-details, formData, {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(logout());
        dispatch(login(res.data.data));
        toast.success("User info updated")
      })
      .catch((err) => {console.log(err);
      })
      .finally(() => {setLoading(false)})
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="w-full flex flex-col md:flex-row md:gap-4">
        <div className="w-full">
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-400 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div className="w-full mt-2 md:mt-0">
          <label className="block text-gray-700 dark:text-gray-400 mb-1">
            Email
          </label>
          <input
            type="text"
            disabled
            value={userData?.email}
            className="w-full cursor-not-allowed border border-gray-300 rounded-lg p-3 text-gray-600/50 bg-gray-100 dark:text-gray-300/50 dark:bg-zinc-800"
          />
        </div>
      </div>

      <div className="mt-2">
        <label htmlFor="mobileNumber" className="block text-gray-700 dark:text-gray-400 mb-1">
          Mobile Number
        </label>
        <input
          type="tel"
          id="mobileNumber"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          pattern="[0-9]{10}"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div className="mt-2">
        <label htmlFor="instituteName" className="block text-gray-700 dark:text-gray-400 mb-1">
          Institute Name
        </label>
        <input
          type="text"
          id="instituteName"
          name="instituteName"
          value={formData.instituteName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div className="mt-2">
        <label htmlFor="presentCourseOfStudy" className="block text-gray-700 dark:text-gray-400 mb-1">
          Present Course of Study
        </label>
        <input
          type="text"
          id="presentCourseOfStudy"
          name="presentCourseOfStudy"
          value={formData.presentCourseOfStudy}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="my-3 bg-blue-600 text-white py-3 px-5 cursor-pointer rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
      >
        {loading ? " Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default ProfileUpdateForm;