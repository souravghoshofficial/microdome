const BuyNowCard = ({
  actualPrice,
  discountedPrice,
  handlePayment,
  isEnrolled,
  imageUrl,
  courseFeatures,
  mode
}) => {
  const discount = Math.trunc(
    100 * ((actualPrice - discountedPrice) / actualPrice)
  );
  return (
    <div className="w-full bg-white dark:bg-zinc-900 text-black dark:text-white border border-zinc-900/10 dark:border-gray-700/25 rounded-lg overflow-hidden shadow-lg shadow-gray-300 dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)_0_1px_3px_rgba(255,255,255,0.05)]">
      <img
        className="h-65 w-full object-top object-cover"
        src={imageUrl}
        alt="course image"
      />
      <div className="w-full px-4 py-6">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold">₹ {discountedPrice}</h3>
            <h3
              className={`${
                actualPrice === discountedPrice ? "hidden" : "block"
              } text-sm line-through`}
            >
              ₹ {actualPrice}
            </h3>
            <h3 className="text-sm text-gray-700 ml-[-4px]">{mode === "live" ? "/monthly" : ""}</h3>
          </div>
          <div>
            <h4
              className={`${
                discount ? "block" : "hidden"
              } text-right px-2 py-0.5 text-sm font-semibold bg-green-100 text-green-600 dark:bg-white rounded-md bg:text-black`}
            >
              {discount}% OFF
            </h4>
          </div>
        </div>
        <button
          onClick={() => handlePayment()}
          className="w-full mt-4 py-2 font-semibold rounded-md cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white text-center"
        >
          {isEnrolled ? "Go to course" : "Enroll Now"}
        </button>
        <div className="w-full mt-4">
          <h3 className="text-lg font-semibold">What's in the course ?</h3>
          <ul className="mt-1">
            {courseFeatures?.map((feature, index) => (
              <li key={index} className="text-sm mt-0.5">
                <span className="mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BuyNowCard;
