import React from "react";
import { Link } from "react-router";

const CourseCard = ({
  courseTitle,
  actualPrice,
  discountedPrice,
  courseImg,
  courseTag,
  linkAddress = "#",
  btnText = "View Details"
}) => {

  const discount = Math.trunc(((actualPrice - discountedPrice) / actualPrice) * 100)
  return (
    <Link to={linkAddress} className="w-full cursor-pointer flex flex-col overflow-hidden text-black dark:bg-zinc-900/90 dark:text-white rounded-xl bg-white shadow-lg shadow-gray-300 dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)_0_1px_3px_rgba(255,255,255,0.05)]">
      <div className="w-full relative">
        <h5 className={`${courseTag ? "block" : "hidden"} absolute top-3 right-3 text-[0.6vw] font-bold px-3 py-0.5 rounded-md bg-slate-100 text-black`}>{courseTag}</h5>
        <img className="w-full h-80 object-cover object-center" src={courseImg} alt="course image" />
      </div>
      <div className="p-3 lg:p-4">
        <h2 className="mt-2 text-xl font-bold">{courseTitle}</h2>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">₹ {discountedPrice}</h3>
            <h3 className={`${actualPrice === discountedPrice ? "hidden" : "block"} text-sm line-through`}>
              ₹ {actualPrice}
            </h3>
          </div>
          <div>
            <h4 className={`${discount ? "block" : "hidden"} text-right px-2 py-0.5 text-sm font-semibold bg-slate-100 rounded-md text-black`}>{discount}% OFF</h4>
          </div>
        </div>
        <Link to={linkAddress} className="mt-4 block w-full px-3 py-2 text-center text-lg font-semibold cursor-pointer bg-blue-600 text-white rounded-md">
          {btnText}
        </Link>
      </div>
    </Link>
  );
};

export default CourseCard;
