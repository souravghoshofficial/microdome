import { useEffect, useState } from "react";
import axios from "axios";
import { loadRazorpayScript } from "../utils/razorpay";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router";
import { login } from "../features/auth/authSlice";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const CheckOut = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  const [courseDetails, setCourseDetails] = useState(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    axios
      .post(
        `${ApiUrl}/courses/get-course-details`,
        { linkAddress: id },
        { withCredentials: true }
      )
      .then((res) => setCourseDetails(res.data.courseDetails))
      .catch(() => console.log("Error fetching course details"));
  }, [id]);

  const isEnrolled = userData?.enrolledCourses.includes(courseDetails?._id);

  const handlePayment = async () => {
    if (isEnrolled) {
      navigate(`/my-courses/${courseDetails?._id}`);
      return;
    }
    if (!isLoggedIn) {
      toast.warn("Please login to enroll");
      return;
    }
    if (!phone || phone.length < 10) {
      toast.warn("Enter a valid phone number");
      return;
    }

    try {
      const res = await axios.post(
        `${ApiUrl}/orders/create-order`,
        {
          courseId: courseDetails?._id,
          amount: courseDetails?.discountedPrice,
          phone: phone,
        },
        { withCredentials: true }
      );

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Please try again later.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: 100 * courseDetails?.discountedPrice,
        currency: "INR",
        name: "Microdome Classes",
        description: `Payment for ${courseDetails.courseTitle}`,
        image:
          "http://res.cloudinary.com/deljukiyr/image/upload/v1748880241/qi2txlfzapvqkqle8baa.jpg",
        order_id: res.data.order.id,
        handler: async function (response) {
          try {
            const res = await axios.get(`${ApiUrl}/users/current-user`, {
              withCredentials: true,
            });
            dispatch(login(res.data.data));
            navigate("/payment-success", {
              state: { paymentId: response.razorpay_payment_id },
            });
          } catch (err) {
            console.log("Failed to refresh user:", err.message);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-slate-900 dark:to-slate-800 px-4">
      <ToastContainer />
      <div className="mt-8 w-full max-w-3xl bg-white dark:bg-[#1e293b] shadow-2xl rounded-2xl p-10 mb-16 relative overflow-hidden">
        {/* Header */}
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-gray-100">
          Checkout
        </h2>

        {courseDetails ? (
          <div className="space-y-8">
            {/* Course Card */}
            <div className="border rounded-xl p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-slate-700 dark:to-slate-600 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {courseDetails.courseTitle}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm leading-relaxed">
                {courseDetails.courseDescription}
              </p>
              <div className="flex items-baseline gap-4 mt-4">
                <span className="text-lg line-through text-gray-500">
                  ₹{courseDetails.actualPrice}
                </span>
                <span className="text-3xl font-extrabold text-green-700 dark:text-green-400">
                  ₹{courseDetails.discountedPrice}
                </span>
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block mb-3 font-semibold text-gray-700 dark:text-gray-300">
                Whatsapp Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-5 py-3 border rounded-lg text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            {/* Payment Button */}
            <div className="text-center">
              <button
                onClick={handlePayment}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {isEnrolled ? "Go to My Course" : "Proceed to Payment"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Loading course details...
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckOut;
