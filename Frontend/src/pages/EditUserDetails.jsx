import { useState } from "react";
import { RiArrowLeftLine } from "@remixicon/react";
import { Pencil } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../features/auth/authSlice";
import axios from "axios";
import { Link } from "react-router";
import userImage from "../assets/user-img.jpeg";
import toast, { Toaster } from "react-hot-toast";
import { ProfileUpdateForm } from "../components";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const EditUserDetails = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [imageSrc, setImageSrc] = useState(userData?.profileImage || userImage);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!profileImage) return alert("Please select an image");

    const formData = new FormData();
    formData.append("profileImage", profileImage);

    try {
      const res = await axios.post(
        `${ApiUrl}/users/update-user-profile-image`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Image Uploaded Successfully");
      dispatch(logout());
      dispatch(login(res.data.data));
      setImageSrc(res.data.data.profileImage);
      setProfileImage(null);
    } catch (err) {
      console.log(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-white dark:bg-gray-950 text-black dark:text-white transition-colors duration-300">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto px-4">
        {/* Back button */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-1 text-sm border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <RiArrowLeftLine size={20} />
          Back to profile
        </Link>

        {/* Content card */}
        <div className="mt-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl p-6 md:p-10 flex flex-col md:flex-row gap-10">
          {/* Image upload section */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 w-full md:w-1/3"
          >
            <div className="relative w-28 h-28 group">
              <label htmlFor="profileImage">
                <img
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-md cursor-pointer"
                  src={imageSrc}
                  alt="Upload Profile"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <Pencil className="text-white w-6 h-6" />
                </div>
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div className="text-center">
              <h5 className="font-semibold">Profile Photo</h5>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, JPEG (Max. 1MB)
              </p>
              {profileImage && (
                <button
                  disabled={loading}
                  type="submit"
                  className="mt-3 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              )}
            </div>
          </form>

          {/* Profile Update Form */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Your Details</h3>
            <ProfileUpdateForm toast={toast} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserDetails;
