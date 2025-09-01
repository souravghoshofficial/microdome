import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { loadRazorpayScript } from "../utils/razorpay.js";
import { motion } from "framer-motion";
import { Clock, Lock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/quiz`);
        setQuizzes(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, []);

  const hasAccessToQuizzes = userData?.hasAccessToQuizzes || false;
  const attemptedQuizzes = userData?.attemptedQuizzes || [];

  const handleUnlock = () => {
    if (!isLoggedIn) {
      toast.error("Please login to continue!");
      return;
    }
    setIsModalOpen(true);
  };

  const handlePayment = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to continue!");
      return;
    }

    if (hasAccessToQuizzes) {
      toast.error("You have already purchased mock test series");
      return;
    }

    setIsPaying(true);

    try {
      const res = await axios.post(
        `${ApiUrl}/orders/create-order`,
        {
          amount: 10,
          itemType: "quiz",
        },
        { withCredentials: true }
      );

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Razorpay SDK failed to load. Please try again later.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: 10 * 100,
        currency: "INR",
        name: "Microdome Classes",
        description: "Payment for Mock Test Series",
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

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled by user");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error("Something went wrong. Try again!");
    } finally {
      setIsModalOpen(false);
      setIsPaying(false);
    }
  };

  // ✅ Helper for button text & click
  const getButtonConfig = (quiz) => {
    const isAttempted = attemptedQuizzes.includes(quiz._id);

    if (quiz.category === "free") {
      if (!isLoggedIn) {
        return {
          text: "Attempt",
          onClick: () => toast.error("Login to attempt"),
        };
      }
      return isAttempted
        ? {
            text: "Go to Result",
            onClick: () => navigate(`/quiz-result/${quiz._id}`),
          }
        : {
            text: "Attempt",
            onClick: () => navigate(`/quiz/${quiz._id}`),
          };
    } else {
      // premium quiz
      if (!hasAccessToQuizzes) {
        return {
          text: "Unlock Premium Test",
          locked: true,
          onClick: handleUnlock,
        };
      }
      return isAttempted
        ? {
            text: "Go to Result",
            onClick: () => navigate(`/quiz-result/${quiz._id}`),
          }
        : {
            text: "Attempt",
            onClick: () => navigate(`/quiz/${quiz._id}`),
          };
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-32">
      <Toaster />
      <div className="w-[90%] max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Available <span className="text-highlighted">Quizzes</span>
        </h1>

        {quizzes.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
            No quizzes found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz, index) => {
              const config = getButtonConfig(quiz);

              return (
                <motion.div
                  key={quiz._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-zinc-900 shadow-md hover:shadow-2xl rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 border border-gray-200 dark:border-zinc-800"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {quiz.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                      {quiz.description}
                    </p>
                    {quiz.timeLimit > 0 && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                        <Clock size={16} className="mr-2" />
                        Time Limit: {quiz.timeLimit} min
                      </div>
                    )}
                  </div>

                  {/* ✅ Button Logic */}
                  {config.locked ? (
                    <div
                      onClick={config.onClick}
                      className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 
                              bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 
                              font-medium rounded-xl border border-gray-300 dark:border-zinc-700 
                              cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-700 transition"
                    >
                      <Lock size={18} />
                      {config.text}
                    </div>
                  ) : (
                    <button
                      onClick={config.onClick}
                      className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 
                                text-white font-medium rounded-xl shadow-md hover:scale-105 
                                hover:shadow-lg transition-transform duration-200 cursor-pointer"
                    >
                      {config.text}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ✅ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-200 dark:bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 w-[90%] max-w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-center mb-3">
              Unlock Premium Quizzes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Get access to our{" "}
              <span className="font-semibold">Mock Test Series </span>
              and practice with multiple quizzes designed to boost your
              preparation.
            </p>

            {/* ✅ Pricing Section */}
            {(() => {
              const actualPrice = 1499;
              const discountedPrice = 10;
              const discountPercent = Math.round(
                ((actualPrice - discountedPrice) / actualPrice) * 100
              );

              return (
                <div className="flex items-center justify-between gap-3 mb-6 px-2">
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-bold text-black dark:text-white">
                      ₹ {discountedPrice}
                    </p>
                    <p className="text-gray-500 line-through text-lg">
                      ₹ {actualPrice}
                    </p>
                  </div>
                  <span className="bg-green-100 dark:bg-slate-100 text-green-600 dark:text-black text-sm font-semibold px-2 py-1 rounded-md">
                    {discountPercent}% OFF
                  </span>
                </div>
              );
            })()}

            {/* Buttons */}
            <div className="flex justify-between gap-3">
              <button
                className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                disabled={isPaying}
                className={`flex-1 py-2 rounded-lg text-white transition ${
                  isPaying
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                onClick={handlePayment}
              >
                {isPaying ? "Processing..." : "Enroll Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;
