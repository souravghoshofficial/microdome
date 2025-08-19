// import { useEffect, useState } from "react";
// import axios from "axios";
// import { loadRazorpayScript } from "../utils/razorpay";
// import { useSelector, useDispatch } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import { useParams, useNavigate } from "react-router";
// import { login } from "../features/auth/authSlice";
// import AOS from "aos";
// import "aos/dist/aos.css";

// const ApiUrl = import.meta.env.VITE_BACKEND_URL;

// const CheckOut = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const isLoggedIn = useSelector((state) => state.auth.status);
//   const userData = useSelector((state) => state.auth.userData);

//   const [courseDetails, setCourseDetails] = useState(null);
//   const [phone, setPhone] = useState("");
//   const [couponCode, setCouponCode] = useState("");
//   const [appliedDiscount, setAppliedDiscount] = useState(0);
//   const [finalAmount, setFinalAmount] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true });
//   }, []);

//   useEffect(() => {
//     setLoading(true);
//     axios
//       .post(
//         `${ApiUrl}/courses/get-course-details`,
//         { linkAddress: id },
//         { withCredentials: true }
//       )
//       .then((res) => {
//         setCourseDetails(res.data.courseDetails);
//         setFinalAmount(res.data.courseDetails.discountedPrice);
//       })
//       .catch(() => console.log("Error fetching course details"))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const isEnrolled = userData?.enrolledCourses.includes(courseDetails?._id);

//   const handleApplyCoupon = async () => {
//     if (!couponCode) {
//       toast.warn("Enter a coupon code first");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${ApiUrl}/orders/validate-coupon-code`,
//         {
//           courseId: courseDetails._id,
//           couponCode,
//         },
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         setAppliedDiscount(res.data.discount);
//         const discountAmt = Math.floor(
//           (courseDetails.discountedPrice * res.data.discount) / 100
//         );
//         const newPrice = courseDetails.discountedPrice - discountAmt;
//         setFinalAmount(newPrice);
//         toast.success(`Coupon applied! You got ${res.data.discount}% off 🎉`);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to apply coupon");
//       setAppliedDiscount(0);
//       setFinalAmount(courseDetails.discountedPrice);
//     }
//   };

//   const handlePayment = async () => {
//     if (isEnrolled) {
//       navigate(`/my-courses/${courseDetails?._id}`);
//       return;
//     }
//     if (!isLoggedIn) {
//       toast.warn("Please login to enroll");
//       return;
//     }
//     if (!phone || phone.length < 10) {
//       toast.warn("Enter a valid phone number");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const res = await axios.post(
//         `${ApiUrl}/orders/create-order`,
//         {
//           courseId: courseDetails?._id,
//           amount: finalAmount,
//           phone,
//         },
//         { withCredentials: true }
//       );

//       const isScriptLoaded = await loadRazorpayScript();
//       if (!isScriptLoaded) {
//         alert("Razorpay SDK failed to load. Please try again later.");
//         setIsSubmitting(false);
//         return;
//       }

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: 100 * finalAmount,
//         currency: "INR",
//         name: "Microdome Classes",
//         description: `Payment for ${courseDetails.courseTitle}`,
//         image:
//           "http://res.cloudinary.com/deljukiyr/image/upload/v1748880241/qi2txlfzapvqkqle8baa.jpg",
//         order_id: res.data.order.id,
//         handler: async function (response) {
//           try {
//             const res = await axios.get(`${ApiUrl}/users/current-user`, {
//               withCredentials: true,
//             });
//             dispatch(login(res.data.data));
//             navigate("/payment-success", {
//               state: { paymentId: response.razorpay_payment_id },
//             });
//           } catch (err) {
//             console.log("Failed to refresh user:", err.message);
//           } finally {
//             setIsSubmitting(false);
//           }
//         },
//         modal: {
//           ondismiss: function () {
//             toast.info("Payment cancelled by user");
//             setIsSubmitting(false);
//           },
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (err) {
//       console.log(err);
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:bg-black px-3 sm:px-6">
//       <ToastContainer />
//       <div
//         className="mt-6 w-full max-w-3xl bg-white dark:bg-[#1b1e27] shadow-2xl rounded-2xl p-5 sm:p-8 md:p-10 mb-12 relative overflow-hidden"
//         data-aos="fade-up"
//       >
//         <h2
//           className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-gray-900 dark:text-gray-100"
//           data-aos="fade-down"
//         >
//           Checkout
//         </h2>

//         {loading ? (
//           <p
//             className="text-center text-gray-600 dark:text-gray-400"
//             data-aos="fade-in"
//           >
//             Loading course details...
//           </p>
//         ) : courseDetails ? (
//           <div className="space-y-6 sm:space-y-8">
//             {/* Course Card */}
//             <div
//               className="border rounded-xl p-4 sm:p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-slate-700 dark:to-slate-600 shadow-md"
//               data-aos="zoom-in"
//             >
//               <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-50">
//                 {courseDetails.courseTitle}
//               </h3>
//               <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm leading-relaxed">
//                 {courseDetails.courseDescription}
//               </p>
//               <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-2 sm:gap-4 mt-4">
//                 <span className="text-base sm:text-lg line-through text-gray-500">
//                   ₹{courseDetails.actualPrice}
//                 </span>
//                 <span className="text-2xl sm:text-3xl font-extrabold text-green-700 dark:text-green-400">
//                   ₹{finalAmount}
//                 </span>
//               </div>
//               {appliedDiscount > 0 && (
//                 <p className="mt-2 text-green-600 font-semibold text-sm sm:text-base">
//                   Coupon Applied: {appliedDiscount}% OFF
//                 </p>
//               )}
//             </div>

//             {/* Coupon Input */}
//             <div data-aos="fade-right">
//               <label className="block mb-2 sm:mb-3 font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
//                 Coupon Code
//               </label>
//               <div className="flex flex-col sm:flex-row gap-2">
//                 <input
//                   type="text"
//                   value={couponCode}
//                   onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//                   placeholder="Enter coupon code"
//                   className="flex-1 px-4 py-2 sm:px-5 sm:py-3 border rounded-lg text-base sm:text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-100"
//                 />
//                 <button
//                   onClick={handleApplyCoupon}
//                   className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm sm:text-base"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>

//             {/* Phone Input */}
//             <div data-aos="fade-left">
//               <label className="block mb-2 sm:mb-3 font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
//                 Whatsapp Number
//               </label>
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 placeholder="Enter your whatsapp number"
//                 className="w-full px-4 py-2 sm:px-5 sm:py-3 border rounded-lg text-base sm:text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-100"
//               />
//             </div>

//             {/* Payment Button */}
//             <div className="text-center" data-aos="flip-up">
//               <button
//                 onClick={handlePayment}
//                 disabled={isSubmitting}
//                 className={`w-full sm:w-auto ${
//                   isSubmitting
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 cursor-pointer"
//                 } text-white font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg shadow-lg transform transition-all duration-300`}
//               >
//                 {isSubmitting
//                   ? "Processing..."
//                   : isEnrolled
//                   ? "Go to My Course"
//                   : "Proceed to Payment"}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <p className="text-center text-red-600" data-aos="fade-in">
//             Course not found
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CheckOut;



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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:bg-black px-3 sm:px-6">
      <ToastContainer />
      <div
        className="mt-6 w-full max-w-3xl bg-white dark:bg-[#1b1e27] shadow-2xl rounded-2xl p-5 sm:p-8 md:p-10 mb-12 relative overflow-hidden"
      >
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-gray-900 dark:text-gray-100"
        >
          Checkout
        </h2>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Loading course details...
          </p>
        ) : courseDetails ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Course Card */}
            <div
              className="border rounded-xl p-4 sm:p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-slate-700 dark:to-slate-600 shadow-md"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-50">
                {courseDetails.courseTitle}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm leading-relaxed">
                {courseDetails.courseDescription}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-2 sm:gap-4 mt-4">
                <span className="text-base sm:text-lg line-through text-gray-500">
                  ₹{courseDetails.actualPrice}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-green-700 dark:text-green-400">
                  ₹{finalAmount}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <p className="mt-2 text-green-600 font-semibold text-sm sm:text-base">
                  Coupon Applied: {appliedDiscount}% OFF
                </p>
              )}
            </div>

            {/* Coupon Input */}
            <div>
              <label className="block mb-2 sm:mb-3 font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                Coupon Code
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2 sm:px-5 sm:py-3 border rounded-lg text-base sm:text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-100"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm sm:text-base"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block mb-2 sm:mb-3 font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                Whatsapp Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your whatsapp number"
                className="w-full px-4 py-2 sm:px-5 sm:py-3 border rounded-lg text-base sm:text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            {/* Payment Button */}
            <div className="text-center">
              <button
                onClick={handlePayment}
                disabled={isSubmitting}
                className={`w-full sm:w-auto ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 cursor-pointer"
                } text-white font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg shadow-lg transform transition-all duration-300`}
              >
                {isSubmitting
                  ? "Processing..."
                  : isEnrolled
                  ? "Go to My Course"
                  : "Proceed to Payment"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-600">
            Course not found
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckOut;

