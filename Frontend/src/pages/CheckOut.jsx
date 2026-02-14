// import { useEffect, useState } from "react";
// import axios from "axios";
// import { loadRazorpayScript } from "../utils/razorpay";
// import { useSelector, useDispatch } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import { useParams, useNavigate } from "react-router";
// import { login } from "../features/auth/authSlice";

// const ApiUrl = import.meta.env.VITE_BACKEND_URL;

// const CheckOut = () => {
//   const { id,itemType } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const isLoggedIn = useSelector((state) => state.auth.status);
//   const userData = useSelector((state) => state.auth.userData);
//   const theme = useSelector((state) => state.theme.theme)
//   const [item, setItem] = useState(null);
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [instituteName, setInstituteName] = useState("");
//   const [presentCourseOfStudy, setPresentCourseOfStudy] = useState("");
//   const [couponCode, setCouponCode] = useState("");
//   const [appliedDiscount, setAppliedDiscount] = useState(0);
//   const [finalAmount, setFinalAmount] = useState(null);

//   const [showCoupon, setShowCoupon] = useState(false);

//   const [showPaymentHelp, setShowPaymentHelp] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//   if (!id || !itemType) return;

//   const fetchItem = async () => {
//     try {
//       setLoading(true);

//       let url = "";

//       if (itemType === "course") {
//         url = `${ApiUrl}/courses/get-course-details/${id}`;
//       } else if (itemType === "mock-test-bundle") {
//         url = `${ApiUrl}/user/mock-test-bundles/${id}`;
//       }

//       const res =
//         itemType === "course"
//           ? await axios.get(url, { withCredentials: true })
//           : await axios.get(url);

//       const data =
//         itemType === "course"
//           ? res.data?.course
//           : res.data?.data;

//       if (!data) {
//         toast.error("Invalid response structure");
//         return;
//       }

//       setItem(data);
//       setFinalAmount(data?.discountedPrice || 0);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchItem();
// }, [itemType, id]);



//   const isEnrolled = userData?.enrolledCourses.includes(item?._id);

//   const handleApplyCoupon = async () => {
//     if (!couponCode) {
//       toast.warn("Enter a coupon code first");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${ApiUrl}/orders/validate-coupon-code`,
//         {
//           itemId: item._id,
//           itemType: itemType === "course" ? "Course" : "MockTestBundle",
//           couponCode
//         },

//         { withCredentials: true },
//       );

//       if (res.data.success) {
//         setAppliedDiscount(res.data.discount);
//         const discountAmt = Math.floor(
//           (item.discountedPrice * res.data.discount) / 100,
//         );
//         const newPrice = item.discountedPrice - discountAmt;
//         setFinalAmount(newPrice);
//         toast.success(`Coupon applied! You got ${res.data.discount}% off 🎉`);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to apply coupon");
//       setAppliedDiscount(0);
//       setFinalAmount(item.discountedPrice);
//     }
//   };

//   const title = item?.courseTitle || item?.title;
//   const image = item?.courseImage || item?.thumbnail;
//   const actualPrice = item?.actualPrice;
//   const price = finalAmount;
//   const description = item?.subTitle || item?.description;

//   const handlePayment = async () => {
//     if (isEnrolled) {
//       navigate(`/my-courses/${courseDetails?._id}`);
//       return;
//     }
//     if (!isLoggedIn) {
//       toast.warn("Please login to enroll");
//       return;
//     }
//     if (!mobileNumber || mobileNumber.length !== 10) {
//       toast.warn("Enter a valid phone number");
//       return;
//     }
//     // --
//     if (!instituteName || instituteName.length < 2) {
//       toast.warn("Enter a valid institute name");
//       return;
//     }

//     if (!presentCourseOfStudy || presentCourseOfStudy.length < 3) {
//       toast.warn("Enter a valid course name");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const res = await axios.post(
//         `${ApiUrl}/orders/create-order`,
//         {
//           itemId: item?._id,
//           itemType: itemType === "course" ? "course" : "mock_test_bundle",
//           amount: finalAmount,
//           mobileNumber,
//           instituteName,
//           presentCourseOfStudy,
//         },
//         { withCredentials: true },
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
//         description: `Payment for ${title}`,
//         image:
//           "https://res.cloudinary.com/dpsmiqy61/image/upload/v1755101381/1755101380750-MicroDome%20new%20logo.png",
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
//     <div className={`min-h-screen w-full ${theme}`}>
//     <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-black dark:to-gray-900 px-4 sm:px-6">
//       <ToastContainer />
//       <div className="my-10 w-full max-w-5xl bg-white dark:bg-[#1b1e27] shadow-2xl rounded-2xl">
//         {loading ? (
//           <p className="text-center text-gray-600 dark:text-gray-400 py-12">
//             Loading course details...
//           </p>
//         ) : item ? (
//           <div className="grid md:grid-cols-2">
//             {/* Left: Course Image */}
//             <div className="relative h-64 md:h-full p-4 mt-4 md:mt-0 flex items-center justify-center">
//               <img
//                 src={image}
//                 alt={title}
//                 className="max-h-80 md:max-h-[500px] w-auto object-contain rounded-lg"
//               />
//             </div>

//             {/* Right: Checkout Info */}
//             <div className="p-6 sm:p-10 flex flex-col justify-between">
//               <div>
//                 <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
//                   {title}
//                 </h2>
                
//                   <p className="text-gray-600 dark:text-gray-400 mb-4 text-base sm:text-lg">
//                     {description}
//                   </p>
                

//                 {/* Price Section */}
//                 <div className="flex items-baseline gap-3 mb-4">
//                   <span className="text-lg sm:text-xl line-through text-gray-500">
//                     ₹{actualPrice}
//                   </span>
//                   <span className="text-3xl sm:text-4xl font-extrabold text-green-600 dark:text-green-400">
//                     ₹{price}
//                   </span>
//                 </div>

//                 {appliedDiscount > 0 && (
//                   <p className="mb-4 text-green-600 font-semibold text-sm sm:text-base">
//                     Coupon Applied: {appliedDiscount}% OFF
//                   </p>
//                 )}

//                 {/* Coupon Input */}

//                 <div className="mb-4">
//                   {/* Clickable Text */}
//                   <p
//                     onClick={() => setShowCoupon(!showCoupon)}
//                     className="cursor-pointer text-yellow-700 dark:text-yellow-800 font-semibold flex items-center gap-2"
//                   >
//                     Have a coupon code
//                     <span className="text-sm">{showCoupon ? "▲" : "▼"}</span>
//                   </p>

//                   {/* Hidden Content */}
//                   {showCoupon && (
//                     <div className="mb-6">
//                       <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
//                         Coupon Code
//                       </label>
//                       <div className="flex flex-col gap-3 md:flex-row md:gap-2">
//                         <input
//                           type="text"
//                           value={couponCode}
//                           onChange={(e) =>
//                             setCouponCode(e.target.value.toUpperCase())
//                           }
//                           placeholder="Enter coupon code"
//                           className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-100"
//                         />
//                         <button
//                           onClick={handleApplyCoupon}
//                           className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base cursor-pointer"
//                         >
//                           Apply
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Phone Input */}
//                 <div className="mb-6">
//                   <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
//                     Whatsapp Number
//                   </label>
//                   <input
//                     type="tel"
//                     value={mobileNumber}
//                     onChange={(e) => setMobileNumber(e.target.value)}
//                     placeholder="Enter your whatsapp number"
//                     className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-100"
//                   />
//                 </div>

//                 {/* Institute Input */}
//                 <div className="mb-6">
//                   <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
//                     Institute Name
//                   </label>
//                   <input
//                     type="text"
//                     value={instituteName}
//                     onChange={(e) => setInstituteName(e.target.value)}
//                     placeholder="Enter your Institute Name"
//                     className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-100"
//                   />
//                 </div>

//                 {/* Course Input */}
//                 <div className="mb-6">
//                   <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
//                     Present Course of Study
//                   </label>
//                   <input
//                     type="text"
//                     value={presentCourseOfStudy}
//                     onChange={(e) => setPresentCourseOfStudy(e.target.value)}
//                     placeholder="Enter Present Course of Study"
//                     className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-100"
//                   />
//                 </div>

//                 {/*  Payment Trouble Message */}
//                 <div className="mb-4">
//                   <p
//                     onClick={() => setShowPaymentHelp(!showPaymentHelp)}
//                     className="cursor-pointer text-yellow-700 dark:text-yellow-800 font-semibold flex items-center gap-2"
//                   >
//                     ⚠️ Trouble in payment?
//                     <span className="text-sm">
//                       {showPaymentHelp ? "▲" : "▼"}
//                     </span>
//                   </p>

