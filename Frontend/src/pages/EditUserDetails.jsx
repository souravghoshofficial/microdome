import { useState } from "react";
import { RiArrowLeftLine } from "@remixicon/react";
import { Pencil } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../features/auth/authSlice";
import axios from "axios";
import { Link } from "react-router";
import userImage from "../assets/user-img.jpeg";
import { ToastContainer, toast } from "react-toastify";
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

    axios
      .post(`${ApiUrl}/api/v1/users/update-user-profile-image`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setProfileImage(null);
        toast.success("Image Uploaded Successfully");
        dispatch(logout());
        dispatch(login(res.data.data));
        setImageSrc(res.data.data.profileImage);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full min-h-screen pt-32">
      <div className=" w-[90%] mx-auto ">
        <ToastContainer />
        <Link
          to="/profile"
          className="inline-block px-3 py-2 border rounded-md"
        >
          <div className="flex items-center gap-1">
            <RiArrowLeftLine size={20} />
            <span>Back to profile</span>
          </div>
        </Link>
        <div className="mt-16 border rounded-xl p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <div className="relative w-24 h-24 group">
              <label htmlFor="profileImage">
              
                  <img
                    className="w-full h-full rounded-full bg-center cursor-pointer"
                    src={imageSrc}
                    alt="Upload Profile Image"
                  />
                  <div className="absolute w-full h-full top-0 left-0 bg-black/40 bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <Pencil className="text-white w-6 h-6 cursor-pointer" />
                  </div>
            
              </label>
              <input
                className="hidden"
                id="profileImage"
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div>
              <h5>Profile Photo</h5>
              <h6 className="mt-1">PNG, JPG or JPEG (Max. 1MB)</h6>
              {profileImage && (
                <button
                  disabled={loading}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg cursor-pointer"
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserDetails;
