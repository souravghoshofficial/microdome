import { useState } from "react";
import { RiArrowLeftLine } from "@remixicon/react";
import { Pencil, Camera } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import axios from "axios";
import { Link } from "react-router";
import userImage from "../assets/user-img.jpeg";
import toast, { Toaster } from "react-hot-toast";
import { ProfileUpdateForm } from "../components";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const EditUserDetails = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [imageSrc, setImageSrc] = useState(
    userData?.profileImage || userImage
  );
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("profileImage", profileImage);

    try {
      const res = await axios.post(
        `${ApiUrl}/users/update-user-profile-image`,
        formData,
        { withCredentials: true }
      );

      dispatch(login(res.data.data));
      toast.success("Profile image updated");
      setProfileImage(null);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto px-6 py-28">

        {/* Back */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-highlighted transition"
        >
          <RiArrowLeftLine size={18} />
          Back to profile
        </Link>

        {/* Card */}
        <div className="mt-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-md p-8">

          <div className="grid md:grid-cols-3 gap-12">

            {/* ================= LEFT IMAGE SECTION ================= */}
            <div className="md:col-span-1 flex flex-col items-center">

              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative w-32 h-32 group">
                  <label htmlFor="profileImage">
                    <img
                      src={imageSrc}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4 border-highlighted shadow-md cursor-pointer"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                      <Pencil className="text-white w-6 h-6" />
                    </div>

                    {/* Camera icon */}
                    <div className="absolute bottom-0 right-0 bg-highlighted text-white p-2 rounded-full shadow cursor-pointer hover:scale-105 transition">
                      <Camera className="w-4 h-4" />
                    </div>
                  </label>

                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  PNG, JPG, JPEG (Max 1MB)
                </p>

                <button
                  disabled={!profileImage || loading}
                  type="submit"
                  className="mt-2 px-5 py-2 text-sm font-medium bg-highlighted hover:bg-highlighted-hover text-white rounded-lg transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? "Uploading..." : "Save Image"}
                </button>
              </form>
            </div>

            {/* ================= RIGHT FORM SECTION ================= */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-6">
                Edit Personal Details
              </h3>

              <ProfileUpdateForm toast={toast} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserDetails;