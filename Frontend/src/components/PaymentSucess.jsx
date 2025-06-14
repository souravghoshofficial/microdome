import { useLocation, useNavigate } from "react-router";
import { CheckCircle } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks"; 

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const paymentId = location.state?.paymentId || "XXXXXXXXXXXX";

  // Get window size for Confetti to fill screen
  const { width, height } = useWindowSize();

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center text-white overflow-hidden">
      {/* Confetti animation */}
      <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />

      <div className="z-10 bg-[#1c1c1c] p-8 rounded-2xl shadow-lg w-[90%] max-w-md text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-400 w-14 h-14" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Woohooo!</h2>
        <p className="text-sm text-gray-300 mb-4">
          Your course purchase was successful.<br />
          Enjoy your learning journey! 🎉
        </p>

        <div className="bg-gray-800 p-3 rounded text-xs text-gray-200 mb-4">
          Payment ID: <span className="text-green-400">{paymentId}</span>
        </div>

        <button
          onClick={() => navigate("/profile")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
        >
          Start Learning
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
