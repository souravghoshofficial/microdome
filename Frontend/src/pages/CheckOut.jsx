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
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .post(
        `${ApiUrl}/courses/get-course-details`,
        { linkAddress: id },
        { withCredentials: true }
      )
      .then((res) => {
        setCourseDetails(res.data.courseDetails);
        setFinalAmount(res.data.courseDetails.discountedPrice);
      })
      .catch(() => console.log("Error fetching course details"))
      .finally(() => setLoading(false));
  }, [id]);

  const isEnrolled = userData?.enrolledCourses.includes(courseDetails?._id);

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.warn("Enter a coupon code first");
      return;
    }

    try {
      const res = await axios.post(
        `${ApiUrl}/orders/validate-coupon-code`,
        {
          courseId: courseDetails._id,
          couponCode,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setAppliedDiscount(res.data.discount);
        const discountAmt = Math.floor(
          (courseDetails.discountedPrice * res.data.discount) / 100
        );
        const newPrice = courseDetails.discountedPrice - discountAmt;
        setFinalAmount(newPrice);
        toast.success(`Coupon applied! You got ${res.data.discount}% off 🎉`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply coupon");
      setAppliedDiscount(0);
      setFinalAmount(courseDetails.discountedPrice);
    }
  };

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

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${ApiUrl}/orders/create-order`,
        {
          courseId: courseDetails?._id,
          amount: finalAmount,
          phone,
          itemType: "course",
        },
        { withCredentials: true }
      );

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Please try again later.");
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: 100 * finalAmount,
        currency: "INR",
        name: "Microdome Classes",
        description: `Payment for ${courseDetails.courseTitle}`,
        image:
          "https://res.cloudinary.com/dpsmiqy61/image/upload/v1755101381/1755101380750-MicroDome%20new%20logo.png",
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
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled by user");
            setIsSubmitting(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-black dark:to-gray-900 px-4 sm:px-6">
      <ToastContainer />
      <div className="mt-10 w-full max-w-5xl bg-white dark:bg-[#1b1e27] shadow-2xl rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-12">
            Loading course details...
          </p>
        ) : courseDetails ? (
          <div className="grid md:grid-cols-2">
            {/* Left: Course Image */}
            <div className="relative h-64 md:h-full p-4 mt-6 md:mt-0 flex items-center justify-center">
              <img
                src={courseDetails.courseImage}
                alt={courseDetails.courseTitle}
                className="max-h-80 md:max-h-[500px] w-auto object-contain rounded-lg"
              />
            </div>

            {/* Right: Checkout Info */}
            <div className="p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                  {courseDetails.courseTitle}
                </h2>
                {courseDetails.subTitle && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-base sm:text-lg">
                    {courseDetails.subTitle}
                  </p>
                )}

                {/* Price Section */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-lg sm:text-xl line-through text-gray-500">
                    ₹{courseDetails.actualPrice}
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-green-600 dark:text-green-400">
                    ₹{finalAmount}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <p className="mb-4 text-green-600 font-semibold text-sm sm:text-base">
                    Coupon Applied: {appliedDiscount}% OFF
                  </p>
                )}

                {/* Coupon Input */}
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-100"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Phone Input */}
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                    Whatsapp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your whatsapp number"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Payment Button */}
              <div className="mt-6">
                <button
                  onClick={handlePayment}
                  disabled={isSubmitting}
                  className={`w-full py-3 sm:py-4 font-bold text-lg rounded-xl shadow-lg transition-all ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white cursor-pointer"
                  }`}
                >
                  {isSubmitting
                    ? "Processing..."
                    : isEnrolled
                    ? "Go to My Course"
                    : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-600 py-12">Course not found</p>
        )}
      </div>
    </div>
  );
};

export default CheckOut;
