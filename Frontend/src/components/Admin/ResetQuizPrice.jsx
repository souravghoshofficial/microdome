import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const ResetQuizPrice = () => {
  const [actualPrice, setActualPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuizPrice = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${ApiUrl}/quiz/bundle/price`);
        setActualPrice(res.data.quizPrice.actualPrice);
        setDiscountedPrice(res.data.quizPrice.discountedPrice);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizPrice();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (actualPrice === "" || discountedPrice === "") {
      setError("Both prices are required");
      return;
    }

    if (discountedPrice > actualPrice) {
      setError("Discounted price must be less than Actual Price");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await axios.put(
        `${ApiUrl}/admin/reset-quiz-price`,
        { actualPrice, discountedPrice },
        { withCredentials: true }
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setActualPrice(0);
        setDiscountedPrice(0);
      }
    } catch (error) {
      console.log("Error resetting quiz price : ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 w-full h-screen flex items-center justify-center">
        <h3>Loading...</h3>
      </div>
    );
  }
  return (
    <div className="bg-gray-100 w-full h-screen flex items-center justify-center">
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        className=" w-[95%] max-w-sm p-6 bg-white rounded-lg shadow-lg flex flex-col justify-center"
      >
        <h2 className="text-lg font-semibold text-center mb-2">
          Reset Quiz Price
        </h2>
        <label htmlFor="actualPrice">Actual Price :</label>
        <input
          placeholder="Actual Price"
          className="mb-3 border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-2 py-1.5 rounded-md"
          value={actualPrice === 0 ? "" : actualPrice}
          onChange={(e) => {
            setActualPrice(e.target.value === "" ? "" : Number(e.target.value));
          }}
          type="number"
          name="actualPrice"
          id="actualPrice"
        />
        <label htmlFor="discountedPrice">Discounted Price :</label>
        <input
          placeholder="Discounted Price"
          className="mb-3 border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-2 py-1.5 rounded-md"
          value={discountedPrice === 0 ? "" : discountedPrice}
          onChange={(e) => {
            setDiscountedPrice(
              e.target.value === "" ? "" : Number(e.target.value)
            );
          }}
          type="number"
          name="discountedPrice"
          id="discountedPrice"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          disabled={isSubmitting}
          className={`w-full mt-1 py-2  text-white font-semibold rounded-md ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
          }`}
          type="submit"
        >
          {isSubmitting ? "Resetting Price..." : "Reset Price"}
        </button>
      </form>
    </div>
  );
};

export default ResetQuizPrice;