//                   {showPaymentHelp && (
//                     <ul className="mt-2 text-sm text-yellow-600 dark:text-yellow-700 list-disc list-inside space-y-1">
//                       <li>
//                         Make sure to allow <b>third-party cookies</b> in your
//                         browser settings.
//                       </li>
//                       <li>
//                         Recommended Browser: <b>Google Chrome</b>
//                       </li>
//                       <li>
//                         Contact: <b>microdomeclasses2@gmail.com</b>
//                       </li>
//                     </ul>
//                   )}
//                 </div>
//               </div>

//               {/* Payment Button */}
//               <div className="mt-6">
//                 <button
//                   onClick={handlePayment}
//                   disabled={isSubmitting}
//                   className={`w-full py-3 sm:py-4 font-bold text-lg rounded-xl shadow-lg transition-all ${
//                     isSubmitting
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white cursor-pointer"
//                   }`}
//                 >
//                   {isSubmitting
//                     ? "Processing..."
//                     : isEnrolled
//                       ? "Go to My Course"
//                       : "Proceed to Payment"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-center text-red-600 py-12">Course not found</p>
//         )}
//       </div>
//     </div>
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
  const { id, itemType } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const theme = useSelector((state) => state.theme.theme);

  const [item, setItem] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [presentCourseOfStudy, setPresentCourseOfStudy] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showPaymentHelp, setShowPaymentHelp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id || !itemType) return;

    const fetchItem = async () => {
      try {
        setLoading(true);
        let url = "";

        if (itemType === "course") {
          url = `${ApiUrl}/courses/get-course-details/${id}`;
        } else if (itemType === "mock-test-bundle") {
          url = `${ApiUrl}/user/mock-test-bundles/${id}`;
        }

        const res =
          itemType === "course"
            ? await axios.get(url, { withCredentials: true })
            : await axios.get(url);

        const data =
          itemType === "course"
            ? res.data?.course
            : res.data?.data;

        setItem(data);
        setFinalAmount(data?.discountedPrice || 0);
      } catch (err) {
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemType, id]);

  const isEnrolled = userData?.enrolledCourses.includes(item?._id);

    const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.warn("Enter a coupon code first");
      return;
    }

    try {
      const res = await axios.post(
        `${ApiUrl}/orders/validate-coupon-code`,
        {
          itemId: item._id,
          itemType: itemType === "course" ? "Course" : "MockTestBundle",
          couponCode
        },

        { withCredentials: true },
      );

      if (res.data.success) {
        setAppliedDiscount(res.data.discount);
        const discountAmt = Math.floor(
          (item.discountedPrice * res.data.discount) / 100,
        );
        const newPrice = item.discountedPrice - discountAmt;
        setFinalAmount(newPrice);
        toast.success(`Coupon applied! You got ${res.data.discount}% off 🎉`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply coupon");
      setAppliedDiscount(0);
      setFinalAmount(item.discountedPrice);
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
    if (!mobileNumber || mobileNumber.length !== 10) {
      toast.warn("Enter a valid phone number");
      return;
    }
    // --
    if (!instituteName || instituteName.length < 2) {
      toast.warn("Enter a valid institute name");
      return;
    }

    if (!presentCourseOfStudy || presentCourseOfStudy.length < 3) {
      toast.warn("Enter a valid course name");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${ApiUrl}/orders/create-order`,
        {
          itemId: item?._id,
          itemType: itemType === "course" ? "course" : "mock_test_bundle",
          amount: finalAmount,
          mobileNumber,
          instituteName,
          presentCourseOfStudy,
        },
        { withCredentials: true },
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
        description: `Payment for ${title}`,
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

  const title = item?.courseTitle || item?.title;
  const image = item?.courseImage || item?.thumbnail;
  const actualPrice = item?.actualPrice;
  const price = finalAmount;
  const description = item?.subTitle || item?.description;

  return (
    <div className={`min-h-screen ${theme} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-black dark:to-gray-900`}>
      <ToastContainer />

      <div className="max-w-6xl mx-auto py-16 px-4">
        {loading ? (
          <div className="text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
            Loading checkout details...
          </div>
        ) : item ? (
          <div className="grid lg:grid-cols-3 gap-10">

            {/* LEFT SECTION */}
            <div className="lg:col-span-2 bg-white/70 dark:bg-[#1b1e27]/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transition-all duration-500">

              <h1 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-white">
                Checkout
              </h1>

              {/* User Info */}
              <div className="space-y-6">
                <InputField
                  label="Whatsapp Number"
                  value={mobileNumber}
                  onChange={setMobileNumber}
                  placeholder="Enter your whatsapp number"
                />

                <InputField
                  label="Institute Name"
                  value={instituteName}
                  onChange={setInstituteName}
                  placeholder="Enter your institute name"
                />

                <InputField
                  label="Present Course of Study"
                  value={presentCourseOfStudy}
                  onChange={setPresentCourseOfStudy}
                  placeholder="Enter your course of study"
                />
              </div>

              {/* Coupon Section */}
              <div className="mt-8">
                <div
                  onClick={() => setShowCoupon(!showCoupon)}
                  className="cursor-pointer text-blue-600 font-semibold flex items-center justify-between"
                >
                  Apply Coupon Code
                  <span>{showCoupon ? "▲" : "▼"}</span>
                </div>

                {showCoupon && (
                  <div className="mt-4 flex gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter coupon"
                      className="        w-full px-4 py-3 rounded-lg
                                        bg-white/80 dark:bg-white/5
                                        backdrop-blur-xl
                                        border border-slate-300 dark:border-white/10
                                        text-slate-800 dark:text-white
                                        placeholder:text-slate-400 dark:placeholder:text-slate-500
                                        shadow-sm dark:shadow-lg
                                        focus:outline-none
                                        focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                        focus:border-blue-500 dark:focus:border-blue-400
                                        transition-all duration-300
                                        hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isSubmitting}
                className={`mt-10 w-full py-4 rounded-2xl text-lg font-bold shadow-xl transition-all cursor-pointer duration-300 ${
                  isSubmitting
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 hover:shadow-2xl text-white"
                }`}
              >
                {isSubmitting
                  ? "Processing..."
                  : isEnrolled
                  ? "Go to My Course"
                  : "Proceed to Payment"}
              </button>
            </div>

            {/* RIGHT SECTION - ORDER SUMMARY */}
            <div className="sticky top-24 h-fit bg-white/80 dark:bg-[#1b1e27]/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6">

              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Order Summary
              </h2>

              <img
                src={image}
                alt={title}
                className="rounded-2xl mb-6 w-full object-cover shadow-md"
              />

              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {title}
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                {description}
              </p>

              <div className="space-y-3 border-t pt-4">
                <PriceRow label="Original Price" value={`₹${actualPrice}`} />
                {appliedDiscount > 0 && (
                  <PriceRow
                    label={`Discount (${appliedDiscount}%)`}
                    value={`- ₹${Math.floor(
                      (item.discountedPrice * appliedDiscount) / 100
                    )}`}
                    highlight
                  />
                )}
                <div className="flex justify-between font-bold text-lg pt-4 border-t text-black dark:text-white">
                  <span>Total</span>
                  <span>₹{price}</span>
                </div>
              </div>

              <div className="mt-6 text-xs text-gray-400">
                Secure payment powered by Razorpay 🔒
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-600 font-semibold">
            Item not found
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold 
      text-slate-700 dark:text-slate-300 tracking-wide">
      {label}
    </label>

    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full px-4 py-3 rounded-lg
        bg-white/80 dark:bg-white/5
        backdrop-blur-xl
        border border-slate-300 dark:border-white/10
        text-slate-800 dark:text-white
        placeholder:text-slate-400 dark:placeholder:text-slate-500
        shadow-sm dark:shadow-lg
        focus:outline-none
        focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
        focus:border-blue-500 dark:focus:border-blue-400
        transition-all duration-300
        hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]
      "
    />
  </div>
);


const PriceRow = ({ label, value, highlight }) => (
  <div
    className={`
      flex justify-between items-center p-3 rounded-xl
      transition-all duration-300
      ${
        highlight
          ? "text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10"
          : "text-slate-600 dark:text-slate-300"
      }
    `}
  >
    <span className="text-sm">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);


export default CheckOut;
